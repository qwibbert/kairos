/*  PocketbaseSyncProtocol

    This implementation of ISyncProtocol is heavily based on the WebSocketSyncProtocol.js example from Dexie.
    Pocketbase uses SSE (server side events) and doesn't support websockets, an alteration of the example was necessary.
    
    With SSE it is not possible to send messages to the server, only to receive them. 
    Since we need to talk to the server to achieve two-way syncronisation, I came up with the following strategy:
        - Receiving data from the server: 
            1. Client identification, client->server change and subscribe POST request status: HTTP response
            2. Server->client changes, ack and all other error messages: subscription to client channel
        - Sending data to server: via HTTP POST request to /api/kairos/sync

    For the implementation of the server side, look at backend/pb_hooks/sync.pb.ts
*/
import Dexie from 'dexie';

import { alert_dialog, push_toast } from '$lib/components/alerts.svelte';
import { client } from '$lib/pocketbase';

import {
	type ClientChangeRequestBody,
	type ClientIdRequestBody,
	type ClientSubscribeRequestBody,
	type IDatabaseChange,
	type ServerErrorResponse,
	type ServerResponse,
} from '../../../backend/src/types/sync';
import { db } from './db';

interface PersistedContext {
	client_identity: string | null;
	save(): Promise<void>;
}

interface SyncOptions {
	token: string;
}

(function () {
	// Constants:
	const RECONNECT_DELAY = 5000; // Reconnect delay in case of errors such as network down.

	Dexie.Syncable.registerSyncProtocol('pocketbase', {
		sync: async function (
			context: PersistedContext,
			url: string,
			options: SyncOptions,
			baseRevision: number | null,
			syncedRevision: number | null,
			changes: IDatabaseChange[],
			partial: boolean,
			applyRemoteChanges: (
				changes: IDatabaseChange[],
				lastRevision: number | null,
				partial: boolean,
			) => void,
			onChangesAccepted: () => void,
			onSuccess: (options: {
				react: (changes, baseRevision, partial, onChangesAccepted) => void;
				disconnect: () => void;
			}) => void,
			onError: (err: string, again: number) => void,
		) {
			// Pocketbase cancels similar requests that fire quickly after another by default.
			// If the network goes down or another error occurs, Dexie will retry to connect which may cause
			// autocancellation errors. It is best to disable this behaviour.
			client.autoCancellation(false);

			// The following vars are needed because we must know which callback to ack when server sends it's ack to us.
			let requestId = 0;
			const acceptCallbacks = {};

			// sendChanges() method:
			async function sendChanges(
				changes: IDatabaseChange[],
				baseRevision: number | null,
				partial: boolean,
				onChangesAccepted,
			) {
				++requestId;
				acceptCallbacks[requestId.toString()] = onChangesAccepted;

				client
					.send('/api/kairos/sync', {
						method: 'POST',
						body: {
							type: 'CHANGES',
							changes: await preprocess_changes(changes),
							partial: partial,
							base_revision: baseRevision,
							request_id: requestId,
							client_id: context.client_identity,
						} as ClientChangeRequestBody,
					})
					.catch((err: ServerErrorResponse) => {
						onError(
							'Error while pushing changes to sync server: ' + JSON.stringify(err),
							RECONNECT_DELAY,
						);
						handle_error(err);
					});
			}

			// Step 1: Let's say hello to the sync server. If we already have a valid client_id we provide it to the server.
			//       | If not, the server will give us a new one. The server will respond with 401 if the id is invalid.
			//       | In that case we unregister our faulty token from the sync logic and rerun this step.
			client
				.send('/api/kairos/sync', {
					method: 'POST',
					body: {
						type: 'CLIENT_ID',
						client_id: context.client_identity ?? null,
					} as ClientIdRequestBody,
				})
				.then((res: ServerResponse) => {
					if (res.type == 'client_id' && res.client_id) {
						if (res.client_id != context.client_identity) {
							// We recieved a new identity!
							context.client_identity = res.client_id;
							context.save();
						}
					} else {
						onError('Server error while saying hello ', Infinity);
						handle_error({
							error_type: 'OTHER',
							fatal: false,
							message: 'Unknown error',
							type: 'error',
						});
						return;
					}

					let isFirstRound = true;

					// isFirstRound: Will need to call onSuccess() only when we are in sync the first time.
					// onSuccess() will unblock Dexie to be used by application code.
					// If for example app code writes: db.friends.where('shoeSize').above(40).toArray(callback), the execution of that query
					// will not run until we have called onSuccess(). This is because we want application code to get results that are as
					// accurate as possible. Specifically when connected the first time and the entire DB is being synced down to the browser,
					// it is important that queries starts running first when db is in sync.

					// When messages arrive from the server, deal with the messages accordingly:
					client.realtime
						.subscribe(res.client_id, (e: ServerResponse) => {
							try {
								// Assume we have a server that should send JSON messages of the following format:
								// {
								//     type: "changes", "ack" or "error"
								//     message: Error message (Only applicable if type="error")
								//     requestId: ID of change request that is acked by the server (Only applicable if type="ack" or "error")
								//     changes: changes from server (Only applicable if type="changes")
								//     lastRevision: last revision of changes sent (applicable if type="changes")
								//     partial: true if server has additionalChanges to send. False if these changes were the last known. (applicable if type="changes")
								// }
								if (e.type == 'changes') {
									applyRemoteChanges(
										e.changes.map((c) => ({
											...c,
											type:
												c.type == 'CREATE'
													? 1
													: c.type == 'UPDATE'
														? 2
														: c.type == 'DELETE'
															? 3
															: 1,
										})),
										e.current_revision,
										e.partial,
									);
									if (isFirstRound && !e.partial) {
										// Since this is the first sync round and server says we've got all changes - now is the time to call onsuccess()
										onSuccess({
											// Specify a react function that will react on additional client changes
											react: async function (changes, baseRevision, partial, onChangesAccepted) {
												await sendChanges(changes, baseRevision, partial, onChangesAccepted);
											},
											// Specify a disconnect function that will close our socket so that we dont continue to monitor changes.
											disconnect: function () {
												client.realtime.unsubscribe();
											},
										});
										isFirstRound = false;
									}
								} else if (e.type == 'ack') {
									const requestId = e.request_id;
									const acceptCallback = acceptCallbacks[requestId.toString()];

									acceptCallback(); // Tell framework that server has acknowledged the changes sent.
									delete acceptCallbacks[requestId.toString()];
								} else if (e.type == 'error') {
									client.realtime.unsubscribe();
									onError(e.message, Infinity); // Don't reconnect - an error in application level means we have done something wrong.
									return;
								}
							} catch (err) {
								client.realtime.unsubscribe();
								onError(err, Infinity); // Something went crazy. Server sends invalid format or our code is buggy. Dont reconnect - it would continue failing.
								handle_error(err);
								return;
							}
						})
						.then(async () => {
							// Step 2: Now that we are subscribed to the message channel, we can start to send our changes to the server.
							await sendChanges(changes, baseRevision, partial, onChangesAccepted);

							// Step 3: Tell the server that we are interested in changes happening there
							client
								.send('/api/kairos/sync', {
									method: 'POST',
									body: {
										type: 'SUBSCRIBE',
										client_id: context.client_identity ?? null,
										synced_revision: syncedRevision,
									} as ClientSubscribeRequestBody,
								})
								.then((subs_res: ServerResponse) => {
									if (subs_res.type == 'error') {
										onError('Server error asking for subscription', RECONNECT_DELAY);
										handle_error(subs_res);
									}
								})
								.catch((res: ServerErrorResponse) => {
									onError('Server error asking for subscription', RECONNECT_DELAY);
									handle_error(res);
								});
						});
				})
				.catch(async (res) => {
					if (
						res.status == 401 &&
						res.message == 'The request requires valid record authorization token.'
					) {
						// Looks like we are not logged in to an account, this shouldn't really happen because the sync service should be inactive.
						// Let's disable it.
						for (const sync_server of await db.syncable.list()) {
							db.syncable.disconnect(sync_server);
						}
						handle_error(res);
					} else if (res.status == 401) {
						// We seem to have an invalid client_id, try to fetch a new one
						context.client_identity = null;
						context.save();

						onError('Invalid client id ', RECONNECT_DELAY);
						handle_error(res);
					}

					onError('Network error while saying hello', RECONNECT_DELAY);
					handle_error(res);
				});
		},
	});
})();

async function delete_remote_data() {
	await client.send('/api/kairos/sync/delete', {
		method: 'POST',
	});
}

async function delete_local_data() {
	await db.transaction('rw', db.vines, db.settings, db.history, async (tx) => {
		await db.vines.clear();
		await db.settings.clear();
		await db.history.clear();
	});
}

async function delete_local_sync_data() {
	for (const url of await db.syncable.list()) {
		await db.syncable.disconnect(url);
		await db.syncable.delete(url);
	}
}

async function preprocess_changes(changes: IDatabaseChange[]): Promise<IDatabaseChange[]> {
	const processed_changes = [];

	for (const change of changes) {
		processed_changes.push(change);
	}

	return processed_changes;
}

function handle_error(err: ServerErrorResponse) {
	if (err.fatal) {
		alert_dialog({
			header: 'Sync Error',
			text: 'A <strong>fatal error</strong> occured with the sync service which could not be solved automatically. Please choose one of the options below.',
			actions: [
				[
					'Keep client data',
					async () => {
						return delete_local_sync_data().then(() => delete_remote_data());
					},
				],
				[
					'Keep remote data',
					async () => {
						return delete_local_sync_data().then(() => delete_local_data());
					},
				],
			],
		});
	} else {
		push_toast('error', {
			type: 'headed',
			header: `Sync Error: ${err.error_type}`,
			text: err.message,
		});
	}
}

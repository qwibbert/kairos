import { ClientChangeRequestBody, ClientIdRequestBody, ClientSubscribeRequestBody, DatabaseChangeType, IDatabaseChange, ServerAckResponse, ServerClientIdResponse, ServerErrorResponse, ServerSubscribeResponse, ServerSuccessResponse } from '../types/sync';
import { reduceChanges, resolveConflicts } from './utils';


function sendAnyChanges(client, synced_rev: number, user_id: string, client_id: string) {
    // Get all changes after syncedRevision that was not performed by the client we're talkin' to.
    let changes = [];

    try {
        changes = $app.findRecordsByFilter(
            $app.findCollectionByNameOrId('sync_changes'),
            'revision > {:synced_rev} && source != {:client_id} && source.user = {:user_id}',
            '',
            0,
            0,
            { synced_rev: synced_rev, client_id: client_id, user_id }
        )
    } catch (e) {
        throw { type: 'error', error_type: 'OTHER', message: 'Something went wrong during sync_changes fetching: ' + toString(e), fatal: false } as ServerErrorResponse;
    }

    const preprocessed_changes = preprocess_server_changes(changes);

    // Compact changes so that multiple changes on same object is merged into a single change.
    var reduced_set = reduceChanges(preprocessed_changes);

    // Convert the reduced set into an array again.
    var reduced_array = Object.keys(reduced_set).map(function (key) { return reduced_set[key]; });
    // Notice the current revision of the database. We want to send it to client so it knows what to ask for next time.
    var current_revision = 0;

    let collection = undefined;
    let revision = undefined;

    try {
        collection = $app.findCollectionByNameOrId('sync_revisions');
        revision = $app.findRecordsByFilter(collection, `user = '${user_id}'`, '', 0, 0);
    } catch (e) {
        throw { type: 'error', error_type: 'OTHER', message: 'Something went wrong during revision fetching: ' + toString(e), fatal: false } as ServerErrorResponse;
    }

    if (revision.length == 0) {
        const revision_record = new Record(collection);

        revision_record.set('user', user_id);
        revision_record.set('revision', 0);
        $app.save(revision_record);
    } else {
        current_revision = revision[0].get('revision');
    }

    const message = new SubscriptionMessage({
        name: client_id,
        data: JSON.stringify({
            type: 'changes',
            changes: reduced_array,
            current_revision: current_revision,
            partial: false
        }),
    });

    client.send(message);

    return current_revision;
}

export default (e: core.RequestEvent) => {
    let client_id = null;
    const body: ClientChangeRequestBody | ClientIdRequestBody | ClientSubscribeRequestBody = e.requestInfo().body as any;
    let synced_revision = 0;

    // If a client is not subscribed to a it's channel (named by client_id), we assume that it does not yet have a client_id
    const clients = $app.subscriptionsBroker().clients();
    let client = undefined;

    try {
        for (let clientId in clients) {
            if (clients[clientId].hasSubscription(body.client_id)) {
                client = clients[clientId]
            }
        }
    } catch (err) {
        return e.json(500, { type: 'error', error_type: 'OTHER', message: 'Something went wrong during client subscription checking: ' + toString(e), fatal: false } as ServerErrorResponse);
    }

    // Client Hello: Client says "Hello, My name is <clientIdentity>!" or "Hello, I'm newborn. Please give me a name!"
    // Client identity is used for the following purpose:
    //  * When client sends its changes, register the changes into server database and mark each change with the clientIdentity.
    //  * When sending back changes to client, leave out those marked with the client id so that changes aren't echoed back.
    // The client should initiate the connection by submitting or requesting a client identity.
    // This should be done before sending any changes to us.
    if (body.type == "CLIENT_ID") {
        if (body.client_id) {
            // Check if client_id is registered to user
            try {
                const record = $app.findRecordById($app.findCollectionByNameOrId('sync_clients'), body.client_id);

                if (record.get('user') != e.auth?.id) {
                    throw undefined;
                }
                return e.json(200, { type: 'client_id', client_id: body.client_id } as ServerClientIdResponse);
            } catch {
                return e.json(401, { type: 'error', error_type: 'INVALID_CLIENT_ID', message: 'Invalid client_id.', fatal: false } as ServerErrorResponse);
            }

        } else {
            try {
                // Client requests an identity. Provide one.
                client_id = $security.randomStringByRegex('[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}');

                // Assign new client_id to user
                let collection = $app.findCollectionByNameOrId("sync_clients");

                let record = new Record(collection);

                record.set('id', client_id)
                record.set('user', e.auth?.id);

                $app.save(record);

                return e.json(200, { type: 'client_id', client_id } as ServerClientIdResponse);
            } catch (err) {
                return e.json(401, { type: 'error', error_type: 'CLIENT_ID_GEN', message: 'Failed to generate a new client id.', fatal: false } as ServerErrorResponse);
            }
        }
    } else if (body.type == "SUBSCRIBE") {
        // Client wants to subscribe to server changes happened or happening after given syncedRevision
        synced_revision = body.synced_revision || 0;

        // Make sure we only send revisions coming after this revision next time and not resend the above changes over and over.
        try {
            synced_revision = sendAnyChanges(client, synced_revision, e.auth?.id, body.client_id);

            // Start subscribing for additional changes:

            client.set('subscribed', true);
            client.set('revision', synced_revision);
        } catch (err) {
            return e.json(500, err);
        }

        return e.json(200, { type: 'subscribe' } as ServerSubscribeResponse);
    } else if (body.type == "CHANGES") {
        if (!client) {
            return e.json(400, { type: 'error', error_type: 'CLIENT_NOT_SUBSCRIBED', message: 'Client is not subscribed to channel. Messages can\'t come through.', fatal: false } as ServerErrorResponse);
        }

        // Client sends its changes to us.
        let request_id = body.request_id;
        try {
            if (!(body.changes instanceof Array)) {
                return e.json(400, { type: 'error', error_type: 'INVALID_PROPS', message: 'Property \'changes\' must be provided and must be an array', fatal: false } as ServerErrorResponse);
            }

            let changes = preprocess_client_changes(body.changes);

            // if (!("baseRevision" in body)) {
            //     console.log('hello!')
            //     throw "Property 'baseRevision' missing";
            // }

            // First, if sent change set is partial. 
            if (body.partial) {
                // Don't commit changes just yet. Store it in the partialChanges table so far. (In real db, uncommittedChanges would be its own table with columns: {clientID, type, table, key, obj, mods}).
                // Get or create db.uncommittedChanges array for current client
                let collection = $app.findCollectionByNameOrId("sync_uncommitted");

                for (const change of changes) {
                    let change_record = new Record(collection)
                    change_record.set('sync_client', body.client_id);
                    change_record.set('collection',
                        change.table == 'history'
                            ? 'history_entries'
                            : change.table == 'settings'
                                ? 'settings'
                                : change.table == 'vines'
                                    ? 'vines'
                                    : ''
                    );

                    change_record.set('key', change.key);

                    if (change.type == DatabaseChangeType.Create) {
                        // CREATE
                        change_record.set('type', 'CREATE');
                        change_record.set('obj', change.obj);
                    } else if (change.type == DatabaseChangeType.Update) {
                        // UPDATE
                        change_record.set('type', 'UPDATE');
                        change_record.set('mods', change.mods);
                    } else if (change.type == DatabaseChangeType.Delete) {
                        // DELETE
                        change_record.set('type', 'DELETE');
                    }

                    $app.save(change_record);
                }
            } else {
                // This request is not partial. Time to commit.
                // But first, check if we have previous changes from that client in uncommittedChanges because now is the time to commit them too.
                let uncommitted_changes = [];

                try {
                    uncommitted_changes = $app.findRecordsByFilter(
                        $app.findCollectionByNameOrId('sync_uncommitted'),
                        `sync_client = {:client_id}`,
                        '',
                        0,
                        0,
                        { client_id: body.client_id }
                    ) as unknown as IDatabaseChange[];
                } catch (err) {
                    return e.json(500, { type: 'error', error_type: 'OTHER', message: 'Failed to check uncommited changes: ' + toString(err), fatal: false } as ServerErrorResponse);
                }

                if (uncommitted_changes.length != 0) {
                    changes = uncommitted_changes.concat(changes as any);

                    for (const change of uncommitted_changes) {
                        try {
                            $app.delete(change.id);
                        } catch (err) {
                            return e.json(500, { type: 'error', error_type: 'OTHER', message: 'Failed to delete uncommited change: ' + toString(err), fatal: false } as ServerErrorResponse);
                        }
                    }
                }

                // ----------------------------------------------
                //
                //
                //
                // HERE COMES THE QUITE IMPORTANT SYNC ALGORITHM!
                //
                // 1. Reduce all server changes (not client changes) that have occurred after given
                //    baseRevision (our changes) to a set (key/value object where key is the combination of table/primaryKey)
                // 2. Check all client changes against reduced server
                //    changes to detect conflict. Resolve conflicts:
                //      If server created an object with same key as client creates, updates or deletes: Always discard client change.
                //      If server deleted an object with same key as client creates, updates or deletes: Always discard client change.
                //      If server updated an object with same key as client updates: Apply all properties the client updates unless they conflict with server updates
                //      If server updated an object with same key as client creates: Apply the client create but apply the server update on top
                //      If server updated an object with same key as client deletes: Let client win. Deletes always wins over Updates.
                //
                // 3. After resolving conflicts, apply client changes into server database.
                // 4. Send an ack to the client that we have persisted its changes
                //
                //
                // ----------------------------------------------

                // Step 1
                let base_revision = body.base_revision || 0;
                let server_changes = [];
                try {
                    server_changes = $app.findRecordsByFilter($app.findCollectionByNameOrId('sync_changes'), `revision > ${base_revision}`, '', 0, 0);
                } catch (err) {
                    return e.json(500, { type: 'error', error_type: 'OTHER', message: 'Failed to retrieve server change: ' + toString(err), fatal: false } as ServerErrorResponse);
                }


                // Step 2
                const reduced_server_change_set = reduceChanges(server_changes);
                const resolved = resolveConflicts(changes, reduced_server_change_set);

                // Step 3
                resolved.forEach(function (change) {
                    let collection = undefined;
                    let change_collection = undefined;
                    let revision_collection = undefined;

                    try {
                        collection = $app.findCollectionByNameOrId(change.table == 'history' ? 'history_entries' : change.table);

                        change_collection = $app.findCollectionByNameOrId('sync_changes');
                        revision_collection = $app.findCollectionByNameOrId('sync_revisions');
                    } catch (err) {
                        return e.json(500, { type: 'error', error_type: 'OTHER', message: 'Failed to retrieve collection for uploading resolved changes: ' + toString(err), fatal: false } as ServerErrorResponse);
                    }


                    switch (change.type) {
                        case 1:
                        case 'CREATE': {
                            $app.runInTransaction((txApp) => {
                                try {
                                    let record = new Record(collection);

                                    // Let's check if all the relation records exist
                                    if (change.table == 'history') {
                                        // Check course
                                        if (change.obj.vine_course) {
                                            try {
                                                $app.findRecordById($app.findCollectionByNameOrId('courses'), change.obj.vine_course);
                                            } catch (err) {
                                                return e.json(400, { type: 'error', error_type: 'OTHER', message: 'Course does not exist for history entry: ' + change.obj.id + ', ' + toString(err), fatal: false } as ServerErrorResponse);
                                            }
                                        }

                                        // Check vine
                                        if (change.obj.vine) {
                                            
                                            try {
                                                console.log('test2', change.obj.vine)
                                                $app.findRecordById($app.findCollectionByNameOrId('vines'), change.obj.vine);
                                            } catch (err) {
                                                return e.json(400, { type: 'error', error_type: 'OTHER', message: 'Vine does not exist for history entry: ' + change.obj.id + ', ' + toString(err), fatal: false } as ServerErrorResponse);
                                            }
                                        }
                                    } else if (change.table == 'vines') {
                                        // Check course
                                        if (change.obj.course) {
                                            try {
                                                $app.findRecordById($app.findCollectionByNameOrId('courses'), change.obj.course);
                                            } catch (err) {
                                                return e.json(400, { type: 'error', error_type: 'OTHER', message: 'Course does not exist for vine: ' + change.obj.id + ', ' + toString(err), fatal: false } as ServerErrorResponse);
                                            }
                                        }
                                    }

                                    for (const key in change.obj) {
                                        // For JSON fields (e.g. elapsed time) we get the change is in the format of e.g. elapsed_time.Mon Aug 18 2025
                                        // We need to separate the key (Mon Aug 18 2025)
                                        const split = key.split('.');
                                        if (split.length == 2) {
                                            if (JSON.stringify(record.get(split[0]!)) != "null") {
                                                record.set(split[0]!, { ...JSON.parse(record.get(split[0]!)), [split[1]!]: change.obj[key] });
                                            } else {
                                                record.set(split[0]!, { [split[1]!]: change.obj[key] });
                                            }
                                        } else if (split.length != 0) {
                                            record.set(key, change.obj[key]);
                                        } else {
                                            return e.json(500, { type: 'error', error_type: 'CREATE', message: 'Failed to set record for: ' + change.id + '. JSON key split length has unexpected value of ' + split.length, fatal: true } as ServerErrorResponse);
                                        }

                                    }

                                    record.load(change.obj);

                                    // On the client side, the id of the settings object is 1. The server expects a uuid.
                                    if (change.table == 'settings' && change.obj.id == 1) {
                                        record.set('id', $security.randomStringByRegex('[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}'))
                                    } else {
                                        record.set('id', change.obj.id);
                                    }

                                    record.set('user', e.auth?.id);
                                    txApp.save(record);

                                    let revision_record = txApp.findRecordsByFilter(revision_collection, `user = '${e.auth?.id}'`, '', 0, 0);

                                    if (revision_record.length > 0) {
                                        revision_record[0].set('revision', revision_record[0]?.get('revision') + 1);
                                        txApp.save(revision_record[0]);

                                    } else {
                                        return e.json(500, { type: 'error', error_type: 'CREATE', message: 'Failed to set the revision record for: ' + change.id + toString(err), fatal: true } as ServerErrorResponse);
                                    }

                                    let change_record = new Record(change_collection);
                                    change_record.set('revision', revision_record[0].get('revision'));
                                    change_record.set('source', body.client_id);
                                    change_record.set('type', 'CREATE');
                                    change_record.set('collection', change.table == 'history' ? 'history_entries' : change.table);
                                    change_record.set('key', change.key);
                                    change_record.set('obj', change.obj);
                                    txApp.save(change_record);
                                } catch (err) {
                                    console.log('create err', JSON.stringify(err));
                                    console.warn('Skipping create');
                                }
                            })

                            break;
                        }
                        case 2:
                        case 'UPDATE': {
                            $app.runInTransaction((txApp) => {
                                try {
                                    let record = undefined;

                                    console.log('1');
                                    // Let's check if all the relation records exist
                                    if (change.table == 'history') {
                                        console.log('2');
                                        // Check course
                                        if (change.mods.vine_course) {
                                            try {
                                                $app.findRecordById($app.findCollectionByNameOrId('courses'), change.mods.vine_course);
                                            } catch (err) {
                                                return e.json(400, { type: 'error', error_type: 'OTHER', message: 'Course does not exist for history entry: ' + change.mods.id + ', ' + toString(err), fatal: false } as ServerErrorResponse);
                                            }
                                        }

                                        console.log('3');

                                        // Check vine
                                        if (change.mods.vine) {
                                            try {
                                                $app.findRecordById($app.findCollectionByNameOrId('vines'), change.mods.vine_course);
                                            } catch (err) {
                                                return e.json(400, { type: 'error', error_type: 'OTHER', message: 'Vine does not exist for history entry: ' + change.mods.id + ', ' + toString(err), fatal: false } as ServerErrorResponse);
                                            }
                                        }
                                    } else if (change.table == 'vines') {
                                        // Check course
                                        if (change.mods.course) {
                                            try {
                                                $app.findRecordById($app.findCollectionByNameOrId('courses'), change.mods.course);
                                            } catch (err) {
                                                return e.json(400, { type: 'error', error_type: 'OTHER', message: 'Course does not exist for vine: ' + change.mods.id + ', ' + toString(err), fatal: false } as ServerErrorResponse);
                                            }
                                        }
                                    }

                                    if (change.table == 'settings') {
                                        try {
                                            record = txApp.findFirstRecordByFilter(collection, `user = '${e.auth?.id}'`);
                                            record.set('user', e.auth?.id);
                                        } catch (err) {
                                            // It seems like the settings record does not yet exist, let's create a new one
                                            record = new Record(txApp.findCollectionByNameOrId('settings'));
                                            record.set('user', e.auth?.id);
                                        }
                                    } else {
                                        try {
                                            record = txApp.findRecordById(collection, change.key);
                                        } catch {
                                            return e.json(200, {});
                                        }
                                    }

                                    if (record) {
                                        for (const mod in change.mods) {
                                            // For JSON fields (e.g. elapsed time) we get the change is in the format of e.g. elapsed_time.Mon Aug 18 2025
                                            // We need to separate the key (Mon Aug 18 2025)
                                            const split = mod.split('.');
                                            if (split.length == 2) {
                                                if (record.get(split[0]!) != 'null') {
                                                    record.set(split[0]!, { ...JSON.parse(record.get(split[0]!)), [split[1]!]: change.mods[mod] });
                                                } else {
                                                    record.set(split[0]!, { [split[1]!]: change.mods[mod] });
                                                }
                                            } else if (split.length != 0) {
                                                record.set(mod, change.mods[mod]);
                                            } else {
                                                return e.json(500, { type: 'error', error_type: 'UPDATE', message: 'Failed to set record for: ' + change.key + '. JSON key split length has unexpected value of ' + split.length, fatal: true } as ServerErrorResponse);
                                            }

                                        }

                                        try {
                                            txApp.save(record);
                                        } catch (err) {
                                            return e.json(500, { type: 'error', error_type: 'UPDATE', message: 'Failed to update record for: ' + change.key + toString(err), fatal: true } as ServerErrorResponse);
                                        }
                                    }

                                    let revision_record = undefined;
                                    try {
                                        revision_record = txApp.findRecordsByFilter(revision_collection, `user = '${e.auth?.id}'`, '', 0, 0);

                                        if (revision_record.length > 0) {
                                            revision_record[0].set('revision', revision_record[0]?.get('revision') + 1);
                                            txApp.save(revision_record[0]);
                                        } else {
                                            throw '';
                                        }
                                    } catch (err) {
                                        return e.json(500, { type: 'error', error_type: 'UPDATE', message: 'Failed to set the revision record for: ' + change.id + toString(err), fatal: true } as ServerErrorResponse);
                                    }


                                    let change_record = new Record(change_collection);

                                    change_record.set('revision', revision_record[0].get('revision'));
                                    change_record.set('source', body.client_id);
                                    change_record.set('type', 'UPDATE');

                                    change_record.set('collection', change.table == 'history' ? 'history_entries' : change.table);
                                    change_record.set('key', change.key);
                                    change_record.set('mods', change.mods);

                                    try {
                                        txApp.save(change_record);
                                    } catch (err) {
                                        return e.json(500, { type: 'error', error_type: 'UPDATE', message: 'Failed to set the change record for: ' + change.key + toString(err), fatal: true } as ServerErrorResponse);
                                    }

                                } catch (err) {
                                    return e.json(500, { type: 'error', error_type: 'UPDATE', message: 'Error occurred while updating record: ' + change.key + toString(err), fatal: true } as ServerErrorResponse);
                                }
                            });
                            break;
                        }
                        case 3:
                        case 'DELETE': {
                            $app.runInTransaction((txApp) => {
                                try {
                                    let record = txApp.findRecordById(collection, change.id);
                                    txApp.delete(record);
                                } catch { }


                                let revision_record = undefined;
                                try {
                                    revision_record = txApp.findRecordsByFilter(revision_collection, `user = '${e.auth?.id}'`, '', 0, 0);
                                } catch (err) {
                                    return e.json(500, { type: 'error', error_type: 'DELETE', message: 'Failed to set the change record for: ' + change.id + toString(err), fatal: false } as ServerErrorResponse);
                                }


                                if (revision_record.length > 0) {
                                    try {
                                        revision_record[0].set('revision', revision_record[0]?.get('revision') + 1);
                                        txApp.save(revision_record[0]);
                                    } catch (err) {
                                        return e.json(500, { type: 'error', error_type: 'DELETE', message: 'Failed to set the revision record for: ' + change.id + toString(err), fatal: false } as ServerErrorResponse);
                                    }


                                } else {
                                    throw '';
                                }

                                try {
                                    let change_record = new Record(change_collection);
                                    change_record.set('revision', revision_record[0].get('revision'));
                                    change_record.set('source', body.client_id);
                                    change_record.set('type', 'DELETE');
                                    change_record.set('collection', change.collection);
                                    change_record.set('key', change.key);
                                    txApp.save(change_record);
                                } catch (err) {
                                    return e.json(500, { type: 'error', error_type: 'DELETE', message: 'Failed to set change record for: ' + change.id + toString(err), fatal: false } as ServerErrorResponse);
                                }

                            })
                            break;
                        }
                    }

                });
            }


            // Step 4
            // Now ack client that we have recieved his changes. This should be done no matter if the're buffered into uncommittedChanges
            // or if the're actually committed to db.
            const message = new SubscriptionMessage({
                name: body.client_id,
                data: JSON.stringify({
                    type: 'ack',
                    request_id
                } as ServerAckResponse),
            });

            client.send(message);
        } catch (err) {
            const message = new SubscriptionMessage({
                name: body.client_id,
                data: JSON.stringify({
                    type: 'error',
                    error_type: 'OTHER',
                    request_id,
                    fatal: false,
                    message: '2' + err.toString()
                } as ServerErrorResponse),
            });

            client.send(message);

            return e.json(200, {
                type: 'error',
                error_type: 'OTHER',
                request_id,
                fatal: false,
                message: '3' + err.toString()
            } as ServerErrorResponse);
        }

    }

    return e.json(200, { type: 'success' } as ServerSuccessResponse);
}

function preprocess_client_changes(changes: IDatabaseChange[]): IDatabaseChange[] {
    const processed_changes = [];

    for (let change of changes) {
        // -------------------------
        //          HISTORY
        // -------------------------
        if (change.table == 'history') {
            
            if (change.type == 1) {
                console.log('yes, ', JSON.stringify(change))
                for (const key in change.obj) {
                    if (key == 'vine_id') {
                        change.obj['vine'] = change.obj['vine_id'];
                        delete change.obj.vine_id;
                        
                    } else if (key == 'type') {
                        if (change.obj['type'] == 'COURSE') {
                            change.obj['vine_course'] = change.obj['course_id'];
                            delete change.obj.course_id;
                        }
                    }
                }
            } else if (change.type == 2) {
                for (const key in change.mods) {
                    if (key == 'vine_id') {
                        change.mods['vine'] = change.mods['vine_id'];
                        delete change.mods.vine_id;
                    } else if (key == 'type') {
                        if (change.mods['type'] == 'COURSE') {
                            change.mods['vine_course'] = change.mods['course_id'];
                            delete change.mods.course_id;
                        }
                    }
                }
            }
        }


        // -----------------------
        //          VINES
        // -----------------------

        if (change.table == 'vines') {
            if (change.type == 'CREATE') {
                for (const key in change.obj) {
                    if (key == 'course_id') {
                        change.obj['course'] = change.obj[key];
                        delete change.obj.course_id;
                    }
                }
            } else if (change.type == 'UPDATE') {
                for (const key in change.mods) {
                    if (key == 'course_id') {
                        change.mods['course'] = change.mods[key];
                        delete change.mods.course_id;
                    }
                }
            }
        }

        // --------------------------
        //          SETTINGS
        // --------------------------
        if (change.table == 'settings') {
            if (change.type == DatabaseChangeType.Create) {
                delete change.obj.id;
            } else if (change.type == DatabaseChangeType.Update) {
                delete change.mods.id;
            }
        }

        processed_changes.push(change);
    }

    return processed_changes;
}

function preprocess_server_changes(changes: IDatabaseChange[]): IDatabaseChange[] {
    const processed_changes = [];

    for (let change of changes) {
        let cloned_change = JSON.parse(JSON.stringify(change));

        cloned_change.table = cloned_change.collection == 'history_entries' ? 'history' : cloned_change.collection;

        if (cloned_change.collection == 'settings') {
            if (cloned_change.type == DatabaseChangeType.Create) {
                delete cloned_change.obj.id;
            } else if (cloned_change.type == DatabaseChangeType.Update) {
                delete cloned_change.mods.id;
            }
        }

        processed_changes.push(cloned_change);
    }

    return processed_changes;
}
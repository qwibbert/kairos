import { browser } from '$app/environment';
import { resolve } from '$app/paths';
import type { ListResult, RecordListOptions, RecordModel, UnsubscribeFunc } from 'pocketbase';
import PocketBase, { type AuthProviderInfo, RecordService } from 'pocketbase';
import { type Readable, type Subscriber, readable } from 'svelte/store';

import { push_toast } from '$lib/toasts.js';
import { modals } from 'svelte-modals';
import LoginRegister from './login-register.svelte';
import type { TypedPocketBase } from './types.js';

export let client: TypedPocketBase | null = null;

try {
	client = new PocketBase(resolve('/'))
} catch (e) {
	push_toast('error', { header: 'Server error', text: `Failed to connect to the backend server: ${e}`, type: 'headed' });
}

if (client) {
	try {
		await client?.collection('users').authRefresh();
	} catch (e) {
		if (e.status == 500) {
			push_toast('error', { header: 'Server error', text: `Failed to connect to the backend server: please try again later`, type: 'headed' });
		} else if (client.authStore.token) {
			// Token is expired, make the user log in again
			push_toast('warning', { type: 'headed', header: 'Session Expired', text: 'Your session has expired, please log in again.' });
			client.authStore.clear();
			modals.open(LoginRegister);
		}
	}
}

export async function login(
	email: string,
	password: string,
	register = false,
	rest: { [key: string]: unknown } = {},
): Promise<'SUCCESS' | 'INVALID_CREDENTIALS' | 'OTHER_ERROR' | 'EMAIL_IN_USE' | 'OTHER_ERROR'> {
	if (register) {
		const user = { ...rest, email, password, passwordConfirm: password };

		try {
			await client?.collection('users').create({ ...user });
		} catch (e: any) {
			if (e.response?.data?.email?.code == "validation_not_unique") {
				return 'EMAIL_IN_USE';
			} else return 'OTHER_ERROR';
		}

		push_toast('success', { type: 'headed', header: "Account created!", text: `Welcome to Kairos, ${rest.surname}!` });
	}

	try {
		await client?.collection('users').authWithPassword(email, password);
	} catch (e) {
		if (e.status == 400) {
			return 'INVALID_CREDENTIALS';
		} else {
			return 'OTHER_ERROR';
		}
	}

	if (!register) {
		push_toast('success', { type: 'headed', header: "Logged In", text: "Welcome back!" });
	}

	return 'SUCCESS';
}

export function logout() {
	client?.authStore.clear();
}

/*
 * Save (create/update) a record (a plain object). Automatically converts to
 * FormData if needed.
 */
export async function save<T>(collection: string, record: RecordModel, create = false) {
	// convert obj to FormData in case one of the fields is instanceof FileList
	const data = object2formdata(record);
	if (record.id && !create) {
		// "create" flag overrides update
		return await client?.collection(collection).update<T>(record.id, data);
	} else {
		return await client?.collection(collection).create<T>(data);
	}
}

// convert obj to FormData in case one of the fields is instanceof FileList
function object2formdata(obj: object) {
	// check if any field's value is an instanceof FileList
	if (!Object.values(obj).some((val) => val instanceof FileList || val instanceof File)) {
		// if not, just return the original object
		return obj;
	}
	// otherwise, build FormData (multipart/form-data) from obj
	const fd = new FormData();
	for (const [key, val] of Object.entries(obj)) {
		if (val instanceof FileList) {
			for (const file of val) {
				fd.append(key, file);
			}
		} else if (val instanceof File) {
			// handle File before "object" so that it doesn't get serialized as JSON
			fd.append(key, val);
		} else if (Array.isArray(val)) {
			// for some reason, multipart/form-data wants arrays to be comma-separated strings
			fd.append(key, val.join(','));
		} else if (typeof val === 'object') {
			fd.append(key, JSON.stringify(val));
		} else {
			fd.append(key, val);
		}
	}
	return fd;
}

export interface PageStore<T> extends Readable<ListResult<T>> {
	setPage(newpage: number): Promise<void>;
	next(): Promise<void>;
	prev(): Promise<void>;
}

export async function watch<T extends RecordModel>(
	idOrName: string,
	queryParams = {} as RecordListOptions,
	page = 1,
	perPage = 20,
	realtime = browser,
): Promise<PageStore<T>> {
	const collection = client?.collection(idOrName);
	let result = await collection?.getList<T>(page, perPage, queryParams);
	let set: Subscriber<ListResult<T>>;
	let unsubRealtime: UnsubscribeFunc | undefined;
	// fetch first page
	const store = readable<ListResult<T>>(result, (_set) => {
		set = _set;
		// watch for changes (only if you're in the browser)
		if (realtime)
			collection
				.subscribe<T>(
					'*',
					({ action, record }) => {
						(async function (action: string) {
							// see https://github.com/pocketbase/pocketbase/discussions/505
							switch (action) {
								// ISSUE: no subscribe event when a record is modified and no longer fits the "filter"
								// @see https://github.com/pocketbase/pocketbase/issues/4717
								case 'update':
								case 'create': {
									// record = await expand(queryParams.expand, record);
									const index = result.items.findIndex((r) => r.id === record.id);
									// replace existing if found, otherwise append
									if (index >= 0) {
										result.items[index] = record;
										return result.items;
									} else {
										return [...result.items, record];
									}
								}

								case 'delete':
									return result.items.filter((item) => item.id !== record.id);
							}
							return result.items;
						})(action).then((items) => set((result = { ...result, items })));
					},
					queryParams,
				)
				// remember for later
				.then((unsub) => (unsubRealtime = unsub));
	});
	async function setPage(newpage: number) {
		const { page, totalPages, perPage } = result;
		if (page > 0 && page <= totalPages) {
			set((result = await collection.getList(newpage, perPage, queryParams)));
		}
	}
	return {
		...store,
		subscribe(run, invalidate) {
			const unsubStore = store.subscribe(run, invalidate);
			return async () => {
				unsubStore();
				// ISSUE: Technically, we should AWAIT here, but that will slow down navigation UX.
				if (unsubRealtime) /* await */ unsubRealtime();
			};
		},
		setPage,
		async next() {
			setPage(result.page + 1);
		},
		async prev() {
			setPage(result.page - 1);
		},
	};
}

export async function providerLogin(provider: AuthProviderInfo, authCollection: RecordService) {
	const authResponse = await authCollection.authWithOAuth2({
		provider: provider.name,
		createData: {
			// emailVisibility: true,
		},
	});
	// update user "record" if "meta" has info it doesn't have
	const { meta, record } = authResponse;
	const changes = {} as { [key: string]: unknown };
	if (!record.name && meta?.name) {
		changes.name = meta.name;
	}
	if (!record.avatar && meta?.avatarUrl) {
		const response = await fetch(meta.avatarUrl);
		if (response.ok) {
			const type = response.headers.get('content-type') ?? 'image/jpeg';
			changes.avatar = new File([await response.blob()], 'avatar', { type });
		}
	}
	if (Object.keys(changes).length) {
		authResponse.record = await save(authCollection.collectionIdOrName, {
			...record,
			...changes,
		});
	}
	return authResponse;
}

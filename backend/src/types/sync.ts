export interface ClientChangeRequestBody {
    type: 'CHANGES',
    changes: IDatabaseChange[],
    partial: boolean,
    base_revision: number | null,
    request_id: number,
    client_id: string
}

export interface ClientIdRequestBody {
    type: 'CLIENT_ID',
    client_id: string | null
}

export interface ClientSubscribeRequestBody {
    type: 'SUBSCRIBE',
    client_id: string | null,
    synced_revision: number | null
}

export interface ServerChangesResponse {
    type: 'changes',
    changes: IDatabaseChange[];
    currentRevision: number | null;
    needsResync: boolean; // Flag telling that server doesn't have given syncedRevision or of other reason wants client to resync. ATTENTION: this flag is currently ignored by Dexie.Syncable
    partial: boolean; // The server sent only a part of the changes it has for us. On next resync it will send more based on the clientIdentity
    client_identity: string | null;
}

export interface ServerClientIdResponse {
    type: "client_id",
    client_id: string
}

export interface ServerSubscribeResponse {
    type: "subscribe"
}

export interface ServerAckResponse {
    type: "ack",
    request_id: number
}

export interface ServerErrorResponse {
    type: "error"
    error_type: ServerErrorType,
    request_id?: number,
    // Informs the client that a non-recoverable error occured and we should reset the sync data
    fatal: boolean,
    message: string,
    table?: string,
    key?: string
}

export interface ServerSuccessResponse {
    type: 'success'
}

export type ServerErrorType = 'OTHER' | 'INVALID_CLIENT_ID' | 'CLIENT_ID_GEN' | 'CLIENT_NOT_SUBSCRIBED' | 'INVALID_PROPS' | 'CREATE' | 'UPDATE' | 'DELETE';

export type ServerResponse = ServerAckResponse | ServerChangesResponse | ServerClientIdResponse | ServerErrorResponse | ServerSuccessResponse;

export enum DatabaseChangeType {
    Create = 'CREATE',
    Update = 'UPDATE',
    Delete = 'DELETE',
}

export interface ICreateChange {
    type: DatabaseChangeType.Create;
    table: 'settings' | 'vines' | 'history';
    key: string;
    obj: CoursesRecord | InstitutionsRecord | UsersRecord;
}

export interface IUpdateChange {
    type: DatabaseChangeType.Update;
    table: 'settings' | 'vines' | 'history';
    key: string;
    mods: {
        [keyPath: string]:
        | CoursesRecord
        | InstitutionsRecord
        | UsersRecord
        | undefined;
    };
}

export interface IDeleteChange {
    type: DatabaseChangeType.Delete;
    table: 'settings' | 'vines' | 'history';
    key: string;
}

export type IDatabaseChange = ICreateChange | IUpdateChange | IDeleteChange;
import { Subject } from "rxjs";
import { __KAIROS_VERSION__ } from "../constants";
import { ServerErrorFactory } from "../errors";

let last_event_id = 0;
const pull_stream$ = new Subject();

export default function (e: core.RequestEvent) {
    // Version gate
    const version = e.request?.header.get('Version');
    if (!version || version != __KAIROS_VERSION__) {
        return e.json(426, ServerErrorFactory.version('settings.push', e.requestInfo().body.id, { request_version: version, server_version: __KAIROS_VERSION__ }))
    }

    $app.runInTransaction((tx) => {
        let change_rows: Array<any> = e.requestInfo().body.change_rows;

        const conflicts = [];
        const event = {
            id: last_event_id++,
            documents: [],
            checkpoint: null
        };
        for (const change_row of change_rows) {
            let settings_collection = null;

            try {
                settings_collection = tx.findCollectionByNameOrId('setting');
            } catch (err) {
                return e.error(500, err.toString(), err);
            }
            
            let real_master_state = null;
            let new_record = false;
            try {
                real_master_state = tx.findFirstRecordByFilter(settings_collection, 'user = {:user}', { user: e.auth?.id });
            } catch (err) {
                if (err.toString() == 'GoError: sql: no rows in result set') {
                    // The record does not exist, let's create it.

                    real_master_state = new Record(settings_collection, { id: $security.randomStringByRegex('[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}'), created_at: new Date().toISOString().replace('T', ' '), updated_at: new Date().toISOString().replace('T', ' ') });
                    new_record = true;
                } else {
                    return e.error(500, err.toString(), err);
                }
            }

            if (!new_record) {
                if (
                    (real_master_state && !change_row.assumedMasterState) ||
                    (
                        real_master_state && change_row.assumedMasterState &&
                        /*
                         * For simplicity we detect conflicts on the server by only compare the updateAt value.
                         * In reality you might want to do a more complex check or do a deep-equal comparison.
                         */
                        new Date(real_master_state.get('updated_at')).toISOString().replace('T', ' ') !== change_row.assumedMasterState.updated_at)

                ) {
                    // we have a conflict
                    let copy = real_master_state.fieldsData();
                    delete copy.user;
                    copy.id = '1';
                    conflicts.push(copy);
                } else {
                    // no conflict -> write the document
                    try {
                        real_master_state.load({ ...change_row.newDocumentState, id: real_master_state?.id, user: e.auth?.id });
                        tx.save(real_master_state);
                    } catch (err) {
                        return e.error(500, err.toString(), err);
                    }
                    

                    event.documents.push(change_row.newDocumentState);
                    event.checkpoint = { id: '1', updated_at: change_row.newDocumentState.updated_at };
                }
            } else {
                // no conflict -> write the document
                try {
                    real_master_state.load({ ...change_row.newDocumentState, id: real_master_state?.id, user: e.auth?.id });
                tx.save(real_master_state);
                } catch (err) {
                    return e.error(500, err.toString(), err);
                }
                

                event.documents.push(change_row.newDocumentState);
                event.checkpoint = { id: '1', updated_at: change_row.newDocumentState.updated_at };
            }
        }

        if (event.documents.length > 0) {
            const message = new SubscriptionMessage({
                name: e.auth?.id + '_settings',
                data: JSON.stringify({ event }),
            });

            const clients = $app.subscriptionsBroker().clients();

            for (let clientId in clients) {
                if (clients[clientId].hasSubscription(e.auth?.id + '_settings')) {
                    clients[clientId].send(message);
                }
            }
        }

        e.response.header().set('Content-Type', 'application/json');
        return e.json(200, conflicts);
    });
}
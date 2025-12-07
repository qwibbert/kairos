import { Subject } from "rxjs";
import { __KAIROS_VERSION__ } from "../constants";
import { ServerErrorFactory } from "../errors";
import { VinesSyncErrorFactory } from "./errors";

let last_event_id = 0;
const pull_stream$ = new Subject();

export default function (e: core.RequestEvent) {
    // Version gate
    const version = e.request?.header.get('Version');
    if (!version || version != __KAIROS_VERSION__) {
        return e.json(426, ServerErrorFactory.version('vines.push', e.requestInfo().body.id, { request_version: version, server_version: __KAIROS_VERSION__ }))
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
            const vines_collection = tx.findCollectionByNameOrId('vines');
            let real_master_state = null;
            let new_record = false;
            try {
                real_master_state = tx.findFirstRecordByFilter(vines_collection, 'user = {:user} && id = {:id}', { user: e.auth?.id, id: change_row.newDocumentState?.id });
            } catch (err) {
                if (err.toString() == 'GoError: sql: no rows in result set') {
                    // The record does not exist, let's create it.

                    real_master_state = new Record(vines_collection, { id: $security.randomStringByRegex('[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}'), created_at: new Date().toISOString().replace('T', ' '), updated_at: new Date().toISOString().replace('T', ' ') });
                    new_record = true;
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
                    let copy = real_master_state.fieldsData();
                    copy.parent_id = copy.parent;
                    delete copy.parent;
                    copy.course_id = copy.course;
                    delete copy.course;
                    delete copy.user;
                    conflicts.push(copy);
                } else {
                    // no conflict -> write the document
                    try {
                        real_master_state!.load({ 
                            ...change_row.newDocumentState, 
                            user: e.auth?.id, 
                            parent: change_row.newDocumentState?.parent_id,
                            course: change_row.newDocumentState?.course_id
                         });
                        tx.save(real_master_state!);
                    } catch (err: any) {
                        throw err;
                    }

                    event.documents.push(change_row.newDocumentState as never);
                    event.checkpoint = { id: change_row.newDocumentState?.id, updated_at: change_row.newDocumentState.updated_at };
                }
            } else {
                // no conflict -> write the document parent: Failed to find all relation records with the provided ids.
                try {
                    real_master_state!.load({ 
                        ...change_row.newDocumentState, 
                        user: e.auth?.id, 
                        parent: change_row.newDocumentState?.parent_id,
                        course: change_row.newDocumentState?.course_id
                    });
                    tx.save(real_master_state!);
                } catch (err: any) {
                    if (err.toString() == 'GoError: parent: Failed to find all relation records with the provided ids.') {
                        return e.json(424, VinesSyncErrorFactory.parent_rel('vines.push', change_row.newDocumentState?.id ?? '???', {
                            parent_id: change_row.newDocumentState?.id ?? '???'
                        }));
                    } else if (err.toString() == 'GoError: course: Failed to find all relation records with the provided ids.') {
                        return e.json(424, VinesSyncErrorFactory.course_rel('vines.push', change_row.newDocumentState?.id ?? '???', {
                            course: change_row.newDocumentState?.id ?? '???'
                        }));
                    } else {
                        return e.json(500, VinesSyncErrorFactory.other('vines.push', change_row.newDocumentState?.id ?? '???', {
                            original: err
                        }));
                    }
                }

                event.documents.push(change_row.newDocumentState as never);
                event.checkpoint = { id: change_row.newDocumentState?.id, updated_at: change_row.newDocumentState.updated_at };
            }
        }

        if (event.documents.length > 0) {
            const message = new SubscriptionMessage({
                name: e.auth?.id + '_vines',
                data: JSON.stringify({ event }),
            });

            const clients = $app.subscriptionsBroker().clients();

            for (let clientId in clients) {
                if (clients[clientId].hasSubscription(e.auth?.id + '_vines')) {
                    clients[clientId].send(message);
                }
            }
        }

        e.response.header().set('Content-Type', 'application/json');
        return e.json(200, conflicts);
    });
}
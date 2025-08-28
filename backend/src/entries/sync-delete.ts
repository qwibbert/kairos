export default (e: core.RequestEvent) => {
    const user = e.auth?.id;

    // Disconnect all connected clients associated with the user.
    const user_clients = $app.findRecordsByFilter($app.findCollectionByNameOrId('sync_clients'), `user = '${user}'`, '', 0, 0);
    const clients = $app.subscriptionsBroker().clients();

    try {
        for (let clientId in clients) {
            if (user_clients.some(c => c?.id == clientId)) {
                clients[clientId].discard();
            }
        }
    } catch (err) {
        return e.json(500, { type: 'error', error_type: 'OTHER', message: 'Something went wrong during client discarding: ' + toString(e), fatal: false } as ServerErrorResponse);
    }


    $app.runInTransaction((txApp) => {
        // Delete all history entries
        const history_entries_collection = txApp.findCollectionByNameOrId('history_entries');
        const history_entries = txApp.findRecordsByFilter(history_entries_collection, `user = '${user}'`, '', 0, 0);

        for (const record of history_entries) {
            if (record) {
                $app.delete(record);
            }
        }

        // Delete all vines entries
        const vines_collection = txApp.findCollectionByNameOrId('vines');
        const vines = txApp.findRecordsByFilter(vines_collection, `user = '${user}'`, '', 0, 0);

        for (const record of vines) {
            if (record) {
                $app.delete(record);
            }
        }

        // Delete all sync_changes
        const sync_changes_collection = txApp.findCollectionByNameOrId('sync_changes');
        const sync_changes = txApp.findRecordsByFilter(sync_changes_collection, `user = '${user}'`, '', 0, 0);

        for (const record of sync_changes) {
            if (record) {
                $app.delete(record);
            }
        }

        // Reset user revision
        const sync_revisions_collection = txApp.findCollectionByNameOrId('sync_revisions');
        const sync_revision_record = txApp.findFirstRecordByFilter(sync_revisions_collection, `user =  '${user}'`);

        if (sync_revision_record) {
            sync_revision_record.set('revision', 0);
            $app.save(sync_revision_record);
        }
    });

};
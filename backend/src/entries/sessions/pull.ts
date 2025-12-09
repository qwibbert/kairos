import { __KAIROS_VERSION__ } from "../constants";
import { ServerErrorFactory } from "../errors";

export default function (e: core.RequestEvent) {
    let body = e.requestInfo().query;

    const id = body.id ?? '';
    const updated_at = new Date(parseInt(body.updated_at, 10)).toISOString().replace('T', ' ');

    // Version gate
    const version = e.request?.header.get('Version');
    if (!version || version != __KAIROS_VERSION__) {
        return e.json(426, ServerErrorFactory.version('session.pull', id, { request_version: version, server_version: __KAIROS_VERSION__ }))
    }

    let documents = $app.findRecordsByFilter(
        $app.findCollectionByNameOrId('sessions'),
        'user = {:user} && (updated_at > {:updated_at} || (updated_at = {:updated_at} && id != {:id}))',
        '+updated_at, +id',
        parseInt(body.batch_size, 10),
        0,
        { user: e.auth?.id, updated_at: updated_at, id });
    
    documents = documents.map((r) => {
        let copy = r?.fieldsData();

        if (copy) {
            delete copy.user;

            copy.vine_id = copy.vine ?? '';
            delete copy.vine;

            copy.vine_course = copy.course ?? '';
            delete copy.course;
        };

        return copy;
    });

    const new_checkpoint = documents.length === 0 ? { id, updated_at } : {
        id: documents[documents.length - 1]?.id,
        updated_at: documents[documents.length - 1]?.updated_at
    };

    e.response.header().set('Content-Type', 'application/json');

    e.json(200, { documents, checkpoint: new_checkpoint });
}
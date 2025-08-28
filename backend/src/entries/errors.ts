export class ErrorBase<T extends string> extends Error {
    name: T;
    message: string;
    context?: {
        operation: string;
        entity_id?: string;
        timestamp: Date;
        additional_data?: Record<string, any>;
    };

    constructor({
        name,
        message,
        context
    }: {
        name: T,
        message: string;
        context?: {
            operation: string;
            entity_id?: string;
            timestamp: Date;
            additional_data?: Record<string, any>;
        };
    }) {
        super();
        this.name = name;
        this.message = message;
        this.context = context;
    }
}

export enum ServerErrorType {
    VERSION = 'VERSION',
    OTHER = 'OTHER'
}

type ErrorMessage = string;

export const history_sync_error_map: Map<ServerErrorType, ErrorMessage> = new Map([
    [ServerErrorType.VERSION, 'Client is outdated or didn\'t send a version header.'],
    [ServerErrorType.OTHER, 'An unexpected error occurred']
]);

export class ServerError extends ErrorBase<ServerErrorType> { }

export class ServerErrorFactory {
    static version(operation: string, entity_id: string, additional_data: Record<string, any>): ServerError {
        return new ServerError({
            name: ServerErrorType.VERSION,
            message: `${history_sync_error_map.get(ServerErrorType.VERSION)}`,
            context: {
                operation,
                entity_id,
                timestamp: new Date(),
                additional_data
            }
        });
    }

    static other(operation: string, entity_id: string, additional_data: Record<string, any>): ServerError {
        return new ServerError({
            name: ServerErrorType.OTHER,
            message: `${history_sync_error_map.get(ServerErrorType.OTHER)}`,
            context: {
                operation,
                entity_id,
                timestamp: new Date(),
                additional_data
            }
        });
    }
}
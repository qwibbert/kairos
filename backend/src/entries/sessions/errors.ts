import { ErrorBase } from "../errors";

export enum HistorySyncErrorType {
    PARENT_REL = 'PARENT_REL',
    COURSE_REL = 'COURSE_REL',
    OTHER = 'OTHER'
}

type ErrorMessage = string;

export const history_sync_error_map: Map<HistorySyncErrorType, ErrorMessage> = new Map([
    [HistorySyncErrorType.PARENT_REL, 'The parent relation was not found in the upstream database.'],
    [HistorySyncErrorType.COURSE_REL, 'The course relation was not found in the upstream database.'],
    [HistorySyncErrorType.OTHER, 'An unexpected error occurred']
]);

export class HistorySyncError extends ErrorBase<HistorySyncErrorType> { }

export class HistorySyncErrorFactory {
    static parent_rel(operation: string, entity_id: string, additional_data: Record<string, any>): HistorySyncError {
        return new HistorySyncError({
            name: HistorySyncErrorType.PARENT_REL,
            message: `${history_sync_error_map.get(HistorySyncErrorType.PARENT_REL)}`,
            context: {
                operation,
                entity_id,
                timestamp: new Date(),
                additional_data
            }
        });
    }

    static course_rel(operation: string, entity_id: string, additional_data: Record<string, any>): HistorySyncError {
        return new HistorySyncError({
            name: HistorySyncErrorType.COURSE_REL,
            message: `${history_sync_error_map.get(HistorySyncErrorType.COURSE_REL)}`,
            context: {
                operation,
                entity_id,
                timestamp: new Date(),
                additional_data
            }
        });
    }

    static other(operation: string, entity_id: string, additional_data: Record<string, any>): HistorySyncError {
        return new HistorySyncError({
            name: HistorySyncErrorType.OTHER,
            message: `${history_sync_error_map.get(HistorySyncErrorType.OTHER)}`,
            context: {
                operation,
                entity_id,
                timestamp: new Date(),
                additional_data
            }
        });
    }
}
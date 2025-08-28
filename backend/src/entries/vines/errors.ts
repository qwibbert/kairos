import { ErrorBase } from "../errors";

export enum VinesSyncErrorType {
    PARENT_REL = 'PARENT_REL',
    COURSE_REL = 'COURSE_REL',
    OTHER = 'OTHER'
}

type ErrorMessage = string;

export const vines_sync_error_map: Map<VinesSyncErrorType, ErrorMessage> = new Map([
    [VinesSyncErrorType.PARENT_REL, 'The parent relation was not found in the upstream database.'],
    [VinesSyncErrorType.COURSE_REL, 'The course relation was not found in the upstream database.'],
    [VinesSyncErrorType.OTHER, 'An unexpected error occurred']
]);

export class VinesSyncError extends ErrorBase<VinesSyncErrorType> { }

export class VinesSyncErrorFactory {
    static parent_rel(operation: string, entity_id: string, additional_data: Record<string, any>): VinesSyncError {
        return new VinesSyncError({
            name: VinesSyncErrorType.PARENT_REL,
            message: `${vines_sync_error_map.get(VinesSyncErrorType.PARENT_REL)}`,
            context: {
                operation,
                entity_id,
                timestamp: new Date(),
                additional_data
            }
        });
    }

    static course_rel(operation: string, entity_id: string, additional_data: Record<string, any>): VinesSyncError {
        return new VinesSyncError({
            name: VinesSyncErrorType.COURSE_REL,
            message: `${vines_sync_error_map.get(VinesSyncErrorType.COURSE_REL)}`,
            context: {
                operation,
                entity_id,
                timestamp: new Date(),
                additional_data
            }
        });
    }

    static other(operation: string, entity_id: string, additional_data: Record<string, any>): VinesSyncError {
        return new VinesSyncError({
            name: VinesSyncErrorType.OTHER,
            message: `${vines_sync_error_map.get(VinesSyncErrorType.OTHER)}`,
            context: {
                operation,
                entity_id,
                timestamp: new Date(),
                additional_data
            }
        });
    }
}
import { ErrorBase } from '$lib/errors';

export enum SessionErrorType {
	INVALID_TIME = 'INVALID_TIME',
	INVALID_STATE = 'INVALID_STATE',
	INVALID_PAUSE = 'INVALID_PAUSE',
	DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
	NOT_PRESENT = 'NOT_PRESENT',
	INVALID_ELAPSED_TIME = 'INVALID_ELAPSED_TIME',
	OTHER = 'OTHER',
}

type ErrorMessage = string;

export const session_error_map: Map<SessionErrorType, ErrorMessage> = new Map([
	[SessionErrorType.INVALID_TIME, 'Session has invalid timing configuration'],
	[SessionErrorType.INVALID_STATE, 'Session does not possess the correct state for this operation'],
	[SessionErrorType.INVALID_PAUSE, 'Session has invalid pause configuration'],
	[SessionErrorType.DUPLICATE_ENTRY, 'History entry already exists in the database'],
	[SessionErrorType.NOT_PRESENT, 'History entry not found'],
	[SessionErrorType.INVALID_ELAPSED_TIME, 'Elapsed time calculation is invalid'],
	[SessionErrorType.OTHER, 'An unexpected error occurred'],
]);

export class SessionError extends ErrorBase<SessionErrorType> {}

export class SessionErrorFactory {
	static invalid_time(
		details: string,
		operation: string,
		entity_id: string,
		additional_data: Record<string, unknown>,
	): SessionError {
		return new SessionError({
			name: SessionErrorType.INVALID_TIME,
			message: `${session_error_map.get(SessionErrorType.INVALID_TIME)}: ${details}`,
			context: {
				operation,
				entity_id,
				timestamp: new Date(),
				additional_data,
			},
		});
	}

	static invalid_state(
		detail: string,
		operation: string,
		entity_id: string,
		additional_data: Record<string, unknown>,
	): SessionError {
		return new SessionError({
			name: SessionErrorType.INVALID_STATE,
			message: `${session_error_map.get(SessionErrorType.INVALID_STATE)}: ${detail}`,
			context: {
				operation,
				entity_id,
				timestamp: new Date(),
				additional_data,
			},
		});
	}

	static invalid_pause(
		operation: string,
		entity_id: string,
		additional_data: Record<string, unknown>,
	): SessionError {
		return new SessionError({
			name: SessionErrorType.INVALID_PAUSE,
			message: `${session_error_map.get(SessionErrorType.INVALID_PAUSE)}`,
			context: {
				operation,
				entity_id,
				timestamp: new Date(),
				additional_data,
			},
		});
	}

	static entry_not_found(
		operation: string,
		entity_id: string,
		additional_data: Record<string, unknown>,
	): SessionError {
		return new SessionError({
			name: SessionErrorType.NOT_PRESENT,
			message: `${session_error_map.get(SessionErrorType.NOT_PRESENT)}`,
			context: {
				operation,
				timestamp: new Date(),
				entity_id,
				additional_data,
			},
		});
	}

	static duplicate_entry(
		operation: string,
		entity_id: string,
		additional_data: Record<string, unknown>,
	): SessionError {
		return new SessionError({
			name: SessionErrorType.DUPLICATE_ENTRY,
			message: `${session_error_map.get(SessionErrorType.DUPLICATE_ENTRY)}`,
			context: {
				operation,
				entity_id,
				timestamp: new Date(),
				additional_data,
			},
		});
	}
}

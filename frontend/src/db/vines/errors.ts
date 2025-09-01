import { ErrorBase } from '$lib/errors';

export enum VinesErrorType {
	NOT_FOUND = 'NOT_FOUND',
	OTHER = 'OTHER',
}

type ErrorMessage = string;

export const vines_error_map: Map<VinesErrorType, ErrorMessage> = new Map([
	[VinesErrorType.NOT_FOUND, 'A record was not found in the database'],
	[VinesErrorType.OTHER, 'An unexpected error occurred'],
]);

export class VinesError extends ErrorBase<VinesErrorType> {}

export class VinesErrorFactory {
	static not_found(
		operation: string,
		entity_id: string,
		additional_data: Record<string, unknown>,
	): VinesError {
		return new VinesError({
			name: VinesErrorType.NOT_FOUND,
			message: `${vines_error_map.get(VinesErrorType.NOT_FOUND)}`,
			context: {
				operation,
				entity_id,
				timestamp: new Date(),
				additional_data,
			},
		});
	}
}

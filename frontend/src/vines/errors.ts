import { ErrorBase, type TErrorMessage } from '$lib/errors';

export enum TVineError {
	NO_VINE = 'NO_VINE',
	NO_SETTINGS = 'NO_SETTINGS',
	OTHER = 'OTHER',
}

export const vine_error_map: Map<TVineError, TErrorMessage> = new Map([
	[TVineError.NO_SETTINGS, 'User settings not yet initialised.'],
	[TVineError.OTHER, 'Unexpected database error occured.'],
]);

export class VineError extends ErrorBase<TVineError> {}

export class VineErrorFactory {
	static noVine(): VineError {
		return new VineError({
			name: TVineError.NO_VINE,
			message: `${vine_error_map.get(TVineError.NO_VINE)}`,
			context: {
				timestamp: new Date(),
			},
		});
	}

	static other(e: any): VineError {
		return new VineError({
			name: TVineError.OTHER,
			message: `${vine_error_map.get(TVineError.OTHER)}`,
			context: {
				timestamp: new Date(),
				additional_data: {
					db_error: e,
				},
			},
		});
	}
}

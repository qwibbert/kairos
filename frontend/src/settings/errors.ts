import { ErrorBase, type TErrorMessage } from '$lib/errors';

export enum TSettingsError {
	NO_SETTINGS = 'NO_SETTINGS',
	OTHER = 'OTHER',
}

export const settings_error_map: Map<TSettingsError, TErrorMessage> = new Map([
	[TSettingsError.NO_SETTINGS, 'User settings not yet initialised.'],
	[TSettingsError.OTHER, 'Unexpected database error occured.'],
]);

export class SettingsError extends ErrorBase<TSettingsError> {}

export class SettingsErrorFactory {
	static noSettings(): SettingsError {
		return new SettingsError({
			name: TSettingsError.NO_SETTINGS,
			message: `${settings_error_map.get(TSettingsError.NO_SETTINGS)}`,
			context: {
				timestamp: new Date(),
			},
		});
	}

	static other(e: any): SettingsError {
		return new SettingsError({
			name: TSettingsError.OTHER,
			message: `${settings_error_map.get(TSettingsError.OTHER)}`,
			context: {
				timestamp: new Date(),
				additional_data: {
					db_error: e,
				},
			},
		});
	}
}

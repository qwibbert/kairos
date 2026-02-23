import { db } from '$db/db';
import { type SettingsDocType, type SettingsDocument } from '$db/settings/define';
import i18next from 'i18next';
import { DateTime, Interval } from 'luxon';
import type { Observable } from 'rxjs';
import { modals } from 'svelte-modals';

import { Logger } from '$lib/logger';

import { SettingsError, SettingsErrorFactory } from './errors';

/**
 * Contains utility methods for interacting with the settings storage.
 */
export class Settings {
	private constructor() {}

	/**
	 * Returns the SettingsDocument from the database or a `SettingsError` if a database problem occured.
	 */
	static async getDoc(): Promise<SettingsDocument | SettingsError> {
		return db.settings
			.findOne('1')
			.exec()
			.then((doc) => {
				if (doc) {
					return doc;
				} else {
					return SettingsErrorFactory.noSettings();
				}
			})
			.catch((e) => {
				return SettingsErrorFactory.other(e);
			});
	}

	static async setupSubscriptions() {
		const doc = await this.getDoc();

		if (!(doc instanceof SettingsError)) {
			const festive_period = this.is_festive_period();

			doc.$.subscribe((d) => {
				if (
					festive_period &&
					d?.special_periods &&
					d.tour_completed &&
					!d.special_periods_tip_shown
				) {
					modals.open(Alert, {
						type: 'INFO',
						header:
							festive_period == 'HALLOWEEN'
								? i18next.t('settings:halloween_header')
								: i18next.t('settings:christmas_header'),
						text: i18next.t('settings:theme_auto_adjust_msg', {
							theme:
								festive_period == 'HALLOWEEN'
									? i18next.t('settings:halloween')
									: i18next.t('settings:christmas'),
						}),
						dismissable: false,
						actions: new Map([
							[
								i18next.t('common:dismiss'),
								async () => {
									await this.writeSetting('special_periods_tip_shown', true);
								},
							],
							[
								i18next.t('common:revert'),
								async () => {
									document.documentElement.setAttribute(
										'data-theme',
										await this.readSetting('theme'),
									);
									await this.writeSetting('special_periods_tip_shown', true);
									await this.writeSetting('special_periods', false);
								},
							],
						]),
					});
				}
				if (
					d.changelog_autoshow &&
					d.changelog_latest_shown != undefined &&
					d.changelog_latest_shown != __KAIROS_VERSION__
				) {
					modals.open(ChangelogModal, { autoshow: true });
				}
			});
		}
	}

	/**
	 * Writes `value` to a setting `key`. Returns a `SettingsError` if a database problem occured.
	 */
	static async writeSetting<K extends keyof SettingsDocType>(
		key: K,
		value: SettingsDocType[K],
	): Promise<void | SettingsError> {
		const doc = await this.getDoc();

		if (doc instanceof SettingsError) {
			return doc;
		}

		try {
			await doc.incrementalUpdate({
				$set: {
					[key]: value,
					updated_at: new Date().toISOString().replace('T', ' '),
				},
			});

			Logger.debug(`Updated setting ${key} to ${value}`);
		} catch (e) {
			Logger.error(`Updating setting ${key} to ${value} failed with error {e}`);
			return SettingsErrorFactory.other(e);
		}
	}

	static async readSetting<K extends keyof SettingsDocType>(
		key: K,
	): Promise<SettingsDocType[K] | SettingsError> {
		const doc = await this.getDoc();

		if (doc instanceof SettingsError) {
			return doc;
		}

		try {
			return await doc.get(key);
		} catch (e) {
			return SettingsErrorFactory.other(e);
		}
	}

	/**
	 * Attaches `callback` to a setting `key` that fires once on subscription and every time the setting changes. Returns a `SettingsError` if a database problem occured.
	 */
	static async subscribeSetting<K extends keyof SettingsDocType>(
		key: K,
		callback: (v: SettingsDocType[K]) => void,
	): Promise<void | SettingsError> {
		const doc = await this.getDoc();

		if (doc instanceof SettingsError) {
			return doc;
		}

		try {
			doc.get$(key).subscribe(callback);
		} catch (e) {
			return SettingsErrorFactory.other(e);
		}
	}

	/**
	 * Checks if the current date falls in a festive period. Currently supported festive periods are Christmas and Halloween.
	 */
	static is_festive_period(): 'CHRISTMAS' | 'HALLOWEEN' | null {
		const today = DateTime.now();

		if (
			Interval.fromDateTimes(
				DateTime.local(today.year, 10, 20),
				DateTime.local(today.year, 11, 5),
			).contains(today)
		) {
			return 'HALLOWEEN';
		} else if ((today.month == 12 && today.day >= 15) || (today.month == 1 && today.day <= 5)) {
			return 'CHRISTMAS';
		} else {
			return null;
		}
	}
}

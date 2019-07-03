import { remote } from "electron";
import settings from "electron-settings";
import { is } from "electron-util";
import { JsonValue } from "type-fest";

import { isAtLeastMojave } from "../../utils/os";

const DEFAULT_ALLOW_FUTURE_ENTRIES = false;
const DEFAULT_THEME_PREF: ThemePref = "light";
const PREF_DIR = remote.app.getPath("userData");

/**
 * Return value for specified preference. If not set, save and return the provided default value
 */
function getPref<T extends JsonValue>(prefName: string, defaultValue: T): T {
	let value: T;
	if (settings.has(prefName)) {
		value = settings.get(prefName) as T;
	} else {
		value = defaultValue;
		settings.set(prefName, value);
	}
	return value;
}

/**
 * Update the specified preference's value
 */
function setPref(prefName: string, value: JsonValue): void {
	settings.set(prefName, value);
}

// Diary file

/**
 * Return the preference for the directory in which the diary file is saved
 */
export function loadDirPref(): string {
	return getPref("filePath", PREF_DIR);
}

/**
 * Update the diary directory preference
 */
export function saveDirPref(filePath: string): void {
	setPref("filePath", filePath);
}

// Future entries

/**
 * Return the preference for whether diary entries can be written for days in the future
 */
export function loadFutureEntriesPref(): boolean {
	return getPref("allowFutureEntries", DEFAULT_ALLOW_FUTURE_ENTRIES);
}

/**
 * Update the future entries preference
 */
export function saveFutureEntriesPref(allowFutureEntries: boolean): void {
	setPref("allowFutureEntries", allowFutureEntries);
}

// Theme

/**
 * Return the theme preference (one of ['auto', 'light', 'dark'])
 * When set to 'auto', the system theme will be used
 */
export function loadThemePref(): ThemePref {
	const defaultPref = is.macos && isAtLeastMojave() ? "auto" : DEFAULT_THEME_PREF;
	return getPref("theme", defaultPref);
}

/**
 * Update the theme preference (one of ['auto', 'light', 'dark'])
 */
export function saveThemePref(themePref: ThemePref): void {
	setPref("theme", themePref);
}

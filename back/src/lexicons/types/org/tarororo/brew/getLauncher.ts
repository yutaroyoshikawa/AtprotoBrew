import { validate as _validate } from "../../../../lexicons";
import { is$typed as _is$typed } from "../../../../util";
import type * as OrgTarororoBrewLauncher from "./launcher.js";
import type * as OrgTarororoBrewStoreItem from "./storeItem.js";

const is$typed = _is$typed,
	validate = _validate;
const id = "org.tarororo.brew.getLauncher";

export type QueryParams = {};
export type InputSchema = undefined;

export interface OutputSchema {
	view: LauncherView;
	record: OrgTarororoBrewLauncher.Record;
}

export type HandlerInput = undefined;

export interface HandlerSuccess {
	encoding: "application/json";
	body: OutputSchema;
	headers?: { [key: string]: string };
}

export interface HandlerError {
	status: number;
	message?: string;
}

export type HandlerOutput = HandlerError | HandlerSuccess;
export type LauncherView = LauncherViewItem[];

export interface LauncherViewItem {
	$type?: "org.tarororo.brew.getLauncher#launcherViewItem";
	thumbnail: string;
	record: OrgTarororoBrewStoreItem.Record;
}

const hashLauncherViewItem = "launcherViewItem";

export function isLauncherViewItem<V>(v: V) {
	return is$typed(v, id, hashLauncherViewItem);
}

export function validateLauncherViewItem<V>(v: V) {
	return validate<LauncherViewItem & V>(v, id, hashLauncherViewItem);
}

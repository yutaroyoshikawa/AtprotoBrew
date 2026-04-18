/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type { BlobRef } from "@atproto/lexicon";
import { validate as _validate } from "../../../../lexicons";
import { is$typed as _is$typed, type $Typed } from "../../../../util";

const is$typed = _is$typed,
	validate = _validate;
const id = "org.tarororo.brew.storeItem";

export interface Record {
	$type: "org.tarororo.brew.storeItem";
	title: string;
	description: string;
	author: string;
	launch: $Typed<LaunchWeb> | { $type: string };
	thumbnail: BlobRef;
	[k: string]: unknown;
}

const hashRecord = "main";

export function isRecord<V>(v: V) {
	return is$typed(v, id, hashRecord);
}

export function validateRecord<V>(v: V) {
	return validate<Record & V>(v, id, hashRecord, true);
}

export interface LaunchWeb {
	$type?: "org.tarororo.brew.storeItem#launchWeb";
	link: string;
}

const hashLaunchWeb = "launchWeb";

export function isLaunchWeb<V>(v: V) {
	return is$typed(v, id, hashLaunchWeb);
}

export function validateLaunchWeb<V>(v: V) {
	return validate<LaunchWeb & V>(v, id, hashLaunchWeb);
}

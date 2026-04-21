import { validate as _validate } from "../../../../lexicons";
import { is$typed as _is$typed } from "../../../../util";
import type * as ComAtprotoRepoStrongRef from "../../../com/atproto/repo/strongRef.js";

const is$typed = _is$typed,
	validate = _validate;
const id = "org.tarororo.brew.launcher";

export interface Record {
	$type: "org.tarororo.brew.launcher";
	items: Item[];
	[k: string]: unknown;
}

const hashRecord = "main";

export function isRecord<V>(v: V) {
	return is$typed(v, id, hashRecord);
}

export function validateRecord<V>(v: V) {
	return validate<Record & V>(v, id, hashRecord, true);
}

export interface Item {
	$type?: "org.tarororo.brew.launcher#item";
	storeItemRef?: ComAtprotoRepoStrongRef.Main;
}

const hashItem = "item";

export function isItem<V>(v: V) {
	return is$typed(v, id, hashItem);
}

export function validateItem<V>(v: V) {
	return validate<Item & V>(v, id, hashItem);
}

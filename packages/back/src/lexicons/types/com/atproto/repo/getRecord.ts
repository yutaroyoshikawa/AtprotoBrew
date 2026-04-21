import { validate as _validate } from "../../../../lexicons";
import { is$typed as _is$typed } from "../../../../util";

const is$typed = _is$typed,
	validate = _validate;
const id = "com.atproto.repo.getRecord";

export type QueryParams = {
	/** The CID of the version of the record. If not specified, then return the most recent version. */
	cid?: string;
	/** The handle or DID of the repo. */
	repo: string;
	/** The Record Key. */
	rkey: string;
	/** The NSID of the record collection. */
	collection: string;
};
export type InputSchema = undefined;

export interface OutputSchema {
	cid?: string;
	uri: string;
	value: { [_ in string]: unknown };
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
	error?: "RecordNotFound";
}

export type HandlerOutput = HandlerError | HandlerSuccess;

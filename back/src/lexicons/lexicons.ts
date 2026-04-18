/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type LexiconDoc, Lexicons, ValidationError, type ValidationResult } from "@atproto/lexicon";
import { is$typed, maybe$typed } from "./util.js";

export const schemaDict = {
	ComAtprotoRepoGetRecord: {
		id: "com.atproto.repo.getRecord",
		defs: {
			main: {
				type: "query",
				errors: [
					{
						name: "RecordNotFound",
					},
				],
				output: {
					schema: {
						type: "object",
						required: ["uri", "value"],
						properties: {
							cid: {
								type: "string",
								format: "cid",
							},
							uri: {
								type: "string",
								format: "at-uri",
							},
							value: {
								type: "unknown",
							},
						},
					},
					encoding: "application/json",
				},
				parameters: {
					type: "params",
					required: ["repo", "collection", "rkey"],
					properties: {
						cid: {
							type: "string",
							format: "cid",
							description:
								"The CID of the version of the record. If not specified, then return the most recent version.",
						},
						repo: {
							type: "string",
							format: "at-identifier",
							description: "The handle or DID of the repo.",
						},
						rkey: {
							type: "string",
							format: "record-key",
							description: "The Record Key.",
						},
						collection: {
							type: "string",
							format: "nsid",
							description: "The NSID of the record collection.",
						},
					},
				},
				description: "Get a single record from a repository. Does not require auth.",
			},
		},
		$type: "com.atproto.lexicon.schema",
		lexicon: 1,
	},
	ComAtprotoRepoStrongRef: {
		id: "com.atproto.repo.strongRef",
		defs: {
			main: {
				type: "object",
				required: ["uri", "cid"],
				properties: {
					cid: {
						type: "string",
						format: "cid",
					},
					uri: {
						type: "string",
						format: "at-uri",
					},
				},
			},
		},
		$type: "com.atproto.lexicon.schema",
		lexicon: 1,
		description: "A URI with a content-hash fingerprint.",
	},
	OrgTarororoBrewGetLauncher: {
		lexicon: 1,
		id: "org.tarororo.brew.getLauncher",
		defs: {
			main: {
				type: "query",
				description: "",
				parameters: {
					type: "params",
					properties: {},
				},
				output: {
					schema: {
						type: "object",
						required: ["view", "record"],
						properties: {
							view: {
								type: "ref",
								ref: "lex:org.tarororo.brew.getLauncher#launcherView",
							},
							record: {
								type: "ref",
								ref: "lex:org.tarororo.brew.launcher",
							},
						},
					},
					encoding: "application/json",
				},
			},
			launcherView: {
				type: "array",
				items: {
					type: "ref",
					ref: "lex:org.tarororo.brew.getLauncher#launcherViewItem",
				},
			},
			launcherViewItem: {
				type: "object",
				required: ["thumbnail", "record"],
				properties: {
					thumbnail: {
						type: "string",
						format: "uri",
					},
					record: {
						type: "ref",
						ref: "lex:org.tarororo.brew.storeItem",
					},
				},
			},
		},
	},
	OrgTarororoBrewLauncher: {
		lexicon: 1,
		id: "org.tarororo.brew.launcher",
		defs: {
			main: {
				type: "record",
				description: "",
				key: "literal:self",
				record: {
					type: "object",
					required: ["items"],
					properties: {
						items: {
							type: "array",
							items: {
								type: "ref",
								ref: "lex:org.tarororo.brew.launcher#item",
							},
						},
					},
				},
			},
			item: {
				type: "object",
				properties: {
					storeItemRef: {
						type: "ref",
						ref: "lex:com.atproto.repo.strongRef",
					},
				},
			},
		},
	},
	OrgTarororoBrewStoreItem: {
		lexicon: 1,
		id: "org.tarororo.brew.storeItem",
		defs: {
			main: {
				type: "record",
				description: "",
				key: "any",
				record: {
					type: "object",
					required: ["title", "description", "author", "launch", "thumbnail"],
					properties: {
						title: {
							type: "string",
						},
						description: {
							type: "string",
						},
						author: {
							type: "string",
						},
						launch: {
							type: "union",
							refs: ["lex:org.tarororo.brew.storeItem#launchWeb"],
						},
						thumbnail: {
							type: "blob",
						},
					},
				},
			},
			launchWeb: {
				type: "object",
				required: ["link"],
				properties: {
					link: {
						type: "string",
						format: "uri",
					},
				},
			},
		},
	},
} as const satisfies Record<string, LexiconDoc>;
export const schemas = Object.values(schemaDict) satisfies LexiconDoc[];
export const lexicons: Lexicons = new Lexicons(schemas);

export function validate<T extends { $type: string }>(
	v: unknown,
	id: string,
	hash: string,
	requiredType: true,
): ValidationResult<T>;
export function validate<T extends { $type?: string }>(
	v: unknown,
	id: string,
	hash: string,
	requiredType?: false,
): ValidationResult<T>;
export function validate(v: unknown, id: string, hash: string, requiredType?: boolean): ValidationResult {
	return (requiredType ? is$typed : maybe$typed)(v, id, hash)
		? lexicons.validate(`${id}#${hash}`, v)
		: {
				success: false,
				error: new ValidationError(
					`Must be an object with "${hash === "main" ? id : `${id}#${hash}`}" $type property`,
				),
			};
}

export const ids = {
	ComAtprotoRepoGetRecord: "com.atproto.repo.getRecord",
	ComAtprotoRepoStrongRef: "com.atproto.repo.strongRef",
	OrgTarororoBrewGetLauncher: "org.tarororo.brew.getLauncher",
	OrgTarororoBrewLauncher: "org.tarororo.brew.launcher",
	OrgTarororoBrewStoreItem: "org.tarororo.brew.storeItem",
} as const;

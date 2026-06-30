import { DID_KEY_PREFIX, parseDidKey, parseMultikey, SECP256K1_JWT_ALG, verifySignature } from "@atproto/crypto";
import { getKey } from "@atproto/identity";
import {
	AuthRequiredError,
	type HonoAuthVerifier,
	type HonoAuthVerifierContext,
	InvalidRequestError,
} from "@evex-dev/xrpc-hono";
import { secp256k1 } from "@noble/curves/secp256k1";
import { sha256 } from "@noble/hashes/sha2";
import type { Context } from "hono";
import { resolveDiddoc } from "../../../resolver";
import type { BrewEnv } from "../../../types";

export type ServiceAuth = (arg: HonoAuthVerifierContext<BrewEnv>) => Promise<AuthSuccess>;
type AuthParam = Parameters<HonoAuthVerifier<BrewEnv, AuthSuccess>>[0];
type AuthSuccess = { credentials: { type: "standard"; iss: string; aud: string } };
type VerifySignatureWithKeyFn = (
	didKey: string,
	msgBytes: Uint8Array,
	sigBytes: Uint8Array,
	alg: string,
) => Promise<boolean>;

type JwtHeader = {
	alg: string;
	typ?: string;
	kid?: string;
};

type JwtPayload = {
	iss: string;
	aud: string;
	exp: number;
	iat: number;
	lxm?: string;
	jti?: string;
};

type JwtParts = {
	headerB64: string;
	payloadB64: string;
	sigB64: string;
};

type ParsedJwt = {
	header: JwtHeader;
	payload: JwtPayload;
	msgBytes: Uint8Array;
	sigBytes: Uint8Array;
};

export function createServiceAuth({ ownDid }: { ownDid: string }): ServiceAuth {
	return async ({ ctx }: AuthParam): Promise<AuthSuccess> => {
		const jwtStr = requireBearerToken(ctx);
		const nsid = parseUrlNsid(ctx.req.path);
		const parsed = parseServiceJwt(jwtStr);
		await verifyServiceJwtSignature(parsed, getSigningKey, verifySignatureWithKey);
		ensureAudience(parsed.payload.aud, ownDid);
		ensureLexiconMethod(parsed.payload.lxm, nsid);
		return buildAuthSuccess(parsed.payload);
	};
}

const requireBearerToken = (c: Context): string => {
	//Bearer以外(Basicとか)は管理者用っぽいのでBearerだけでいいはず
	if (!isBearerToken(c)) {
		throw new AuthRequiredError(undefined, "AuthMissing");
	}
	const jwtStr = bearerTokenFromReq(c);
	if (!jwtStr) throw new AuthRequiredError("missing jwt", "MissingJwt");
	return jwtStr;
};

const parseServiceJwt = (jwtStr: string): ParsedJwt => {
	const parts = splitJwt(jwtStr);
	const header = parseJwtHeader(parts.headerB64);
	const payload = parseJwtPayload(parts.payloadB64);
	validateJwtHeader(header);
	validateJwtPayload(payload);
	const msgBytes = new TextEncoder().encode(`${parts.headerB64}.${parts.payloadB64}`);
	const sigBytes = base64UrlToBytes(parts.sigB64);
	return { header, payload, msgBytes, sigBytes };
};

const splitJwt = (jwtStr: string): JwtParts => {
	const parts = jwtStr.split(".");
	if (parts.length !== 3) {
		throw new AuthRequiredError("poorly formatted jwt", "BadJwt");
	}
	return { headerB64: parts[0], payloadB64: parts[1], sigB64: parts[2] };
};

const validateJwtHeader = (header: JwtHeader): void => {
	if (header.typ === undefined) {
		return;
	}
	if (header.typ !== "JWT") {
		throw new AuthRequiredError(`Invalid jwt type "${header.typ}"`, "BadJwtType");
	}
};

const validateJwtPayload = (payload: JwtPayload): void => {
	if (!isDidStringOrService(payload.iss)) {
		throw new AuthRequiredError("jwt iss is not a valid did", "BadJwtIss");
	}
	if (Date.now() / 1000 > payload.exp) {
		throw new AuthRequiredError("jwt expired", "JwtExpired");
	}
};

const verifyServiceJwtSignature = async (
	parsed: ParsedJwt,
	getSigningKey: (iss: string, forceRefresh: boolean) => Promise<string>,
	verifySignatureWithKey: VerifySignatureWithKeyFn,
): Promise<void> => {
	const signingKey = await getSigningKey(parsed.payload.iss, false);
	let validSig = await verifySignatureAttempt(signingKey, parsed, verifySignatureWithKey);
	if (!validSig) {
		const freshSigningKey = await getSigningKey(parsed.payload.iss, true);
		validSig =
			freshSigningKey !== signingKey
				? await verifySignatureAttempt(freshSigningKey, parsed, verifySignatureWithKey)
				: false;
	}
	if (!validSig) {
		throw new AuthRequiredError("jwt signature does not match jwt issuer", "BadJwtSignature");
	}
};

const verifySignatureAttempt = async (
	didKey: string,
	parsed: ParsedJwt,
	verifySignatureWithKey: VerifySignatureWithKeyFn,
): Promise<boolean> => {
	try {
		return await verifySignatureWithKey(didKey, parsed.msgBytes, parsed.sigBytes, parsed.header.alg);
	} catch {
		throw new AuthRequiredError("could not verify jwt signature", "BadJwtSignature");
	}
};

const ensureAudience = (aud: string, ownDid: string): void => {
	if (!matchesAudience(aud, ownDid)) {
		throw new AuthRequiredError("jwt audience does not match service did", "BadJwtAudience");
	}
};

const matchesAudience = (aud: string, ownDid: string): boolean => {
	if (aud === ownDid) return true;
	if (!ownDid.includes("#") && aud.startsWith(`${ownDid}#`)) return true;
	return false;
};

const ensureLexiconMethod = (lxm: string | undefined, nsid: string): void => {
	if (lxm !== nsid) {
		throw new AuthRequiredError(
			lxm !== undefined
				? `bad jwt lexicon method ("lxm"). must match: ${nsid}`
				: `missing jwt lexicon method ("lxm"). must match: ${nsid}`,
			"BadJwtLexiconMethod",
		);
	}
};

const buildAuthSuccess = (payload: JwtPayload): AuthSuccess => {
	return {
		credentials: {
			type: "standard",
			iss: payload.iss,
			aud: payload.aud,
		},
	};
};

const getSigningKey = async (iss: string, forceRefresh: boolean): Promise<string> => {
	const [did, serviceId] = iss.split("#");
	const identity = await resolveDiddoc(did, forceRefresh);
	if (identity == null) throw new AuthRequiredError("failed to resolve did");
	const key = getKey(identity);
	if (key == null) throw new AuthRequiredError("missing or bad key");
	return key;
};

//ES256Kむけの実装を分岐している。それ以外の方式はこの関数いらなそう
const verifySignatureWithKey: VerifySignatureWithKeyFn = async (
	didKey: string,
	msgBytes: Uint8Array,
	sigBytes: Uint8Array,
	alg: string,
) => {
	if (alg === SECP256K1_JWT_ALG) {
		const parsed = didKey.startsWith(DID_KEY_PREFIX) ? parseDidKey(didKey) : parseMultikey(didKey);
		if (alg !== parsed.jwtAlg) {
			throw new Error(`Expected key alg ${alg}, got ${parsed.jwtAlg}`);
		}
		return verifySig(parsed.keyBytes, msgBytes, sigBytes);
	}
	return verifySignature(didKey, msgBytes, sigBytes, {
		jwtAlg: alg,
		allowMalleableSig: true,
	});
};

// Cloudflare Workers 互換: @noble/curves で secp256k1 検証
const verifySig = (publicKey: Uint8Array, data: Uint8Array, sig: Uint8Array): boolean => {
	// ATProto の JWT は SHA-256 ハッシュ + raw (r||s) 64バイト署名
	// @noble/curves は IEEE P1363 形式 (raw r||s) をデフォルトで受け取る
	const msgHash = sha256(data);
	return secp256k1.verify(sig, msgHash, publicKey);
};

const BEARER = "Bearer ";
const isBearerToken = (c: Context): boolean => {
	return c.req.header().authorization?.startsWith(BEARER) ?? false;
};

const bearerTokenFromReq = (c: Context) => {
	const header = c.req.header().authorization || "";
	if (!header.startsWith(BEARER)) return null;
	return header.slice(BEARER.length).trim();
};

const parseJwtHeader = (raw: string): JwtHeader => {
	const parsed = parseJwtChunk(raw);
	if (typeof parsed.alg !== "string") {
		throw new AuthRequiredError("poorly formatted jwt", "BadJwt");
	}
	if (parsed.typ !== undefined && typeof parsed.typ !== "string") {
		throw new AuthRequiredError("poorly formatted jwt", "BadJwt");
	}
	if (parsed.kid !== undefined && typeof parsed.kid !== "string") {
		throw new AuthRequiredError("poorly formatted jwt", "BadJwt");
	}
	return { alg: parsed.alg, typ: parsed.typ, kid: parsed.kid };
};

const parseJwtPayload = (raw: string): JwtPayload => {
	const parsed = parseJwtChunk(raw);
	if (
		typeof parsed.iss !== "string" ||
		typeof parsed.aud !== "string" ||
		typeof parsed.exp !== "number" ||
		typeof parsed.iat !== "number" ||
		(parsed.lxm !== undefined && typeof parsed.lxm !== "string") ||
		(parsed.jti !== undefined && typeof parsed.jti !== "string")
	) {
		throw new AuthRequiredError("poorly formatted jwt", "BadJwt");
	}
	return {
		iss: parsed.iss,
		aud: parsed.aud,
		exp: parsed.exp,
		iat: parsed.iat,
		lxm: parsed.lxm,
		jti: parsed.jti,
	};
};

const parseJwtChunk = (raw: string): Record<string, unknown> => {
	try {
		const decoded = new TextDecoder().decode(base64UrlToBytes(raw));
		const parsed = JSON.parse(decoded);
		if (!parsed || typeof parsed !== "object") {
			throw new Error("invalid jwt chunk");
		}
		return parsed as Record<string, unknown>;
	} catch {
		throw new AuthRequiredError("poorly formatted jwt", "BadJwt");
	}
};

const base64UrlToBytes = (b64url: string): Uint8Array => {
	// base64url → base64 変換
	const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
	// パディング補完
	const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
	const bin = atob(padded);
	const bytes = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
	return bytes;
};

const parseUrlNsid = (url: string): string => {
	const nsid = extractUrlNsid(url);
	if (nsid) {
		return nsid;
	}
	throw new InvalidRequestError("invalid xrpc path");
};

const extractUrlNsid = (url: string): string | undefined => {
	if (
		url.length <= 6 ||
		url[5] !== "/" ||
		url[4] !== "c" ||
		url[3] !== "p" ||
		url[2] !== "r" ||
		url[1] !== "x" ||
		url[0] !== "/"
	) {
		return undefined;
	}

	const start = 6;
	let index = start;
	let alphaNumRequired = true;

	for (; index < url.length; index++) {
		const code = url.charCodeAt(index);
		if (
			(code >= 48 && code <= 57) || // 0-9
			(code >= 65 && code <= 90) || // A-Z
			(code >= 97 && code <= 122) // a-z
		) {
			alphaNumRequired = false;
			continue;
		}

		if (code === 45 || code === 46) {
			if (alphaNumRequired) {
				return undefined;
			}
			alphaNumRequired = true;
			continue;
		}

		if (code === 47) {
			if (index === url.length - 1 || url.charCodeAt(index + 1) === 63) {
				break;
			}
			return undefined;
		}

		if (code === 63) {
			break;
		}

		return undefined;
	}

	if (alphaNumRequired) {
		return undefined;
	}

	if (index - start < 2) {
		return undefined;
	}

	return url.slice(start, index);
};

const isDidStringOrService = (value: string): boolean => {
	const hashIndex = value.indexOf("#");
	if (hashIndex === -1) {
		return value.startsWith("did:");
	}
	if (value.includes("#", hashIndex + 1)) {
		return false;
	}
	const did = value.slice(0, hashIndex);
	const fragment = value.slice(hashIndex + 1);
	return did.startsWith("did:") && fragment.length > 0;
};

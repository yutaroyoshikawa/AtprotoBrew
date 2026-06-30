// @atproto/identity uses fetch with redirect: 'error', which Cloudflare Workers
// does not support. This polyfill emulates the same semantics by using
// redirect: 'manual' and throwing TypeError when a 3xx response is received.
const nativeFetch = globalThis.fetch;

globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
	if (init?.redirect !== "error") {
		return nativeFetch(input, init);
	}

	const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;

	const res = await nativeFetch(input, { ...init, redirect: "manual" });

	if (res.status >= 300 && res.status < 400) {
		throw new TypeError(`fetch: unexpected redirect for ${url}`);
	}

	return res;
};

import { createHmac, timingSafeEqual } from "node:crypto";
import { createMiddleware } from "hono/factory";

export function createAirglowVerifySignatureMiddleware() {
	return createMiddleware(async (c, next) => {
		const secrets = JSON.parse(c.env.AIRGLOW_SECRETS) as Record<string, string | undefined>;
		const secret = secrets[c.req.path];
		if (secret == null) {
			return c.status(404);
		}
		const body = await c.req.raw.clone().arrayBuffer();
		const bodyBuf = Buffer.from(body);
		const headerSigStr = c.req.header("x-airglow-signature")?.slice("sha256=".length);
		if (headerSigStr == null) {
			return c.text("Missing signature", 401);
		}
		const headerSig = Buffer.from(headerSigStr, "hex");
		const computedSig = createHmac("sha256", secret).update(bodyBuf).digest();
		if (computedSig.length !== headerSig.length || !timingSafeEqual(computedSig, headerSig)) {
			return c.text("Invalid signature", 401);
		}
		return await next();
	});
}

import { Hono } from "hono";
import type { BrewEnv } from "../../types";
import { createAirglowVerifySignatureMiddleware } from "./middleware/airglowVerifySignature";

export function createAirglowServer() {
	const app = new Hono<BrewEnv>();
	const verifySignature = createAirglowVerifySignatureMiddleware();
	app.use(verifySignature);
	return app;
}

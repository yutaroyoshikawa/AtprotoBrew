import "./polyfills";
import { Hono } from "hono";
import { createDbClient } from "./db/client";
import { createAirglowServer } from "./routes/airglow";
import { createXrpcServer } from "./routes/xrpc";
import type { BrewEnv } from "./types";

const app = new Hono<BrewEnv>();
app.use(async (c, next) => {
	c.set("db", createDbClient(c.env.DB));
	await next();
});
app.route("/xrpc", createXrpcServer());
app.route("/airglow", createAirglowServer());

export default app;

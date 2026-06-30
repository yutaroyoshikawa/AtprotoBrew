import type { Hono } from "hono";
import type { BrewEnv } from "../../types";

export type AirglowApp = Hono<BrewEnv>;

import type { AtprotoDid } from "@atproto/did";

// TypeScript fallback — bundler resolves .native.ts on native.
// no-op on web.
export function migrateLauncherLayout(_did: AtprotoDid): void {}

import { useEffect } from "react";
import type { ResolvedTheme } from "./types";

/**
 * web: resolved 値に基づいて <html> に .dark class をトグル。
 * これが Tailwind v4 の dark variant を駆動する。
 */
export function useApplyPlatformTheme(resolved: ResolvedTheme) {
	useEffect(() => {
		document.documentElement.classList.toggle("dark", resolved === "dark");
	}, [resolved]);
}

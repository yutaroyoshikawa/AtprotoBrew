import { languageAtom } from "@atprotobrew/common/core/stores/languageStore";
import { committedAtom } from "@atprotobrew/common/launcher/launcherStore";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { useAuthContext } from "../auth/AuthProvider";
import { buildSnapshot, buildUnauthenticatedSnapshot } from "./buildSnapshot";
import { cacheIcons } from "./widgetIconCache";
import { widgetSync } from "./widgetSync";

export function useWidgetSync(): void {
	const committed = useAtomValue(committedAtom);
	const locale = useAtomValue(languageAtom);
	const { authState } = useAuthContext();

	useEffect(() => {
		if (authState.status === "authenticated") {
			syncToWidget().catch((e) => console.warn("[widget] sync failed", e));
		}

		if (authState.status === "unauthenticated") {
			const snapshot = buildUnauthenticatedSnapshot(locale);

			widgetSync.push(snapshot).catch((e) => console.warn("[widget] unauthenticated sync failed", e));
		}

		async function syncToWidget() {
			const iconPaths = await cacheIcons(committed);
			const snapshot = buildSnapshot(committed, iconPaths, locale);

			await widgetSync.push(snapshot);
		}
	}, [committed, locale, authState.status]);
}

import { themes } from "@atprotobrew/tokens/themes";
import LauncherWidget from "../../widgets/ios/LauncherWidget";
import type { WidgetSync } from "./widgetSync";

const widgetSyncImpl: WidgetSync = {
	push: async (snapshot) => {
		const color = {
			light: {
				bg: themes.light.bg,
				cardBg: themes.light.bgContrast50,
				textContrastLow: themes.light.textContrastLow,
			},
			dark: {
				bg: themes.dark.bg,
				cardBg: themes.dark.bgContrast50,
				textContrastLow: themes.dark.textContrastLow,
			},
		};

		if (snapshot.state !== "ready") {
			LauncherWidget.updateSnapshot({
				state: snapshot.state,
				locale: snapshot.locale,
				color,
			});
			return;
		}

		LauncherWidget.updateSnapshot({
			state: "ready",
			locale: snapshot.locale,
			rowsBySize: snapshot.rowsBySize,
			color,
		});
	},
};

export const widgetSync = widgetSyncImpl;

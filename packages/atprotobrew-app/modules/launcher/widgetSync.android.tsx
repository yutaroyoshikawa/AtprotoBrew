"use no memo";

import { type SizeBucket, WIDGET_GRID } from "@atprotobrew/common/launcher/widgetGrid";
import { requestWidgetUpdate, type WidgetInfo } from "react-native-android-widget";
import { LauncherWidgetView } from "../../widgets/android/LauncherWidgetView";
import { WidgetStateView } from "../../widgets/android/WidgetStateView";
import { AndroidWidgetStore } from "./androidWidgetStore";
import type { WidgetSync } from "./widgetSync";

function resolveBucket(info: WidgetInfo): SizeBucket {
	if (info.width >= 250 && info.height >= 250) {
		return "large";
	}

	if (info.width >= 250) {
		return "medium";
	}

	return "small";
}

const widgetSyncImpl: WidgetSync = {
	push: async (snapshot) => {
		AndroidWidgetStore.writeSnapshot(snapshot);

		await requestWidgetUpdate({
			widgetName: "LauncherWidgetView",
			renderWidget: (widgetInfo) => {
				const bucket = resolveBucket(widgetInfo);

				if (snapshot.state !== "ready") {
					return {
						light: (
							<WidgetStateView
								state={snapshot.state}
								bucket={bucket}
								locale={snapshot.locale}
								theme="light"
							/>
						),
						dark: (
							<WidgetStateView
								state={snapshot.state}
								bucket={bucket}
								locale={snapshot.locale}
								theme="dark"
							/>
						),
					};
				}

				return {
					light: (
						<LauncherWidgetView
							rows={snapshot.rowsBySize[bucket]}
							columns={WIDGET_GRID[bucket].columns}
							theme="light"
						/>
					),
					dark: (
						<LauncherWidgetView
							rows={snapshot.rowsBySize[bucket]}
							columns={WIDGET_GRID[bucket].columns}
							theme="dark"
						/>
					),
				};
			},
		});
	},
};

export const widgetSync = widgetSyncImpl;

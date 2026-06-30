import { type SizeBucket, WIDGET_GRID } from "@atprotobrew/common/launcher/widgetGrid";
import type { WidgetTaskHandlerProps } from "react-native-android-widget";
import { AndroidWidgetStore } from "../../modules/launcher/androidWidgetStore";
import { LauncherWidgetView } from "./LauncherWidgetView";
import { WidgetStateView } from "./WidgetStateView";

function resolveBucket(info: WidgetTaskHandlerProps["widgetInfo"]): SizeBucket {
	if (info.width >= 250 && info.height >= 250) {
		return "large";
	}

	if (info.width >= 250) {
		return "medium";
	}

	return "small";
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps): Promise<void> {
	switch (props.widgetAction) {
		case "WIDGET_ADDED":
		case "WIDGET_RESIZED":
		case "WIDGET_UPDATE": {
			const snapshot = await AndroidWidgetStore.loadSnapshot();
			const bucket = resolveBucket(props.widgetInfo);

			// null（初回インストール・ファイル破損）→ loading 表示
			if (!snapshot) {
				props.renderWidget({
					light: <WidgetStateView state="loading" bucket={bucket} locale="ja" theme="light" />,
					dark: <WidgetStateView state="loading" bucket={bucket} locale="ja" theme="dark" />,
				});

				break;
			}

			if (snapshot.state !== "ready") {
				props.renderWidget({
					light: (
						<WidgetStateView
							state={snapshot.state}
							bucket={bucket}
							locale={snapshot.locale}
							theme="light"
						/>
					),
					dark: (
						<WidgetStateView state={snapshot.state} bucket={bucket} locale={snapshot.locale} theme="dark" />
					),
				});

				break;
			}

			props.renderWidget({
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
			});

			break;
		}
		case "WIDGET_DELETED":
			break;
		// OPEN_URI はライブラリが処理するため自前ハンドリング不要
		default:
			break;
	}
}

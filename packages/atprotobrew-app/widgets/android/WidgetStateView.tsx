"use no memo";

import type { AppLanguage } from "@atprotobrew/common/core/types/i18n";
import { LAUNCHER_DEEP_LINK, WIDGET_SIGNIN_DEEP_LINK } from "@atprotobrew/common/launcher/widgetConstants";
import type { SizeBucket } from "@atprotobrew/common/launcher/widgetGrid";
import {
	WIDGET_STATE_LOGO_H,
	WIDGET_STATE_LOGO_W,
	WIDGET_STATE_TEXT_HIDDEN_BUCKETS,
	WIDGET_STATE_TEXT_SIZE,
} from "@atprotobrew/common/launcher/widgetLayout";
import { getWidgetStateMessage } from "@atprotobrew/common/launcher/widgetStateMessages";
import type { NonReadyWidgetState } from "@atprotobrew/common/launcher/widgetTypes";
import { themes } from "@atprotobrew/tokens/themes";
import { FlexWidget, SvgWidget, TextWidget } from "react-native-android-widget";

interface WidgetStateViewProps {
	state: NonReadyWidgetState;
	bucket: SizeBucket;
	locale: AppLanguage;
	theme: "light" | "dark";
}

export function WidgetStateView({ state, bucket, locale, theme }: WidgetStateViewProps) {
	const t = themes[theme];
	const message = getWidgetStateMessage(state, locale);
	const hideText = WIDGET_STATE_TEXT_HIDDEN_BUCKETS.includes(bucket);
	const deepLink = state === "unauthenticated" ? WIDGET_SIGNIN_DEEP_LINK : LAUNCHER_DEEP_LINK;

	const mascot =
		theme === "dark"
			? require("../../assets/images/mascot-dark.svg")
			: require("../../assets/images/mascot-light.svg");

	return (
		<FlexWidget
			clickAction="OPEN_URI"
			clickActionData={{ uri: deepLink }}
			style={{
				width: "match_parent",
				height: "match_parent",
				backgroundColor: t.bg,
				alignItems: "center",
				justifyContent: "center",
				flexDirection: "column",
			}}
		>
			<SvgWidget svg={mascot} style={{ width: WIDGET_STATE_LOGO_W, height: WIDGET_STATE_LOGO_H }} />
			{!hideText && (
				<TextWidget
					text={message}
					style={{
						fontSize: WIDGET_STATE_TEXT_SIZE,
						color: t.textContrastLow,
						fontWeight: "400",
					}}
				/>
			)}
		</FlexWidget>
	);
}

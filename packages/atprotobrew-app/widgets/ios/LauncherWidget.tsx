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
import type { NonReadyWidgetState, RenderableCell } from "@atprotobrew/common/launcher/widgetTypes";
import { HStack, Image, Link, Spacer, Text, VStack } from "@expo/ui/swift-ui";
import {
	background,
	clipShape,
	containerBackground,
	font,
	foregroundStyle,
	frame,
	padding,
	resizable,
	shadow,
	shapes,
	widgetURL,
} from "@expo/ui/swift-ui/modifiers";
import { createWidget, type WidgetEnvironment, type WidgetFamily } from "expo-widgets";

type WidgetColor = {
	light: { bg: string; cardBg: string; textContrastLow: string };
	dark: { bg: string; cardBg: string; textContrastLow: string };
};

type LauncherWidgetComponentProps =
	| {
			state: "ready";
			locale: AppLanguage;
			rowsBySize: Record<SizeBucket, RenderableCell[][]>;
			color: WidgetColor;
	  }
	| {
			state: NonReadyWidgetState;
			locale: AppLanguage;
			color: WidgetColor;
	  };

const bucketSize = {
	systemSmall: "small",
	systemMedium: "medium",
	systemLarge: "large",
	systemExtraLarge: "large",
	accessoryCircular: "large",
	accessoryInline: "large",
	accessoryRectangular: "large",
} as const satisfies Record<WidgetFamily, SizeBucket>;

const LauncherWidgetComponent = (props: LauncherWidgetComponentProps, env: WidgetEnvironment) => {
	"widget";

	const theme = env.colorScheme ?? "light";

	const ICON = 52;
	const ICON_RADIUS = 10;
	const CARD_RADIUS = 16;
	const SHADOW_COLOR = "#4064A0F0";

	const bucket = bucketSize[env.widgetFamily];

	const base = [padding({ all: 8 }), containerBackground(props.color[theme].bg, "widget")];

	// 非 ready 状態: ロゴ＋メッセージを表示
	if (props.state !== "ready") {
		// iOS は SVG 非対応のため icon.png を代替使用（PNG 版マスコット追加後に差し替え予定）
		const hideText = WIDGET_STATE_TEXT_HIDDEN_BUCKETS.includes(bucket);
		const message = getWidgetStateMessage(props.state, props.locale);
		const deepLink = props.state === "unauthenticated" ? WIDGET_SIGNIN_DEEP_LINK : LAUNCHER_DEEP_LINK;

		return (
			<VStack modifiers={[...base, widgetURL(deepLink)]}>
				<VStack
					modifiers={[
						frame({
							maxWidth: Number.POSITIVE_INFINITY,
							maxHeight: Number.POSITIVE_INFINITY,
						}),
					]}
				>
					<Image
						uiImage={require("../../assets/images/icon.png")}
						modifiers={[
							resizable(),
							frame({
								width: WIDGET_STATE_LOGO_W,
								height: WIDGET_STATE_LOGO_H,
							}),
							clipShape("roundedRectangle", 8),
						]}
					/>
					{!hideText && (
						<Text
							modifiers={[
								font({ size: WIDGET_STATE_TEXT_SIZE }),
								foregroundStyle(props.color[theme].textContrastLow),
							]}
						>
							{message}
						</Text>
					)}
				</VStack>
			</VStack>
		);
	}

	const rows = props.rowsBySize[bucket] ?? [];

	const grid = (
		<VStack>
			{rows.map((row, i) => (
				<HStack key={i}>
					{row.map((cell, j) => {
						const cellContent = (
							<VStack
								modifiers={[
									padding({ all: 10 }),
									background(
										props.color[theme].cardBg,
										shapes.roundedRectangle({ cornerRadius: CARD_RADIUS }),
									),
									clipShape("roundedRectangle", CARD_RADIUS),
									shadow({ color: SHADOW_COLOR, radius: 4, x: 0, y: 2 }),
								]}
							>
								{cell.hasIcon ? (
									<Image
										uiImage={cell.iconPath}
										modifiers={[
											resizable(),
											frame({ width: ICON, height: ICON }),
											clipShape("roundedRectangle", ICON_RADIUS),
										]}
									/>
								) : (
									<Image systemName="square.dashed" size={ICON} />
								)}
							</VStack>
						);

						const element =
							bucket === "small" ? (
								cellContent
							) : (
								<Link key={j} destination={cell.url}>
									{cellContent}
								</Link>
							);

						return (
							<>
								{j > 0 && <Spacer />}
								{element}
							</>
						);
					})}
				</HStack>
			))}
		</VStack>
	);

	if (bucket === "small") {
		return <VStack modifiers={[...base, widgetURL(LAUNCHER_DEEP_LINK)]}>{grid}</VStack>;
	}

	return <VStack modifiers={base}>{grid}</VStack>;
};

export default createWidget("LauncherWidget", LauncherWidgetComponent);

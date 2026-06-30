"use no memo";

import type { RenderableCell } from "@atprotobrew/common/launcher/widgetTypes";
import { themes } from "@atprotobrew/tokens/themes";
import { FlexWidget, ImageWidget, OverlapWidget, SvgWidget } from "react-native-android-widget";

const ICON = 52;
const ICON_RADIUS = 10;
const CARD_RADIUS = 16;
const LOGO_W = 32;
const LOGO_H = 36;

interface Props {
	rows: RenderableCell[][];
	columns: number;
	theme: "light" | "dark";
}

export function LauncherWidgetView({ rows, columns, theme }: Props) {
	const t = themes[theme];

	const mascot =
		theme === "dark"
			? require("../../assets/images/mascot-dark.svg")
			: require("../../assets/images/mascot-light.svg");

	// columns 分のスロット index 配列。各行で必ずこの長さ分レンダリングする
	const slots = Array.from({ length: columns }, (_, j) => j);

	return (
		<OverlapWidget
			style={{
				width: "match_parent",
				height: "match_parent",
				backgroundColor: t.bgContrast50,
			}}
		>
			<FlexWidget
				style={{
					flexDirection: "column",
					width: "match_parent",
					height: "match_parent",
					paddingHorizontal: 10,
					justifyContent: "center",
				}}
			>
				{rows.map((row, i) => (
					<FlexWidget
						key={i}
						style={{
							flexDirection: "row",
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						{slots.map((j) => {
							const cell = row[j];

							// 空スロット: 場所だけ確保
							if (!cell) {
								return (
									<FlexWidget
										key={j}
										style={{
											flex: 1,
											backgroundColor: t.bgContrast25,
											borderRadius: CARD_RADIUS,
										}}
									/>
								);
							}

							return (
								<FlexWidget
									key={j}
									clickAction="OPEN_URI"
									clickActionData={{ uri: cell.url }}
									style={{
										flex: 1, // ← columns で均等分割
										alignItems: "center",
										justifyContent: "center",
										padding: 6,
									}}
								>
									<FlexWidget
										style={{
											backgroundColor: t.bgContrast25,
											borderRadius: CARD_RADIUS,
											padding: 10,
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<ImageWidget
											image={cell.hasIcon ? `${cell.iconPath}` : require("./placeholder.png")}
											imageWidth={ICON}
											imageHeight={ICON}
											radius={ICON_RADIUS}
										/>
									</FlexWidget>
								</FlexWidget>
							);
						})}
					</FlexWidget>
				))}
			</FlexWidget>

			<FlexWidget
				style={{
					width: "match_parent",
					height: "match_parent",
					justifyContent: "flex-end",
					alignItems: "flex-end",
					padding: 8,
				}}
			>
				<SvgWidget svg={mascot} style={{ width: LOGO_W, height: LOGO_H }} />
			</FlexWidget>
		</OverlapWidget>
	);
}

import type { AppLanguage } from "@atprotobrew/common/core/types/i18n";
import type { LauncherItem } from "@atprotobrew/common/launcher/types";
import { INTERNAL_STORE_DEEP_LINK, LAUNCHER_DEEP_LINK } from "@atprotobrew/common/launcher/widgetConstants";
import { chunk, isMissingIcon, selectItems, WIDGET_GRID } from "@atprotobrew/common/launcher/widgetGrid";
import type { RenderableCell, WidgetItem, WidgetLauncherSnapshot } from "@atprotobrew/common/launcher/widgetTypes";

// 副作用ゼロの純関数。IO（cacheIcons）と分離してあるため単体テスト可能
export function buildSnapshot(
	items: LauncherItem[],
	iconPaths: Map<string, string>,
	locale: AppLanguage,
): WidgetLauncherSnapshot {
	const now = new Date().toISOString();

	if (items.length === 0) {
		return { version: 1, state: "empty", updatedAt: now, locale };
	}

	const widgetItems: WidgetItem[] = items
		.map((it) => ({
			id: it.id,
			label: it.label,
			iconPath: iconPaths.get(it.id) ?? "",
			address: it.address,
			launchUrl:
				it.launch.$type === "org.tarororo.brew.defs#launchWeb"
					? it.launch.link
					: it.launch.$type === "org.tarororo.brew.defs#launchStore"
						? INTERNAL_STORE_DEEP_LINK
						: null,
		}))
		.sort((a, b) => a.address - b.address);

	const buildRows = (bucket: keyof typeof WIDGET_GRID): RenderableCell[][] => {
		const { columns } = WIDGET_GRID[bucket];
		const cells: RenderableCell[] = selectItems(widgetItems, bucket).map((it) => ({
			label: it.label,
			url: it.launchUrl ?? LAUNCHER_DEEP_LINK,
			iconPath: it.iconPath,
			hasIcon: !isMissingIcon(it),
		}));
		return chunk(cells, columns);
	};

	const rowsBySize = {
		small: buildRows("small"),
		medium: buildRows("medium"),
		large: buildRows("large"),
	};

	return { version: 1, state: "ready", updatedAt: now, locale, rowsBySize };
}

export function buildUnauthenticatedSnapshot(locale: AppLanguage): WidgetLauncherSnapshot {
	return {
		version: 1,
		state: "unauthenticated",
		updatedAt: new Date().toISOString(),
		locale,
	};
}

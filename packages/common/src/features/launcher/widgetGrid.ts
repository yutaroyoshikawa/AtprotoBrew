import type { WidgetItem } from "./widgetTypes";

export type SizeBucket = "small" | "medium" | "large";

// グリッド寸法の唯一のソース。iOS・Android 両方がここを参照する
export const WIDGET_GRID: Record<SizeBucket, { columns: number; rows: number }> = {
	small: { columns: 2, rows: 2 }, // 4 items
	medium: { columns: 4, rows: 2 }, // 8 items
	large: { columns: 4, rows: 4 }, // 16 items
};

export const capacityOf = (bucket: SizeBucket): number => {
	const { columns, rows } = WIDGET_GRID[bucket];
	return columns * rows;
};

// snapshot は address 昇順ソート済み前提
export const selectItems = (items: WidgetItem[], bucket: SizeBucket): WidgetItem[] =>
	items.slice(0, capacityOf(bucket));

export const isMissingIcon = (item: WidgetItem): boolean => !item.iconPath;

export function chunk<T>(arr: T[], size: number): T[][] {
	const out: T[][] = [];
	for (let i = 0; i < arr.length; i += size) {
		out.push(arr.slice(i, i + size));
	}
	return out;
}

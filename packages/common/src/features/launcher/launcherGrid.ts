const TARGET_ICON_SIZE = 80;
const ICON_GAP = 24;
export const CELL_SIZE = TARGET_ICON_SIZE + ICON_GAP;

const MIN_COLS = 3;
const MAX_COLS = 6;
const MIN_ROWS = 3;
const MAX_ROWS = 5;
const TOPBAR_H = 48;
const INDICATOR_H = 24;

export const MIN_PAGES = 3;

export interface GridConfig {
	cols: number;
	rows: number;
	perPage: number;
	cellSize: number;
}

const clamp = (v: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, v));

export function deriveGridConfig(
	screenWidth: number,
	screenHeight: number,
	insets: { top: number; bottom: number },
): GridConfig {
	const usableHeight = screenHeight - insets.top - insets.bottom - TOPBAR_H - INDICATOR_H;
	const cols = clamp(Math.floor(screenWidth / CELL_SIZE), MIN_COLS, MAX_COLS);
	const rows = clamp(Math.floor(usableHeight / CELL_SIZE), MIN_ROWS, MAX_ROWS);

	return { cols, rows, perPage: cols * rows, cellSize: CELL_SIZE };
}

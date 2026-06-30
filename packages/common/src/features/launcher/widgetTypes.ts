import type { AppLanguage } from "../../core/types/i18n";
import type { SizeBucket } from "./widgetGrid";

// 永続化スナップショットが取りうる状態
type SnapshotState = "ready" | "unauthenticated" | "empty";

// ウィジェット描画層が扱う全状態（loading は Android のみ使うトランジェント状態）
export type WidgetState = SnapshotState | "loading";
export type NonReadyWidgetState = Exclude<WidgetState, "ready">;

export type WidgetLauncherSnapshot =
	| {
			version: 1;
			state: "ready";
			updatedAt: string;
			locale: AppLanguage;
			rowsBySize: Record<SizeBucket, RenderableCell[][]>;
	  }
	| {
			version: 1;
			state: "unauthenticated" | "empty";
			updatedAt: string;
			locale: AppLanguage;
	  };

// Widget に渡る最終形（タップ先 URL・アイコン有無はアプリ側で確定済み）
export interface RenderableCell {
	label: string;
	url: string; // launchUrl ?? LAUNCHER_DEEP_LINK
	iconPath: string; // file:// パス（空ならアイコンなし）
	hasIcon: boolean;
}

// buildSnapshot 内部だけで使う中間型（snapshot には載らない）
export interface WidgetItem {
	id: string;
	label: string;
	// 共有コンテナ内の絶対ファイルパス。空文字なら欠損（プレースホルダーを表示）
	iconPath: string;
	address: number;
	// launchWeb → URL、launchStore → null
	launchUrl: string | null;
}

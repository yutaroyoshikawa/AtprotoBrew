import type { SizeBucket } from "./widgetGrid";

// 状態表示ビューのロゴ寸法（Android・iOS 共通）
export const WIDGET_STATE_LOGO_W = 32;
export const WIDGET_STATE_LOGO_H = 36;

// 状態メッセージのフォントサイズ（sp/pt）
export const WIDGET_STATE_TEXT_SIZE = 12;

// ロゴのみを表示し、メッセージテキストを省略するサイズバケット
export const WIDGET_STATE_TEXT_HIDDEN_BUCKETS: SizeBucket[] = ["small"];

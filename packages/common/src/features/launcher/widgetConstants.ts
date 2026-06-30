// launchUrl が null のアイテム・iOS small の全体タップのフォールバック先
export const LAUNCHER_DEEP_LINK = "atprotobrew://home";
export const INTERNAL_STORE_DEEP_LINK = "atprotobrew://store";

// 未ログイン状態ウィジェットのタップ先
export const WIDGET_SIGNIN_DEEP_LINK = "atprotobrew://login";

// アイコンの表示寸法（論理 pt）。widgetIconCache でのリサイズ目標はここを参照する
export const WIDGET_ICON_SIZE = 22;

// 正規化後のピクセルサイズ（@3x 相当での参考値。実際は PixelRatio.get() で動的計算）
export const WIDGET_ICON_PX = WIDGET_ICON_SIZE * 3;

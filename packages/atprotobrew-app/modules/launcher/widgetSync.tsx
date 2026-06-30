import type { WidgetLauncherSnapshot } from "@atprotobrew/common/launcher/widgetTypes";

export interface WidgetSync {
	push(snapshot: WidgetLauncherSnapshot): Promise<void>;
}

// Metro が .ios.tsx / .android.tsx に解決する。TypeScript 型チェック用の宣言のみ
export declare const widgetSync: WidgetSync;

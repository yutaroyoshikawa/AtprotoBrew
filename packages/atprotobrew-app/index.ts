import "expo-dev-client";
import { registerWidgetTaskHandler } from "react-native-android-widget";
import { widgetTaskHandler } from "./widgets/android/widgetTaskHandler";

// Android: Widget タスクハンドラをアプリ起動前に登録する
// iOS ではこの呼び出しは no-op になる
registerWidgetTaskHandler(widgetTaskHandler);

// expo-router のエントリをそのまま利用
import "expo-router/entry";

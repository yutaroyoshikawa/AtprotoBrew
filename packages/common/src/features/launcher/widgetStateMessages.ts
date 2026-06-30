import type { AppLanguage } from "../../core/types/i18n";
import type { NonReadyWidgetState } from "./widgetTypes";

const messages: Record<AppLanguage, Record<NonReadyWidgetState, string>> = {
	ja: {
		unauthenticated: "ログインして始めよう",
		empty: "アプリでサービスを追加しよう",
		loading: "読み込み中…",
	},
	en: {
		unauthenticated: "Sign in to get started",
		empty: "Add services in the app",
		loading: "Loading…",
	},
};

export function getWidgetStateMessage(state: NonReadyWidgetState, locale: AppLanguage): string {
	return messages[locale]?.[state] ?? messages.en[state];
}

import { i18n, type Messages } from "@lingui/core";
import { useLingui } from "@lingui/react";
import { useSetAtom } from "jotai";
import { useEffect, useMemo } from "react";
import * as z from "zod";
import { messages as jaDefaultMessages } from "../../../locales/ja/messages";
import { AppLanguageSchema } from "../shcemas/i18n";
import { languageAtom } from "../stores/languageStore";
import type { AppLanguage, CatalogLoader } from "../types/i18n";

// I18nProvider が最初のレンダリングで null を返さないよう、モジュールロード時に同期的に有効化する
i18n.load("ja", jaDefaultMessages);
i18n.activate("ja");

// common パッケージ自身の locale ファイルを動的インポート
export const commonCatalogLoader: CatalogLoader = async (lang) => {
	switch (lang) {
		case "ja":
			return (await import("../../../locales/ja/messages")).messages;
		case "en":
			return (await import("../../../locales/en/messages")).messages;
	}
};

// common → app の順でマージ (後勝ち)
export async function dynamicActivate(lang: AppLanguage, loaders: CatalogLoader[]): Promise<void> {
	const catalogs = await Promise.all(loaders.map((l) => l(lang)));
	const merged: Messages = {};

	for (const catalog of catalogs) {
		Object.assign(merged, catalog);
	}

	i18n.load(lang, merged);
	i18n.activate(lang);
}

function isAppLanguage(locale: string): locale is AppLanguage {
	return z.safeParse(AppLanguageSchema, locale).success;
}

export function useLocale() {
	const { i18n } = useLingui();
	const setLanguage = useSetAtom(languageAtom);

	const locale = useMemo(() => {
		if (isAppLanguage(i18n.locale)) {
			return i18n.locale;
		}

		return "ja";
	}, [i18n]);

	useEffect(() => {
		setLanguage(locale);
	}, [locale, setLanguage]);

	return locale;
}

export function useLanguage() {
	const locale = useLocale();
	const setLanguage = useSetAtom(languageAtom);

	return [locale, setLanguage] as const;
}

export { i18n };

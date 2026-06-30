import { I18nProvider } from "@lingui/react";
import { useAtomValue } from "jotai";
import { type ReactNode, useEffect, useMemo } from "react";
import { DateLocaleContext, resolveDateLocale } from "../modules/dateLocale";
import { commonCatalogLoader, dynamicActivate, i18n } from "../modules/i18n";
import { languageAtom } from "../stores/languageStore";
import type { CatalogLoader } from "../types/i18n";
import { AppText } from "./AppText";

interface AppI18nProviderProps {
	children: ReactNode;
	// app 固有の messages を渡す。common messages に後勝ちでマージされる。
	// モジュールスコープで定義して参照を安定させること。
	extraLoaders?: CatalogLoader[];
}

export function AppI18nProvider({ children, extraLoaders = [] }: AppI18nProviderProps) {
	const lang = useAtomValue(languageAtom);

	// extraLoaders はモジュールスコープで定義された安定参照を前提とする
	const loaders = useMemo(() => [commonCatalogLoader, ...extraLoaders], [extraLoaders]);

	useEffect(() => {
		dynamicActivate(lang, loaders);
	}, [lang, loaders]);

	return (
		<DateLocaleContext.Provider value={resolveDateLocale(lang)}>
			<I18nProvider i18n={i18n} defaultComponent={AppText}>
				{children}
			</I18nProvider>
		</DateLocaleContext.Provider>
	);
}

import type { Locale } from "date-fns";
import { enUS, ja } from "date-fns/locale";
import { createContext, useContext } from "react";
import type { AppLanguage } from "../types/i18n";

const DATE_LOCALES = { ja, en: enUS } as const satisfies Record<AppLanguage, Locale>;

export const resolveDateLocale = (lang: AppLanguage): Locale => DATE_LOCALES[lang];

export const DateLocaleContext = createContext<Locale | undefined>(undefined);

export function useDateLocale(): Locale {
	const ctx = useContext(DateLocaleContext);

	if (!ctx) {
		throw new Error("useDateLocale must be used within AppI18nProvider");
	}

	return ctx;
}

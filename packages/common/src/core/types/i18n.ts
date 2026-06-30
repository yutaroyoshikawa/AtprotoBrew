import type { Messages } from "@lingui/core";
import type * as z from "zod";
import type { AppLanguageSchema } from "../shcemas/i18n";

export type AppLanguage = z.infer<typeof AppLanguageSchema>;
export type CatalogLoader = (lang: AppLanguage) => Promise<Messages>;

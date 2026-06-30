import AsyncStorage from "@react-native-async-storage/async-storage";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import type { AppLanguage } from "../types/i18n";

const storage = createJSONStorage<AppLanguage>(() => AsyncStorage);

export const languageAtom = atomWithStorage<AppLanguage>("app-language", "ja", storage, { getOnInit: false });

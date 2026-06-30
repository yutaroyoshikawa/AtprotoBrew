import type { AtprotoDid } from "@atproto/did";
import type { StoreItemView } from "@atprotobrew/atproto/lexicons/org/tarororo/brew/defs.defs";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { SyncStorage } from "jotai/vanilla/utils/atomWithStorage";
import { atomFamily } from "jotai-family";
import { MMKV } from "react-native-mmkv";
import { activeDidAtom } from "../account/accountStoreAtoms";
import { buildCommitted, moveItem, reflowIfNeeded, toPersisted } from "./launcherLayout";
import { type LauncherItem, type PersistedLayoutV1, persistedLayoutV1Schema } from "./types";

const launcherMmkv = new MMKV({ id: "launcher" });

const persistedStorage: SyncStorage<PersistedLayoutV1 | null> = {
	getItem: (key, initialValue) => {
		const v = launcherMmkv.getString(key);

		if (!v) {
			return initialValue;
		}

		const result = persistedLayoutV1Schema.safeParse(JSON.parse(v));

		return result.success ? result.data : initialValue;
	},
	setItem: (key, value) => {
		launcherMmkv.set(key, JSON.stringify(value));
	},
	removeItem: (key) => {
		launcherMmkv.delete(key);
	},
};

/** DID ごとのレイアウト永続 atom。 */
export const persistedLayoutAtomFamily = atomFamily((did: string) =>
	atomWithStorage<PersistedLayoutV1 | null>(`launcher.layout.${did}`, null, persistedStorage, {
		getOnInit: true,
	}),
);

/**
 * 保存される唯一の出力。activeDidAtom 経由で family にブリッジ。
 * 外部からは単一の atom として扱える。
 */
export const persistedLayoutAtom = atom(
	(get) => {
		const did = get(activeDidAtom);

		if (!did) {
			return null;
		}

		return get(persistedLayoutAtomFamily(did));
	},
	(get, set, update: PersistedLayoutV1 | null) => {
		const did = get(activeDidAtom);

		if (!did) {
			return;
		}

		set(persistedLayoutAtomFamily(did), update);
	},
);

/** getLauncher の結果（LauncherScreen が set する）。 */
export const storeViewsAtom = atom<StoreItemView[]>([]);

/** 現在の gridConfig.perPage（リフロー判定用）。 */
export const perPageAtom = atom<number>(0);

/** committed = views + persistedLayout から派生（読み取り専用）。 */
export const committedAtom = atom<LauncherItem[]>((get) => {
	const views = get(storeViewsAtom);
	const persisted = reflowIfNeeded(get(persistedLayoutAtom), get(perPageAtom));

	return buildCommitted(views, persisted);
});

/** EDIT 中のみ非 null（null = VIEW モード）。 */
export const draftAtom = atom<LauncherItem[] | null>(null);

/** モードは draft の null 判定から派生。 */
export const modeAtom = atom<"VIEW" | "EDIT">((get) => (get(draftAtom) === null ? "VIEW" : "EDIT"));

// ---- actions ----

export const enterEditAtom = atom(null, (get, set) => {
	set(draftAtom, [...get(committedAtom)]);
});

export const cancelEditAtom = atom(null, (_get, set) => {
	set(draftAtom, null);
});

export const saveEditAtom = atom(null, (get, set) => {
	const draft = get(draftAtom);

	if (!draft) {
		return;
	}

	const perPage = get(perPageAtom);

	set(persistedLayoutAtom, toPersisted(draft, perPage));
	set(draftAtom, null);
});

export const moveItemAtom = atom(null, (get, set, { id, targetAddress }: { id: string; targetAddress: number }) => {
	const draft = get(draftAtom);

	if (!draft) {
		return;
	}

	set(draftAtom, moveItem(draft, id, targetAddress));
});

// ---- account lifecycle utilities ----

/** アカウント削除時に MMKV キーと atomFamily キャッシュを消去する。 */
export function removeLauncherLayout(did: AtprotoDid): void {
	persistedLayoutAtomFamily.remove(did);
	launcherMmkv.delete(`launcher.layout.${did}`);
}

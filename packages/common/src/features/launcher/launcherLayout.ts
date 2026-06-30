import { pageOf } from "./launcherAddress";
import { MIN_PAGES } from "./launcherGrid";
import type { LauncherItem, PersistedLayoutV1, StoreItem } from "./types";

export function derivePageCount(items: LauncherItem[], perPage: number): number {
	if (perPage <= 0) {
		return MIN_PAGES;
	}

	const maxPage = items.reduce((m, it) => Math.max(m, pageOf(it.address, perPage)), -1);

	return Math.max(MIN_PAGES, maxPage + 2);
}

/** views(getLauncher) と persisted(MMKV) から committed を構築。O(n)。 */
export function buildCommitted(views: StoreItem[], persisted: PersistedLayoutV1 | null): LauncherItem[] {
	const addressById = new Map<string, number>(persisted?.items.map((i) => [i.id, i.address]) ?? []);

	const occupied = new Set<number>(addressById.values());

	let cursor = 0;

	const nextFree = (): number => {
		while (occupied.has(cursor)) {
			cursor++;
		}
		occupied.add(cursor);
		return cursor++;
	};

	return views
		.map((v) => {
			const address = addressById.get(v.uri) ?? nextFree();

			const launch =
				v.launch.$type === "org.tarororo.brew.defs#launchStore"
					? {
							$type: "org.tarororo.brew.defs#launchStore" as const,
						}
					: "link" in v.launch
						? {
								$type: "org.tarororo.brew.defs#launchWeb" as const,
								link: v.launch.link,
							}
						: null;

			if (!launch) {
				return null;
			}

			return {
				id: v.uri,
				label: v.title,
				iconUri: v.thumbnail,
				address,
				launch,
			};
		})
		.filter((view) => !!view);
}

/** draft を保存形へ変換（label/iconUri/launch は捨てる）。 */
export function toPersisted(items: LauncherItem[], perPage: number): PersistedLayoutV1 {
	return {
		version: 1,
		perPage,
		items: items.map((i) => ({ id: i.id, address: i.address })),
	};
}

/** perPage が変わったら旧 address 昇順で詰め直す。 */
export function reflowIfNeeded(persisted: PersistedLayoutV1 | null, currentPerPage: number): PersistedLayoutV1 | null {
	if (!persisted || currentPerPage <= 0 || persisted.perPage === currentPerPage) {
		return persisted;
	}

	const sorted = [...persisted.items].sort((a, b) => a.address - b.address);

	return {
		version: 1,
		perPage: currentPerPage,
		items: sorted.map((it, idx) => ({ id: it.id, address: idx })),
	};
}

/** スワップ並び替え。no-op の場合は同一参照を返す。 */
export function moveItem(items: LauncherItem[], movingId: string, target: number): LauncherItem[] {
	const moving = items.find((i) => i.id === movingId);

	if (!moving || moving.address === target) {
		return items;
	}

	const occupant = items.find((i) => i.address === target && i.id !== movingId);

	return items.map((i) => {
		if (i.id === movingId) {
			return { ...i, address: target };
		}

		if (occupant && i.id === occupant.id) {
			return { ...i, address: moving.address };
		}

		return i;
	});
}

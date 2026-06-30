import type { LauncherItem } from "@atprotobrew/common/launcher/types";
import * as Crypto from "expo-crypto";
import { Directory, File, Paths } from "expo-file-system";

// TODO(Phase 0): iOS needs App Group container path for widget extension access
function iconsDir(): Directory {
	return new Directory(Paths.document, "widget", "icons");
}

async function urlToKey(url: string): Promise<string> {
	const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, url);
	return `${hash.slice(0, 16)}.png`;
}

// 返り値: id -> ローカル絶対 URI（成功分のみ）。失敗 id は含めない
export async function cacheIcons(items: LauncherItem[]): Promise<Map<string, string>> {
	iconsDir().create({ intermediates: true, idempotent: true });
	const dir = iconsDir();
	const result = new Map<string, string>();

	await Promise.allSettled(
		items.map(async (item) => {
			if (!item.iconUri) {
				return;
			}
			const key = await urlToKey(item.iconUri);
			const destFile = new File(dir, key);
			if (!destFile.exists) {
				await File.downloadFileAsync(item.iconUri, destFile, {
					idempotent: true,
				});
			}
			result.set(item.id, destFile.uri);
		}),
	);

	return result;
}

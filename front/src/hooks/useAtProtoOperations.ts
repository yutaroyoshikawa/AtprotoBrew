import * as com from "../lexicons/com";
import * as org from "../lexicons/org";
import { useAtProtoClient, useUserDid } from "./useAtProtoClient";

/**
 * Launcher記録の取得と保存を行うカスタムフック
 * OAuth認証済みのクライアントを使用してAtProtoAPIを呼び出します
 */
export function useLauncherOperations() {
	const client = useAtProtoClient();
	const userDid = useUserDid();

	const getLauncher = async () => {
		if (!client) {
			throw new Error("Client not available: user not authenticated");
		}

		try {
			const res = await client.xrpc(org.tarororo.brew.getLauncher);
			return res.body;
		} catch (error) {
			console.error("Failed to get launcher:", error);
			throw error;
		}
	};

	const saveLauncher = async (items: org.tarororo.brew.launcher.Item[]) => {
		if (!client || !userDid) {
			throw new Error("Client or user DID not available: user not authenticated");
		}

		try {
			await client.xrpc(com.atproto.repo.putRecord, {
				body: {
					repo: userDid,
					collection: "org.tarororo.brew.launcher",
					record: {
						items,
						$type: "org.tarororo.brew.launcher",
					} satisfies org.tarororo.brew.launcher.Main,
					rkey: "self",
				},
			});
		} catch (error) {
			console.error("Failed to save launcher:", error);
			throw error;
		}
	};

	return { getLauncher, saveLauncher, client, userDid };
}

/**
 * Store Item操作を行うカスタムフック
 */
export function useStoreItemOperations() {
	const client = useAtProtoClient();
	const userDid = useUserDid();

	const getStoreItems = async () => {
		if (!client) {
			throw new Error("Client not available: user not authenticated");
		}

		try {
			// StoreItem一覧を取得するエンドポイント（存在する場合）
			// const res = await client.xrpc(org.tarororo.brew.getStoreItems);
			// return res.body;
			return null;
		} catch (error) {
			console.error("Failed to get store items:", error);
			throw error;
		}
	};

	return { getStoreItems, client, userDid };
}

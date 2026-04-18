// import { useAtProtoClient, useUserDid } from "./hooks/useAtProtoClient";
// import * as com from "./lexicons/com";
// import * as org from "./lexicons/org";

// export function useExampleAtProtoOperations() {
// 	const client = useAtProtoClient();
// 	const userDid = useUserDid();

// 	const getAndSaveLauncher = async () => {
// 		if (!client || !userDid) {
// 			console.error("Client or user DID not available");
// 			return;
// 		}

// 		try {
// 			// データ取得
// 			const res = await client.xrpc(org.tarororo.brew.getLauncher);
// 			const data = res.body;

// 			// 保存
// 			await client.xrpc(com.atproto.repo.putRecord, {
// 				body: {
// 					repo: userDid, // OAuthセッションのユーザーDID
// 					collection: "org.tarororo.brew.launcher",
// 					record: {
// 						items: [],
// 						$type: "org.tarororo.brew.launcher",
// 					} satisfies org.tarororo.brew.launcher.Main,
// 					rkey: "self",
// 				},
// 			});

// 			return data;
// 		} catch (error) {
// 			console.error("Failed to get and save launcher:", error);
// 			throw error;
// 		}
// 	};

// 	return { getAndSaveLauncher, client, userDid };
// }

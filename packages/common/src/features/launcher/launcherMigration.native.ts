import type { AtprotoDid } from "@atproto/did";
import { MMKV } from "react-native-mmkv";

const mmkv = new MMKV({ id: "launcher" });

export function migrateLauncherLayout(did: AtprotoDid): void {
	const existing = mmkv.getString("launcher.layout");

	if (!existing) {
		return;
	}

	mmkv.set(`launcher.layout.${did}`, existing);
	mmkv.delete("launcher.layout");
}

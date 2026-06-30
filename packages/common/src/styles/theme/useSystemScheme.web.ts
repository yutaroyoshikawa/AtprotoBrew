import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { systemSchemeAtom } from "./atoms";

/**
 * web: matchMedia で OS/ブラウザのカラースキーム変化を購読。
 * マウント時に現在値をセット、リアルタイムで追従。
 */
export function useSystemScheme() {
	const set = useSetAtom(systemSchemeAtom);

	useEffect(() => {
		const mq = window.matchMedia("(prefers-color-scheme: dark)");

		const apply = () => set(mq.matches ? "dark" : "light");

		apply();

		mq.addEventListener("change", apply);

		return () => {
			mq.removeEventListener("change", apply);
		};
	}, [set]);
}

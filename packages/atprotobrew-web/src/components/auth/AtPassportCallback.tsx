import { useEffect, useEffectEvent } from "react";
import { parseAtPassportCallback } from "../../hooks/useAtPassport";

interface Props {
	login: (handle: string, handleResolver: string) => Promise<void>;
}

export function AtPassportCallback({ login }: Props) {
	const onCallback = useEffectEvent(() => {
		parseAtPassportCallback(login);
	});

	useEffect(() => {
		onCallback();
	}, []);

	return (
		<div className="min-h-screen bg-bg flex items-center justify-center">
			<div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
		</div>
	);
}

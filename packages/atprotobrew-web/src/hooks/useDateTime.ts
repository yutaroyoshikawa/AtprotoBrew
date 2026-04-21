import { useEffect, useState } from "react";

interface DateTime {
	time: string;
	date: string;
}

export function useDateTime(): DateTime {
	const [now, setNow] = useState(new Date());

	useEffect(() => {
		const id = setInterval(() => setNow(new Date()), 1000);
		return () => clearInterval(id);
	}, []);

	const time = now.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});

	const date = now.toLocaleDateString("en-US", {
		weekday: "short",
		month: "numeric",
		day: "numeric",
	});

	return { time, date };
}

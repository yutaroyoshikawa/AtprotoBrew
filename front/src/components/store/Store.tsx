import { useNavigate } from "react-router-dom";
import { STORE_CHANNELS } from "../../data/storeChannels";
import type { InstalledChannel } from "../../types/channel";
import { StoreItemCard } from "./StoreItemCard";

interface StoreProps {
	installedChannels: InstalledChannel[];
}

export function Store({ installedChannels }: StoreProps) {
	const navigate = useNavigate();
	const installedIds = new Set(installedChannels.map((ch) => ch.id));

	return (
		<div className="min-h-screen bg-sky-50 flex flex-col">
			<header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-3 flex items-center gap-3 sticky top-0 z-10">
				<button
					type="button"
					onClick={() => navigate("/")}
					className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
					aria-label="ホームに戻る"
				>
					←
				</button>
				<div className="flex items-center gap-2">
					<div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
						<span className="text-white text-xs font-bold">AT</span>
					</div>
					<h1 className="text-slate-800 font-semibold text-base tracking-tight">brew store</h1>
				</div>
			</header>

			<main className="flex-1 px-6 py-6 max-w-xl mx-auto w-full">
				<p className="text-slate-400 text-sm mb-5">AT Protocol サービスのチャンネル一覧</p>

				<div className="flex flex-col gap-2">
					{STORE_CHANNELS.map((channel) => (
						<StoreItemCard key={channel.id} channel={channel} isInstalled={installedIds.has(channel.id)} />
					))}
				</div>
			</main>
		</div>
	);
}

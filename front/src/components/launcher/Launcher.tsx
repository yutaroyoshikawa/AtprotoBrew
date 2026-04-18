import { useNavigate } from "react-router-dom";
import { useDateTime } from "../../hooks/useDateTime";
import type { InstalledChannel } from "../../types/channel";
import { ChannelCard, StoreChannelCard } from "./ChannelCard";

interface LauncherProps {
	installedChannels: InstalledChannel[];
	onLogout: () => void;
}

export function Launcher({ installedChannels, onLogout }: LauncherProps) {
	const { time, date } = useDateTime();
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-sky-50 flex flex-col">
			<header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
				<div className="flex items-center gap-2">
					<div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
						<span className="text-white text-xs font-bold">AT</span>
					</div>
					<h1 className="text-slate-800 font-semibold text-base tracking-tight">
						atproto brew
					</h1>
				</div>
				<div className="flex items-center gap-4">
					<div className="text-right">
						<p className="text-slate-800 font-medium text-sm leading-none">{time}</p>
						<p className="text-slate-400 text-xs mt-0.5">{date}</p>
					</div>
					<button
						type="button"
						onClick={onLogout}
						className="text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
					>
						ログアウト
					</button>
				</div>
			</header>

			<main className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full">
				<section>
					<h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
						チャンネル
					</h2>
					<div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
						{installedChannels.map((ch) => (
							<ChannelCard key={ch.id} channel={ch} />
						))}
						<StoreChannelCard onNavigateToStore={() => navigate("/store")} />
					</div>
				</section>

				{installedChannels.length === 0 && (
					<div className="mt-8 text-center">
						<p className="text-slate-400 text-sm">
							チャンネルがありません。
							<br />
							brew store からインストールしてください。
						</p>
					</div>
				)}
			</main>

			<footer className="pb-6 text-center">
				<p className="text-xs text-slate-300">{date}</p>
			</footer>
		</div>
	);
}

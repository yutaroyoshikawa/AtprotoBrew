import { useNavigate, useParams } from "react-router-dom";
import { STORE_CHANNELS } from "../../data/storeChannels";
import type { InstalledChannel } from "../../types/channel";

interface StoreItemDetailProps {
	installedChannels: InstalledChannel[];
	onInstall: (channel: InstalledChannel) => void;
	onUninstall: (id: string) => void;
}

export function StoreItemDetail({
	installedChannels,
	onInstall,
	onUninstall,
}: StoreItemDetailProps) {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const channel = STORE_CHANNELS.find((ch) => ch.id === id);
	const isInstalled = installedChannels.some((ch) => ch.id === id);

	if (!channel) {
		return (
			<div className="min-h-screen bg-sky-50 flex items-center justify-center">
				<div className="text-center">
					<p className="text-slate-500">チャンネルが見つかりません。</p>
					<button
						type="button"
						onClick={() => navigate("/store")}
						className="mt-4 text-blue-600 text-sm hover:underline cursor-pointer"
					>
						Storeに戻る
					</button>
				</div>
			</div>
		);
	}

	const handleInstall = () => {
		onInstall({
			id: channel.id,
			letter: channel.letter,
			color: channel.color,
			name: channel.name,
			url: channel.url,
		});
		navigate("/");
	};

	const handleUninstall = () => {
		onUninstall(channel.id);
	};

	return (
		<div className="min-h-screen bg-sky-50 flex flex-col">
			<header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-3 flex items-center gap-3 sticky top-0 z-10">
				<button
					type="button"
					onClick={() => navigate("/store")}
					className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
					aria-label="Storeに戻る"
				>
					←
				</button>
				<h1 className="text-slate-800 font-semibold text-base tracking-tight">
					チャンネル詳細
				</h1>
			</header>

			<main className="flex-1 px-6 py-8 max-w-xl mx-auto w-full">
				<div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col gap-6">
					<div className="flex items-center gap-4">
						<div
							className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-sm shrink-0"
							style={{ backgroundColor: channel.color }}
						>
							<span className="text-white text-3xl font-bold">{channel.letter}</span>
						</div>
						<div>
							<h2 className="text-xl font-semibold text-slate-800">{channel.name}</h2>
							<p className="text-slate-400 text-sm">{channel.developer}</p>
						</div>
					</div>

					<div className="flex gap-3 text-xs text-slate-500">
						<span className="bg-slate-50 px-3 py-1.5 rounded-lg">
							v{channel.version}
						</span>
						<span className="bg-slate-50 px-3 py-1.5 rounded-lg">
							更新日: {channel.updatedAt}
						</span>
					</div>

					<div>
						<h3 className="text-sm font-semibold text-slate-600 mb-2">概要</h3>
						<p className="text-slate-500 text-sm leading-relaxed">{channel.description}</p>
					</div>

					<div>
						<h3 className="text-sm font-semibold text-slate-600 mb-2">更新内容</h3>
						<p className="text-slate-500 text-sm leading-relaxed">{channel.changeLog}</p>
					</div>

					{isInstalled ? (
						<button
							type="button"
							onClick={handleUninstall}
							className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-xl py-3 px-6 transition-colors duration-150 cursor-pointer"
						>
							アンインストール
						</button>
					) : (
						<button
							type="button"
							onClick={handleInstall}
							className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-xl py-3 px-6 transition-colors duration-150 cursor-pointer"
						>
							インストール
						</button>
					)}
				</div>
			</main>
		</div>
	);
}

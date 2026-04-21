import { useNavigate, useParams } from "react-router-dom";
import type { InstalledChannel } from "../../types/channel";

interface ChannelDetailProps {
	installedChannels: InstalledChannel[];
}

export function ChannelDetail({ installedChannels }: ChannelDetailProps) {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const channel = installedChannels.find((ch) => ch.id === id);

	if (!channel) {
		return (
			<div className="min-h-screen bg-sky-50 flex items-center justify-center">
				<div className="text-center">
					<p className="text-slate-500">チャンネルが見つかりません。</p>
					<button
						type="button"
						onClick={() => navigate("/")}
						className="mt-4 text-blue-600 text-sm hover:underline cursor-pointer"
					>
						ホームに戻る
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center px-4">
			<div className="bg-white rounded-3xl shadow-lg px-8 py-10 flex flex-col items-center gap-6 max-w-sm w-full">
				<div
					className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-md"
					style={{ backgroundColor: channel.color }}
				>
					<span className="text-white text-4xl font-bold">{channel.letter}</span>
				</div>

				<div className="text-center">
					<h1 className="text-2xl font-semibold text-slate-800">{channel.name}</h1>
					<p className="text-slate-400 text-sm mt-1">{channel.url}</p>
				</div>

				<a
					href={channel.url}
					target="_blank"
					rel="noopener noreferrer"
					className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-xl py-3 px-6 text-center transition-colors duration-150"
				>
					起動する
				</a>

				<button
					type="button"
					onClick={() => navigate("/")}
					className="text-slate-400 hover:text-slate-600 text-sm transition-colors cursor-pointer"
				>
					← ホームに戻る
				</button>
			</div>
		</div>
	);
}

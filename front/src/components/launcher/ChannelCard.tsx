import { Link } from "react-router-dom";
import type { InstalledChannel } from "../../types/channel";

interface ChannelCardProps {
	channel: InstalledChannel;
}

export function ChannelCard({ channel }: ChannelCardProps) {
	return (
		<Link
			to={`/channel/${channel.id}`}
			className="group block bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 aspect-square flex flex-col items-center justify-center gap-2 p-4 cursor-pointer"
		>
			<div
				className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
				style={{ backgroundColor: channel.color }}
			>
				<span className="text-white text-xl font-bold">{channel.letter}</span>
			</div>
			<span className="text-slate-700 text-xs font-medium text-center leading-tight">
				{channel.name}
			</span>
		</Link>
	);
}

interface StoreChannelCardProps {
	onNavigateToStore: () => void;
}

export function StoreChannelCard({ onNavigateToStore }: StoreChannelCardProps) {
	return (
		<button
			type="button"
			onClick={onNavigateToStore}
			className="group block bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 aspect-square flex flex-col items-center justify-center gap-2 p-4 cursor-pointer w-full"
		>
			<div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
				<span className="text-white text-xl font-bold">AT</span>
			</div>
			<span className="text-white/90 text-xs font-medium text-center leading-tight">
				brew store
			</span>
		</button>
	);
}

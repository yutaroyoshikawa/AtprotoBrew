import { Link } from "react-router-dom";
import type { StoreChannel } from "../../types/channel";

interface StoreItemCardProps {
	channel: StoreChannel;
	isInstalled: boolean;
}

export function StoreItemCard({ channel, isInstalled }: StoreItemCardProps) {
	return (
		<Link
			to={`/store/${channel.id}`}
			className="flex items-center gap-4 bg-white rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer"
		>
			<div
				className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
				style={{ backgroundColor: channel.color }}
			>
				<span className="text-white text-xl font-bold">{channel.letter}</span>
			</div>

			<div className="flex-1 min-w-0">
				<p className="text-slate-800 font-medium text-sm">{channel.name}</p>
				<p className="text-slate-400 text-xs truncate mt-0.5">{channel.developer}</p>
			</div>

			<span
				className={`text-xs px-2 py-1 rounded-full shrink-0 font-medium ${
					isInstalled ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
				}`}
			>
				{isInstalled ? "インストール済" : "取得"}
			</span>
		</Link>
	);
}

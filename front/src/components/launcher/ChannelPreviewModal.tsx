import { useEffect } from "react";
import { STORE_CHANNELS } from "../../data/storeChannels";
import type { InstalledChannel } from "../../types/channel";

interface ChannelPreviewModalProps {
	channel: InstalledChannel | null;
	onClose: () => void;
	onStart: (channel: InstalledChannel) => void;
}

export function ChannelPreviewModal({ channel, onClose, onStart }: ChannelPreviewModalProps) {
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [onClose]);

	if (!channel) return null;

	const storeInfo = STORE_CHANNELS.find((c) => c.id === channel.id);

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
			role="dialog"
			aria-modal="true"
			aria-label={`${channel.name} preview`}
		>
			{/* biome-ignore lint/a11y/noStaticElementInteractions: aaaaa  */}
			<div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

			<div className="relative z-10 w-full max-w-lg rounded-3xl overflow-hidden glass-tile aero-shadow">
				{/* Banner */}
				<div
					className="relative h-48 flex items-center justify-center overflow-hidden"
					style={{ background: `linear-gradient(145deg, ${channel.color}cc, ${channel.color})` }}
				>
					<div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-transparent" />
					<div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent" />

					<div className="relative z-10 flex flex-col items-center gap-3">
						<div
							className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl font-bold text-white drop-shadow-xl"
							style={{
								background: "rgba(255,255,255,0.2)",
								backdropFilter: "blur(8px)",
								border: "1.5px solid rgba(255,255,255,0.5)",
							}}
						>
							{channel.letter}
						</div>
						<div className="absolute top-2 left-3 w-16 h-6 rounded-full bg-white/30 blur-md" />
					</div>

					<button
						type="button"
						onClick={onClose}
						className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/25 hover:bg-black/40 transition-colors flex items-center justify-center text-white/90 cursor-pointer"
						aria-label="Close"
					>
						<svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
							<path d="M4.293 4.293a1 1 0 0 1 1.414 0L8 6.586l2.293-2.293a1 1 0 1 1 1.414 1.414L9.414 8l2.293 2.293a1 1 0 0 1-1.414 1.414L8 9.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L6.586 8 4.293 5.707a1 1 0 0 1 0-1.414z" />
						</svg>
					</button>
				</div>

				{/* Info */}
				<div className="p-6">
					<div className="flex items-start justify-between mb-3">
						<div>
							<h2 className="text-xl font-bold text-slate-800 leading-tight">{channel.name}</h2>
							{storeInfo && <p className="text-sm text-slate-500 mt-0.5">{storeInfo.developer}</p>}
						</div>
						{storeInfo && (
							<span
								className="text-xs font-medium px-2.5 py-1 rounded-full text-white/90 shrink-0"
								style={{ background: channel.color }}
							>
								v{storeInfo.version}
							</span>
						)}
					</div>

					<p className="text-sm text-slate-700 leading-relaxed mb-6">
						{storeInfo?.description ?? channel.url}
					</p>

					<div className="flex gap-3">
						<button
							type="button"
							onClick={() => onStart(channel)}
							className="flex-1 py-3 rounded-2xl font-bold text-base text-white glass-btn cursor-pointer"
						>
							起動する
						</button>
						<button
							type="button"
							onClick={onClose}
							className="px-5 py-3 rounded-2xl font-semibold text-sm bg-white/60 border border-white/70 text-slate-700 hover:bg-white/80 transition-colors cursor-pointer"
						>
							ホーム
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

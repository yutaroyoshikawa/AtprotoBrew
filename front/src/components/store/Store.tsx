import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { STORE_CHANNELS } from "../../data/storeChannels";
import type { InstalledChannel } from "../../types/channel";
import { BubbleBackground } from "../launcher/BubbleBackground";

type InstallState = "idle" | "brewing" | "done";

interface StoreProps {
	installedChannels: InstalledChannel[];
	onInstall: (channel: InstalledChannel) => void;
}

export function Store({ installedChannels, onInstall }: StoreProps) {
	const navigate = useNavigate();
	const installedIds = new Set(installedChannels.map((ch) => ch.id));
	const [installStates, setInstallStates] = useState<Record<string, InstallState>>({});

	const handleInstall = useCallback(
		(channelId: string) => {
			const channel = STORE_CHANNELS.find((c) => c.id === channelId);
			if (!channel || installStates[channelId] === "brewing" || installedIds.has(channelId)) return;

			setInstallStates((prev) => ({ ...prev, [channelId]: "brewing" }));

			setTimeout(() => {
				setInstallStates((prev) => ({ ...prev, [channelId]: "done" }));
				onInstall({
					id: channel.id,
					letter: channel.letter,
					color: channel.color,
					name: channel.name,
					url: channel.url,
				});
			}, 2200);
		},
		[installStates, installedIds, onInstall],
	);

	const installedCount = installedChannels.length;

	return (
		<div className="relative w-full min-h-screen overflow-x-hidden select-none font-sans">
			<BubbleBackground />

			<div className="relative z-10 flex flex-col min-h-screen">
				<header
					className="flex items-center gap-4 px-6 py-4 shrink-0"
					style={{
						background: "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, transparent 100%)",
						borderBottom: "1px solid rgba(255,255,255,0.5)",
					}}
				>
					<button
						type="button"
						onClick={() => navigate("/")}
						className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 cursor-pointer"
						style={{
							background: "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(200,220,255,0.5) 100%)",
							border: "1.5px solid rgba(255,255,255,0.8)",
							boxShadow: "0 2px 8px rgba(100,160,240,0.25), inset 0 1px 0 rgba(255,255,255,0.7)",
						}}
						aria-label="ランチャーに戻る"
					>
						<svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-blue-600">
							<path
								d="M10 3.5L5.5 8 10 12.5"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>

					<div className="flex items-center gap-3">
						<div
							className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
							style={{
								background: "linear-gradient(145deg, #4ade80, #16a34a)",
								boxShadow: "0 2px 8px rgba(22,163,74,0.4), inset 0 1px 0 rgba(255,255,255,0.4)",
							}}
						>
							<svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
								<rect x="3" y="9" width="13" height="10" rx="2" fill="white" fillOpacity="0.9" />
								<path
									d="M16 11 Q20 11 20 14.5 Q20 18 16 18"
									stroke="white"
									strokeWidth="1.8"
									strokeLinecap="round"
									fill="none"
								/>
								<path
									d="M7 6 Q7 3.5 9.5 3.5 Q9.5 6 12 6 Q12 3.5 14.5 3.5 Q14.5 6 17 6"
									stroke="white"
									strokeWidth="1.5"
									strokeLinecap="round"
									fill="none"
									strokeOpacity="0.8"
								/>
							</svg>
						</div>
						<div>
							<h1
								className="font-bold text-lg text-slate-800 leading-tight"
								style={{ textShadow: "0 1px 3px rgba(255,255,255,0.8)" }}
							>
								atproto brew store
							</h1>
							<p className="text-xs text-slate-500">
								{installedCount} / {STORE_CHANNELS.length} installed
							</p>
						</div>
					</div>
				</header>

				<main className="flex-1 px-4 py-4 max-w-2xl w-full mx-auto">
					<div className="space-y-3">
						{STORE_CHANNELS.map((channel) => {
							const state = installStates[channel.id] ?? "idle";
							const isDone = state === "done" || installedIds.has(channel.id);
							const isBrewing = state === "brewing";
							const iconBg = `linear-gradient(145deg, ${channel.color}dd, ${channel.color})`;

							return (
								<div
									key={channel.id}
									className="rounded-2xl p-4 flex items-center gap-4 glass-tile aero-shadow"
								>
									<div className="relative shrink-0">
										<div
											className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white drop-shadow"
											style={{ background: iconBg }}
										>
											{channel.letter}
										</div>
										<div className="absolute top-1 left-2 w-9 h-3 rounded-full bg-white/35 blur-sm pointer-events-none" />
										<div
											className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl opacity-80"
											style={{ background: channel.color }}
										/>
									</div>

									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-0.5 flex-wrap">
											<span className="font-semibold text-slate-800 text-sm">{channel.name}</span>
											<span
												className="text-xs font-medium px-2 py-0.5 rounded-full text-white/90 shrink-0"
												style={{ background: channel.color }}
											>
												v{channel.version}
											</span>
										</div>
										<p className="text-xs text-slate-500 mb-0.5">{channel.developer}</p>
										<p className="text-xs text-slate-700/70 leading-relaxed line-clamp-2">
											{channel.description}
										</p>

										{isBrewing && (
											<div className="mt-2">
												<span className="text-xs text-green-700 font-medium">Brewing...</span>
												<div className="mt-1 h-2 rounded-full bg-white/50 overflow-hidden border border-white/40">
													<div
														className="h-full rounded-full"
														style={{
															background: "linear-gradient(90deg, #4ade80, #16a34a)",
															animation: "brew-progress 2.2s ease-out forwards",
														}}
													/>
												</div>
											</div>
										)}
									</div>

									<div className="shrink-0">
										{isDone ? (
											<div className="flex items-center gap-1.5 text-green-700 bg-green-50/80 border border-green-200 rounded-xl px-3 py-2">
												<svg
													viewBox="0 0 16 16"
													fill="currentColor"
													className="w-4 h-4 shrink-0"
												>
													<path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
												</svg>
												<span className="text-xs font-semibold">Installed</span>
											</div>
										) : (
											<button
												type="button"
												onClick={() => handleInstall(channel.id)}
												disabled={isBrewing}
												className="glass-btn text-white text-xs font-bold px-4 py-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/80 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
											>
												Install
											</button>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</main>

				<footer className="px-6 py-4 flex justify-center shrink-0">
					<button
						type="button"
						onClick={() => navigate("/")}
						className="px-8 py-3 rounded-2xl font-semibold text-sm bg-white/60 border border-white/70 text-slate-700/80 hover:bg-white/80 transition-colors aero-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 cursor-pointer"
					>
						Back to Launcher
					</button>
				</footer>
			</div>
		</div>
	);
}

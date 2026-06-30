import type { AtIdentifierString, Client } from "@atproto/lex";
import { useFetchLaunchers } from "@atprotobrew/common/channel/modules/launchersHooks";
// import {
//   useFetchStoreItems,
//   usePutStoreItemMutation,
// } from "@atprotobrew/common/channel/modules/storeItemsHooks";
import { AppButton } from "@atprotobrew/common/core/components/AppButton";
import { StoreItem } from "@atprotobrew/common/store/components/StoreItem";
import { Trans, useLingui } from "@lingui/react/macro";
import { Link } from "react-router-dom";

import { BubbleBackground } from "../launcher/BubbleBackground";

interface StoreProps {
	client: Client;
	identifier: AtIdentifierString;
}

export function Store({ client }: StoreProps) {
	const { t } = useLingui();
	const { data } = useFetchLaunchers({ agent: client });
	// const storeItemMutation = usePutStoreItemMutation({ client, identifier });

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
					<AppButton
						type="button"
						shape="circle"
						render={(props) => <Link {...props} to="/" />}
						aria-label={t`ランチャーに戻る`}
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
					</AppButton>

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
								<Trans>Atprotobrew ストア</Trans>
							</h1>
						</div>
					</div>
				</header>

				<main className="flex-1 px-4 py-4 max-w-2xl w-full mx-auto">
					<div className="space-y-3">
						{data.body.items.map((channel) => {
							console.log(channel);

							return (
								<StoreItem
									key={channel.title}
									title={channel.title}
									thumbnail={channel.thumbnail}
									author={channel.author}
									description={channel.description}
								/>
							);
						})}
					</div>
				</main>
			</div>
		</div>
	);
}

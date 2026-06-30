import type { AtprotoDid } from "@atproto/did";
import type { AtIdentifierString, Client } from "@atproto/lex";
import type { StoredAccount } from "@atprotobrew/common/account/types";
import { InstalledChannelTile } from "@atprotobrew/common/channel/components/InstalledChannelTile";
import { StoreChannelTile } from "@atprotobrew/common/channel/components/StoreChannelTile";
import { useFetchLaunchers } from "@atprotobrew/common/channel/modules/launchersHooks";
import { AppFooter } from "@atprotobrew/common/core/components/AppFooter";
import { useUnreadNotificationCount } from "@atprotobrew/common/notifications/modules/useNotifications";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserMenuButton } from "../user/UserMenuButton";
import { BubbleBackground } from "./BubbleBackground";

const TOTAL_TILES = 12;

interface LauncerProps {
	onLogout: () => void;
	client: Client;
	identifier: AtIdentifierString;
	accounts: StoredAccount[];
	onSwitchAccount: (did: AtprotoDid) => Promise<void>;
	onDeleteAccount: (did: AtprotoDid) => Promise<void>;
	onAddAccount: () => void;
}

export function Launcher({
	client,
	onLogout,
	identifier,
	accounts,
	onSwitchAccount,
	onDeleteAccount,
	onAddAccount,
}: LauncerProps) {
	const navigate = useNavigate();
	const { data } = useFetchLaunchers({ agent: client });
	const { data: unreadCount = 0 } = useUnreadNotificationCount(client);

	const installChannels = data.body.items;

	const [page] = useState(0);

	const tilesPerPage = TOTAL_TILES;

	const pageChannels = installChannels.slice(page * (tilesPerPage - 1), (page + 1) * (tilesPerPage - 1));

	return (
		<div className="relative w-full h-screen overflow-hidden select-none font-sans">
			<BubbleBackground />

			<div className="relative z-10 flex flex-col h-full">
				<div className="absolute top-4 right-4 z-20">
					<UserMenuButton
						actor={identifier}
						accounts={accounts}
						onLogout={onLogout}
						onSwitchAccount={onSwitchAccount}
						onDeleteAccount={onDeleteAccount}
						onAddAccount={onAddAccount}
					/>
				</div>

				<main className="flex-1 flex items-center justify-center px-6 py-2">
					<div className="w-full max-w-2xl">
						<div className="grid grid-cols-4 gap-3">
							<StoreChannelTile render={(props) => <Link {...props} to="/store" />} />
							{pageChannels.map((tile) => (
								<InstalledChannelTile
									key={tile.uri}
									channelName={tile.title}
									thumbnailUrl={tile.thumbnail}
									render={(props) => <Link {...props} to={`/channel/${tile.title}`} />}
								/>
							))}
						</div>
					</div>
				</main>

				<footer className="relative w-full">
					<AppFooter
						onRequestOpenNotifications={() => navigate("/notifications")}
						unreadNotificationCount={unreadCount}
						onRequestOpenSocialGraph={() => navigate("/social-graph")}
					/>
				</footer>
			</div>
		</div>
	);
}

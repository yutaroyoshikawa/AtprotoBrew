import { AppI18nProvider } from "@atprotobrew/common/core/components/AppI18nProvider";
import { AppQueryProvider } from "@atprotobrew/common/core/components/AppQueryProvider";
import { UIProvider } from "@atprotobrew/common/core/components/UIProvider";
import { getAppQueryClient } from "@atprotobrew/common/core/modules/appQuery";
import type { CatalogLoader } from "@atprotobrew/common/core/types/i18n";
import { Trans } from "@lingui/react/macro";
import { Provider as JotaiProvider } from "jotai";
import { Suspense, useState } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useOutletContext } from "react-router-dom";
import { AtPassportCallback } from "./components/auth/AtPassportCallback";
import { AuthGate } from "./components/auth/AuthGate";
import { ChannelDetail } from "./components/launcher/ChannelDetail";
import { Launcher } from "./components/launcher/Launcher";
import { Notifications } from "./components/notifications/Notifications";
import { Settings } from "./components/settings/Settings";
import { Store } from "./components/store/Store";
import { StoreItemDetail } from "./components/store/StoreItemDetail";
import { ProfilePageLayout } from "./components/user/ProfilePageLayout";
import { SocialGraph } from "./components/user/SocialGraph";
import { UserProfile } from "./components/user/UserProfile";
import { UserProfileFollowers } from "./components/user/UserProfileFollowers";
import { UserProfileFollows } from "./components/user/UserProfileFollows";
import { useOAuth } from "./hooks/useOAuth";

const appQueryClient = getAppQueryClient();

const webCatalogLoader: CatalogLoader = async (lang) => {
	switch (lang) {
		case "ja":
			return (await import("../locales/ja/messages")).messages;
		case "en":
			return (await import("../locales/en/messages")).messages;
	}
};

export default function App() {
	return (
		<JotaiProvider>
			<AppI18nProvider extraLoaders={[webCatalogLoader]}>
				<UIProvider>
					<AppQueryProvider client={appQueryClient}>
						<BrowserRouter>
							<Suspense
								fallback={
									<div className="min-h-screen bg-bg flex items-center justify-center">
										<div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
									</div>
								}
							>
								<Router />
							</Suspense>
						</BrowserRouter>
					</AppQueryProvider>
				</UIProvider>
			</AppI18nProvider>
		</JotaiProvider>
	);
}

function Router() {
	const oauthValues = useOAuth();

	return (
		<Routes>
			<Route path="/atpassport/callback" element={<AtPassportCallbackRoute authCtx={oauthValues} />} />

			<Route path="/profile/:did" element={<UserProfileRoute authCtx={oauthValues} />} />

			<Route element={<ProtectedLayout authCtx={oauthValues} />}>
				<Route path="/" element={<LauncerRoute />} />
				<Route path="/store" element={<StoreRoute />} />
				<Route path="/store/:id" element={<StoreItemDetail />} />
				<Route path="/channel/:id" element={<ChannelDetailRoute />} />
				<Route path="/settings" element={<SettingsRoute />} />
				<Route path="/notifications" element={<NotificationsRoute />} />
				<Route path="/social-graph" element={<SocialGraphRoute />} />
				<Route path="/profile/:did/follows" element={<UserProfileFollowsRoute />} />
				<Route path="/profile/:did/followers" element={<UserProfileFollowersRoute />} />

				<Route path="*" element={<Navigate to="/" replace />} />
			</Route>
		</Routes>
	);
}

type AuthContext = ReturnType<typeof useOAuth>;

function ProtectedLayout({ authCtx }: { authCtx: AuthContext }) {
	if (authCtx.authState.status === "loading" || authCtx.authState.status === "switching") {
		return (
			<div className="min-h-screen bg-bg flex items-center justify-center">
				<div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	if (authCtx.authState.status === "unauthenticated") {
		return <AuthGate onRequestLogin={authCtx.login} />;
	}

	return (
		<Outlet
			key={authCtx.authState.status === "authenticated" ? authCtx.authState.session.sub : "other"}
			context={authCtx}
		/>
	);
}

function AtPassportCallbackRoute({ authCtx }: { authCtx: AuthContext }) {
	return <AtPassportCallback login={authCtx.login} />;
}

function LauncerRoute() {
	const { authState, logout, accounts, switchAccount, deleteAccount, login } = useOutletContext<AuthContext>();
	const [showAddAccount, setShowAddAccount] = useState(false);

	if (authState.status !== "authenticated") {
		return null;
	}

	return (
		<>
			<Launcher
				client={authState.client}
				identifier={authState.identifier}
				onLogout={logout}
				accounts={accounts}
				onSwitchAccount={switchAccount}
				onDeleteAccount={deleteAccount}
				onAddAccount={() => setShowAddAccount(true)}
			/>

			{showAddAccount && (
				<div className="fixed inset-0 z-100 bg-bg/80 backdrop-blur-sm flex items-center justify-center">
					<div className="relative w-full max-w-sm mx-4">
						<button
							type="button"
							onClick={() => setShowAddAccount(false)}
							className="absolute -top-10 right-0 text-textContrastMedium hover:text-text text-sm"
						>
							キャンセル
						</button>

						<AuthGate
							onRequestLogin={async (handle, handleResolver) => {
								setShowAddAccount(false);
								await login(handle, handleResolver);
							}}
						/>
					</div>
				</div>
			)}
		</>
	);
}

function StoreRoute() {
	const { authState } = useOutletContext<AuthContext>();

	if (authState.status !== "authenticated") {
		return null;
	}

	return <Store client={authState.client} identifier={authState.identifier} />;
}

function ChannelDetailRoute() {
	const { authState } = useOutletContext<AuthContext>();

	if (authState.status !== "authenticated") {
		return null;
	}

	return <ChannelDetail client={authState.client} />;
}

function SettingsRoute() {
	const { authState } = useOutletContext<AuthContext>();

	if (authState.status !== "authenticated") {
		return null;
	}

	return <Settings />;
}

function NotificationsRoute() {
	const { authState } = useOutletContext<AuthContext>();

	if (authState.status !== "authenticated") {
		return null;
	}

	return (
		<ProfilePageLayout backTo="/" title={<Trans>通知</Trans>}>
			<Notifications client={authState.client} />
		</ProfilePageLayout>
	);
}

function SocialGraphRoute() {
	const { authState } = useOutletContext<AuthContext>();

	if (authState.status !== "authenticated") {
		return null;
	}

	return (
		<ProfilePageLayout backTo="/" title={<Trans>ソーシャルグラフ</Trans>}>
			<SocialGraph client={authState.client} currentUserDid={authState.session.sub} />
		</ProfilePageLayout>
	);
}

function UserProfileRoute({ authCtx }: { authCtx: AuthContext }) {
	const client = authCtx.authState.status === "authenticated" ? authCtx.authState.client : undefined;
	const currentUserDid = authCtx.authState.status === "authenticated" ? authCtx.authState.session.sub : undefined;

	return <UserProfile client={client} currentUserDid={currentUserDid} />;
}

function UserProfileFollowsRoute() {
	const { authState } = useOutletContext<AuthContext>();

	if (authState.status !== "authenticated") {
		return null;
	}

	return <UserProfileFollows client={authState.client} currentUserDid={authState.session.sub} />;
}

function UserProfileFollowersRoute() {
	const { authState } = useOutletContext<AuthContext>();

	if (authState.status !== "authenticated") {
		return null;
	}

	return <UserProfileFollowers client={authState.client} currentUserDid={authState.session.sub} />;
}

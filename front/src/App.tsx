import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthGate } from "./components/auth/AuthGate";
import { ChannelDetail } from "./components/launcher/ChannelDetail";
import { Launcher } from "./components/launcher/Launcher";
import { Store } from "./components/store/Store";
import { StoreItemDetail } from "./components/store/StoreItemDetail";
import type { InstalledChannel } from "./types/channel";

const STORAGE_KEY = "atproto-brew-installed";

function loadInstalled(): InstalledChannel[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as InstalledChannel[]) : [];
	} catch {
		return [];
	}
}

function saveInstalled(channels: InstalledChannel[]): void {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(channels));
}

export default function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [installedChannels, setInstalledChannels] = useState<InstalledChannel[]>(loadInstalled);

	useEffect(() => {
		saveInstalled(installedChannels);
	}, [installedChannels]);

	const handleInstall = (channel: InstalledChannel) => {
		setInstalledChannels((prev) =>
			prev.some((ch) => ch.id === channel.id) ? prev : [...prev, channel],
		);
	};

	const handleUninstall = (id: string) => {
		setInstalledChannels((prev) => prev.filter((ch) => ch.id !== id));
	};

	if (!isAuthenticated) {
		return <AuthGate onLogin={() => setIsAuthenticated(true)} />;
	}

	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={
						<Launcher
							installedChannels={installedChannels}
							onLogout={() => setIsAuthenticated(false)}
						/>
					}
				/>
				<Route
					path="/store"
					element={<Store installedChannels={installedChannels} />}
				/>
				<Route
					path="/store/:id"
					element={
						<StoreItemDetail
							installedChannels={installedChannels}
							onInstall={handleInstall}
							onUninstall={handleUninstall}
						/>
					}
				/>
				<Route
					path="/channel/:id"
					element={<ChannelDetail installedChannels={installedChannels} />}
				/>
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	);
}

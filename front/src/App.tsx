import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthGate } from "./components/auth/AuthGate";
import { ChannelDetail } from "./components/launcher/ChannelDetail";
import { Launcher } from "./components/launcher/Launcher";
import { Store } from "./components/store/Store";
import { StoreItemDetail } from "./components/store/StoreItemDetail";
import { useOAuth } from "./hooks/useOAuth";
import { useLauncherOperations } from "./hooks/useAtProtoOperations";
import type { InstalledChannel } from "./types/channel";

const STORAGE_KEY = "atproto-brew-installed";

function loadInstalledFromStorage(): InstalledChannel[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as InstalledChannel[]) : [];
  } catch {
    return [];
  }
}

function saveInstalledToStorage(channels: InstalledChannel[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(channels));
}

export default function App() {
  const { authState, login, logout } = useOAuth();
  const { getLauncher } = useLauncherOperations();
  const [installedChannels, setInstalledChannels] = useState<
    InstalledChannel[]
  >(loadInstalledFromStorage);
  const [isLoading, setIsLoading] = useState(false);

  // AtProtoからLauncherデータを取得
  useEffect(() => {
    if (authState.status !== "authenticated") {
      return;
    }

    const fetchLauncherData = async () => {
      setIsLoading(true);
      try {
        const launcherData = await getLauncher();
        if (launcherData?.view) {
          // バックエンドから返されたviewデータを InstalledChannel に変換
          const channels: InstalledChannel[] = launcherData.view.map(
            (item: any, index: number) => ({
              id: `channel-${index}`,
              letter: item.record.title.charAt(0).toUpperCase(),
              color: `hsl(${index * 60}, 70%, 50%)`,
              name: item.record.title,
              url: item.record.launch?.link || "",
            }),
          );
          setInstalledChannels(channels);
          saveInstalledToStorage(channels);
        }
      } catch (error) {
        console.error("Failed to fetch launcher data:", error);
        // フォールバック：ローカルストレージから取得
        setInstalledChannels(loadInstalledFromStorage());
      } finally {
        setIsLoading(false);
      }
    };

    fetchLauncherData();
  }, [authState.status]);

  const handleInstall = (channel: InstalledChannel) => {
    setInstalledChannels((prev) =>
      prev.some((ch) => ch.id === channel.id) ? prev : [...prev, channel],
    );
  };

  const handleUninstall = (id: string) => {
    setInstalledChannels((prev) => prev.filter((ch) => ch.id !== id));
  };

  if (authState.status === "loading") {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (authState.status === "unauthenticated") {
    return <AuthGate onLogin={login} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Launcher
              installedChannels={installedChannels}
              onLogout={logout}
              isLoading={isLoading}
            />
          }
        />
        <Route
          path="/store"
          element={
            <Store
              installedChannels={installedChannels}
              onInstall={handleInstall}
            />
          }
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

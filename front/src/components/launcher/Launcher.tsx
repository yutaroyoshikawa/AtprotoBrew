import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDateTime } from "../../hooks/useDateTime";
import type { InstalledChannel } from "../../types/channel";
import { BubbleBackground } from "./BubbleBackground";
import { ChannelTile } from "./ChannelCard";
import { ChannelPreviewModal } from "./ChannelPreviewModal";

const TOTAL_TILES = 12;

interface LauncherProps {
  installedChannels: InstalledChannel[];
  onLogout: () => void;
  isLoading?: boolean;
}

export function Launcher({
  installedChannels,
  onLogout,
  isLoading = false,
}: LauncherProps) {
  const { time, date } = useDateTime();
  const navigate = useNavigate();
  const [selectedChannel, setSelectedChannel] =
    useState<InstalledChannel | null>(null);
  const [startedApp, setStartedApp] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const tilesPerPage = TOTAL_TILES;
  const totalPages = Math.ceil(
    Math.max(1, installedChannels.length) / (tilesPerPage - 1),
  );

  const pageChannels = installedChannels.slice(
    page * (tilesPerPage - 1),
    (page + 1) * (tilesPerPage - 1),
  );

  const tiles = Array.from({ length: tilesPerPage }, (_, i) => {
    if (i === 0) return { kind: "brew" as const };
    const ch = pageChannels[i - 1];
    if (ch) return { kind: "installed" as const, channel: ch };
    return { kind: "empty" as const };
  });

  const handleStart = useCallback((ch: InstalledChannel) => {
    setSelectedChannel(null);
    setStartedApp(ch.name);
    window.open(ch.url, "_blank", "noopener,noreferrer");
    setTimeout(() => setStartedApp(null), 2000);
  }, []);

  const [h, m] = time.split(":");
  const hour = Number(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  const clockTime = `${hour12}:${m}`;

  return (
    <div className="relative w-full h-screen overflow-hidden select-none font-sans">
      <BubbleBackground />

      {isLoading && (
        <div className="absolute inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="glass-tile aero-shadow rounded-3xl px-10 py-8 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-blue-400/40 border-t-blue-600 animate-spin" />
            <p className="font-bold text-slate-800 text-lg">
              Loading channels...
            </p>
          </div>
        </div>
      )}

      {startedApp && (
        <div className="absolute inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="glass-tile aero-shadow rounded-3xl px-10 py-8 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-blue-400/40 border-t-blue-600 animate-spin" />
            <p className="font-bold text-slate-800 text-lg">
              Starting {startedApp}...
            </p>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full">
        <header className="flex items-center justify-between px-6 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(145deg, #60b4ff, #2563eb)",
                boxShadow:
                  "0 2px 8px rgba(37,99,235,0.4), inset 0 1px 0 rgba(255,255,255,0.4)",
              }}
            >
              <span className="text-white text-xs font-black tracking-tight">
                AT
              </span>
            </div>
            <span
              className="font-bold text-slate-800/90 text-base"
              style={{ textShadow: "0 1px 3px rgba(255,255,255,0.8)" }}
            >
              atproto brew
            </span>
          </div>

          <div className="flex items-baseline gap-1">
            <span
              className="font-bold text-2xl text-slate-800/90 tabular-nums"
              style={{ textShadow: "0 1px 4px rgba(255,255,255,0.9)" }}
            >
              {clockTime}
            </span>
            <span className="text-sm font-semibold text-slate-600/60">
              {ampm}
            </span>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-6 py-2">
          <div className="w-full max-w-2xl">
            <div className="grid grid-cols-4 gap-3">
              {tiles.map((tile, i) => {
                if (tile.kind === "empty") {
                  return <ChannelTile key={`empty-${i}`} kind="empty" />;
                }
                if (tile.kind === "brew") {
                  return (
                    <ChannelTile
                      key="brew"
                      kind="brew"
                      onClick={() => navigate("/store")}
                    />
                  );
                }
                return (
                  <ChannelTile
                    key={tile.channel.id}
                    kind="installed"
                    channel={tile.channel}
                    onClick={() => setSelectedChannel(tile.channel)}
                  />
                );
              })}
            </div>
          </div>
        </main>

        <footer className="relative flex items-center justify-between px-6 pb-4 pt-2 shrink-0">
          <div className="absolute top-0 left-0 right-0 overflow-hidden h-5 pointer-events-none">
            <svg
              viewBox="0 0 800 20"
              preserveAspectRatio="none"
              className="w-full h-full"
              aria-hidden="true"
            >
              <path
                d="M0,10 C100,0 200,20 300,10 C400,0 500,20 600,10 C700,0 800,20 800,10 L800,0 L0,0 Z"
                fill="rgba(255,255,255,0.35)"
              />
            </svg>
          </div>

          <button
            type="button"
            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 cursor-pointer"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(200,220,255,0.35) 100%)",
              border: "1.5px solid rgba(255,255,255,0.7)",
              boxShadow:
                "0 2px 8px rgba(100,160,240,0.3), inset 0 1px 0 rgba(255,255,255,0.6)",
            }}
            aria-label="Home"
          >
            <span className="text-slate-600/70 text-xs font-black">AT</span>
          </button>

          <div className="flex flex-col items-center gap-1.5">
            <span
              className="text-sm font-semibold text-slate-700/75"
              style={{ textShadow: "0 1px 3px rgba(255,255,255,0.9)" }}
            >
              {date}
            </span>
            {totalPages > 1 && (
              <div className="flex gap-1.5">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${i === page ? "bg-blue-600 scale-110" : "bg-slate-500/30 hover:bg-slate-500/50"}`}
                    aria-label={`Page ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 cursor-pointer"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(200,220,255,0.35) 100%)",
              border: "1.5px solid rgba(255,255,255,0.7)",
              boxShadow:
                "0 2px 8px rgba(100,160,240,0.3), inset 0 1px 0 rgba(255,255,255,0.6)",
            }}
            aria-label="ログアウト"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-slate-600/65"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </button>

          {page > 0 && (
            <button
              type="button"
              onClick={() => setPage((p) => p - 1)}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/40 border border-white/60 hover:bg-white/60 transition-colors cursor-pointer"
              aria-label="前のページ"
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="w-4 h-4 text-blue-600"
              >
                <path
                  d="M10.5 3.5L6 8l4.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          {page < totalPages - 1 && (
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/40 border border-white/60 hover:bg-white/60 transition-colors cursor-pointer"
              aria-label="次のページ"
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="w-4 h-4 text-blue-600"
              >
                <path
                  d="M5.5 3.5L10 8l-4.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </footer>
      </div>

      <ChannelPreviewModal
        channel={selectedChannel}
        onClose={() => setSelectedChannel(null)}
        onStart={handleStart}
      />
    </div>
  );
}

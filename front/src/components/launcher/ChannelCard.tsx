import type { InstalledChannel } from "../../types/channel";

function BrewIcon() {
  return (
    <div className="relative w-14 h-14 mx-auto mb-2 drop-shadow-lg">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: "linear-gradient(145deg, #4ade80, #16a34a)" }}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          className="w-9 h-9"
          aria-hidden="true"
        >
          <rect
            x="5"
            y="14"
            width="20"
            height="15"
            rx="3"
            fill="white"
            fillOpacity="0.9"
          />
          <path
            d="M25 17 Q32 17 32 22 Q32 27 25 27"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M10 9 Q10 5 14 5 Q14 9 18 9 Q18 5 22 5 Q22 9 26 9"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            strokeOpacity="0.85"
          />
          <rect
            x="9"
            y="29"
            width="16"
            height="2"
            rx="1"
            fill="white"
            fillOpacity="0.5"
          />
        </svg>
      </div>
      <div className="absolute top-1 left-2 w-7 h-3 rounded-full bg-white/35 blur-sm" />
    </div>
  );
}

function ServiceIcon({ channel }: { channel: InstalledChannel }) {
  return (
    <div className="relative w-14 h-14 mx-auto mb-2 drop-shadow-lg">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
        style={{
          background: `linear-gradient(145deg, ${channel.color}dd, ${channel.color})`,
        }}
      >
        {channel.letter}
      </div>
      <div className="absolute top-1 left-2 w-8 h-3 rounded-full bg-white/40 blur-sm" />
    </div>
  );
}

interface EmptyTileProps {
  kind: "empty";
}

interface BrewTileProps {
  kind: "brew";
  onClick: () => void;
}

interface InstalledTileProps {
  kind: "installed";
  channel: InstalledChannel;
  onClick: () => void;
}

type ChannelTileProps = EmptyTileProps | BrewTileProps | InstalledTileProps;

export function ChannelTile(props: ChannelTileProps) {
  if (props.kind === "empty") {
    return (
      <div
        className="rounded-2xl h-32 w-full border-2 border-dashed border-white/40 bg-white/15"
        aria-hidden="true"
      />
    );
  }

  if (props.kind === "brew") {
    return (
      <button
        type="button"
        onClick={props.onClick}
        className="group relative rounded-2xl h-32 w-full overflow-hidden glass-tile aero-shadow tile-hover cursor-pointer select-none flex flex-col items-center justify-center gap-0.5 p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70"
        aria-label="brew store を開く"
      >
        <div className="relative z-10 flex flex-col items-center gap-1">
          <BrewIcon />
          <span
            className="text-xs font-semibold text-slate-800/90 text-center leading-tight px-1 truncate max-w-full"
            style={{ textShadow: "0 1px 2px rgba(255,255,255,0.8)" }}
          >
            brew store
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 opacity-70 bg-emerald-500" />
      </button>
    );
  }

  const { channel, onClick } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative rounded-2xl h-32 w-full overflow-hidden glass-tile aero-shadow tile-hover cursor-pointer select-none flex flex-col items-center justify-center gap-0.5 p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70"
      aria-label={`${channel.name} を開く`}
    >
      <div className="relative z-10 flex flex-col items-center gap-1">
        <ServiceIcon channel={channel} />
        <span
          className="text-xs font-semibold text-slate-800/90 text-center leading-tight px-1 truncate max-w-full"
          style={{ textShadow: "0 1px 2px rgba(255,255,255,0.8)" }}
        >
          {channel.name}
        </span>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-1 opacity-70"
        style={{ background: channel.color }}
      />
    </button>
  );
}

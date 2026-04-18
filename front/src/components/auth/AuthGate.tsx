import { useState } from "react";

interface AuthGateProps {
	onLogin: (handle: string) => Promise<void>;
}

export function AuthGate({ onLogin }: AuthGateProps) {
	const [handle, setHandle] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		const trimmed = handle.trim();
		if (!trimmed) return;

		setIsLoading(true);
		setError(null);

		try {
			await onLogin(trimmed);
		} catch (err) {
			setError(err instanceof Error ? err.message : "ログインに失敗しました。ハンドルを確認してください。");
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center px-4">
			<div className="bg-white rounded-3xl shadow-lg px-10 py-12 flex flex-col items-center gap-6 max-w-sm w-full">
				<div className="flex flex-col items-center gap-2">
					<div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-md">
						<span className="text-white text-2xl font-bold tracking-tight">AT</span>
					</div>
					<h1 className="text-2xl font-semibold text-slate-800 tracking-tight">atproto brew</h1>
					<p className="text-slate-500 text-sm text-center leading-relaxed">
						AT Protocol サービスのランチャー
					</p>
				</div>

				<form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
					<div className="flex flex-col gap-1.5">
						<label htmlFor="handle" className="text-xs font-medium text-slate-600">
							ハンドル
						</label>
						{/* biome-ignore lint/correctness/useUniqueElementIds: aa */}
						<input
							id="handle"
							type="text"
							value={handle}
							onChange={(e) => setHandle(e.target.value)}
							placeholder="user.bsky.social"
							autoComplete="username"
							autoCapitalize="none"
							autoCorrect="off"
							spellCheck={false}
							disabled={isLoading}
							className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition"
						/>
					</div>

					{error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

					<button
						type="submit"
						disabled={isLoading || !handle.trim()}
						className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3 px-6 transition-colors duration-150 cursor-pointer"
					>
						{isLoading ? "リダイレクト中…" : "ログイン"}
					</button>
				</form>

				<p className="text-xs text-slate-400 text-center">@atproto/oauth-client-browser による OAuth 認証</p>
			</div>
		</div>
	);
}

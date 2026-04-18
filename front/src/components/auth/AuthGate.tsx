interface AuthGateProps {
	onLogin: () => void;
}

export function AuthGate({ onLogin }: AuthGateProps) {
	return (
		<div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center px-4">
			<div className="bg-white rounded-3xl shadow-lg px-10 py-12 flex flex-col items-center gap-6 max-w-sm w-full">
				<div className="flex flex-col items-center gap-2">
					<div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-md">
						<span className="text-white text-2xl font-bold tracking-tight">AT</span>
					</div>
					<h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
						atproto brew
					</h1>
					<p className="text-slate-500 text-sm text-center leading-relaxed">
						AT Protocol サービスのランチャー。
						<br />
						ログインして始めましょう。
					</p>
				</div>

				<button
					type="button"
					onClick={onLogin}
					className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-xl py-3 px-6 transition-colors duration-150 cursor-pointer"
				>
					AT Protocol でログイン
				</button>

				<p className="text-xs text-slate-400 text-center">
					@atproto/oauth-client-browser による認証
				</p>
			</div>
		</div>
	);
}

import { useLingui } from "@lingui/react/macro";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface ProfilePageLayoutProps {
	backTo: string;
	title: ReactNode;
	children: ReactNode;
}

export function ProfilePageLayout({ backTo, title, children }: ProfilePageLayoutProps) {
	const { t } = useLingui();

	return (
		<div className="relative w-full min-h-screen font-sans bg-bg">
			<div className="flex flex-col min-h-screen max-w-xl mx-auto">
				<header className="flex items-center gap-4 px-4 py-3 shrink-0 sticky top-0 z-10 bg-bg/80 backdrop-blur-md border-b border-bgContrast25">
					<Link
						to={backTo}
						className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-bgContrast25 transition-colors"
						aria-label={t`戻る`}
					>
						<svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-textContrastMedium">
							<path
								d="M10 3.5L5.5 8 10 12.5"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</Link>
					<h1 className="text-base font-bold text-text">{title}</h1>
				</header>

				<main className="flex-1 overflow-y-auto">{children}</main>
			</div>
		</div>
	);
}

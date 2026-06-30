import { AuthForm } from "@atprotobrew/common/auth/components/AuthForm";
import { LanguageToggle } from "@atprotobrew/common/core/components/LanguageToggle";
import { useLocale } from "@atprotobrew/common/core/modules/i18n";
import { ThemeToggle } from "@atprotobrew/common/theme";
import { startAtPassportLogin } from "../../hooks/useAtPassport";

interface AuthGateProps {
	onRequestLogin: (handle: string, handleResolver: string) => Promise<void>;
}

export function AuthGate({ onRequestLogin }: AuthGateProps) {
	const locale = useLocale();

	return (
		<div className="min-h-screen bg-bg transition-colors flex flex-col gap-y-8 items-center justify-center px-4">
			<div className="max-w-sm w-full">
				<AuthForm
					onSubmit={async ({ handle, handleResolver }) => {
						const trimmed = handle.trim();

						if (!trimmed) {
							return;
						}

						await onRequestLogin(trimmed, handleResolver);
					}}
					onAtPassportLogin={() => startAtPassportLogin(locale)}
				/>
			</div>

			<ThemeToggle />
			<LanguageToggle />
		</div>
	);
}

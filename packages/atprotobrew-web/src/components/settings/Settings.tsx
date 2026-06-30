import { LanguageToggle } from "@atprotobrew/common/core/components/LanguageToggle";
import { ThemeToggle } from "@atprotobrew/common/theme";

export function Settings() {
	return (
		<div className="w-full h-full grid gap-y-4 p-4">
			<ThemeToggle />
			<LanguageToggle />
		</div>
	);
}

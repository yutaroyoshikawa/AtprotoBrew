import { Trans } from "@lingui/react/macro";
import { Check, ChevronDown } from "lucide-react-native";
import { Adapt, Select, Sheet, Text, XStack } from "tamagui";
import { useLanguage } from "../modules/i18n";
import { AppLanguageSchema } from "../shcemas/i18n";
import type { AppLanguage } from "../types/i18n";

const options: Array<{ value: AppLanguage; label: string }> = [
	{ value: "ja", label: "日本語" },
	{ value: "en", label: "English" },
];

const isAppLanguage = (v: unknown): v is AppLanguage => AppLanguageSchema.safeParse(v).success;

export function LanguageToggle() {
	const [language, setLanguage] = useLanguage();

	return (
		<XStack alignItems="center" gap="$4">
			<Text fontWeight="700" color="$text">
				<Trans>言語</Trans>
			</Text>
			<Select native value={language} onValueChange={(v) => isAppLanguage(v) && setLanguage(v)}>
				<Select.Trigger flex={1} iconAfter={ChevronDown}>
					<Select.Value />
				</Select.Trigger>

				<Adapt when="sm" platform="touch">
					<Sheet modal dismissOnSnapToBottom>
						<Sheet.Frame>
							<Sheet.ScrollView>
								<Adapt.Contents />
							</Sheet.ScrollView>
						</Sheet.Frame>
						<Sheet.Overlay />
					</Sheet>
				</Adapt>

				<Select.Content>
					<Select.ScrollUpButton />
					<Select.Viewport>
						<Select.Group>
							{options.map((item, i) => (
								<Select.Item key={item.value} index={i} value={item.value}>
									<Select.ItemText>{item.label}</Select.ItemText>
									<Select.ItemIndicator>
										<Check size={16} />
									</Select.ItemIndicator>
								</Select.Item>
							))}
						</Select.Group>
					</Select.Viewport>
					<Select.ScrollDownButton />
				</Select.Content>
			</Select>
		</XStack>
	);
}

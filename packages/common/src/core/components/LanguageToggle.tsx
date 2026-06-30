import { Picker, Row, Spacer, Text } from "@expo/ui";
import { useLingui } from "@lingui/react/macro";
import { useTheme } from "tamagui";
import { useLanguage } from "../modules/i18n";
import type { AppLanguage } from "../types/i18n";

const options = [
	{ value: "ja", label: "日本語" },
	{ value: "en", label: "English" },
] as const satisfies Array<{
	value: AppLanguage;
	label: string;
}>;

export function LanguageToggle() {
	const t = useTheme();
	const [language, setLanguage] = useLanguage();
	const { t: l } = useLingui();

	return (
		<Row key={language} alignment="center" style={{ padding: 16 }}>
			<Text style={{ paddingRight: 16 }} textStyle={{ fontWeight: "bold", color: t.text.val }}>
				{l`言語`}
			</Text>
			<Spacer flexible />
			<Picker selectedValue={language} onValueChange={(value) => setLanguage(value)}>
				{options.map((item) => (
					<Picker.Item key={item.value} label={item.label} value={item.value} />
				))}
			</Picker>
		</Row>
	);
}

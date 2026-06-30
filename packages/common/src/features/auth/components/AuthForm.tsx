"use client";

import { Trans, useLingui } from "@lingui/react/macro";
import { useForm } from "@tanstack/react-form";
import { View } from "tamagui";
import { AppButton } from "../../../core/components/AppButton";
import { AppCard } from "../../../core/components/AppCard";
import { AppForm, AppFormTrigger } from "../../../core/components/AppForm";
import { AppH1 } from "../../../core/components/AppH1";
import { AppInput } from "../../../core/components/AppInput";
import { AppLabel } from "../../../core/components/AppLabel";
import { AppSeparator } from "../../../core/components/AppSeparator";
import { AppText } from "../../../core/components/AppText";
import { AppVStack } from "../../../core/components/AppVStack";
import { AtPassportLogin } from "../../../core/components/AtPassportLogin";
import { useLocale } from "../../../core/modules/i18n";

const DEFAULT_HANDLE_RESOLVER = "https://bsky.social";

interface FormInputs {
	handle: string;
	handleResolver: string;
}

interface AuthFormProps {
	onSubmit?: (inputs: FormInputs) => Promise<void>;
	onAtPassportLogin?: () => void;
}

export function AuthForm({ onSubmit, onAtPassportLogin }: AuthFormProps) {
	const form = useForm({
		defaultValues: {
			handle: "",
			handleResolver: DEFAULT_HANDLE_RESOLVER,
		} satisfies FormInputs,
		onSubmit: (props) => onSubmit?.(props.value),
	});
	const locale = useLocale();
	const { t } = useLingui();

	return (
		<AppCard>
			<AppVStack gap="$5">
				<AppVStack gap="$1" paddingHorizontal="$6">
					<Trans render={AppH1}>ログイン</Trans>
				</AppVStack>

				<AppForm onSubmit={form.handleSubmit} paddingHorizontal="$6">
					<AppVStack gap="$5">
						<AppVStack gap="$1">
							<form.Field name="handle">
								{(field) => (
									<>
										<AppLabel>{t`ハンドル`}</AppLabel>
										<AppInput
											id={field.name}
											prefix="@"
											value={field.state.value}
											name={field.name}
											onChangeText={field.handleChange}
											placeholder="user.bsky.social"
											autoComplete="username"
											autoCapitalize="none"
											autoCorrect={false}
											spellCheck={false}
											disabled={form.state.isSubmitting}
										/>
										{!field.state.meta.isValid && (
											<AppText kind="error" role="alert">
												{field.state.meta.errors.join(", ")}
											</AppText>
										)}
									</>
								)}
							</form.Field>
						</AppVStack>

						<AppVStack gap="$1">
							<form.Field name="handleResolver">
								{(field) => (
									<>
										<AppLabel>PDS URL</AppLabel>
										<AppInput
											id={field.name}
											value={field.state.value}
											name={field.name}
											onChangeText={field.handleChange}
											placeholder={DEFAULT_HANDLE_RESOLVER}
											autoCapitalize="none"
											autoCorrect={false}
											spellCheck={false}
											disabled={form.state.isSubmitting}
										/>
										{!field.state.meta.isValid && (
											<AppText kind="error" role="alert">
												{field.state.meta.errors.join(", ")}
											</AppText>
										)}
									</>
								)}
							</form.Field>
						</AppVStack>

						<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
							{([canSubmit, isSubmitting]) => (
								<AppFormTrigger asChild disabled={!canSubmit}>
									{isSubmitting ? (
										<AppButton
											variant="primary"
											shape="tile"
											disabled
										>{t`リダイレクト中…`}</AppButton>
									) : (
										<AppButton
											variant="primary"
											shape="tile"
											onPress={form.handleSubmit}
										>{t`ログイン`}</AppButton>
									)}
								</AppFormTrigger>
							)}
						</form.Subscribe>
					</AppVStack>
				</AppForm>

				<AppSeparator />

				<View paddingHorizontal="$6">
					<AtPassportLogin lang={locale} onPress={onAtPassportLogin} />
				</View>
			</AppVStack>
		</AppCard>
	);
}

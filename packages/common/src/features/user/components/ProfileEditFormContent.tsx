"use client";

import { useLingui } from "@lingui/react/macro";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Text } from "tamagui";
import { AppButton } from "../../../core/components/AppButton";
import { AppForm, AppFormTrigger } from "../../../core/components/AppForm";
import { AppInput } from "../../../core/components/AppInput";
import { AppLabel } from "../../../core/components/AppLabel";
import { AppText } from "../../../core/components/AppText";
import { AppVStack } from "../../../core/components/AppVStack";
import { useThemeColors } from "../../../styles/theme";
import type { EditProfileInput, PendingImage } from "../modules/useEditProfile";
import type { UserProfile } from "../modules/useUserProfile";

interface ProfileEditFormContentProps {
	profile: UserProfile;
	onSubmit: (values: EditProfileInput) => Promise<void>;
	onCancel: () => void;
	onPickAvatar: () => Promise<PendingImage | null>;
	onPickBanner: () => Promise<PendingImage | null>;
	serverError?: string;
}

const segmenter = typeof Intl?.Segmenter === "function" ? new Intl.Segmenter() : null;

function countGraphemes(str: string): number {
	if (segmenter !== null) {
		return [...segmenter.segment(str)].length;
	}

	return [...str].length;
}

function makeGraphemeValidator(max: number, message: string) {
	return ({ value }: { value: string }) => {
		if (countGraphemes(value) > max) {
			return message;
		}

		return undefined;
	};
}

const BANNER_HEIGHT = 120;
const AVATAR_SIZE = 56;

export function ProfileEditFormContent({
	profile,
	onSubmit,
	onCancel,
	onPickAvatar,
	onPickBanner,
	serverError,
}: ProfileEditFormContentProps) {
	const { t } = useLingui();
	const tc = useThemeColors();

	const [pendingAvatar, setPendingAvatar] = useState<PendingImage | null>(null);
	const [pendingBanner, setPendingBanner] = useState<PendingImage | null>(null);

	const avatarUri = pendingAvatar?.uri ?? profile.avatar ?? null;
	const bannerUri = pendingBanner?.uri ?? profile.banner ?? null;

	const displayNameValidator = makeGraphemeValidator(64, t`表示名は64文字以内で入力してください`);
	const descriptionValidator = makeGraphemeValidator(256, t`自己紹介は256文字以内で入力してください`);

	const form = useForm({
		defaultValues: {
			displayName: profile.displayName ?? "",
			description: profile.description ?? "",
			website: profile.website ?? "",
			pronouns: profile.pronouns ?? "",
		},
		onSubmit: async ({ value }) => {
			await onSubmit({
				...value,
				pendingAvatar: pendingAvatar ?? undefined,
				pendingBanner: pendingBanner ?? undefined,
			});
		},
	});

	const handlePickAvatar = async () => {
		const picked = await onPickAvatar();

		if (picked) {
			setPendingAvatar(picked);
		}
	};

	const handlePickBanner = async () => {
		const picked = await onPickBanner();

		if (picked) {
			setPendingBanner(picked);
		}
	};

	return (
		<AppForm onSubmit={form.handleSubmit}>
			<AppVStack gap="$4">
				<Pressable
					onPress={handlePickBanner}
					accessibilityRole="button"
					accessibilityLabel={t`バナー画像を変更`}
				>
					<View style={[styles.bannerContainer, { backgroundColor: tc.bgContrast25 }]}>
						{bannerUri && (
							<Image
								source={{ uri: bannerUri }}
								style={StyleSheet.absoluteFill}
								resizeMode="cover"
								accessibilityLabel=""
							/>
						)}

						<View style={styles.overlay}>
							<Text style={styles.overlayText}>{t`バナーを変更`}</Text>
						</View>
					</View>
				</Pressable>

				<View style={styles.avatarWrapper}>
					<Pressable
						onPress={handlePickAvatar}
						accessibilityRole="button"
						accessibilityLabel={t`アバター画像を変更`}
						style={[styles.avatarContainer, { borderColor: tc.bg, backgroundColor: tc.bgContrast25 }]}
					>
						{avatarUri && (
							<Image source={{ uri: avatarUri }} style={StyleSheet.absoluteFill} accessibilityLabel="" />
						)}

						<View style={styles.overlay}>
							<Text style={styles.avatarOverlayText}>{t`変更`}</Text>
						</View>
					</Pressable>
				</View>

				<AppVStack gap="$4" paddingHorizontal="$4" paddingTop="$7">
					{serverError && (
						<AppText kind="error" role="alert">
							{serverError}
						</AppText>
					)}

					<form.Field
						name="displayName"
						validators={{ onChange: displayNameValidator, onSubmit: displayNameValidator }}
					>
						{(field) => (
							<AppVStack gap="$1">
								<AppLabel htmlFor={field.name}>{t`表示名`}</AppLabel>

								<AppInput
									id={field.name}
									value={field.state.value}
									onChangeText={field.handleChange}
									placeholder={t`表示名`}
									disabled={form.state.isSubmitting}
								/>

								{!field.state.meta.isValid && (
									<AppText kind="error" role="alert">
										{field.state.meta.errors.join(", ")}
									</AppText>
								)}
							</AppVStack>
						)}
					</form.Field>

					<form.Field
						name="description"
						validators={{ onChange: descriptionValidator, onSubmit: descriptionValidator }}
					>
						{(field) => (
							<AppVStack gap="$1">
								<AppLabel htmlFor={field.name}>{t`自己紹介`}</AppLabel>

								<AppInput
									id={field.name}
									value={field.state.value}
									onChangeText={field.handleChange}
									placeholder={t`自己紹介`}
									multiline
									numberOfLines={4}
									disabled={form.state.isSubmitting}
								/>

								{!field.state.meta.isValid && (
									<AppText kind="error" role="alert">
										{field.state.meta.errors.join(", ")}
									</AppText>
								)}
							</AppVStack>
						)}
					</form.Field>

					<form.Field
						name="website"
						validators={{
							onChange: ({ value }) => {
								if (value && !/^https?:\/\//i.test(value)) {
									return t`URLはhttps://またはhttp://から始めてください`;
								}

								return undefined;
							},
							onSubmit: ({ value }) => {
								if (value && !/^https?:\/\//i.test(value)) {
									return t`URLはhttps://またはhttp://から始めてください`;
								}

								return undefined;
							},
						}}
					>
						{(field) => (
							<AppVStack gap="$1">
								<AppLabel htmlFor={field.name}>{t`ウェブサイト`}</AppLabel>

								<AppInput
									id={field.name}
									value={field.state.value}
									onChangeText={field.handleChange}
									placeholder="https://example.com"
									autoCapitalize="none"
									autoCorrect={false}
									keyboardType="url"
									disabled={form.state.isSubmitting}
								/>

								{!field.state.meta.isValid && (
									<AppText kind="error" role="alert">
										{field.state.meta.errors.join(", ")}
									</AppText>
								)}
							</AppVStack>
						)}
					</form.Field>

					<form.Field name="pronouns">
						{(field) => (
							<AppVStack gap="$1">
								<AppLabel htmlFor={field.name}>{t`代名詞`}</AppLabel>

								<AppInput
									id={field.name}
									value={field.state.value}
									onChangeText={field.handleChange}
									placeholder="they/them"
									autoCapitalize="none"
									disabled={form.state.isSubmitting}
								/>
							</AppVStack>
						)}
					</form.Field>

					<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
						{([canSubmit, isSubmitting]) => (
							<AppVStack gap="$2">
								<AppFormTrigger asChild disabled={!canSubmit || isSubmitting}>
									<AppButton variant="glossy" shape="tile" disabled={!canSubmit || isSubmitting}>
										{isSubmitting ? t`保存中…` : t`保存`}
									</AppButton>
								</AppFormTrigger>

								<AppButton variant="secondary" shape="tile" onPress={onCancel} disabled={isSubmitting}>
									{t`キャンセル`}
								</AppButton>
							</AppVStack>
						)}
					</form.Subscribe>
				</AppVStack>
			</AppVStack>
		</AppForm>
	);
}

const styles = StyleSheet.create({
	bannerContainer: {
		height: BANNER_HEIGHT,
		overflow: "hidden",
	},
	avatarWrapper: {
		position: "absolute",
		top: BANNER_HEIGHT - AVATAR_SIZE / 2,
		left: 16,
	},
	avatarContainer: {
		width: AVATAR_SIZE,
		height: AVATAR_SIZE,
		borderRadius: AVATAR_SIZE / 2,
		borderWidth: 3,
		overflow: "hidden",
	},
	overlay: {
		...StyleSheet.absoluteFill,
		backgroundColor: "rgba(0,0,0,0.35)",
		alignItems: "center",
		justifyContent: "center",
	},
	overlayText: {
		color: "#fff",
		fontSize: 13,
		fontWeight: "600",
	},
	avatarOverlayText: {
		color: "#fff",
		fontSize: 9,
		fontWeight: "600",
		textAlign: "center",
	},
});

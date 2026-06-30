import type { Agent } from "@atproto/lex";
import { useThemeColors } from "@atprotobrew/common/theme";
import { ProfileEditFormContent } from "@atprotobrew/common/user/components/ProfileEditFormContent";
import { type EditProfileInput, isInvalidSwap, useEditProfile } from "@atprotobrew/common/user/modules/useEditProfile";
import { useUserProfile } from "@atprotobrew/common/user/modules/useUserProfile";
import { type BottomSheetMethods, BottomSheetModal, BottomSheetScrollView } from "@expo/ui/community/bottom-sheet";
import { useLingui } from "@lingui/react/macro";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { pickAvatar, pickBanner } from "./imageUtils";

interface ProfileEditBottomSheetProps {
	agent: Agent;
	actor: string;
}

export interface ProfileEditBottomSheetMethods {
	open: () => void;
}

export const ProfileEditBottomSheet = forwardRef<ProfileEditBottomSheetMethods, ProfileEditBottomSheetProps>(
	function ProfileEditBottomSheet({ agent, actor }, ref) {
		const { t } = useLingui();
		const tc = useThemeColors();
		const insets = useSafeAreaInsets();
		const sheetRef = useRef<BottomSheetMethods>(null);
		const { mutateAsync } = useEditProfile(agent, actor);
		const { data: profile } = useUserProfile(actor, agent);
		const [serverError, setServerError] = useState<string | undefined>();
		const [resetKey, setResetKey] = useState(0);

		useImperativeHandle(ref, () => ({
			open: () => {
				setServerError(undefined);
				setResetKey((k) => k + 1);
				sheetRef.current?.present();
			},
		}));

		const handleSubmit = async (values: EditProfileInput) => {
			setServerError(undefined);

			try {
				await mutateAsync(values);
				sheetRef.current?.dismiss();
			} catch (err) {
				if (isInvalidSwap(err)) {
					setServerError(t`他のデバイスで更新されました。一度閉じて再度開いてください。`);
				} else {
					setServerError(t`保存に失敗しました。もう一度お試しください。`);
				}
			}
		};

		const handlePickAvatar = async () => {
			try {
				return await pickAvatar();
			} catch (err: unknown) {
				if (err instanceof Error && (err as { code?: string }).code === "IMAGE_TOO_LARGE") {
					setServerError(t`画像が大きすぎます。別の画像を選んでください。`);
					return null;
				}

				throw err;
			}
		};

		const handlePickBanner = async () => {
			try {
				return await pickBanner();
			} catch (err: unknown) {
				if (err instanceof Error && (err as { code?: string }).code === "IMAGE_TOO_LARGE") {
					setServerError(t`画像が大きすぎます。別の画像を選んでください。`);
					return null;
				}

				throw err;
			}
		};

		if (!profile) {
			return null;
		}

		return (
			<BottomSheetModal
				ref={sheetRef}
				enableDynamicSizing={false}
				snapPoints={["90%"]}
				enablePanDownToClose
				backgroundStyle={{ backgroundColor: tc.bg }}
				handleIndicatorStyle={{ backgroundColor: tc.textContrastLow }}
			>
				<BottomSheetScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
					<ProfileEditFormContent
						key={resetKey}
						profile={profile}
						onSubmit={handleSubmit}
						onCancel={() => sheetRef.current?.dismiss()}
						onPickAvatar={handlePickAvatar}
						onPickBanner={handlePickBanner}
						serverError={serverError}
					/>
				</BottomSheetScrollView>
			</BottomSheetModal>
		);
	},
);

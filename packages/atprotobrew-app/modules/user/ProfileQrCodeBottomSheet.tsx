import type { AtprotoDid } from "@atproto/did";
import { atoms as a } from "@atprotobrew/common/alf";
import { AppButton } from "@atprotobrew/common/core/components/AppButton";
import { AtprotobrewMascot } from "@atprotobrew/common/core/components/AtprotobrewMascot";
import { useThemeColors } from "@atprotobrew/common/theme";
import { QrCodeDotMatrix } from "@atprotobrew/common/user/components/QrCodeDotMatrix";
import { useProfileQrUrl } from "@atprotobrew/common/user/modules/useProfileQrUrl";
import { type BottomSheetMethods, BottomSheetModal, BottomSheetView } from "@expo/ui/community/bottom-sheet";
import { useLingui } from "@lingui/react/macro";
import * as Clipboard from "expo-clipboard";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Image, Share, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ProfileQrCodeBottomSheetProps {
	did: AtprotoDid;
	displayName?: string;
	avatarUri?: string;
	handle: string;
}

export interface ProfileQrCodeBottomSheetMethods {
	present: () => void;
	dismiss: () => void;
}

const QR_SIZE = 200;
const MASCOT_SIZE = 44;

export const ProfileQrCodeBottomSheet = forwardRef<ProfileQrCodeBottomSheetMethods, ProfileQrCodeBottomSheetProps>(
	function ProfileQrCodeBottomSheet({ did, displayName, handle, avatarUri }, ref) {
		const { t } = useLingui();
		const tc = useThemeColors();
		const insets = useSafeAreaInsets();
		const sheetRef = useRef<BottomSheetMethods>(null);
		const url = useProfileQrUrl(did);

		useImperativeHandle(ref, () => ({
			present: () => sheetRef.current?.present(),
			dismiss: () => sheetRef.current?.dismiss(),
		}));

		const handleCopy = async () => {
			await Clipboard.setStringAsync(url);
		};

		const handleShare = async () => {
			await Share.share({ message: url });
		};

		return (
			<BottomSheetModal
				ref={sheetRef}
				enableDynamicSizing
				enablePanDownToClose
				backgroundStyle={{ backgroundColor: tc.bgContrast25 }}
				handleIndicatorStyle={{ backgroundColor: tc.textContrastLow }}
			>
				<BottomSheetView
					style={[a.items_center, a.px_6, a.pt_2, a.gap_5, { paddingBottom: insets.bottom + 24 }]}
				>
					<View style={{ width: QR_SIZE, height: QR_SIZE }}>
						<QrCodeDotMatrix value={url} size={QR_SIZE} foreground={tc.text} background={tc.bgContrast25} />
						<View
							style={[
								a.absolute,
								a.rounded_md,
								a.p_1,
								{
									width: MASCOT_SIZE,
									height: MASCOT_SIZE,
									top: (QR_SIZE - MASCOT_SIZE) / 2,
									left: (QR_SIZE - MASCOT_SIZE) / 2,
									backgroundColor: tc.bgContrast25,
								},
							]}
						>
							<AtprotobrewMascot />
						</View>
					</View>

					<View style={[a.items_center, a.gap_1]}>
						{avatarUri && (
							<Image source={{ uri: avatarUri }} style={[a.rounded_full, { width: 42, height: 42 }]} />
						)}
						{displayName && (
							<Text style={[a.text_md, a.font_semibold, { color: tc.text }]} numberOfLines={1}>
								{displayName}
							</Text>
						)}

						<Text style={[a.text_sm, { color: tc.textContrastMedium }]} numberOfLines={1}>
							@{handle}
						</Text>
					</View>

					<View style={[a.flex_row, a.gap_3, a.self_stretch]}>
						<AppButton
							variant="secondary"
							shape="tile"
							flex={1}
							onPress={handleCopy}
							accessibilityRole="button"
							accessibilityLabel={t`URLをコピー`}
						>
							{t`コピー`}
						</AppButton>

						<AppButton
							variant="secondary"
							shape="tile"
							flex={1}
							onPress={handleShare}
							accessibilityRole="button"
							accessibilityLabel={t`シェア`}
						>
							{t`シェア`}
						</AppButton>
					</View>
				</BottomSheetView>
			</BottomSheetModal>
		);
	},
);

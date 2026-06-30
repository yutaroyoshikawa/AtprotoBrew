import { useLingui } from "@lingui/react/macro";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { useThemeColors } from "../../../styles/theme";

interface FollowButtonProps {
	isFollowing: boolean;
	isMutating: boolean;
	onPress: () => void;
	size?: "sm" | "lg";
}

export function FollowButton({ isFollowing, isMutating, onPress, size = "sm" }: FollowButtonProps) {
	const tc = useThemeColors();
	const { t } = useLingui();

	const paddingHorizontal = size === "lg" ? 20 : 16;
	const minWidth = size === "lg" ? 96 : 80;
	const fontSize = size === "lg" ? 14 : 13;

	return (
		<Pressable
			onPress={isMutating ? undefined : onPress}
			disabled={isMutating}
			accessibilityRole="button"
			accessibilityLabel={isFollowing ? t`フォロー中` : t`フォロー`}
			style={({ pressed }) => ({
				paddingHorizontal,
				paddingVertical: 8,
				borderRadius: 999,
				backgroundColor: isFollowing ? tc.bgContrast25 : tc.primary,
				opacity: isMutating || pressed ? 0.6 : 1,
				minWidth,
				alignItems: "center" as const,
				justifyContent: "center" as const,
			})}
		>
			{isMutating ? (
				<ActivityIndicator size="small" color={isFollowing ? tc.text : tc.bg} />
			) : (
				<Text style={{ color: isFollowing ? tc.text : tc.bg, fontSize, fontWeight: "600" }}>
					{isFollowing ? t`フォロー中` : t`フォロー`}
				</Text>
			)}
		</Pressable>
	);
}

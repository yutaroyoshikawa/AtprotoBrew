import { Image, Pressable, Text, View } from "react-native";
import { atoms as a } from "../../../styles/alf";
import { useThemeColors } from "../../../styles/theme";
import { useUserProfile } from "../modules/useUserProfile";

export interface UserMenuTriggerProps {
	actor: string;
	onPress: () => void;
}

export function UserMenuTrigger({ actor, onPress }: UserMenuTriggerProps) {
	const tc = useThemeColors();
	const { data: profile } = useUserProfile(actor);

	const label = profile?.displayName ?? profile?.handle ?? "...";
	const avatarUri = profile?.avatar;

	return (
		<Pressable
			onPress={onPress}
			accessibilityRole="button"
			style={({ pressed }) => [
				a.flex_row,
				a.items_center,
				{
					minHeight: 44,
					gap: 8,
					paddingHorizontal: 10,
					paddingVertical: 6,
					borderRadius: 999,
					backgroundColor: tc.bgContrast25,
					opacity: pressed ? 0.7 : 1,
				},
			]}
		>
			{avatarUri ? (
				<Image source={{ uri: avatarUri }} style={{ width: 28, height: 28, borderRadius: 14 }} />
			) : (
				<View
					style={{
						width: 28,
						height: 28,
						borderRadius: 14,
						backgroundColor: tc.bgContrast50,
					}}
				/>
			)}
			<Text
				style={{
					color: tc.text,
					fontSize: 13,
					fontWeight: "500",
					maxWidth: 100,
				}}
				numberOfLines={1}
			>
				{label}
			</Text>
		</Pressable>
	);
}

import type { AtprotoDid } from "@atproto/did";
import { useLingui } from "@lingui/react/macro";
import { Image } from "expo-image";
import { LogOut, PlusCircle, QrCode, Trash2, User } from "lucide-react-native";
import { useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReanimatedSwipeable, { type SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import { atoms as a } from "../../../styles/alf";
import { useThemeColors } from "../../../styles/theme";
import type { StoredAccount } from "../../account/types";
import { useUserProfile } from "../modules/useUserProfile";

interface UserMenuItemsProps {
	accounts: StoredAccount[];
	activeDid: AtprotoDid;
	onSwitchAccount: (did: AtprotoDid) => void | Promise<void>;
	onAddAccount: () => void;
	onLogout: () => void | Promise<void>;
	onDeleteAccount: (did: AtprotoDid) => void | Promise<void>;
	onDismiss: () => void;
	onNavigateToProfile?: () => void;
	onShowQrCode?: () => void;
}

interface AccountRowProps {
	account: StoredAccount;
	isActive: boolean;
	onPress: () => void;
	onDelete: () => void;
}

function DeleteAction({ onDelete }: { onDelete: () => void }) {
	const tc = useThemeColors();
	const { t } = useLingui();

	return (
		<Pressable
			onPress={onDelete}
			accessibilityRole="button"
			accessibilityLabel={t`リストから削除`}
			style={({ pressed }) => ({
				backgroundColor: tc.negative,
				justifyContent: "center",
				alignItems: "center",
				paddingHorizontal: 20,
				opacity: pressed ? 0.8 : 1,
				minWidth: 88,
			})}
		>
			<Trash2 size={18} color={tc.text} />
			<Text style={{ color: tc.text, fontSize: 11, marginTop: 3 }}>{t`リストから削除`}</Text>
		</Pressable>
	);
}

function AccountRow({ account, isActive, onPress, onDelete }: AccountRowProps) {
	const tc = useThemeColors();
	const swipeableRef = useRef<SwipeableMethods>(null);
	const { data: profile } = useUserProfile(account.did);

	const handleDelete = () => {
		swipeableRef.current?.close();
		onDelete();
	};

	return (
		<ReanimatedSwipeable
			ref={swipeableRef}
			renderRightActions={() => <DeleteAction onDelete={handleDelete} />}
			rightThreshold={60}
			overshootRight={false}
		>
			<Pressable
				onPress={onPress}
				accessibilityRole="button"
				disabled={isActive}
				style={({ pressed }) => [
					a.flex_row,
					a.items_center,
					{
						gap: 10,
						paddingVertical: 12,
						backgroundColor: tc.bgContrast25,
						opacity: pressed ? 0.7 : 1,
					},
				]}
			>
				<Image source={{ uri: profile?.avatar }} style={{ width: 32, height: 32, borderRadius: 16 }} />
				<View style={[a.flex_1]}>
					<Text
						style={{
							color: tc.text,
							fontSize: 15,
							fontWeight: isActive ? "600" : "400",
						}}
						numberOfLines={1}
					>
						{account.handle}
					</Text>
				</View>
				{isActive && (
					<View
						style={{
							width: 8,
							height: 8,
							borderRadius: 4,
							backgroundColor: tc.text,
						}}
					/>
				)}
			</Pressable>
		</ReanimatedSwipeable>
	);
}

export function UserMenuItems({
	accounts,
	activeDid,
	onSwitchAccount,
	onAddAccount,
	onLogout,
	onDeleteAccount,
	onDismiss,
	onNavigateToProfile,
	onShowQrCode,
}: UserMenuItemsProps) {
	const tc = useThemeColors();
	const { t } = useLingui();

	const sortedAccounts = [...accounts].sort((a, b) => b.lastUsedAt - a.lastUsedAt);
	const divider = { borderBottomWidth: 1, borderBottomColor: tc.bgContrast25 };

	const handleSwitch = async (did: AtprotoDid) => {
		onDismiss();
		await onSwitchAccount(did);
	};

	const handleLogout = async () => {
		onDismiss();
		await onLogout();
	};

	const handleNavigateToProfile = () => {
		onDismiss();
		onNavigateToProfile?.();
	};

	const handleShowQrCode = () => {
		onDismiss();
		onShowQrCode?.();
	};

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<View>
				{/* アカウント一覧 (スワイプで削除) */}
				<View style={[divider, { paddingBottom: 4 }]}>
					{sortedAccounts.map((account) => (
						<AccountRow
							key={account.did}
							account={account}
							isActive={account.did === activeDid}
							onPress={() => handleSwitch(account.did)}
							onDelete={() => onDeleteAccount(account.did)}
						/>
					))}
				</View>

				{/* アカウントを追加 */}
				<Pressable
					onPress={onAddAccount}
					accessibilityRole="button"
					accessibilityLabel={t`アカウントを追加`}
					style={({ pressed }) => [
						a.flex_row,
						a.items_center,
						{
							...divider,
							gap: 12,
							paddingVertical: 14,
							opacity: pressed ? 0.7 : 1,
						},
					]}
				>
					<PlusCircle size={20} color={tc.textContrastMedium} />
					<Text style={{ color: tc.text, fontSize: 15 }}>{t`アカウントを追加`}</Text>
				</Pressable>

				{/* プロフィール */}
				{onNavigateToProfile && (
					<Pressable
						onPress={handleNavigateToProfile}
						accessibilityRole="button"
						accessibilityLabel={t`プロフィール`}
						style={({ pressed }) => [
							a.flex_row,
							a.items_center,
							{
								...divider,
								gap: 12,
								paddingVertical: 14,
								opacity: pressed ? 0.7 : 1,
							},
						]}
					>
						<User size={20} color={tc.textContrastMedium} />
						<Text style={{ color: tc.text, fontSize: 15 }}>{t`プロフィール`}</Text>
					</Pressable>
				)}

				{/* QR コードで共有 */}
				{onShowQrCode && (
					<Pressable
						onPress={handleShowQrCode}
						accessibilityRole="button"
						accessibilityLabel={t`QR コードで共有`}
						style={({ pressed }) => [
							a.flex_row,
							a.items_center,
							{
								...divider,
								gap: 12,
								paddingVertical: 14,
								opacity: pressed ? 0.7 : 1,
							},
						]}
					>
						<QrCode size={20} color={tc.textContrastMedium} />
						<Text style={{ color: tc.text, fontSize: 15 }}>{t`QR コードで共有`}</Text>
					</Pressable>
				)}

				{/* ログアウト */}
				<Pressable
					onPress={handleLogout}
					accessibilityRole="button"
					accessibilityLabel={t`このアカウントからログアウト`}
					style={({ pressed }) => [
						a.flex_row,
						a.items_center,
						{
							gap: 12,
							paddingVertical: 14,
							opacity: pressed ? 0.7 : 1,
						},
					]}
				>
					<LogOut size={20} color={tc.textContrastMedium} />
					<Text style={{ color: tc.text, fontSize: 15 }}>{t`このアカウントからログアウト`}</Text>
				</Pressable>
			</View>
		</GestureHandlerRootView>
	);
}

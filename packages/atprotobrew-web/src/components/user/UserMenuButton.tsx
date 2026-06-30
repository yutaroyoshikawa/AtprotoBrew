import { type AtprotoDid, isAtprotoDid } from "@atproto/did";
import type { AtIdentifierString } from "@atproto/lex";
import type { StoredAccount } from "@atprotobrew/common/account/types";
import { useUserProfile } from "@atprotobrew/common/user/modules/useUserProfile";
import { LogOut, PlusCircle, QrCode, Trash2, User } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ProfileQrCodeDialog, type ProfileQrCodeDialogMethods } from "./ProfileQrCodeDialog";

interface UserMenuButtonProps {
	actor: AtIdentifierString;
	accounts: StoredAccount[];
	onLogout: () => void | Promise<void>;
	onSwitchAccount: (did: AtprotoDid) => void | Promise<void>;
	onDeleteAccount: (did: AtprotoDid) => void | Promise<void>;
	onAddAccount: () => void;
}

interface AccountItemProps {
	account: StoredAccount;
	isActive: boolean;
	onClick: () => void;
	onDelete: () => void;
}

function AccountItem({ account, isActive, onClick, onDelete }: AccountItemProps) {
	const { data: profile } = useUserProfile(account.did);
	const displayHandle = profile?.handle ?? account.handle ?? account.did;

	return (
		<div className="group flex items-center w-full">
			<button
				type="button"
				role="menuitem"
				onClick={onClick}
				className="flex items-center gap-3 flex-1 min-w-0 px-4 py-3 text-left text-text hover:bg-bgContrast50 transition-colors cursor-pointer"
			>
				<div className="w-7 h-7 rounded-full bg-bgContrast50 shrink-0" />
				<span className={`text-sm flex-1 truncate ${isActive ? "font-semibold" : ""}`}>{displayHandle}</span>
				{isActive && <span className="w-2 h-2 rounded-full bg-text shrink-0" />}
			</button>

			<button
				type="button"
				aria-label="リストから削除"
				onClick={(e) => {
					e.stopPropagation();
					onDelete();
				}}
				className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 flex items-center justify-center w-8 h-8 mr-2 rounded-md text-textContrastMedium hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer shrink-0"
			>
				<Trash2 size={14} />
			</button>
		</div>
	);
}

export function UserMenuButton({
	actor,
	accounts,
	onLogout,
	onSwitchAccount,
	onDeleteAccount,
	onAddAccount,
}: UserMenuButtonProps) {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const menuId = useId();
	const qrDialogRef = useRef<ProfileQrCodeDialogMethods>(null);
	const { data: profile } = useUserProfile(actor);

	const label = profile?.displayName ?? profile?.handle ?? "...";
	const avatarUri = profile?.avatar;

	const sortedAccounts = [...accounts].sort((a, b) => b.lastUsedAt - a.lastUsedAt);

	const close = useCallback(() => {
		setIsOpen(false);
		triggerRef.current?.focus();
	}, []);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				close();
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, close]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const firstItem = menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]');

		firstItem?.focus();
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleMouseDown = (e: MouseEvent) => {
			if (!(e.target instanceof Node)) {
				return;
			}

			if (!menuRef.current?.contains(e.target) && !triggerRef.current?.contains(e.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleMouseDown);

		return () => document.removeEventListener("mousedown", handleMouseDown);
	}, [isOpen]);

	const handleSwitch = async (did: AtprotoDid) => {
		close();
		await onSwitchAccount(did);
	};

	const handleDelete = async (did: AtprotoDid) => {
		close();
		await onDeleteAccount(did);
	};

	const handleLogout = async () => {
		close();
		await onLogout();
	};

	const handleAddAccount = () => {
		close();
		onAddAccount();
	};

	const handleShowQrCode = () => {
		close();
		qrDialogRef.current?.showModal();
	};

	return (
		<div className="relative">
			<button
				ref={triggerRef}
				type="button"
				aria-haspopup="menu"
				aria-expanded={isOpen}
				aria-controls={isOpen ? menuId : undefined}
				onClick={() => setIsOpen((o) => !o)}
				className="flex items-center gap-2 rounded-full px-2.5 py-1.5 bg-bgContrast25 hover:bg-bgContrast50 transition-colors cursor-pointer"
			>
				{avatarUri ? (
					<img src={avatarUri} alt="" className="w-7 h-7 rounded-full object-cover" />
				) : (
					<div className="w-7 h-7 rounded-full bg-bgContrast50 shrink-0" />
				)}
				<span className="text-sm font-medium text-text max-w-25 truncate">{label}</span>
			</button>

			{isOpen && (
				<div
					id={menuId}
					ref={menuRef}
					role="menu"
					className="absolute top-full right-0 mt-1 bg-bgContrast25 rounded-xl shadow-lg py-1 min-w-50 z-50"
				>
					{/* アカウント一覧 (ホバーで削除ボタンを表示) */}
					<div className="border-b border-bgContrast50">
						{sortedAccounts.map((account) => (
							<AccountItem
								key={account.did}
								account={account}
								isActive={account.did === actor}
								onClick={() => handleSwitch(account.did)}
								onDelete={() => handleDelete(account.did)}
							/>
						))}
					</div>

					{/* アカウントを追加 */}
					<button
						type="button"
						role="menuitem"
						onClick={handleAddAccount}
						className="flex items-center gap-3 w-full px-4 py-3 text-left text-text hover:bg-bgContrast50 transition-colors cursor-pointer border-b border-bgContrast50"
					>
						<PlusCircle size={18} className="text-textContrastMedium shrink-0" />
						<span className="text-base">アカウントを追加</span>
					</button>

					{/* プロフィール */}
					<Link
						to={`/profile/${encodeURIComponent(actor)}`}
						role="menuitem"
						onClick={close}
						className="flex items-center gap-3 w-full px-4 py-3 text-left text-text hover:bg-bgContrast50 transition-colors border-b border-bgContrast50"
					>
						<User size={18} className="text-textContrastMedium shrink-0" />
						<span className="text-base">プロフィール</span>
					</Link>

					{/* QR コードで共有 */}
					<button
						type="button"
						role="menuitem"
						onClick={handleShowQrCode}
						className="flex items-center gap-3 w-full px-4 py-3 text-left text-text hover:bg-bgContrast50 transition-colors cursor-pointer border-b border-bgContrast50"
					>
						<QrCode size={18} className="text-textContrastMedium shrink-0" />
						<span className="text-base">QR コードで共有</span>
					</button>

					{/* ログアウト */}
					<button
						type="button"
						role="menuitem"
						onClick={handleLogout}
						className="flex items-center gap-3 w-full px-4 py-3 text-left text-text hover:bg-bgContrast50 transition-colors cursor-pointer"
					>
						<LogOut size={18} className="text-textContrastMedium shrink-0" />
						<span className="text-base">このアカウントからログアウト</span>
					</button>
				</div>
			)}

			{profile && isAtprotoDid(profile.did) && (
				<ProfileQrCodeDialog
					ref={qrDialogRef}
					did={profile.did}
					displayName={profile.displayName}
					handle={profile?.handle ?? actor}
				/>
			)}
		</div>
	);
}

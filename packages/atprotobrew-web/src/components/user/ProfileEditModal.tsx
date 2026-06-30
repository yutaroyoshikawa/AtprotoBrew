import type { Client } from "@atproto/lex";
import { ProfileEditFormContent } from "@atprotobrew/common/user/components/ProfileEditFormContent";
import {
	type EditProfileInput,
	isInvalidSwap,
	type PendingImage,
	useEditProfile,
} from "@atprotobrew/common/user/modules/useEditProfile";
import { useUserProfile } from "@atprotobrew/common/user/modules/useUserProfile";
import { useLingui } from "@lingui/react/macro";
import { useEffect, useRef, useState } from "react";
import { compressImageWeb, ImageValidationError, pickImageFile } from "../../utils/imageUtils";

interface ProfileEditModalProps {
	client: Client;
	actor: string;
	isOpen: boolean;
	onClose: () => void;
}

export function ProfileEditModal({ client, actor, isOpen, onClose }: ProfileEditModalProps) {
	const { t } = useLingui();
	const dialogRef = useRef<HTMLDialogElement>(null);
	const { mutateAsync } = useEditProfile(client, actor);
	const { data: profile } = useUserProfile(actor, client);
	const [serverError, setServerError] = useState<string | undefined>();
	const [resetKey, setResetKey] = useState(0);

	useEffect(() => {
		const dialog = dialogRef.current;

		if (!dialog) {
			return;
		}

		if (isOpen) {
			setServerError(undefined);
			setResetKey((k) => k + 1);
			dialog.showModal();
		} else {
			dialog.close();
		}
	}, [isOpen]);

	useEffect(() => {
		const dialog = dialogRef.current;

		if (!dialog) {
			return;
		}

		const handleClose = () => onClose();
		dialog.addEventListener("close", handleClose);

		return () => dialog.removeEventListener("close", handleClose);
	}, [onClose]);

	const handlePickImage = async (accept: string): Promise<PendingImage | null> => {
		const file = await pickImageFile(accept);

		if (!file) {
			return null;
		}

		try {
			return await compressImageWeb(file);
		} catch (err) {
			if (err instanceof ImageValidationError) {
				if (err.code === "INVALID_TYPE") {
					setServerError(t`JPEG、PNG、WebP のみ選択できます。`);
				} else {
					setServerError(t`画像が大きすぎます。別の画像を選んでください。`);
				}

				return null;
			}

			throw err;
		}
	};

	const handleSubmit = async (values: EditProfileInput) => {
		setServerError(undefined);

		try {
			await mutateAsync(values);
			onClose();
		} catch (err) {
			if (isInvalidSwap(err)) {
				setServerError(t`他のデバイスで更新されました。一度閉じて再度開いてください。`);
			} else {
				setServerError(t`保存に失敗しました。もう一度お試しください。`);
			}
		}
	};

	if (!profile) {
		return null;
	}

	return (
		<dialog
			ref={dialogRef}
			aria-label={t`プロフィールを編集`}
			className="w-full max-w-lg rounded-2xl bg-bg p-0 shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
			onClick={(e) => {
				if (e.target === dialogRef.current) {
					onClose();
				}
			}}
		>
			<div className="flex items-center justify-between border-b border-(--color-bg-contrast-25) px-4 py-3">
				<h2 className="text-base font-bold">{t`プロフィールを編集`}</h2>

				<button
					type="button"
					onClick={onClose}
					aria-label={t`閉じる`}
					className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-(--color-bg-contrast-25)"
				>
					<svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
						<path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
					</svg>
				</button>
			</div>

			<div className="max-h-[calc(100dvh-120px)] overflow-y-auto">
				<ProfileEditFormContent
					key={resetKey}
					profile={profile}
					onSubmit={handleSubmit}
					onCancel={onClose}
					onPickAvatar={() => handlePickImage("image/jpeg,image/png,image/webp")}
					onPickBanner={() => handlePickImage("image/jpeg,image/png,image/webp")}
					serverError={serverError}
				/>
			</div>
		</dialog>
	);
}

import type { AtprotoDid } from "@atproto/did";
import { AtprotobrewMascot } from "@atprotobrew/common/core/components/AtprotobrewMascot";
import { QrCodeDotMatrix } from "@atprotobrew/common/user/components/QrCodeDotMatrix.web";
import { useProfileQrUrl } from "@atprotobrew/common/user/modules/useProfileQrUrl";
import { QrCode as QrCodeIcon, X } from "lucide-react";
import { forwardRef, useImperativeHandle, useRef } from "react";

interface ProfileQrCodeDialogProps {
	did: AtprotoDid;
	displayName?: string;
	handle: string;
}

export interface ProfileQrCodeDialogMethods {
	showModal: () => void;
	close: () => void;
}

const QR_SIZE = 200;
const MASCOT_SIZE = 44;

export const ProfileQrCodeDialog = forwardRef<ProfileQrCodeDialogMethods, ProfileQrCodeDialogProps>(
	function ProfileQrCodeDialog({ did, displayName, handle }, ref) {
		const dialogRef = useRef<HTMLDialogElement>(null);
		const url = useProfileQrUrl(did);

		useImperativeHandle(ref, () => ({
			showModal: () => dialogRef.current?.showModal(),
			close: () => dialogRef.current?.close(),
		}));

		const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
			if (e.target === dialogRef.current) {
				dialogRef.current?.close();
			}
		};

		const handleCopy = async () => {
			await navigator.clipboard.writeText(url);
		};

		return (
			<dialog
				ref={dialogRef}
				onClick={handleBackdropClick}
				className="backdrop:bg-black/50 backdrop:backdrop-blur-sm bg-bg-contrast-25 text-text rounded-2xl shadow-xl p-0 w-80 max-w-[90vw] open:flex flex-col"
			>
				{/* ヘッダー */}
				<div className="flex items-center justify-between px-5 py-4 border-b border-bgContrast50">
					<span className="text-sm font-semibold">プロフィールを共有</span>
					<button
						type="button"
						aria-label="閉じる"
						onClick={() => dialogRef.current?.close()}
						className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-bgContrast50 transition-colors cursor-pointer text-textContrastMedium hover:text-text"
					>
						<X size={16} />
					</button>
				</div>

				{/* QR コード */}
				<div className="flex flex-col items-center gap-4 px-5 py-6">
					<div className="relative" style={{ width: QR_SIZE, height: QR_SIZE }}>
						<QrCodeDotMatrix value={url} size={QR_SIZE} />
						<div
							className="absolute bg-bgContrast25 rounded-md p-1"
							style={{
								width: MASCOT_SIZE,
								height: MASCOT_SIZE,
								top: (QR_SIZE - MASCOT_SIZE) / 2,
								left: (QR_SIZE - MASCOT_SIZE) / 2,
							}}
						>
							<AtprotobrewMascot />
						</div>
					</div>

					<div className="text-center">
						{displayName && <p className="text-sm font-semibold truncate max-w-60">{displayName}</p>}
						<p className="text-xs text-textContrastMedium truncate max-w-60">@{handle}</p>
					</div>

					<button
						type="button"
						onClick={handleCopy}
						className="flex items-center gap-2 w-full justify-center py-2.5 rounded-xl bg-bgContrast50 hover:bg-bgContrast75 text-sm font-medium transition-colors cursor-pointer"
					>
						<QrCodeIcon size={15} />
						コピー
					</button>
				</div>
			</dialog>
		);
	},
);

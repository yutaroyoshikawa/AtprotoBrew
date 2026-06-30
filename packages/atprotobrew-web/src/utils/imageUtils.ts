import type { PendingImage } from "@atprotobrew/common/user/modules/useEditProfile";

const VALID_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BLOB_BYTES = 976 * 1024;
const MAX_DIMENSION = 2000;

export class ImageValidationError extends Error {
	code: "INVALID_TYPE" | "IMAGE_TOO_LARGE";

	constructor(code: "INVALID_TYPE" | "IMAGE_TOO_LARGE") {
		super();

		this.code = code;
	}
}

export async function compressImageWeb(file: File): Promise<PendingImage> {
	if (!VALID_MIME.has(file.type)) {
		throw new ImageValidationError("INVALID_TYPE");
	}

	const img = await loadImage(file);

	let { naturalWidth: w, naturalHeight: h } = img;

	if (w > MAX_DIMENSION || h > MAX_DIMENSION) {
		const ratio = Math.min(MAX_DIMENSION / w, MAX_DIMENSION / h);
		w = Math.round(w * ratio);
		h = Math.round(h * ratio);
	}

	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;

	const ctx = canvas.getContext("2d");

	if (!ctx) {
		throw new Error("Canvas context unavailable");
	}

	ctx.drawImage(img, 0, 0, w, h);

	let quality = 0.8;

	while (quality >= 0.3) {
		const blob = await canvasToBlob(canvas, "image/jpeg", quality);

		if (blob.size <= MAX_BLOB_BYTES) {
			const data = new Uint8Array(await blob.arrayBuffer());
			const uri = URL.createObjectURL(blob);

			return { uri, data, mimeType: "image/jpeg" };
		}

		quality -= 0.1;
	}

	throw new ImageValidationError("IMAGE_TOO_LARGE");
}

function loadImage(file: File): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const img = new window.Image();

		img.onload = () => {
			URL.revokeObjectURL(url);
			resolve(img);
		};

		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error("Failed to load image"));
		};

		img.src = url;
	});
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))), type, quality);
	});
}

export function pickImageFile(accept: string): Promise<File | null> {
	return new Promise((resolve) => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = accept;
		input.onchange = () => resolve(input.files?.[0] ?? null);
		input.oncancel = () => resolve(null);
		input.click();
	});
}

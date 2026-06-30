import type { PendingImage } from "@atprotobrew/common/user/modules/useEditProfile";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";

const MAX_BLOB_BYTES = 976 * 1024;

async function compressToLimit(uri: string, maxWidth: number): Promise<PendingImage> {
	let quality = 0.8;

	while (quality >= 0.3) {
		const result = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: maxWidth } }], {
			compress: quality,
			format: ImageManipulator.SaveFormat.JPEG,
		});

		const response = await fetch(result.uri);
		const arrayBuffer = await response.arrayBuffer();

		if (arrayBuffer.byteLength <= MAX_BLOB_BYTES) {
			return {
				uri: result.uri,
				data: new Uint8Array(arrayBuffer),
				mimeType: "image/jpeg",
			};
		}

		quality -= 0.1;
	}

	throw Object.assign(new Error("Image too large to compress within 1 MB"), { code: "IMAGE_TOO_LARGE" });
}

export async function pickAvatar(): Promise<PendingImage | null> {
	const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();

	if (!granted) {
		return null;
	}

	const result = await ImagePicker.launchImageLibraryAsync({
		mediaTypes: ["images"],
		allowsEditing: true,
		aspect: [1, 1],
		quality: 1,
	});

	if (result.canceled || !result.assets[0]) {
		return null;
	}

	return compressToLimit(result.assets[0].uri, 1000);
}

export async function pickBanner(): Promise<PendingImage | null> {
	const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();

	if (!granted) {
		return null;
	}

	const result = await ImagePicker.launchImageLibraryAsync({
		mediaTypes: ["images"],
		allowsEditing: true,
		aspect: [3, 1],
		quality: 1,
	});

	if (result.canceled || !result.assets[0]) {
		return null;
	}

	return compressToLimit(result.assets[0].uri, 3000);
}

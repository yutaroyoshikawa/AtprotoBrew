import type { TextStyle, ViewStyle } from "react-native";
import { Platform } from "react-native";

type Style = ViewStyle | TextStyle;

export const web = (s: Style): Style => (Platform.OS === "web" ? s : {});
export const native = (s: Style): Style => (Platform.OS !== "web" ? s : {});
export const ios = (s: Style): Style => (Platform.OS === "ios" ? s : {});
export const android = (s: Style): Style => (Platform.OS === "android" ? s : {});

export function platform(variants: { web?: Style; ios?: Style; android?: Style; native?: Style }): Style {
	if (Platform.OS === "web" && variants.web) {
		return variants.web;
	}
	if (Platform.OS === "ios" && variants.ios) {
		return variants.ios;
	}
	if (Platform.OS === "android" && variants.android) {
		return variants.android;
	}
	if (Platform.OS !== "web" && variants.native) {
		return variants.native;
	}
	return {};
}

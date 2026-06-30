import { withAndroidManifest, withDangerousMod, withProjectBuildGradle, withStringsXml } from "@expo/config-plugins";
import type { ExpoConfig } from "expo/config";
import type { WithAndroidWidgetsParams } from "react-native-android-widget";

const widgetConfig: WithAndroidWidgetsParams = {
	widgets: [
		{
			name: "LauncherWidgetView",
			label: "Atprotobrew Launcher",
			minWidth: "110dp",
			minHeight: "110dp",
			targetCellWidth: 4,
			targetCellHeight: 2,
			resizeMode: "horizontal|vertical",
			description: "AT Protocol サービスのランチャー",
			previewImage: "./assets/images/android-widget-thumbnail.png",
		},
	],
};

const baseConfig: ExpoConfig = {
	name: "Atprotobrew",
	slug: "atprotobrew-app",
	version: "1.0.0",
	orientation: "portrait",
	icon: "./assets/images/icon.png",
	scheme: ["org.tarororo.brew", "atprotobrew"],
	userInterfaceStyle: "automatic",
	ios: {
		googleServicesFile: process.env.GOOGLE_SERVICES_INFO_PLIST ?? "./GoogleService-Info.plist",
		supportsTablet: true,
		bundleIdentifier: "org.tarororo.brew",
		associatedDomains: ["applinks:brew.tarororo.org"],
		infoPlist: {
			ITSAppUsesNonExemptEncryption: false,
		},
	},
	android: {
		googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
		adaptiveIcon: {
			backgroundColor: "#E6F4FE",
			foregroundImage: "./assets/images/android-icon-foreground.png",
			backgroundImage: "./assets/images/android-icon-background.png",
			monochromeImage: "./assets/images/android-icon-monochrome.png",
		},
		intentFilters: [
			{
				action: "VIEW",
				autoVerify: true,
				data: [
					{
						scheme: "https",
						host: "brew.tarororo.org",
						pathPrefix: "/profile",
					},
				],
				category: ["BROWSABLE", "DEFAULT"],
			},
			{
				action: "VIEW",
				autoVerify: true,
				data: [
					{
						scheme: "https",
						host: "brew.tarororo.org",
						path: "/atpassport/callback",
					},
				],
				category: ["BROWSABLE", "DEFAULT"],
			},
		],
		predictiveBackGestureEnabled: false,
		package: "org.tarororo.brew",
	},
	web: {
		output: "static",
		favicon: "./assets/images/favicon.png",
	},
	plugins: [
		"expo-router",
		[
			"expo-splash-screen",
			{
				image: "./assets/images/splash-icon.png",
				imageWidth: 200,
				resizeMode: "contain",
				backgroundColor: "#B9E8F3",
				dark: {
					backgroundColor: "#022945",
				},
			},
		],
		"expo-image",
		[
			"expo-image-picker",
			{
				photosPermission: "プロフィール写真を選択するために写真へのアクセスが必要です。",
				cameraPermission: "プロフィール写真を撮影するためにカメラへのアクセスが必要です。",
			},
		],
		"expo-web-browser",
		"@react-native-firebase/app",
		[
			"expo-build-properties",
			{
				ios: {
					useFrameworks: "static",
					newArchEnabled: true,
				},
				android: { newArchEnabled: true },
			},
		],
		["react-native-android-widget", widgetConfig],
		[
			"expo-widgets",
			{
				widgets: [
					{
						name: "LauncherWidget",
						displayName: "AtprotoBrew Launcher",
						description: "AT Protocol サービスのランチャー",
						supportedFamilies: ["systemSmall", "systemMedium", "systemLarge"],
					},
				],
			},
		],
	],
	experiments: {
		typedRoutes: true,
		reactCompiler: true,
	},
	extra: {
		router: {},
		eas: {
			projectId: "63a971a5-2562-4365-ba5c-6840572bcaee",
		},
	},
};

// react-native-android-widget が AndroidManifest に @string/launcher_widget_display_name /
// @string/launcher_widget_description を埋め込むが strings.xml に追加しないバグの workaround
const withWidgetStrings = (c: ExpoConfig) =>
	withStringsXml(c as Parameters<typeof withStringsXml>[0], (mod) => {
		const strings = mod.modResults.resources.string ?? [];
		const add = (name: string, value: string) => {
			if (!strings.find((s) => s.$?.name === name)) {
				strings.push({ $: { name, translatable: "false" }, _: value });
			}
		};
		add("launcher_widget_display_name", "AtprotoBrew Launcher");
		add("launcher_widget_description", "AT Protocol サービスのランチャー");
		return mod;
	});

// react-native-android-widget が minWidth を 180dp に上書きするため正しい値に戻す
const withWidgetMinWidth = (c: ExpoConfig) =>
	withDangerousMod(c as Parameters<typeof withDangerousMod>[0], [
		"android",
		async (mod) => {
			const path = require("node:path");
			const fs = require("node:fs/promises");
			const xmlPath = path.join(
				mod.modRequest.projectRoot,
				"android/app/src/main/res/xml/launcher_widget_info.xml",
			);
			const xml = await fs.readFile(xmlPath, "utf8");
			await fs.writeFile(xmlPath, xml.replace(/android:minWidth="[^"]*"/, 'android:minWidth="110dp"'));
			return mod;
		},
	]);

// work-runtime 2.8+ merged KTX classes。古いバージョンが混在するとクラス重複エラーになるため統一する
const withWorkRuntimeFix = (c: ExpoConfig) =>
	withProjectBuildGradle(c as Parameters<typeof withProjectBuildGradle>[0], (mod) => {
		if (!mod.modResults.contents.includes("work-runtime-ktx")) {
			mod.modResults.contents += `
// Force consistent androidx.work versions (work-runtime 2.8+ merged KTX classes)
allprojects {
  configurations.all {
    resolutionStrategy {
      force 'androidx.work:work-runtime:2.8.1'
      force 'androidx.work:work-runtime-ktx:2.8.1'
    }
  }
}
`;
		}
		return mod;
	});

// expo-widgets は iOS 専用だが config plugin が Android manifest にも receiver を登録する。
// Android widget picker に "LauncherWidget" として現れ誤選択を招くため除外する。
const withRemoveExpoWidgetsAndroidReceiver = (c: ExpoConfig) =>
	withAndroidManifest(c as Parameters<typeof withAndroidManifest>[0], (mod) => {
		const app = mod.modResults.manifest.application?.[0];
		if (app?.receiver) {
			app.receiver = app.receiver.filter((r) => r.$?.["android:name"] !== ".LauncherWidgetProvider");
		}
		return mod;
	});

export default withRemoveExpoWidgetsAndroidReceiver(
	withWorkRuntimeFix(withWidgetMinWidth(withWidgetStrings(baseConfig))),
);

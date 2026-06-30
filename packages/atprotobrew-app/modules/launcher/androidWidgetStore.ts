import type { WidgetLauncherSnapshot } from "@atprotobrew/common/launcher/widgetTypes";
import { Directory, File, Paths } from "expo-file-system";

function widgetDir(): Directory {
	return new Directory(Paths.document, "widget");
}

function dataFile(): File {
	return new File(Paths.document, "widget", "widget_data.json");
}

function isWidgetLauncherSnapshot(value: unknown): value is WidgetLauncherSnapshot {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	if (!("version" in value) || value.version !== 1) {
		return false;
	}

	if (!("state" in value)) {
		return false;
	}

	return true;
}

export const AndroidWidgetStore = {
	writeSnapshot(snapshot: WidgetLauncherSnapshot): void {
		widgetDir().create({ intermediates: true, idempotent: true });
		dataFile().write(JSON.stringify(snapshot));
	},

	clearSnapshot(): void {
		const file = dataFile();
		if (file.exists) {
			file.delete();
		}
	},

	async loadSnapshot(): Promise<WidgetLauncherSnapshot | null> {
		const file = dataFile();

		if (!file.exists) {
			return null;
		}

		try {
			const parsed: unknown = await file.json();

			if (!isWidgetLauncherSnapshot(parsed)) {
				return null;
			}

			return parsed;
		} catch {
			return null;
		}
	},
};

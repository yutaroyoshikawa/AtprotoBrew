import * as org from "@atprotobrew/atproto/lexicons/org";

export function parseLauncer(data: unknown) {
	return org.tarororo.brew.launcher.item.validate(data);
}

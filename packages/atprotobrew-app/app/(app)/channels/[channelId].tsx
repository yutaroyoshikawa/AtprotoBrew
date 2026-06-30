import type { OAuthSession } from "@atproto/oauth-client-expo";
import { useFetchLaunchers } from "@atprotobrew/common/channel/modules/launchersHooks";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Suspense } from "react";
import { ChannelLaunchScreen } from "../../../components/ChannelLaunchScreen";
import { useAuthContext } from "../../../modules/auth/AuthProvider";

export default function Screen() {
	const { authState } = useAuthContext();

	if (authState.status !== "authenticated") {
		return null;
	}

	return (
		<Suspense>
			<ChannelScreenContent session={authState.session} />
		</Suspense>
	);
}

interface ChannelScreenContentProps {
	session: OAuthSession;
}

function ChannelScreenContent({ session }: ChannelScreenContentProps) {
	const router = useRouter();
	const { channelId } = useLocalSearchParams<{ channelId: string }>();

	const { data } = useFetchLaunchers({ agent: session });

	const item = data.body.items.find((i) => i.title === channelId);

	if (!item) {
		return null;
	}

	const handleLaunch = async () => {
		if ("link" in item.launch) {
			await WebBrowser.openAuthSessionAsync(item.launch.link);
		} else {
			router.push("/(app)/store");
		}
	};

	return <ChannelLaunchScreen item={item} onLaunch={handleLaunch} />;
}

import type { AtprotoDid } from "@atproto/did";
import type { Agent } from "@atproto/lex";
import { atoms as a } from "@atprotobrew/common/alf";
import { SocialGraphList } from "@atprotobrew/common/user/components/SocialGraphList";
import { router } from "expo-router";
import { View } from "react-native";

interface SocialGraphListWithNavProps {
	actor: string;
	agent: Agent;
	currentUserDid: AtprotoDid;
	initialTab?: "follows" | "followers";
}

export function SocialGraphListWithNav({ actor, agent, currentUserDid, initialTab }: SocialGraphListWithNavProps) {
	return (
		<View style={[a.h_full, a.w_full]}>
			<SocialGraphList
				actor={actor}
				agent={agent}
				currentUserDid={currentUserDid}
				initialTab={initialTab}
				onNavigateToProfile={(did) => router.push({ pathname: "/(app)/profile/[did]", params: { did } })}
			/>
		</View>
	);
}

import type { Client } from "@atproto/lex";
import { isAtprotoDid } from "@atproto/oauth-client-browser";
import { Trans } from "@lingui/react/macro";
import { useParams } from "react-router-dom";
import { ProfilePageLayout } from "./ProfilePageLayout";
import { SocialGraph } from "./SocialGraph";

interface UserProfileFollowsProps {
	client: Client;
	currentUserDid: string;
}

export function UserProfileFollows({ client, currentUserDid }: UserProfileFollowsProps) {
	const { did } = useParams<{ did: string }>();

	if (!did || !isAtprotoDid(did) || !isAtprotoDid(currentUserDid)) {
		return null;
	}

	return (
		<ProfilePageLayout backTo={`/profile/${encodeURIComponent(did)}`} title={<Trans>フォロー中</Trans>}>
			<SocialGraph client={client} currentUserDid={currentUserDid} actor={did} initialTab="follows" />
		</ProfilePageLayout>
	);
}

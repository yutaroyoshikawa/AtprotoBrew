import type { Client } from "@atproto/lex";
import { UserProfileView } from "@atprotobrew/common/user/components/UserProfileView";
import { Trans } from "@lingui/react/macro";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProfileEditModal } from "./ProfileEditModal";
import { ProfilePageLayout } from "./ProfilePageLayout";

interface UserProfileProps {
	client: Client | undefined;
	currentUserDid: string | undefined;
}

export function UserProfile({ client, currentUserDid }: UserProfileProps) {
	const { did } = useParams<{ did: string }>();
	const navigate = useNavigate();
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	if (!did) {
		return null;
	}

	const isOwnProfile = did === currentUserDid;
	const encodedDid = encodeURIComponent(did);

	return (
		<ProfilePageLayout backTo="/" title={<Trans>プロフィール</Trans>}>
			<UserProfileView
				actor={did}
				agent={client}
				currentUserDid={currentUserDid}
				onNavigateToFollows={() => navigate(`/profile/${encodedDid}/follows`)}
				onNavigateToFollowers={() => navigate(`/profile/${encodedDid}/followers`)}
				onEditProfile={isOwnProfile && client ? () => setIsEditModalOpen(true) : undefined}
			/>

			{isOwnProfile && client && (
				<ProfileEditModal
					client={client}
					actor={did}
					isOpen={isEditModalOpen}
					onClose={() => setIsEditModalOpen(false)}
				/>
			)}
		</ProfilePageLayout>
	);
}

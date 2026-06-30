import type { AtprotoDid } from "@atproto/did";
import type { Client } from "@atproto/lex";
import { FollowButton } from "@atprotobrew/common/user/components/FollowButton";
import { useFollowActions } from "@atprotobrew/common/user/modules/useFollowActions";
import { type SocialGraphProfile, useFollowers, useFollows } from "@atprotobrew/common/user/modules/useSocialGraph";
import { useUserProfile } from "@atprotobrew/common/user/modules/useUserProfile";
import { Trans, useLingui } from "@lingui/react/macro";
import { QrCode } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ProfileQrCodeDialog, type ProfileQrCodeDialogMethods } from "./ProfileQrCodeDialog";

type Tab = "follows" | "followers";

interface SocialGraphProps {
	client: Client;
	currentUserDid: AtprotoDid;
	actor?: AtprotoDid;
	initialTab?: Tab;
}

export function SocialGraph({ client, currentUserDid, actor, initialTab = "follows" }: SocialGraphProps) {
	const { t } = useLingui();
	const [activeTab, setActiveTab] = useState<Tab>(initialTab);
	const qrDialogRef = useRef<ProfileQrCodeDialogMethods>(null);
	const targetActor = actor ?? currentUserDid;
	const { data: profile } = useUserProfile(currentUserDid);

	const followsQuery = useFollows(targetActor, client);
	const followersQuery = useFollowers(targetActor, client);
	const { handleFollow, handleUnfollow, resolvedFollowUri, isMutating } = useFollowActions(client);

	const activeQuery = activeTab === "follows" ? followsQuery : followersQuery;

	const profiles: SocialGraphProfile[] =
		activeTab === "follows"
			? (followsQuery.data?.pages.flatMap((page) => page.follows) ?? [])
			: (followersQuery.data?.pages.flatMap((page) => page.followers) ?? []);

	return (
		<div className="flex flex-col flex-1">
			{/* ページヘッダー */}
			<div className="flex items-center justify-between px-4 py-3 border-b border-bgContrast25">
				<span className="text-sm font-semibold text-text">{t`ソーシャルグラフ`}</span>
				<button
					type="button"
					aria-label={t`QR コードで共有`}
					onClick={() => qrDialogRef.current?.showModal()}
					className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-bgContrast50 transition-colors cursor-pointer text-textContrastMedium hover:text-text"
				>
					<QrCode size={18} />
				</button>
			</div>

			<ProfileQrCodeDialog
				ref={qrDialogRef}
				did={currentUserDid}
				displayName={profile?.displayName}
				handle={profile?.handle ?? currentUserDid}
			/>

			<div className="flex border-b border-bgContrast25">
				{(["follows", "followers"] as const).map((tab) => (
					<button
						key={tab}
						type="button"
						onClick={() => setActiveTab(tab)}
						className={[
							"flex-1 py-3 text-sm font-medium transition-colors border-b-2",
							activeTab === tab
								? "text-accent border-accent"
								: "text-textContrastMedium border-transparent hover:text-text",
						].join(" ")}
					>
						{tab === "follows" ? <Trans>フォロー中</Trans> : <Trans>フォロワー</Trans>}
					</button>
				))}
			</div>

			<div className="flex-1">
				{activeQuery.isPending ? (
					<div className="flex justify-center items-center py-12">
						<div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
					</div>
				) : activeQuery.isError ? (
					<div className="flex justify-center items-center py-12">
						<p className="text-textContrastMedium text-sm">
							<Trans>読み込みエラー</Trans>
						</p>
					</div>
				) : profiles.length === 0 ? (
					<div className="flex justify-center items-center py-12">
						<p className="text-textContrastMedium text-sm">
							{activeTab === "follows" ? (
								<Trans>フォロー中のユーザーがいません</Trans>
							) : (
								<Trans>フォロワーがいません</Trans>
							)}
						</p>
					</div>
				) : (
					<ul>
						{profiles.map((profile) => {
							const followUri = resolvedFollowUri(profile);
							const isFollowing = followUri !== null;
							const isSelf = currentUserDid === profile.did;
							const isMut = isMutating(profile.did);
							const displayName = profile.displayName ?? profile.handle;

							return (
								<li
									key={profile.did}
									className="flex items-center gap-3 px-4 py-3 border-b border-bgContrast25"
								>
									<Link
										to={`/profile/${encodeURIComponent(profile.did)}`}
										className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
									>
										{profile.avatar ? (
											<img
												src={profile.avatar}
												alt=""
												className="w-10 h-10 rounded-full object-cover shrink-0"
											/>
										) : (
											<div className="w-10 h-10 rounded-full bg-bgContrast50 shrink-0" />
										)}

										<div className="min-w-0">
											<p className="text-sm font-semibold text-text truncate">{displayName}</p>
											<p className="text-xs text-textContrastMedium truncate">
												@{profile.handle}
											</p>
										</div>
									</Link>

									{!isSelf && (
										<FollowButton
											isFollowing={isFollowing}
											isMutating={isMut}
											onPress={() => {
												if (isFollowing && followUri) {
													handleUnfollow(profile.did, followUri);
												} else {
													handleFollow(profile.did);
												}
											}}
											size="sm"
										/>
									)}
								</li>
							);
						})}

						{activeQuery.hasNextPage && (
							<li className="flex justify-center py-4">
								<button
									type="button"
									onClick={() => activeQuery.fetchNextPage()}
									disabled={activeQuery.isFetchingNextPage}
									className="px-6 py-2 text-sm text-primary border border-accent rounded-full hover:bg-accent/10 transition-colors disabled:opacity-50"
								>
									{activeQuery.isFetchingNextPage ? (
										<span className="inline-block w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
									) : (
										<Trans>もっと見る</Trans>
									)}
								</button>
							</li>
						)}
					</ul>
				)}
			</div>
		</div>
	);
}

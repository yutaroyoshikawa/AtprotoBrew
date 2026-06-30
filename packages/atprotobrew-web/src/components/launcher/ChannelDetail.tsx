import type { Client } from "@atproto/lex";
import { useFetchLaunchers } from "@atprotobrew/common/channel/modules/launchersHooks";
import { AppButton } from "@atprotobrew/common/core/components/AppButton";
import { AppH1 } from "@atprotobrew/common/core/components/AppH1";
import { AppText } from "@atprotobrew/common/core/components/AppText";
import { Link, useParams } from "react-router-dom";

interface Props {
	client: Client;
}

export function ChannelDetail({ client }: Props) {
	const { id } = useParams<{ id: string }>();

	const { data } = useFetchLaunchers({ agent: client });

	const targetLauncher = data.body.items.find((item) => item.title === id);

	if (!targetLauncher) {
		return null;
	}

	const link = "link" in targetLauncher.launch ? targetLauncher.launch.link : null;

	return (
		<div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4">
			<div className="bg-bg-contrast-50 rounded-3xl shadow-lg px-8 py-10 flex flex-col items-center gap-6 max-w-sm w-full">
				<div className="w-24 h-24 bg-bg-contrast-25 rounded-3xl flex items-center justify-center shadow-md">
					<img src={targetLauncher.thumbnail} width={60} height={60} />
				</div>
				<span className="text-text text-4xl font-bold">{targetLauncher.description}</span>

				<div className="text-center">
					<AppH1>{targetLauncher.title}</AppH1>
					{link && <p className="text-text-contrast-low text-sm mt-1">{link}</p>}
				</div>

				{link && (
					<a
						href={link}
						target="_blank"
						rel="noopener noreferrer"
						className="w-full bg-primary hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-xl py-3 px-6 text-center transition-colors duration-150"
					>
						起動する
					</a>
				)}

				<AppButton render={(props) => <Link {...props} to="/" />}>
					<AppText>← ホームに戻る</AppText>
				</AppButton>
			</div>
		</div>
	);
}

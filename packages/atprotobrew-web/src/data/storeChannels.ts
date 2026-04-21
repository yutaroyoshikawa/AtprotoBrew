import type { StoreChannel } from "../types/channel";

export const STORE_CHANNELS: StoreChannel[] = [
	{
		id: "bluesky",
		letter: "B",
		color: "#0085ff",
		name: "Bluesky",
		url: "https://bsky.app",
		developer: "Bluesky PBC",
		version: "1.0.0",
		description:
			"Bluesky は、AT Protocol 上に構築されたソーシャルネットワークです。分散型のマイクロブログプラットフォームで、自分のデータを所有しながら世界中の人々とつながることができます。",
		updatedAt: "2024-04-01",
		changeLog: "フィード機能の改善、パフォーマンスの向上、UIの調整",
	},
	{
		id: "tokimeki",
		letter: "T",
		color: "#ff6b6b",
		name: "Tokimeki",
		url: "https://tokimeki.blue",
		developer: "Tokimeki Team",
		version: "2.1.0",
		description:
			"Tokimeki は AT Protocol 向けの洗練されたウェブクライアントです。美しいインターフェースで Bluesky を楽しめます。カスタムフィードや高度な検索機能を備えています。",
		updatedAt: "2024-03-15",
		changeLog: "スレッド表示の改善、通知機能の強化",
	},
	{
		id: "whitewind",
		letter: "W",
		color: "#34c759",
		name: "WhiteWind",
		url: "https://whtwnd.com",
		developer: "WhiteWind",
		version: "1.2.0",
		description:
			"WhiteWind は AT Protocol 上のブログプラットフォームです。長文コンテンツを AT Protocol のエコシステム内で公開・共有することができます。",
		updatedAt: "2024-02-20",
		changeLog: "マークダウンエディタの改善、画像アップロード機能追加",
	},
	{
		id: "frontpage",
		letter: "F",
		color: "#ff9500",
		name: "Frontpage",
		url: "https://frontpage.fyi",
		developer: "Frontpage",
		version: "0.9.0",
		description:
			"Frontpage は AT Protocol 上のリンク共有・ディスカッションプラットフォームです。Hacker News や Reddit のような体験を分散型で実現します。",
		updatedAt: "2024-04-01",
		changeLog: "投票システムの改善、コメント機能の強化",
	},
	{
		id: "pdsls",
		letter: "P",
		color: "#8b5cf6",
		name: "PDSls",
		url: "https://pds.blue",
		developer: "PDSls Team",
		version: "1.0.0",
		description:
			"PDSls は AT Protocol の PDS（Personal Data Server）を閲覧・管理するツールです。自分のデータリポジトリを直接確認できます。",
		updatedAt: "2024-03-01",
		changeLog: "レコード閲覧機能の強化、エクスポート機能追加",
	},
	{
		id: "skymemes",
		letter: "S",
		color: "#ec4899",
		name: "SkyMemes",
		url: "https://skymemes.app",
		developer: "SkyMemes",
		version: "0.5.0",
		description:
			"SkyMemes は Bluesky コミュニティのミームや面白いコンテンツを集めたエンターテインメントプラットフォームです。",
		updatedAt: "2024-04-10",
		changeLog: "新しいミームテンプレート追加、シェア機能改善",
	},
];

1. Feature Module分割: XRPCやWebhookをドメイン単位の`register...`関数に分離してルーティングを組み立てる
2. Application Service + Repository: `StoreItem`の読み書きをサービス層/永続化層に切り出す
3. DTO Mapper/Assembler: DBレコードからレスポンスへの変換を専用関数に集約する
4. Automation Registry/Strategy: lexiconごとの検証と処理を戦略として登録する
5. Auth Pipeline: JWT検証の各ステップを小さな関数に分けて合成可能にする
6. Signature Middleware: Airglow署名検証をミドルウェア化して責務を分離する
7. Port/Adapter: DID解決をポート化してキャッシュ戦略やテスト差し替えを容易にする
8. Composition Root/DI: 依存注入を`createApp`に集約してエントリを薄く保つ
9. Directory structure (adapters policy):
	 - src/
		 - adapters/
			 - xrpc/
				 - handlers/
				 - validators/
				 - dto/
			 - airglow/
				 - handlers/
				 - validators/
				 - middleware/  # signature verify
		 - modules/
			 - storeItem/
				 - repository.ts
				 - mapper.ts
				 - validators.ts
			 - launcher/
				 - repository.ts
				 - mapper.ts
		 - infra/
			 - db/
			 - auth/
			 - resolver/
		 - app.ts  # createApp
		 - index.ts  # entry

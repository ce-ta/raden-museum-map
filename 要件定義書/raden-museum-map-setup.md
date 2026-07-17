# セットアップ手順：でん同士美術館マップ（仮称）

[実装方針](raden-museum-map-implementation-plan.md)に基づき、プロジェクトのひな型を作るためのコマンドと各手順をまとめる。

## 0. 前提

- Node.js（LTS版）がインストール済みであること
- Postgresは「ローカルに立てる」か「無料の外部サービスを使う」かのどちらか。個人開発規模かつ本番もVercelにデプロイする想定なので、**Neon**（無料枠あり、Vercelとの相性が良い）を使う方法を軸に、ローカルDocker案も併記する

## 1. Next.jsプロジェクトのひな型作成

```bash
npx create-next-app@latest raden-museum-map --typescript --app --eslint
cd raden-museum-map
```

プロンプトで聞かれる項目（Tailwind、`src/`ディレクトリ、import alias等）は好みで選んでよい。デザインライブラリは要件定義書に指定がないので任意。

## 2. Postgresのセットアップ

### Neon（無料の外部Postgres、おすすめ）

1. https://neon.tech でアカウント作成し、新規プロジェクトを作成
2. 発行される接続文字列（`postgresql://user:password@host/dbname?sslmode=require` の形式）をコピー
3. プロジェクト直下に `.env` を作成し、以下を記載

```bash
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
```

## 3. Prisma導入

```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

`npx prisma init` で `prisma/schema.prisma` と `.env`（未作成なら）が生成される。生成された `schema.prisma` の `datasource` を以下のように確認・修正する。

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

```bash
npx prisma migrate dev --name init
```

`prisma migrate dev` は自動的に `@prisma/client` の再生成（`prisma generate`）も行う。

## 4. 主要ライブラリの導入

```bash
npm install react-leaflet leaflet
npm install -D @types/leaflet
npm install zod
```

## 5. seedスクリプトの準備

`prisma/seed.ts` を作成し、`package.json` に以下を追記する。

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

```bash
npm install -D tsx
npx prisma db seed
```

## 6. 動作確認

```bash
npm run dev
```

`http://localhost:3000` にアクセスしてHello Worldページが表示されればOK。Prisma Studioでデータを直接確認したい場合は以下を使う。

```bash
npx prisma studio
```

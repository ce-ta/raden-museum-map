# 実装方針：でん同士美術館マップ（仮称）

プロトタイプ自体は学習のため自分で実装する。ここではDB設計・使用ライブラリ・進め方の指針だけを整理する。

## 1. DB設計

3テーブル構成にする。「美術館」「公式コラボ情報」「リスナー報告」を分けているのは、公式コラボは0〜1件（美術館ごとに基本1つ）、リスナー報告は複数という関係の違いをそのまま表すため。

```prisma
model Museum {
  id        String   @id @default(cuid())
  name      String
  address   String
  lat       Float
  lng       Float
  createdAt DateTime @default(now())

  collaborations OfficialCollaboration[]
  reports        Report[]
}

model OfficialCollaboration {
  id          String    @id @default(cuid())
  museumId    String
  museum      Museum    @relation(fields: [museumId], references: [id])
  title       String    // 例: 「特別展〇〇 音声ガイド出演」
  description String?
  sourceUrl   String    // 出典（美術館公式Xの投稿など）
  date        DateTime?
}

model Report {
  id        String       @id @default(cuid())
  museumId  String
  museum    Museum       @relation(fields: [museumId], references: [id])
  body      String
  photoUrl  String?
  status    ReportStatus @default(PENDING)
  createdAt DateTime     @default(now())
}

enum ReportStatus {
  PENDING   // 投稿直後、非公開
  PUBLISHED // 承認済み、地図・詳細ページに表示
  HIDDEN    // 通報等により非表示
}
```

補足:
- 地図のピン色分け（公式コラボ／リスナー訪問のみ）は、`Museum.collaborations` が1件以上あるかどうかで判定すればよく、専用フラグは持たせなくてよい
- モデレーションは要件定義書の「事前承認制か事後通報制か」というTODOに対応する形で `ReportStatus` を用意している。事後通報制にするならデフォルトを `PUBLISHED` にし、通報されたら `HIDDEN` にする運用に変えられる

## 2. 使用ライブラリ

| 用途 | ライブラリ | 補足 |
|---|---|---|
| フレームワーク | Next.js (App Router) + TypeScript | 学習目的にも合う |
| DB | Postgres |  |
| 地図表示 | `react-leaflet` + `leaflet`（タイルはOpenStreetMap） | Google Maps APIと違いAPIキー不要・無料 |
| ジオコーディング | Nominatim（OSM提供の無料API） | ライブラリ不要、`fetch`で直接叩けば足りる |
| フォームバリデーション | `zod` | 投稿フォームの入力チェックに。学習素材としても手頃 |
| 画像 | 最初は文字列（URL）で保持 | アップロード機能は後回しでよい。作り込むなら `Vercel Blob` 等 |

## 3. 進め方（学習しやすい順）

いきなり地図から作らず、まずDBとデータ表示だけをシンプルに固めてから地図に発展させる進め方を推奨する。

1. Next.js + TypeScriptプロジェクトを作り、Hello Worldページで動作確認
2. Prisma導入。`Museum` / `OfficialCollaboration` / `Report` モデルを定義
3. seedスクリプトで美術館・報告・公式コラボのダミーデータを数件投入
4. トップページで、地図なしの単純な美術館一覧（名前・住所のリスト）をDBから取得して表示。ここでデータ取得の流れを固める
5. `react-leaflet` を導入し、一覧表示を地図＋ピン表示に置き換える。ピンの色分け（公式コラボ／リスナー訪問のみ）もここで実装
6. 美術館詳細ページ（`/museums/[id]`）を実装。公式コラボ情報セクション・リスナー報告一覧を表示
7. 投稿フォームを実装。Server Actions（またはAPI Route）経由でDBに書き込む。まずは `status: PENDING` で保存するだけでよい
8. 新規美術館登録時のジオコーディング（Nominatimで住所→緯度経度）を実装
9. モデレーション（`status` を切り替える簡易管理画面）を実装

## 4. 今後決めること（実装時に判断）

- モデレーションを事前承認制／事後通報制のどちらにするか（要件定義書のTODOと連動、`ReportStatus`のデフォルト値に影響）
- 画像アップロードを本格導入するタイミング（最初はURL貼り付けで代用してもよい）

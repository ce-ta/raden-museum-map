# app ディレクトリ構成

```
app/
├── layout.tsx                          # ルートレイアウト
├── page.tsx                            # トップページ
├── globals.css                         # グローバルスタイル
├── favicon.ico
├── api/                                # APIルート
│   ├── museums/
│   │   ├── route.ts                    # 美術館一覧 API
│   │   └── [id]/
│   │       └── route.ts                # 美術館詳細 API
│   └── reports/
├── museums/
│   └── [id]/
│       └── page.tsx                    # 美術館詳細ページ
└── generated/
    └── prisma/                         # Prisma Client 自動生成コード
```
component/
├── map/
|    ├── MapView.tsx                     # 地図コンポーネント
|    └── MuseumMarker.tsx                # 地図に表示するマーカー(ピン)コンポーネント
└── museum/
     ├── CollaborationList.tsx           # らでんさんとコラボした美術館一覧（コラボ美術館はピンの色を変えてもいいかも）
     ├── MuseumCard.tsx                  # 地図上のピンをホバー（又はクリック）したときに表示する美術館の簡易情報
     ├── ReportForm.tsx                  # リスナーが訪れた美術館を投稿する作成フォーム（Twitterの投稿を張り付けるだけで完了する対応も必要）
     └── ReportList.tsx                  # リスナー投稿の情報を一覧表示する（MuseumCard.tsxのリンクを踏んだらモーダル表示させる）
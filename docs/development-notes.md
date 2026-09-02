# 開発メモ

## Prisma: スキーマ / DB / Client の3つの関係

`prisma/schema.prisma` を編集しただけでは何も反映されない。以下の3つは別物。

| # | 対象 | 内容 | 更新方法 |
|---|---|---|---|
| 1 | `prisma/schema.prisma` | テーブルの設計図（テキスト） | 手で編集 |
| 2 | 実際の DB（PostgreSQL） | 実テーブルの構造。`CREATE TABLE` 等 | `npx prisma migrate dev` |
| 3 | `app/generated/prisma`（Prisma Client） | `prisma.adminUser.findUnique(...)` 等の TypeScript コードを自動生成 | `npx prisma generate` |

- `schema.prisma` が「正」。そこから DB と Client の両方へ反映して初めて噛み合う。
- 2 を忘れる → 実行時に DB から「そんなテーブル無い」エラー。
- 3 を忘れる → `prisma.xxx` が `undefined`（`TypeError: Cannot read properties of undefined (reading 'findUnique')`）。

### 実務

- スキーマ編集後は **`npx prisma migrate dev` 1本でOK**（migrate と generate の両方が走る）。
- `npx prisma generate` 単体は、`node_modules` 再インストール後など DB は変えず Client だけ作り直したいとき。
  このプロジェクトは `package.json` の `postinstall` で自動実行される。

## 管理者アカウント（AdminUser）

- 管理者は複数。アプリ上での新規作成・PW変更 UI は作らない（照合のみ）。
- 管理者の追加 / PW変更は **システム管理者（1人）が CLI で行う**（案A）。
  サーバー/リポジトリにアクセスしてコマンドを打てること自体が権限の証明。
- スクリプト: `npx tsx scripts/create-admin.ts <username>`
  - 新規 username なら作成、既存ならパスワードのみ更新（upsert）。
  - パスワードは対話入力し、`bcrypt.hash(pw, 12)` で保存。
  - 初期の1人目もこのスクリプトで作る（seed.ts への追記は不要）。
- パスワードは平文保存しない。`passwordHash` カラムに bcrypt ハッシュのみ。
- ログイン照合は `bcrypt.compare(入力PW, user.passwordHash)`。

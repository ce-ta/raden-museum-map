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

## 管理者画面のルーティング制御 / セッション

未ログインで `/admin` を直接開いたらログイン画面へ飛ばす仕組み。
「proxy による楽観的リダイレクト」＋「layout による本チェック」の2層構成（Next.js 公式の認証ガイドに準拠）。

### 前提知識

- **Next.js 16 では `middleware.ts` が `proxy.ts` に改名**された（機能は同じ）。
- proxy は prefetch を含む全リクエストで走るので、重い処理は禁物。**Cookie の有無だけ**を見る。
- proxy は本物の防御ではない（Cookie は偽造・改ざん可能）。トークンの正当性は必ずサーバー側でも検証する。
- セッションは**ステートレス方式**を採用: セッションの実体は署名付き JWT で、それを httpOnly Cookie に入れるだけ。DB にセッションテーブルは持たない。

### 実装手順

1. **依存追加**: `npm i jose`（JWT の署名・検証ライブラリ。Edge/Node 両対応）。
2. **秘密鍵の用意**:
   - `openssl rand -base64 32` で生成し、`.env.local` に `ADMIN_SESSION_SECRET=...` として保存。
   - 本番用に Vercel の環境変数にも同じキーで登録（`vercel env add ADMIN_SESSION_SECRET`）。
   - この鍵が漏れると誰でも正規セッションを偽造できる。コミット禁止。
3. **セッションユーティリティ作成** → `lib/sessions.ts`（`"server-only"`）。3つの関数に集約:
   - `createSession(adminId)`: `adminId` だけを payload にした JWT を発行し、Cookie `admin_session` にセット。
     Cookie 属性は httpOnly / secure(本番のみ) / sameSite=lax / path=/ / maxAge=8h。JWT の exp も 8h に揃える。
   - `getSession()`: Cookie の JWT を `jwtVerify` で検証。署名不一致・期限切れ・欠如はすべて `null` を返す。
   - `deleteSession()`: Cookie を削除。
   - ⚠️ payload に入れるキー名（`adminId`）と `getSession` で取り出すキー名を一致させること（当初 `admin` と `adminId` で食い違っていた）。
4. **login アクション改修** → `lib/actions/login.ts`:
   - 従来の「Cookie に生の `admin.id` を直書き」をやめ、`await createSession(admin.id)` に置換。
   - 戻り値の形（`{ ok: true }` / `{ error }`）は変えない → `app/admin/login/page.tsx` は無修正で済む。
   - あわせて `logout()` アクションを追加（`deleteSession()` → `redirect("/admin/login")`）。
5. **proxy 作成** → **プロジェクトルート**（`app/` と同階層）の `proxy.ts`:
   - `matcher: ["/admin/:path*"]` で /admin 配下のみ対象。
   - Cookie `admin_session` の**有無だけ**で判定:
     - 未ログイン＆ログイン画面以外 → `/admin/login` へ redirect
     - ログイン済み＆ログイン画面 → `/admin` へ redirect
   - ⚠️ 現状 `app/proxy.ts` に置かれているが、この場所では**認識されず動かない**。`museum-map/proxy.ts` へ移動が必要。
6. **本チェック層の作成** → ルートグループで保護領域を分離:
   ```
   app/
     admin/login/page.tsx        ← 保護対象外（ログイン画面）
     (protected)/admin/
       layout.tsx                ← getSession() が null なら redirect("/admin/login")
       page.tsx                  ← 旧 app/admin/page.tsx を git mv で移動
   ```
   - ルートグループ `(protected)` は URL に出ないので、`/admin/login` は layout の管理外に置ける。
   - ⚠️ 旧 `app/admin/page.tsx` を消さずに `(protected)/admin/page.tsx` を作ると
     「two parallel pages that resolve to the same path」ビルドエラー。必ず**移動**（コピー不可）。
   - layout での認証チェックは「遷移時に再レンダーされない」弱点があるため、
     機密データを触る箇所（Server Action / DAL）でも `getSession()` を呼ぶのが本来は望ましい。

### セッション時間（`MAX_SESSION_TIME`）

- 現状は**固定8時間**（`lib/sessions.ts` の定数）。JWT の `exp` と Cookie の `maxAge` を両方この値に揃えている。
- アクセスのたびに延長したい（スライディングセッション）場合は、`getSession()` 成功時に
  トークンを再発行して Cookie を上書きする処理を足す。まずは固定で運用。

### 動作確認の順序

1. `npm run dev` → 未ログインで `/admin` 直打ち → `/admin/login` へ（proxy）
2. ログイン成功 → `/admin` 表示、Cookie に JWT が入る
3. ログイン済みで `/admin/login` を開く → `/admin` へ（proxy）
4. DevTools で Cookie を書き換え → リロードで `/admin/login`（layout の JWT 検証で弾く）
5. `MAX_SESSION_TIME` を短くして期限切れ → ログイン画面に戻る

### 残タスク

- [ ] `app/proxy.ts` → プロジェクトルート `proxy.ts` へ移動
- [ ] `.env.local` と Vercel に `ADMIN_SESSION_SECRET` を設定
- [ ] 管理画面サイドバーに `<form action={logout}>` でログアウトボタンを設置

### awaitを()で囲っている理由
「const token = (await cookies()).get(COOKIE)?.value;」のようにawaitを()で囲う理由は、Next.js16ではcookies()がPromiseなったため、中身（Cookieストア）を取り出してから get()/set()を呼ぶようにする必要がある（優先順位）
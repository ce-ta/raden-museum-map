import "server-only";

import { prisma } from "./prisma";

// 失敗回数を数える期間（30分）
const WINDOW_MS = 30 * 60 * 1000;

// 期間内に許す失敗回数の上限
const MAX_FAILS_PER_IP = 10;      // 1つのIPから複数のユーザー名を試す攻撃への対策
const MAX_FAILS_PER_USERNAME = 5; // 1つのアカウントを複数のIPから狙う攻撃への対策

// この期間より古い記録は判定に使わないので削除する（1日）
const RETENTION_MS = 24 * 60 * 60 * 1000;

// 直近の失敗回数が上限に達しているかをチェック
export async function isLocked(ip: string, username: string): Promise<boolean> {
    const since = new Date(Date.now() - WINDOW_MS);

    // 1つ目のクエリの結果がipFailsに、2つ目のクエリの結果がusernameFailsに入る
    const [ipFails, usernameFails] = await Promise.all([
        prisma.loginAttempt.count({ where: { ip, createdAt: { gte: since } } }), //「gte」・・・>=の条件文(createdAt >= 現在時刻の30分前)
                                                                                 // 30分前から今までの間に記録された行
        prisma.loginAttempt.count({ where: { username, createdAt: { gte: since } } }),
    ]);

    return ipFails >= MAX_FAILS_PER_IP || usernameFails >= MAX_FAILS_PER_USERNAME;
}

// 試行を記録する
export async function recordAttempt(ip: string, username: string): Promise<void> {
    await prisma.loginAttempt.create({ data: { ip, username } });

    // ログイン処理のたびに、古いレコードは削除する
    await prisma.loginAttempt.deleteMany({
        where: { createdAt: { lt: new Date(Date.now() - RETENTION_MS) } },
    });
}

// ログイン成功時に、当該ユーザー名の記録を消す
export async function clearAttempts(username: string): Promise<void> {
    await prisma.loginAttempt.deleteMany({ where: { username } });
}
import "server-only";
import bcrypt from "bcrypt";
import { prisma } from "./prisma";

export async function verifyAdmin(username: string, password: string) {
    const user = await prisma.adminUser.findUnique({ where: { username } });

    // 必ずハッシュ化を走らせる（タイミング攻撃対策）
    const hash = user?.passwordHash ?? "";
    const ok = await bcrypt.compare(password, hash);

    if (!user || !ok) return null;

    const { passwordHash, ...safe } = user;
    return safe;
}

import "server-only";
import { headers } from "next/headers"

const IP_HEADER = "x-forwarded-for";

// x-forwarded-for に追記する「信頼できるプロキシ」の段数。末尾からこの数だけ戻った位置が利用者のIP
const TRUSTED_PROXY_HOPS = Number(process.env.TRUSTED_PROXY_HOPS ?? "1");

if(!Number.isInteger(TRUSTED_PROXY_HOPS) || TRUSTED_PROXY_HOPS < 1) {
    throw new Error("TRUSTED_PROXY_HOPS には 1 以上の整数を設定してください");
}

export function pickClientIp(headerValue: string | null, hops: number) {
    if(!headerValue) return "unknown"

    // x-forwarded-for は「先頭は偽装可能、末尾がプロキシの追記」なので末尾から数える
    const ips = headerValue.split(",").map(ip => ip.trim()).filter(Boolean);
    return ips[ips.length - hops] ?? "unknown";
}

export default async function getClientIp() {
    const value = (await headers()).get(IP_HEADER);
    return pickClientIp(value, TRUSTED_PROXY_HOPS);
}
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const CSP_REPORT_ONLY = false;

// nonce 方式は全ページが動的レンダリングになるため採用せず、next.config で静的に付与する
// script-src: Next.js が埋め込むインラインスクリプトのため 'unsafe-inline' が必要（dev では React のデバッグ用に 'unsafe-eval' も）
// style-src:  Leaflet が style 属性で地図要素を配置するため 'unsafe-inline' が必要
// img-src:    国土地理院の地図タイル、Vercel Blob の画像
const csp = `
    default-src 'self';
    script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https://cyberjapandata.gsi.go.jp https://*.public.blob.vercel-storage.com;
    font-src 'self';
    connect-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`.replace(/\s{2,}/g, " ").trim();

const securityHeaders = [
  {
    key: CSP_REPORT_ONLY ? "Content-Security-Policy-Report-Only" : "Content-Security-Policy",
    value: csp,
  },
  // ブラウザによる Content-Type の推測を禁止
  { key: "X-Content-Type-Options", value: "nosniff" },
  // 外部サイトへはオリジンのみ送る
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // 使わないブラウザ機能を無効化（現在地機能を追加する場合は geolocation=(self) にする）
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // frame-ancestors 非対応の古いブラウザ向けのクリックジャッキング対策
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

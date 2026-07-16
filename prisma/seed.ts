// データ投入: npx prisma db seed
// データ削除+マイグレーション再適用+投入: npx prisma migrate reset

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];

async function main() {
  const prefectures = await Promise.all(
    PREFECTURES.map((name, i) =>
      prisma.prefecture.upsert({
        where: { code: i + 1 },
        update: {},
        create: { code: i + 1, name },
      }),
    ),
  );
  const tokyo = prefectures.find((p) => p.name === "東京都")!;
  const kanagawa = prefectures.find((p) => p.name === "神奈川県")!;
  const kyoto = prefectures.find((p) => p.name === "京都府")!;
  const shizuoka = prefectures.find((p) => p.name === "静岡県")!;
  const fukuoka = prefectures.find((p) => p.name === "福岡県")!;
  const osaka = prefectures.find((p) => p.name === "大阪府")!;

  const artMuseumType = await prisma.facilityType.upsert({
    where: { name: "美術館" },
    update: {},
    create: { name: "美術館" },
  });
  const museumType = await prisma.facilityType.upsert({
    where: { name: "博物館" },
    update: {},
    create: { name: "博物館" },
  });

  // Museum には name の一意制約が無いため、再実行時は同名の既存レコード
  // (関連する collaborations/reports含む)を削除してから作り直すことで
  // このスクリプトを何度実行しても安全にする。
  async function recreateMuseum(name: string, data: Parameters<typeof prisma.museum.create>[0]["data"]) {
    const existing = await prisma.museum.findMany({ where: { name } });
    for (const m of existing) {
      await prisma.officialCollaboration.deleteMany({ where: { museumId: m.id } });
      await prisma.report.deleteMany({ where: { museumId: m.id } });
      await prisma.museum.delete({ where: { id: m.id } });
    }
    return prisma.museum.create({ data });
  }

  // ステータスが「mention」（公式コラボではない紹介・言及）の実績は
  // コラボとして扱わないため、以下は公式コラボ（official）のみを登録する。

  await recreateMuseum("箱根ガラスの森美術館", {
    name: "箱根ガラスの森美術館",
    address: "神奈川県足柄下郡箱根町仙石原940-48",
    lat: 35.266234,
    lng: 139.017738,
    typeId: artMuseumType.id,
    prefectureCode: kanagawa.code,
    websiteUrl: "https://www.hakone-garasunomori.jp/",
    phone: "0460-86-3111",
    openingHours: "10:00〜17:30（入館は17:00まで）※成人の日の翌日から11日間は冬季休館",
    admissionFee: "大人1,800円／大学生・高校生1,300円／中学生・小学生600円（税込）",
    hasCollaboration: true,
    collaborations: {
      create: [
        {
          title: "特別企画展「香りの装い～香水瓶をめぐる軌跡～」音声ガイド担当",
          description: "2024年7月19日〜2025年1月13日開催",
          sourceUrl: "https://www.hakone-garasunomori.jp/blog/media/709/",
        },
        {
          title: "お子さま用音声ガイド担当（博衣こよりと共同）",
          description: "2025年1月25日〜2025年7月13日",
          sourceUrl: "https://x.com/juufuuteiraden/status/1871573392983523668",
        },
        {
          title: "特別企画展「軌跡のきらめき～神秘の光彩、ガラスと貝細工～」音声ガイド担当",
          description: "2025年7月18日〜2026年1月12日開催",
          sourceUrl: "https://www.hakone-garasunomori.jp/blog/exhibition/2566/",
        },
        {
          title: "文化の日記念「貸切クイズロケ」（学術系VTuber複数名と共演）",
          description: "2025年11月3日実施（特別企画展のプロモーション企画）",
          sourceUrl: "https://www.hakone-garasunomori.jp/blog/media/3195/",
        },
      ],
    },
  });

  await recreateMuseum("サントリー美術館", {
    name: "サントリー美術館",
    address: "東京都港区赤坂9-7-4 東京ミッドタウン ガレリア3階",
    lat: 35.666501,
    lng: 139.730239,
    typeId: artMuseumType.id,
    prefectureCode: tokyo.code,
    websiteUrl: "https://www.suntory.co.jp/sma/",
    phone: "03-3479-8600",
    openingHours: "10:00～18:00（金・土は20:00まで、入館は閉館30分前まで）",
    admissionFee: "展覧会ごとに異なる（公式サイト「開館時間・入館料」参照）",
    hasCollaboration: true,
    collaborations: {
      create: [
        {
          title: "「没後120年 エミール・ガレ：憧憬のパリ」展 潜入解説配信",
          description: "2025年3月18日配信（展覧会は2025年4月13日まで開催）",
          sourceUrl: "https://x.com/sun_SMA/status/1895293796612743383",
        },
      ],
    },
  });

  await recreateMuseum("静岡県立美術館", {
    name: "静岡県立美術館",
    address: "静岡県静岡市駿河区谷田53-2",
    lat: 34.9754,
    lng: 138.3907,
    typeId: artMuseumType.id,
    prefectureCode: shizuoka.code,
    websiteUrl: "https://spmoa.shizuoka.shizuoka.jp/",
    phone: "054-263-5755",
    openingHours: "10:00～17:30（最終入館17:00）休館日：月曜（祝日の場合は翌平日）",
    admissionFee:
      "収蔵品展：大人300円（団体200円）、年間パスポート500円、大学生以下・70歳以上無料。企画展は展覧会ごとに異なる",
    hasCollaboration: true,
    collaborations: {
      create: [
        {
          title:
            "ロダン館／企画展「中村宏展 アナクロニズム（時代錯誤）のその先へ」／「2000年代の絵画」音声ガイド担当",
          description: "2026年1月20日〜3月15日開催",
          sourceUrl: "https://spmoa.shizuoka.shizuoka.jp/news/detail/415",
        },
        {
          title: "オリジナル曲「出囃子ジャポニズム」静岡県立美術館ver. 制作・公開",
          description: "2026年、音声ガイド担当期間中に公開",
          sourceUrl: "https://www.youtube.com/watch?v=SRSm0_gjjrI",
        },
      ],
    },
  });

  await recreateMuseum("京都国立博物館", {
    name: "京都国立博物館",
    address: "京都府京都市東山区茶屋町527",
    lat: 34.990581,
    lng: 135.772297,
    typeId: museumType.id,
    prefectureCode: kyoto.code,
    websiteUrl: "https://www.kyohaku.go.jp/",
    phone: "075-525-2473",
    openingHours:
      "火～日 9:30～17:00（特別展中は延長あり、金・土は夜間開館の場合あり）休館日：月曜（祝日の場合は翌平日）",
    admissionFee: "展示内容により異なる（特別展「源氏物語 王朝のかがやき」は別途料金）",
    hasCollaboration: true,
    collaborations: {
      create: [
        {
          title: "特別展「源氏物語　王朝のかがやき」スペシャルサポーター就任",
          description: "2026年10月6日〜11月29日開催予定",
          sourceUrl: "https://x.com/juufuuteiraden/status/2047283998783926357",
        },
      ],
    },
  });

  await recreateMuseum("東京国立博物館", {
    name: "東京国立博物館",
    address: "東京都台東区上野公園13-9",
    lat: 35.718,
    lng: 139.7722,
    typeId: museumType.id,
    prefectureCode: tokyo.code,
    websiteUrl: "https://www.tnm.jp/",
    phone: "03-3822-1111",
    openingHours:
      "9:30～17:00（金・土は20:00まで、入館は閉館30分前まで）休館日：月曜（祝日の場合は開館、翌平日休館）",
    admissionFee:
      "総合文化展：一般1,000円、大学生500円、高校生以下・満18歳未満・満70歳以上無料（特別展は別料金）",
    hasCollaboration: true,
    collaborations: {
      create: [
        {
          title: "特別展「源氏物語　王朝のかがやき」スペシャルサポーター就任",
          description: "2027年1月19日〜3月14日開催予定",
          sourceUrl: "https://x.com/juufuuteiraden/status/2047283998783926357",
        },
        {
          title: "東京国立博物館との正式コラボレーション（詳細未発表）",
          description: "2027年1月〜開催予定。上記「源氏物語」展との関係含め詳細未公表",
          sourceUrl: "https://x.com/juufuuteiraden/status/2056324194959253888",
        },
      ],
    },
  });

  await recreateMuseum("九州国立博物館", {
    name: "九州国立博物館",
    address: "福岡県太宰府市石坂4-7-2",
    lat: 33.518356,
    lng: 130.538297,
    typeId: museumType.id,
    prefectureCode: fukuoka.code,
    websiteUrl: "https://www.kyuhaku.jp/",
    phone: "050-5542-8600（ハローダイヤル）",
    openingHours: "9:30～17:00（最終入館16:30）休館日：月曜（祝日・振替休日の場合は翌日）、年末年始",
    admissionFee: "文化交流展：大人700円、大学生350円、高校生以下無料（特別展は別料金）",
    hasCollaboration: true,
    collaborations: {
      create: [
        {
          title: "特別展「九州の国宝 きゅーはくのたから」施設協力ロケ・らでんラボ配信",
          description: "2025年8月9日公開（展覧会は2025年7月5日〜8月31日開催）",
          sourceUrl: "https://www.youtube.com/watch?v=4ibvLY4s0Fk",
        },
      ],
    },
  });

  await recreateMuseum("東京国立近代美術館", {
    name: "東京国立近代美術館",
    address: "東京都千代田区北の丸公園3-1",
    lat: 35.6905,
    lng: 139.7547,
    typeId: artMuseumType.id,
    prefectureCode: tokyo.code,
    websiteUrl: "https://www.momat.go.jp/",
    phone: "03-3214-2561",
    openingHours:
      "10:00～17:00（金・土は20:00まで、入場は閉館30分前まで）休館日：月曜（祝日の場合は開館し翌日休館）",
    admissionFee: "所蔵作品展と特別展で異なる（公式サイト参照）",
    hasCollaboration: true,
    collaborations: {
      create: [
        {
          title: "「らでんラボ」埴輪＆美術作品特集（東京国立博物館と合同協力）",
          description: "2024年11月1日配信",
          sourceUrl: "https://www.youtube.com/watch?v=oCEucIhcvTY",
        },
      ],
    },
  });

  await recreateMuseum("大阪中之島美術館", {
    name: "大阪中之島美術館",
    address: "大阪府大阪市北区中之島4-3-1",
    lat: 34.692453,
    lng: 135.491386,
    typeId: artMuseumType.id,
    prefectureCode: osaka.code,
    websiteUrl: "https://nakka-art.jp/",
    phone: "06-6479-0550（代表、10:00-17:30）",
    openingHours: "10:00～17:00（最終入館16:30）休館日：月曜（祝日の場合は翌平日）",
    admissionFee: "展覧会により異なる（公式サイト参照）",
    hasCollaboration: true,
    collaborations: {
      create: [
        {
          title: "「生誕150年記念 上村松園」展 施設協力によるらでんラボ配信",
          description: "2025年5月13日頃公開（展覧会は2025年3月29日〜6月1日開催）",
          sourceUrl: "https://www.youtube.com/watch?v=LyHF3GPqJfU",
        },
      ],
    },
  });

  await recreateMuseum("ポーラ美術館", {
    name: "ポーラ美術館",
    address: "神奈川県足柄下郡箱根町仙石原小塚山1285",
    lat: 35.256741,
    lng: 139.021269,
    typeId: artMuseumType.id,
    prefectureCode: kanagawa.code,
    websiteUrl: "https://www.polamuseum.or.jp/",
    phone: "0460-84-2111",
    openingHours: "9:00～17:00（入館は16:30まで）会期中無休（展示替え等による臨時休館あり）",
    admissionFee: "大人2,200円、大学生・高校生1,700円、中学生以下無料（税込）",
    hasCollaboration: true,
    collaborations: {
      create: [
        {
          title: "「ゴッホ・インパクト―生成する情熱」展 施設協力による配信",
          description: "展覧会は2025年5月31日〜11月30日開催",
          sourceUrl: "https://www.youtube.com/watch?v=59YtOUvBCP4",
        },
      ],
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

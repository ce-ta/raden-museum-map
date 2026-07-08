// 画面表示用の Museum 関連の型定義を置く場所。
// Prisma が生成する型をそのまま使うか、画面用に変換した型を定義するかはここで検討する。

// 地図表示に必要な最小限のフィールドのみを持つ型。
export type MuseumMapItem = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
};

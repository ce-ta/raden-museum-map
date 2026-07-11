// 地図表示に必要な最小限のフィールドのみを持つ型。
export type MuseumMapItem = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
};

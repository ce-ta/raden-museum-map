// 地図表示に必要な最小限のフィールドのみを持つ型。
export type MuseumMapItem = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  typeId: number;
  websiteUrl: string | null;
  phone: string | null;
  openingHours: string | null;
  admissionFee: string | null;
  imageUrl: string | null;
  hasCollaboration: boolean;
};

export type FilterState = {
  searchText: string;
  prefectureCode: number | null;
  hasCollaboration: boolean;
  hasNotCollaboration: boolean
}

export type Collaboration = {
  id: string;
  title: string;
  startDate: Date | null;
  endDate: Date | null;
}
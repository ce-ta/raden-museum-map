import type { Region } from "@/lib/regions";

// 地図表示に必要な最小限のフィールドのみを持つ型。
export type MuseumMapItem = NewMuseumInput & {
  id: string;
};

export type FilterState = {
  searchText: string;
  regions: Region[];
  typeIds: number[];
  hasCollaboration: boolean;
  hasNotCollaboration: boolean;
  sortBy: 'name' | 'reports' | 'distance';
  sortOrder: 'asc' | 'desc';
}

export type Collaboration = {
  id: string;
  title: string;
  startDate: Date | null;
  endDate: Date | null;
}

// OfficialCollaboration テーブルの全項目を持つ型。
export type OfficialCollaborationItem = {
  id: string;
  museumId: string;
  title: string;
  description: string | null;
  sourceUrl: string;
  startDate: Date | null;
  endDate: Date | null;
}

// OfficialCollaboration に紐づく Museum の名前を結合した型。
export type OfficialCollaborationWithMuseum = OfficialCollaborationItem & {
  museum: {
    name: string;
  };
}

export type NewMuseumInput = {
  name: string;
  address: string;
  lat: number;
  lng: number;
  typeId: number;
  prefectureCode: number;
  websiteUrl?: string | null;
  phone?: string | null;
  openingHours?: string | null;
  admissionFee?: string | null;
  coverImageUrl?: string | null;
  subImageUrls?: string[];
  hasCollaboration?: boolean;
};

export type NewCollaborationInput = {
  title: string;
  description?: string | null;
  sourceUrl: string;
  startDate?: Date | null;
  endDate?: Date | null;
  museumId: string;
  collaborationId?: string;
};
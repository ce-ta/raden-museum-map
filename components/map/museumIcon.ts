import L from "leaflet";

const pin = `<div class="museum-marker-inner"><span class="pin"></span></div>`;

export const museumIcon = new L.DivIcon({
  className: "museum-marker-icon",
  html: pin,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -10],
});

// コラボ実施済みかどうかは一覧・詳細側のバッジで示すため、ピン自体は同一デザインにする
export const collaboratedMuseumIcon = museumIcon;

// 現在地用アイコン（青いピン）
export const currentLocationIcon = new L.DivIcon({
  className: "museum-marker-icon current-location-icon",
  html: `<div class="museum-marker-inner"><span class="pin" style="background:#2563eb"></span></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -10],
});

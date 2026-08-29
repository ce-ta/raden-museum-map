import L from "leaflet";

// Googleマップ風の涙型ピン。SVGで描画し、下端の尖った先端が実際の位置を指すようにする。
function pinSvg(color: string) {
  return `
    <svg width="27" height="36" viewBox="0 0 27 36" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.5 0C6.04 0 0 6.04 0 13.5c0 9.9 13.5 22.5 13.5 22.5s13.5-12.6 13.5-22.5C27 6.04 20.96 0 13.5 0z"
        fill="${color}"
        stroke="#0e0d0e"
        stroke-width="1.5"
      />
      <circle cx="13.5" cy="13.5" r="5.5" fill="#f3f1ef" />
    </svg>
  `;
}

function createPinIcon(color: string, extraClassName = "") {
  return new L.DivIcon({
    className: `museum-marker-icon ${extraClassName}`.trim(),
    html: `<div class="museum-marker-inner">${pinSvg(color)}</div>`,
    iconSize: [27, 36],
    iconAnchor: [13.5, 36],
    popupAnchor: [0, -32],
  });
}

export const museumIcon = createPinIcon("#b7a7e3");

// コラボ実施済みかどうかは一覧・詳細側のバッジで示すため、ピン自体は同一デザインにする
export const collaboratedMuseumIcon = museumIcon;

// 現在地用アイコン（青いピン）
export const currentLocationIcon = createPinIcon("#2563eb", "current-location-icon");

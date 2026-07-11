// TODO: 座標のtypeを作る
export function createGoogleMapUrl(lat: number, lng: number) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}
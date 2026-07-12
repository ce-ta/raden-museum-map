// TODO: 座標のtypeを作る
export function createGoogleMapUrl(name: string, address: string) {
    const query = encodeURIComponent(`${name} ${address}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
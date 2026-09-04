export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const MAX_IMAGE_LABEL = "5MB";

export function validateImageFile(file: { type: string; size: number }): string | null {
    if (!file.type.startsWith("image/")) {
        return "画像ファイルを選択してください";
    }
    if (file.size > MAX_IMAGE_BYTES) {
        return `画像サイズが大きすぎます（上限 ${MAX_IMAGE_LABEL}）`;
    }
    return null;
}

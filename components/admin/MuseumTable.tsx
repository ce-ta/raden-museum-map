import type { MuseumMapItem } from "@/types/museum";
import { checkCollaboration } from "@/lib/collaboration";

export default function MuseumTable({ museums, onEdit, onDelete }: { museums: MuseumMapItem[] | null, onEdit: (id: string) => void, onDelete: (id: string) => void }) {
    if (museums === null) {
        return <p className="px-4 py-3 text-sm text-neutral-400">読み込み中...</p>;
    }

    return (
        <table className="w-full text-left text-sm">
            <thead className="bg-neutral-900 text-neutral-400">
                <tr>
                    <th className="px-4 py-3 font-medium">名前</th>
                    <th className="px-4 py-3 font-medium">住所</th>
                    <th className="px-4 py-3 font-medium">種別</th>
                    <th className="px-4 py-3 font-medium">公式サイト</th>
                    <th className="px-4 py-3 font-medium">コラボ有無</th>
                    <th className="px-4 py-3 font-medium text-right">操作</th>
                </tr>
            </thead>
            <tbody>
                {museums.map((museum) => (
                    <tr key={museum.id} className="border-t border-neutral-800 bg-neutral-950">
                        <td className="px-4 py-3">{museum.name}</td>
                        <td className="px-4 py-3 text-neutral-400">{museum.address}</td>
                        <td className="px-4 py-3 text-neutral-400">{museum.typeId === 1 ? "美術館" : "博物館"}</td>
                        <td className="px-4 py-3 text-neutral-400">
                            {museum.websiteUrl ? (
                                <a
                                    href={museum.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:underline"
                                >
                                    リンク
                                </a>
                            ) : (
                                "-"
                            )}
                        </td>
                        <td className="px-4 py-3 text-neutral-400">{checkCollaboration(museum) ? "あり" : "なし"}</td>
                        <td className="px-4 py-3 text-right">
                            <button
                                type="button"
                                onClick={() => onEdit(museum.id)}
                                className="cursor-pointer rounded px-2 py-1 text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100"
                            >
                                編集
                            </button>
                            <button
                                type="button"
                                onClick={() => onDelete(museum.id)}
                                className="cursor-pointer rounded px-2 py-1 text-red-400 hover:bg-neutral-800 hover:text-red-300"
                            >
                                削除
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

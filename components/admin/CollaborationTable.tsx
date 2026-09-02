import type { OfficialCollaborationWithMuseum } from "@/types/museum";

function formatDate(date: Date | null) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("ja-JP");
}

export default function CollaborationTable({ collaborations, onEdit, onDelete }: { collaborations: OfficialCollaborationWithMuseum[] | null, onEdit: (id: string) => void, onDelete: (id: string) => void }) {
    if (collaborations === null) {
        return <p className="px-4 py-3 text-sm text-neutral-400">読み込み中...</p>;
    }

    return (
        <table className="w-full text-left text-sm">
            <thead className="bg-neutral-900 text-neutral-400">
                <tr>
                    <th className="px-4 py-3 font-medium">名前</th>
                    <th className="px-4 py-3 font-medium">コラボ名</th>
                    <th className="px-4 py-3 font-medium">概要</th>
                    <th className="px-4 py-3 font-medium">開始日</th>
                    <th className="px-4 py-3 font-medium">終了日</th>
                    <th className="px-4 py-3 font-medium text-right">操作</th>
                </tr>
            </thead>
            <tbody>
                {collaborations.map((collaboration) => (
                    <tr key={collaboration.id} className="border-t border-neutral-800 bg-neutral-950">
                        <td className="px-4 py-3">{collaboration.museum.name}</td>
                        <td className="px-4 py-3">{collaboration.title}</td>
                        <td className="px-4 py-3">{collaboration.description}</td>
                        <td className="px-4 py-3 text-neutral-400">{formatDate(collaboration.startDate)}</td>
                        <td className="px-4 py-3 text-neutral-400">{formatDate(collaboration.endDate)}</td>
                        <td className="px-4 py-3 text-right">
                            <button
                                type="button"
                                onClick={() => onEdit(collaboration.id)}
                                className="cursor-pointer rounded px-2 py-1 text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100"
                            >
                                編集
                            </button>
                            <button
                                type="button"
                                onClick={() => onDelete(collaboration.id)}
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

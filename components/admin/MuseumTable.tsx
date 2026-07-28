const MUSEUMS = [
    { name: "サンプル美術館 1", updatedAt: "2026-07-01" },
    { name: "サンプル美術館 2", updatedAt: "2026-07-01" },
    { name: "サンプル美術館 3", updatedAt: "2026-07-01" },
];

export default function MuseumTable({ onEdit }: { onEdit: (name: string) => void }) {
    return (
        <table className="w-full text-left text-sm">
            <thead className="bg-neutral-900 text-neutral-400">
                <tr>
                    <th className="px-4 py-3 font-medium">名前</th>
                    <th className="px-4 py-3 font-medium">最終更新日</th>
                    <th className="px-4 py-3 font-medium text-right">操作</th>
                </tr>
            </thead>
            <tbody>
                {MUSEUMS.map(({ name, updatedAt }) => (
                    <tr key={name} className="border-t border-neutral-800 bg-neutral-950">
                        <td className="px-4 py-3">{name}</td>
                        <td className="px-4 py-3 text-neutral-400">{updatedAt}</td>
                        <td className="px-4 py-3 text-right">
                            <button
                                type="button"
                                onClick={() => onEdit(name)}
                                className="cursor-pointer rounded px-2 py-1 text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100"
                            >
                                編集
                            </button>
                            <button
                                type="button"
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

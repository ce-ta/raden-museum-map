import type { MuseumMapItem, OfficialCollaborationWithMuseum } from "@/types/museum";

type CollaborationFormModalProps = {
    mode: "create" | "edit";
    initialCollaboration?: OfficialCollaborationWithMuseum;
    museums: MuseumMapItem[] | null;
    onClose: () => void;
};

function toDateInputValue(date: Date | null | undefined) {
    if (!date) return "";
    return new Date(date).toISOString().slice(0, 10);
}

export default function CollaborationFormModal({ mode, initialCollaboration, museums, onClose }: CollaborationFormModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="max-h-[90vh] w-[32rem] overflow-y-auto rounded-xl border border-neutral-700 bg-neutral-900 p-6 text-neutral-100">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        {mode === "create" ? "コラボ情報の新規追加" : "コラボ情報の編集"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded p-1 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
                        aria-label="閉じる"
                    >
                        ×
                    </button>
                </div>

                <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                    <label className="flex flex-col gap-1 text-sm">
                        美術館
                        <select
                            name="museumId"
                            defaultValue={initialCollaboration?.museumId}
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        >
                            <option value="" disabled>
                                選択してください
                            </option>
                            {museums?.map((museum) => (
                                <option key={museum.id} value={museum.id}>
                                    {museum.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                        コラボ名
                        <input
                            type="text"
                            name="title"
                            defaultValue={initialCollaboration?.title}
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                        説明
                        <textarea
                            name="description"
                            rows={4}
                            defaultValue={initialCollaboration?.description ?? ""}
                            className="resize-none rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                        告知元URL
                        <input
                            type="text"
                            name="sourceUrl"
                            defaultValue={initialCollaboration?.sourceUrl ?? ""}
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        />
                    </label>

                    <div className="flex gap-3">
                        <label className="flex flex-1 flex-col gap-1 text-sm">
                            開始日
                            <input
                                type="date"
                                name="startDate"
                                defaultValue={toDateInputValue(initialCollaboration?.startDate)}
                                className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                            />
                        </label>
                        <label className="flex flex-1 flex-col gap-1 text-sm">
                            終了日
                            <input
                                type="date"
                                name="endDate"
                                defaultValue={toDateInputValue(initialCollaboration?.endDate)}
                                className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                            />
                        </label>
                    </div>

                    <div className="mt-2 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer rounded-lg px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800"
                        >
                            キャンセル
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-white"
                        >
                            保存
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

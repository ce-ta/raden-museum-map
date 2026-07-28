type AdminItemFormModalProps = {
    mode: "create" | "edit";
    initialName?: string;
    onClose: () => void;
};

export default function AdminItemFormModal({ mode, initialName, onClose }: AdminItemFormModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-96 rounded-xl border border-neutral-700 bg-neutral-900 p-6 text-neutral-100">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        {mode === "create" ? "新規追加" : "編集"}
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
                        名前
                        <input
                            type="text"
                            name="name"
                            defaultValue={initialName}
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                        説明
                        <textarea
                            name="description"
                            rows={4}
                            className="resize-none rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        />
                    </label>

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

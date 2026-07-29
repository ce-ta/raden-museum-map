import type { MuseumMapItem } from "@/types/museum";

type MuseumFormModalProps = {
    mode: "create" | "edit";
    initialMuseum?: MuseumMapItem;
    onClose: () => void;
};

export default function MuseumFormModal({ mode, initialMuseum, onClose }: MuseumFormModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="max-h-[90vh] w-[32rem] overflow-y-auto rounded-xl border border-neutral-700 bg-neutral-900 p-6 text-neutral-100">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        {mode === "create" ? "美術館の新規追加" : "美術館の編集"}
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
                            defaultValue={initialMuseum?.name}
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                        住所
                        <input
                            type="text"
                            name="address"
                            defaultValue={initialMuseum?.address}
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        />
                    </label>

                    <div className="flex gap-3">
                        <label className="flex flex-1 flex-col gap-1 text-sm">
                            緯度
                            <input
                                type="number"
                                step="any"
                                name="lat"
                                defaultValue={initialMuseum?.lat}
                                className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                            />
                        </label>
                        <label className="flex flex-1 flex-col gap-1 text-sm">
                            経度
                            <input
                                type="number"
                                step="any"
                                name="lng"
                                defaultValue={initialMuseum?.lng}
                                className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                            />
                        </label>
                    </div>

                    <label className="flex flex-col gap-1 text-sm">
                        種別ID
                        <input
                            type="number"
                            name="typeId"
                            defaultValue={initialMuseum?.typeId}
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                        公式サイトURL
                        <input
                            type="text"
                            name="websiteUrl"
                            defaultValue={initialMuseum?.websiteUrl ?? ""}
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                        電話番号
                        <input
                            type="text"
                            name="phone"
                            defaultValue={initialMuseum?.phone ?? ""}
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                        開館時間
                        <input
                            type="text"
                            name="openingHours"
                            defaultValue={initialMuseum?.openingHours ?? ""}
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                        入館料
                        <input
                            type="text"
                            name="admissionFee"
                            defaultValue={initialMuseum?.admissionFee ?? ""}
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                        画像URL
                        <input
                            type="text"
                            name="imageUrl"
                            defaultValue={initialMuseum?.imageUrl ?? ""}
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        />
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            name="hasCollaboration"
                            defaultChecked={initialMuseum?.hasCollaboration ?? false}
                            className="h-4 w-4 rounded border-neutral-700 bg-neutral-800"
                        />
                        コラボ有無
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

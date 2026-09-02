import { useState } from "react";
import type { MuseumMapItem, OfficialCollaborationWithMuseum, NewCollaborationInput } from "@/types/museum";

type CollaborationFormModalProps = {
    mode: "create" | "edit";
    initialCollaboration?: OfficialCollaborationWithMuseum;
    museums: MuseumMapItem[] | null;
    onCreate: (collaboration: NewCollaborationInput) => Promise<unknown>;
    onUpdate: (collaboration: NewCollaborationInput) => Promise<unknown>;
    onClose: () => void;
};

// フォームは全項目を文字列で保持する（date入力・select共に値は文字列のため）。
// 送信時に Date などへ変換する。
type CollaborationFormState = {
    museumId: string;
    title: string;
    description: string;
    sourceUrl: string;
    startDate: string;
    endDate: string;
    collaborationId: string;
};

// 必須項目のキー一覧（バリデーション対象はここに追加/削除するだけでよい）
const REQUIRED_FIELDS = ["museumId", "title", "sourceUrl"] as const;

type RequiredField = (typeof REQUIRED_FIELDS)[number];

// フィールドごとのエラーメッセージを保持する型（未入力エラーがない項目はキー自体が存在しない）
type FormErrors = Partial<Record<RequiredField, string>>;

// Date を <input type="date"> 用の "YYYY-MM-DD" 文字列へ変換する
function toDateInputValue(date: Date | null | undefined) {
    if (!date) return "";
    return new Date(date).toISOString().slice(0, 10);
}

export default function CollaborationFormModal({
    mode,
    initialCollaboration,
    museums,
    onCreate,
    onUpdate,
    onClose,
}: CollaborationFormModalProps) {
    const [form, setForm] = useState<CollaborationFormState>({
        museumId: initialCollaboration?.museumId ?? "",
        title: initialCollaboration?.title ?? "",
        description: initialCollaboration?.description ?? "",
        sourceUrl: initialCollaboration?.sourceUrl ?? "",
        startDate: toDateInputValue(initialCollaboration?.startDate),
        endDate: toDateInputValue(initialCollaboration?.endDate),
        collaborationId: initialCollaboration?.id ?? ""
    });

    // 必須項目ごとのエラーメッセージ。キーが存在する項目のみ入力欄の下に表示される
    const [errors, setErrors] = useState<FormErrors>({});

    function updateField<K extends keyof CollaborationFormState>(key: K, value: CollaborationFormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function validate(): FormErrors {
        const nextErrors: FormErrors = {};
        for (const field of REQUIRED_FIELDS) {
            if (form[field].trim() === "") {
                nextErrors[field] = "この項目は必須です";
            }
        }
        return nextErrors;
    }

    async function submit() {
        const nextErrors = validate();
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        setErrors({});
        const collaboration: NewCollaborationInput = {
            museumId: form.museumId,
            title: form.title,
            description: form.description || null,
            sourceUrl: form.sourceUrl,
            startDate: form.startDate ? new Date(form.startDate) : null,
            endDate: form.endDate ? new Date(form.endDate) : null
        };
        await onCreate(collaboration);
        onClose();
    }

    async function update() {
        const nextErrors = validate();
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        setErrors({});
        const collaboration: NewCollaborationInput = {
            museumId: form.museumId,
            title: form.title,
            description: form.description || null,
            sourceUrl: form.sourceUrl,
            startDate: form.startDate ? new Date(form.startDate) : null,
            endDate: form.endDate ? new Date(form.endDate) : null,
            collaborationId: form.collaborationId
        };
        await onUpdate(collaboration);
        onClose();
    }

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
                        {mode === 'create' ? (
                            <select
                                name="museumId"
                                value={form.museumId}
                                onChange={(e) => updateField("museumId", e.target.value)}
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
                                )
                            </select>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    name="sourceUrl"
                                    disabled
                                    value={initialCollaboration?.museum.name}
                                    className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                                />
                            </>
                        )}
                        {errors.museumId && <span className="text-xs text-red-400">{errors.museumId}</span>}
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                        コラボ名
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={(e) => updateField("title", e.target.value)}
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        />
                        {errors.title && <span className="text-xs text-red-400">{errors.title}</span>}
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                        説明
                        <textarea
                            name="description"
                            rows={4}
                            value={form.description}
                            onChange={(e) => updateField("description", e.target.value)}
                            className="resize-none rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                        告知元URL
                        <input
                            type="text"
                            name="sourceUrl"
                            value={form.sourceUrl}
                            onChange={(e) => updateField("sourceUrl", e.target.value)}
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        />
                        {errors.sourceUrl && <span className="text-xs text-red-400">{errors.sourceUrl}</span>}
                    </label>

                    <div className="flex gap-3">
                        <label className="flex flex-1 flex-col gap-1 text-sm">
                            開始日
                            <input
                                type="date"
                                name="startDate"
                                value={form.startDate}
                                onChange={(e) => updateField("startDate", e.target.value)}
                                className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                            />
                        </label>
                        <label className="flex flex-1 flex-col gap-1 text-sm">
                            終了日
                            <input
                                type="date"
                                name="endDate"
                                value={form.endDate}
                                onChange={(e) => updateField("endDate", e.target.value)}
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
                        {mode === 'create' ? (
                            <button
                                type="button"
                                onClick={() => submit()}
                                className="cursor-pointer rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-white"
                            >
                                保存
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => update()}
                                className="cursor-pointer rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-white"
                            >
                                更新
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

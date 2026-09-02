import { useState } from "react";
import type { MuseumMapItem, NewMuseumInput, NewCollaborationInput } from "@/types/museum";
import CollaborationFields from "./CollaborationFields";

type MuseumFormModalProps = {
    mode: "create" | "edit";
    initialMuseum?: MuseumMapItem;
    facilityTypes: { id: number, name: string }[];
    prefectures: { name: string, code: number }[];
    onCreate: (museum: NewMuseumInput, collaboration?: NewCollaborationInput) => Promise<unknown>;
    onUpdate: (museum: MuseumMapItem) => Promise<unknown>;
    onClose: () => void;
};

type MuseumFormState = {
    name: string;
    address: string;
    lat: string;
    lng: string;
    typeId: string;
    prefectureCode: string;
    websiteUrl: string;
    phone: string;
    openingHours: string;
    admissionFee: string;
    imageUrl: string;
    hasCollaboration: boolean;
};

type CollabotrationFormState = {
    title: string;
    description: string;
    sourceUrl: string;
    startDate: Date;
    endDate: Date;
}

type FormState = MuseumFormState & Partial<CollabotrationFormState>;

// 必須項目のキー一覧（バリデーション対象はここに追加/削除するだけでよい）
const REQUIRED_FIELDS = ["name", "address", "lat", "lng", "typeId", "prefectureCode"] as const;

type RequiredField = (typeof REQUIRED_FIELDS)[number];

// フィールドごとのエラーメッセージを保持する型（未入力エラーがない項目はキー自体が存在しない）
type FormErrors = Partial<Record<RequiredField, string>>;

export default function MuseumFormModal({ mode, initialMuseum, facilityTypes, prefectures, onCreate, onUpdate, onClose }: MuseumFormModalProps) {
    const [form, setForm] = useState<FormState>({
        name: initialMuseum?.name ?? "",
        address: initialMuseum?.address ?? "",
        lat: initialMuseum?.lat != null ? String(initialMuseum.lat) : "",
        lng: initialMuseum?.lng != null ? String(initialMuseum.lng) : "",
        typeId: initialMuseum?.typeId != null ? String(initialMuseum.typeId) : "",
        prefectureCode: initialMuseum?.prefectureCode != null ? String(initialMuseum.prefectureCode) : "",
        websiteUrl: initialMuseum?.websiteUrl ?? "",
        phone: initialMuseum?.phone ?? "",
        openingHours: initialMuseum?.openingHours ?? "",
        admissionFee: initialMuseum?.admissionFee ?? "",
        imageUrl: initialMuseum?.imageUrl ?? "",
        hasCollaboration: initialMuseum?.hasCollaboration ?? false,
    });

    // 必須項目ごとのエラーメッセージ。キーが存在する項目のみ入力欄の下に表示される
    const [errors, setErrors] = useState<FormErrors>({});

    function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    // 必須項目が未入力（空文字、または空白のみ）かどうかをチェックし、
    // 該当する項目のエラーメッセージをまとめて返す
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
        // 保存前に必須項目をチェックし、エラーがあれば保存処理を中断してメッセージを表示する
        const nextErrors = validate();
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }
        // バリデーションを通過したら前回表示していたエラーをクリアしてから保存に進む
        setErrors({});
        const museum: NewMuseumInput & Partial<NewCollaborationInput> = {
            name: form.name,
            address: form.address,
            lat: Number(form.lat),
            lng: Number(form.lng),
            typeId: Number(form.typeId),
            prefectureCode: Number(form.prefectureCode),
            websiteUrl: form.websiteUrl || null,
            phone: form.phone || null,
            openingHours: form.openingHours || null,
            admissionFee: form.admissionFee || null,
            imageUrl: form.imageUrl || null,
            hasCollaboration: form.hasCollaboration,
            title: form.title,
            description: form.description,
            sourceUrl: form.sourceUrl,
            startDate: form.startDate,
            endDate: form.endDate
        };
        await onCreate(museum);
        onClose();
    }

    async function handleUpdate() {
        if (!initialMuseum) return;

        const nextErrors = validate();
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        setErrors({});
        const museum: MuseumMapItem = {
            id: initialMuseum.id,
            name: form.name,
            address: form.address,
            lat: Number(form.lat),
            lng: Number(form.lng),
            typeId: Number(form.typeId),
            prefectureCode: Number(form.prefectureCode),
            websiteUrl: form.websiteUrl || null,
            phone: form.phone || null,
            openingHours: form.openingHours || null,
            admissionFee: form.admissionFee || null,
            imageUrl: form.imageUrl || null,
            hasCollaboration: form.hasCollaboration
        };
        await onUpdate(museum);
        onClose();
    }

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
                            value={form.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        />
                        {errors.name && <span className="text-xs text-red-400">{errors.name}</span>}
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                        住所
                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={(e) => updateField("address", e.target.value)}
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        />
                        {errors.address && <span className="text-xs text-red-400">{errors.address}</span>}
                    </label>

                    <div className="flex gap-3">
                        <label className="flex flex-1 flex-col gap-1 text-sm">
                            緯度
                            <input
                                type="number"
                                step="any"
                                name="lat"
                                value={form.lat}
                                onChange={(e) => updateField("lat", e.target.value)}
                                className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                            />
                            {errors.lat && <span className="text-xs text-red-400">{errors.lat}</span>}
                        </label>
                        <label className="flex flex-1 flex-col gap-1 text-sm">
                            経度
                            <input
                                type="number"
                                step="any"
                                name="lng"
                                value={form.lng}
                                onChange={(e) => updateField("lng", e.target.value)}
                                className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                            />
                            {errors.lng && <span className="text-xs text-red-400">{errors.lng}</span>}
                        </label>
                    </div>

                    <div className="flex gap-3">
                        <label className="flex flex-1 flex-col gap-1 text-sm">
                            種別ID
                            <select
                                name="typeId"
                                value={form.typeId}
                                onChange={(e) => updateField("typeId", e.target.value)}
                                className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                            >
                                <option value="" disabled>選択してください</option>
                                {facilityTypes.map((f) => (
                                    <option key={f.id} value={f.id}>{f.name}</option>
                                ))}
                            </select>
                            {errors.typeId && <span className="text-xs text-red-400">{errors.typeId}</span>}
                        </label>
                        <label className="flex flex-1 flex-col gap-1 text-sm">
                            都道府県コード
                            <select
                                name="prefectureCode"
                                value={form.prefectureCode}
                                onChange={(e) => updateField("prefectureCode", e.target.value)}
                                className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                            >
                                <option value="" disabled>選択してください</option>
                                {prefectures.map((p) => (
                                    <option key={p.code} value={p.code}>{p.name}</option>
                                ))}
                            </select>
                            {errors.prefectureCode && (
                                <span className="text-xs text-red-400">{errors.prefectureCode}</span>
                            )}
                        </label>
                    </div>

                    <label className="flex flex-col gap-1 text-sm">
                        公式サイトURL
                        <input
                            type="text"
                            name="websiteUrl"
                            value={form.websiteUrl}
                            onChange={(e) => updateField("websiteUrl", e.target.value)}
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                        電話番号
                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={(e) => updateField("phone", e.target.value)}
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                        開館時間
                        <input
                            type="text"
                            name="openingHours"
                            value={form.openingHours}
                            onChange={(e) => updateField("openingHours", e.target.value)}
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                        入館料
                        <input
                            type="text"
                            name="admissionFee"
                            value={form.admissionFee}
                            onChange={(e) => updateField("admissionFee", e.target.value)}
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                        画像URL
                        <input
                            type="text"
                            name="imageUrl"
                            value={form.imageUrl}
                            onChange={(e) => updateField("imageUrl", e.target.value)}
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        />
                    </label>

                    {mode === "create" && (
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                name="hasCollaboration"
                                checked={form.hasCollaboration}
                                onChange={(e) => updateField("hasCollaboration", e.target.checked)}
                                className="h-4 w-4 rounded border-neutral-700 bg-neutral-800"
                            />
                            コラボ有無
                        </label>
                    )}

                    {mode === 'create' && form.hasCollaboration && (
                        <CollaborationFields onChange={updateField} />
                    )}

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
                                作成
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => handleUpdate()}
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

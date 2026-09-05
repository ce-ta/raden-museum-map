import { useState } from "react";
import type { MuseumMapItem, NewMuseumInput, NewCollaborationInput } from "@/types/museum";
import { uploadMuseumImage } from "@/lib/actions/museum-admin";
import { checkCollaboration } from "@/lib/collaboration";
import { validateImageFile, MAX_IMAGE_LABEL } from "@/lib/imageUpload";
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
    coverImageUrl: string;
    subImageUrls: string[];
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
        coverImageUrl: initialMuseum?.coverImageUrl ?? "",
        subImageUrls: initialMuseum?.subImageUrls ?? [],
        hasCollaboration: initialMuseum != null ? checkCollaboration(initialMuseum) : false,
    });

    // 必須項目ごとのエラーメッセージ。キーが存在する項目のみ入力欄の下に表示される
    const [errors, setErrors] = useState<FormErrors>({});

    // 現在アップロード中の画像スロット（"cover" / "sub-0" / "sub-1"）。null なら非アップロード中
    const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
    // 画像アップロードの失敗メッセージ
    const [uploadError, setUploadError] = useState<string | null>(null);

    function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    // 追加画像URL（subImageUrls）の指定インデックスだけを書き換える
    function updateSubImage(index: number, value: string) {
        setForm((prev) => {
            const next = [...prev.subImageUrls];
            if (value === "") {
                next.splice(index, 1);
            } else {
                next[index] = value;
            }
            return { ...prev, subImageUrls: next };
        });
    }

    // ファイルを選択したら Blob にアップロードし、返ってきた URL をフォームに反映する
    async function handleUpload(slot: "cover" | "sub", file: File | undefined, index?: number) {
        if (!file) return;
        const slotKey = slot === "cover" ? "cover" : `sub-${index}`;
        setUploadError(null);

        // アップロード前にサイズ・種別をチェック（サーバー側でも同じ検証を行う）
        const invalid = validateImageFile(file);
        if (invalid) {
            setUploadError(invalid);
            return;
        }

        setUploadingSlot(slotKey);
        try {
            const url = await uploadMuseumImage(file);
            if (slot === "cover") {
                updateField("coverImageUrl", url);
            } else if (index != null) {
                updateSubImage(index, url);
            }
        } catch (e) {
            setUploadError(e instanceof Error ? e.message : "画像のアップロードに失敗しました");
        } finally {
            setUploadingSlot(null);
        }
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
            coverImageUrl: form.coverImageUrl || null,
            subImageUrls: form.subImageUrls.map((s) => s.trim()).filter(Boolean),
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
            coverImageUrl: form.coverImageUrl || null,
            subImageUrls: form.subImageUrls.map((s) => s.trim()).filter(Boolean),
            collaborations: initialMuseum.collaborations
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

                    <fieldset className="flex flex-col gap-4 rounded-lg border border-neutral-700 p-3">
                        <legend className="px-1 text-xs font-medium text-neutral-400">画像</legend>

                        {/* メイン画像: 一覧・カード・詳細トップで使い回す代表画像（1枚） */}
                        <div className="flex flex-col gap-1.5 text-sm">
                            <span className="flex items-center gap-2">
                                メイン画像
                                <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-900">
                                    一覧・カード・詳細トップ
                                </span>
                            </span>
                            <span className="text-xs text-neutral-500">
                                全ページで使い回す代表画像。中央を基準に自動トリミングされます。（{MAX_IMAGE_LABEL}まで）
                            </span>
                            {form.coverImageUrl.trim() !== "" ? (
                                <div className="mt-1 flex items-start gap-3">
                                    <img
                                        src={form.coverImageUrl}
                                        alt=""
                                        className="h-24 w-40 rounded border border-neutral-700 object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => updateField("coverImageUrl", "")}
                                        className="cursor-pointer rounded-lg border border-neutral-700 px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-800"
                                    >
                                        削除
                                    </button>
                                </div>
                            ) : (
                                <input
                                    type="file"
                                    accept="image/*"
                                    disabled={uploadingSlot === "cover"}
                                    onChange={(e) => handleUpload("cover", e.target.files?.[0])}
                                    className="text-sm text-neutral-300 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-neutral-900 disabled:opacity-50"
                                />
                            )}
                            {uploadingSlot === "cover" && (
                                <span className="text-xs text-neutral-400">アップロード中…</span>
                            )}
                        </div>

                        {/* 追加画像: 詳細ページのギャラリーにだけ並ぶ補助画像（最大2枚） */}
                        <div className="flex flex-col gap-2 text-sm">
                            <span className="flex items-center gap-2">
                                追加画像
                                <span className="rounded border border-neutral-600 px-1.5 py-0.5 text-[10px] text-neutral-400">
                                    詳細ページのみ・最大2枚
                                </span>
                            </span>
                            <span className="text-xs text-neutral-500">
                                詳細ページのギャラリーに並べる補助画像。（各 {MAX_IMAGE_LABEL} まで）
                            </span>
                            <div className="flex flex-wrap gap-3">
                                {form.subImageUrls.map((url, index) => (
                                    <div key={url} className="flex flex-col items-start gap-1">
                                        <img
                                            src={url}
                                            alt=""
                                            className="h-20 w-32 rounded border border-neutral-700 object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => updateSubImage(index, "")}
                                            className="cursor-pointer rounded-lg border border-neutral-700 px-2 py-0.5 text-xs text-neutral-300 hover:bg-neutral-800"
                                        >
                                            削除
                                        </button>
                                    </div>
                                ))}
                                {form.subImageUrls.length < 2 && (
                                    <label className="flex h-20 w-32 cursor-pointer flex-col items-center justify-center rounded border border-dashed border-neutral-600 text-xs text-neutral-400 hover:border-neutral-400">
                                        {uploadingSlot === `sub-${form.subImageUrls.length}` ? "アップロード中…" : "＋ 画像を追加"}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            disabled={uploadingSlot != null}
                                            onChange={(e) => handleUpload("sub", e.target.files?.[0], form.subImageUrls.length)}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        {uploadError && <span className="text-xs text-red-400">{uploadError}</span>}
                    </fieldset>

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
                                disabled={uploadingSlot != null}
                                className="cursor-pointer rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                作成
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => handleUpdate()}
                                disabled={uploadingSlot != null}
                                className="cursor-pointer rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
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

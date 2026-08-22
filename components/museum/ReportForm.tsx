// 投稿レポート（Report）を新規作成するためのフォームコンポーネント。
"use client";

import { useState } from "react";
import { fetchCreateReport } from "@/lib/actions/report";

const MAX_LENGTH = 400;

export default function ReportForm({
    museumId,
    onSubmitted,
    onCancel,
}: {
    museumId: string;
    onSubmitted: () => void;
    onCancel: () => void;
}) {
    const [body, setBody] = useState("");
    const [attachPhoto, setAttachPhoto] = useState(false);
    const [photo, setPhoto] = useState<File | undefined>(undefined);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!body.trim()) return;
        setSubmitting(true);
        await fetchCreateReport({
            museumId,
            body: body.trim(),
            photo,
        });
        setSubmitting(false);
        setBody("");
        setPhoto(undefined);
        setAttachPhoto(false);
        onSubmitted();
    };

    return (
        <div className="border border-line bg-panel p-5 md:p-6 space-y-2">
            <label htmlFor="report-body" className="mb-2 block text-[11px] tracking-[.14em] text-faint">
                感想（{MAX_LENGTH}字まで）
            </label>
            <textarea
                id="report-body"
                className="w-full resize-none border border-line bg-paper p-3 text-[14px] leading-relaxed text-ink placeholder:text-faint outline-none focus:border-accent"
                rows={4}
                maxLength={MAX_LENGTH}
                placeholder="どんな作品・空間が印象に残りましたか？"
                value={body}
                onChange={(e) => setBody(e.target.value)}
            />
            <div className="flex items-center justify-between text-[11px] text-faint">
                <span>ネタバレを含む場合は冒頭に記載してください</span>
                <span>{body.length}/{MAX_LENGTH}</span>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-[12px] text-muted">
                    <input
                        type="checkbox"
                        className="h-3.5 w-3.5 accent-accent"
                        checked={attachPhoto}
                        onChange={(e) => {
                            setAttachPhoto(e.target.checked);
                            if (!e.target.checked) setPhoto(undefined);
                        }}
                    />
                    写真を添付する
                </label>
                <div className="flex gap-3">
                    <button
                        type="button"
                        className="px-3 py-2 text-[13px] text-muted cursor-pointer hover:text-ink"
                        onClick={onCancel}
                        disabled={submitting}
                    >
                        キャンセル
                    </button>
                    <button
                        type="button"
                        className="border border-accent bg-accent px-5 py-2.5 text-[13px] font-medium text-[#17131f] cursor-pointer hover:bg-[#c8bbec] disabled:opacity-50"
                        onClick={handleSubmit}
                        disabled={submitting || !body.trim()}
                    >
                        投稿する
                    </button>
                </div>
            </div>

            {attachPhoto && (
                <input
                    type="file"
                    accept="image/*"
                    className="w-full border border-line bg-paper p-2 text-[13px] text-ink outline-none focus:border-accent"
                    onChange={(e) => setPhoto(e.target.files?.[0])}
                />
            )}
        </div>
    );
}

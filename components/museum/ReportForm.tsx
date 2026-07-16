// 投稿レポート（Report）を新規作成するためのフォームコンポーネント。
"use client";

import { useState } from "react";
import { fetchCreateReport } from "@/lib/actions/report";

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
        onSubmitted();
    };

    return (
        <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-3 space-y-2">
            <textarea
                className="w-full resize-none rounded-md border border-neutral-600 bg-neutral-900 p-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                rows={5}
                placeholder="感想を書く"
                value={body}
                onChange={(e) => setBody(e.target.value)}
            />
            {/* <input
                type="file"
                accept="image/*"
                className="w-full rounded-md border border-neutral-600 bg-neutral-900 p-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                onChange={(e) => setPhoto(e.target.files?.[0])}
            /> */}
            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-sm text-neutral-400 cursor-pointer hover:text-neutral-100"
                    onClick={onCancel}
                    disabled={submitting}
                >
                    キャンセル
                </button>
                <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-sm bg-neutral-100 text-neutral-900 cursor-pointer disabled:opacity-50"
                    onClick={handleSubmit}
                    disabled={submitting || !body.trim()}
                >
                    投稿する
                </button>
            </div>
        </div>
    );
}

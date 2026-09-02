type CollaborationFieldKey = "title" | "description" | "sourceUrl" | "startDate" | "endDate";

type CollaborationFieldsOnChange = (key: CollaborationFieldKey, value: string) => void;

export default function CollaborationFields({ onChange }: { onChange: CollaborationFieldsOnChange }) {
    return (
        <>
            <label className="flex flex-col gap-1 text-sm">
                コラボ名
                <input
                    type="text"
                    name="title"
                    className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                    onChange={(e) => onChange("title", e.target.value)}
                />
            </label>

            <label className="flex flex-col gap-1 text-sm">
                説明
                <textarea
                    name="description"
                    rows={4}
                    className="resize-none rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                    onChange={(e) => onChange("description", e.target.value)}
                />
            </label>

            <label className="flex flex-col gap-1 text-sm">
                告知元URL
                <input
                    type="text"
                    name="sourceUrl"
                    className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                    onChange={(e) => onChange("sourceUrl", e.target.value)}
                />
            </label>

            <div className="flex gap-3">
                <label className="flex flex-1 flex-col gap-1 text-sm">
                    開始日
                    <input
                        type="date"
                        name="startDate"
                        className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        onChange={(e) => onChange("startDate", e.target.value)}
                    />
                </label>
                <label className="flex flex-1 flex-col gap-1 text-sm">
                    終了日
                    <input
                        type="date"
                        name="endDate"
                        className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-400"
                        onChange={(e) => onChange("endDate", e.target.value)}
                    />
                </label>
            </div>
        </>
    )
}
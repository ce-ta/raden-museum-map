// カレンダー画面右側の一覧⇄詳細パネル。DetailInfo.tsxと同じタブ構造のHTML/CSSのみ実装。
// TODO: isList/selectedCollaborationId等をpropsまたは親のuseStateで管理し、
//       タブ切り替え・選択状態を反映する実装が必要（"use client" 化も必要）
export default function CollaborationDetailPanel() {
    return (
        <div className="ml-2 h-full flex flex-col min-h-0">
            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex flex-row">
                    <button
                        type="button"
                        className="px-4 py-2 border border-b-0 border-neutral-600 cursor-pointer"
                    >
                        詳細
                    </button>
                </div>

                <div className="flex-1 min-h-0 bg-neutral-800 p-4 overflow-y-auto">
                    <p className="text-sm text-neutral-500">日付を選択するとコラボ予定が表示されます</p>
                </div>
            </div>
        </div>
    );
}

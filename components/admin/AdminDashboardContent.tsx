"use client";

import { useState } from "react";
import type { Content } from "@/types/admin"
import AdminItemFormModal from "@/components/admin/AdminItemFormModal";
import MuseumTable from "@/components/admin/MuseumTable";
import CollaborationTable from "@/components/admin/CollaborationTable";

const TITLE_MAP: Record<Content, string> = {
    museum: "美術館一覧",
    collaboration: "コラボ情報",
};

type ModalState =
    | { mode: "create" }
    | { mode: "edit"; name: string }
    | null;

export default function AdminDashboardContent({ content }: { content: Content }) {
    const [modalState, setModalState] = useState<ModalState>(null);

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{TITLE_MAP[content]}</h2>
                <button
                    type="button"
                    onClick={() => setModalState({ mode: "create" })}
                    className="cursor-pointer rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-white"
                >
                    新規追加
                </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-neutral-700">
                {content === "museum" ? (
                    <MuseumTable onEdit={(name) => setModalState({ mode: "edit", name })} />
                ) : (
                    <CollaborationTable onEdit={(name) => setModalState({ mode: "edit", name })} />
                )}
            </div>

            {modalState != null && (
                <AdminItemFormModal
                    mode={modalState.mode}
                    initialName={modalState.mode === "edit" ? modalState.name : undefined}
                    onClose={() => setModalState(null)}
                />
            )}
        </div>
    );
}

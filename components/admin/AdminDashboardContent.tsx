import { useState, useEffect, useRef } from "react";
import type { Content } from "@/types/admin"
import type { MuseumMapItem, OfficialCollaborationWithMuseum, NewMuseumInput, NewCollaborationInput } from "@/types/museum";
import CollaborationFormModal from "@/components/admin/CollaborationFormModal";
import MuseumFormModal from "@/components/admin/MuseumFormModal";
import MuseumTable from "@/components/admin/MuseumTable";
import CollaborationTable from "@/components/admin/CollaborationTable";
import { fetchMuseums, fetchCollaboration, createMuseum } from "@/lib/actions/museum";

const TITLE_MAP: Record<Content, string> = {
    museum: "美術館一覧",
    collaboration: "コラボ情報一覧",
};

type ModalState =
    | { mode: "create" }
    | { mode: "edit"; name: string }
    | null;

export default function AdminDashboardContent({ content }: { content: Content }) {
    const [modalState, setModalState] = useState<ModalState>(null);
    const [museums, setMuseums] = useState<MuseumMapItem[] | null>(null)
    const [collaborations, setCollaborations] = useState<OfficialCollaborationWithMuseum[] | null>(null);
    const requestIdRef = useRef(0);

    const loadData = async () => {
        const requestId = ++requestIdRef.current;
        const resultMuseums = await fetchMuseums();
        const resultCollaborations = await fetchCollaboration();
        if (requestId !== requestIdRef.current) return;
        setMuseums(resultMuseums);
        setCollaborations(resultCollaborations);
    }

    useEffect(() => {
        loadData();
    }, [])

    async function handleCreateMuseum(
        museum: NewMuseumInput,
        collaboration?: NewCollaborationInput
    ) {
        const result = await createMuseum(museum, collaboration);
        await loadData();
        return result;
    }

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
                    <MuseumTable museums={museums} onEdit={(name) => setModalState({ mode: "edit", name })} />
                ) : (
                    <CollaborationTable collaborations={collaborations} onEdit={(name) => setModalState({ mode: "edit", name })} />
                )}
            </div>

            {modalState != null && content === "museum" && (
                <MuseumFormModal
                    mode={modalState.mode}
                    initialMuseum={
                        modalState.mode === "edit"
                            ? museums?.find((museum) => museum.name === modalState.name)
                            : undefined
                    }
                    onCreate={handleCreateMuseum}
                    onClose={() => setModalState(null)}
                />
            )}

            {modalState != null && content === "collaboration" && (
                <CollaborationFormModal
                    mode={modalState.mode}
                    initialCollaboration={
                        modalState.mode === "edit"
                            ? collaborations?.find((collaboration) => collaboration.title === modalState.name)
                            : undefined
                    }
                    museums={museums}
                    onCreate={handleCreateMuseum}
                    onClose={() => setModalState(null)}
                />
            )}
        </div>
    );
}

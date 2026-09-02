import { useState, useEffect, useRef } from "react";
import type { Content } from "@/types/admin"
import type { MuseumMapItem, OfficialCollaborationWithMuseum, NewMuseumInput, NewCollaborationInput } from "@/types/museum";
import CollaborationFormModal from "@/components/admin/CollaborationFormModal";
import MuseumFormModal from "@/components/admin/MuseumFormModal";
import MuseumTable from "@/components/admin/MuseumTable";
import CollaborationTable from "@/components/admin/CollaborationTable";
import { fetchMuseums, fetchCollaboration, createMuseum, deleteMuseum } from "@/lib/actions/museum";
import { fetchAllFacilityTypes } from "@/lib/actions/facilityType";
import { fetchAllPrefecture } from "@/lib/actions/prefecture";
import { addCollabo, updateCollabo, deleteCollabo } from "@/lib/actions/collaboration";
import { updateMuseum } from "@/lib/actions/museum";

const TITLE_MAP: Record<Content, string> = {
    museum: "美術館一覧",
    collaboration: "コラボ情報一覧",
};

type ModalState =
    | { mode: "create" }
    | { mode: "edit"; id: string }
    | null;

export default function AdminDashboardContent({ content }: { content: Content }) {
    const [modalState, setModalState] = useState<ModalState>(null);
    const [museums, setMuseums] = useState<MuseumMapItem[] | null>(null);
    const [collaborations, setCollaborations] = useState<OfficialCollaborationWithMuseum[] | null>(null);
    const [facilityTypes, setFacilityTypes] = useState<{ id: number, name: string }[]>([]);
    const [prefectures, setPrefectures] = useState<{ name: string, code: number }[]>([]);
    const requestIdRef = useRef(0);

    const loadData = async () => {
        const requestId = ++requestIdRef.current;
        const resultMuseums = await fetchMuseums();
        const resultCollaborations = await fetchCollaboration();
        const resultFacilityTypes = await fetchAllFacilityTypes();
        const resultPrefecture = await fetchAllPrefecture();
        if (requestId !== requestIdRef.current) return;
        setMuseums(resultMuseums);
        setCollaborations(resultCollaborations);
        setFacilityTypes(resultFacilityTypes);
        setPrefectures(resultPrefecture);
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

    async function handleUpdateMuseum(museum: MuseumMapItem) {
        const result = await updateMuseum(museum);
        loadData();
        return result;
    }

    async function handleDeleteMuseum(id: string) {
        const result = await deleteMuseum(id);
        await loadData();
        return result;
    }

    async function handleCreateCollaboration(collaboration: NewCollaborationInput) {
        const result = await addCollabo(collaboration);
        await loadData();
        return result;
    }

    async function handleUpdateCollaboration(collaboration: NewCollaborationInput) {
        const result = await updateCollabo(collaboration);
        await loadData();
        return result;
    }

    async function handleDeleteCollabo(id: string) {
        const result = await deleteCollabo(id);
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
                    <MuseumTable museums={museums} onEdit={(id) => setModalState({ mode: "edit", id })} onDelete={handleDeleteMuseum} />
                ) : (
                    <CollaborationTable collaborations={collaborations} onEdit={(id) => setModalState({ mode: "edit", id })} onDelete={handleDeleteCollabo} />
                )}
            </div>

            {modalState != null && content === "museum" && (
                <MuseumFormModal
                    mode={modalState.mode}
                    initialMuseum={
                        modalState.mode === "edit"
                            ? museums?.find((museum) => museum.id === modalState.id)
                            : undefined
                    }
                    facilityTypes={facilityTypes}
                    prefectures={prefectures}
                    onCreate={handleCreateMuseum}
                    onUpdate={handleUpdateMuseum}
                    onClose={() => setModalState(null)}
                />
            )}

            {modalState != null && content === "collaboration" && (
                <CollaborationFormModal
                    mode={modalState.mode}
                    initialCollaboration={
                        modalState.mode === "edit"
                            ? collaborations?.find((collaboration) => collaboration.id === modalState.id)
                            : undefined
                    }
                    museums={museums}
                    onCreate={handleCreateCollaboration}
                    onUpdate={handleUpdateCollaboration}
                    onClose={() => setModalState(null)}
                />
            )}
        </div>
    );
}

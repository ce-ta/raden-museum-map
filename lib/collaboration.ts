type MuseumWithCollaborations = {
    collaborations: { isOfficial: boolean }[];
};

export function checkCollaboration(museum: MuseumWithCollaborations) {
    return museum.collaborations.some((c) => c.isOfficial);
}
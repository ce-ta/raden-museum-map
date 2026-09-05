export function checkCollaboration(museum) {
    return museum.collaborations.some((c) => c.isOfficial);
}
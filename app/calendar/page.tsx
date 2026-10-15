import CalendarView from "@/components/calendar/CalendarView";
import { getCollaborationsDate } from "@/lib/museums";

export default async function CalendarPage() {
    const collaborationsData = await getCollaborationsDate();

    return <CalendarView collaborationsData={collaborationsData} />;
}

import CalendarView from "@/components/calendar/CalendarView";
import { getCollaborationsDate } from "@/lib/museums";

const collaborationsData = await getCollaborationsDate();

export default function CalendarPage() {
    return <CalendarView collaborationsData={collaborationsData} />;
}

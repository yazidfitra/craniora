import { Metadata } from "next";
import ScheduleView from "@/components/schedule/schedule-view";

export const metadata: Metadata = {
  title: "Jadwal Kuliah | Craniora Academy",
};

export default function SchedulePage() {
  return <ScheduleView />;
}

import { Metadata } from "next";
import ExamListView from "@/components/exam/exam-list-view";

export const metadata: Metadata = {
  title: "Bank Soal | Craniora Academy",
};

export default function TasksPage() {
  return <ExamListView />;
}

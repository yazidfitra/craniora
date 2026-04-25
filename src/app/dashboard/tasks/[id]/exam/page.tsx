import { Metadata } from "next";
import ExamView from "@/components/exam/exam-view";

export const metadata: Metadata = {
  title: "Ujian | Craniora Academy",
};

export default async function ExamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ExamView examId={id} />;
}

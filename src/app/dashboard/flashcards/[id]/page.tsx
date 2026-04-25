import { Metadata } from "next";
import FlashcardStudyView from "@/components/flashcard/flashcard-study-view";

export const metadata: Metadata = {
  title: "Belajar Flashcard | Craniora Academy",
};

export default async function FlashcardStudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <FlashcardStudyView deckId={id} />;
}

import { Metadata } from "next";
import FlashcardListView from "@/components/flashcard/flashcard-list-view";

export const metadata: Metadata = {
  title: "Flashcards | Craniora Academy",
};

export default function FlashcardsPage() {
  return <FlashcardListView />;
}

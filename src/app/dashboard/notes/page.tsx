import { Metadata } from "next";
import NotesView from "@/components/notes/notes-view";

export const metadata: Metadata = {
  title: "Berbagi Ilmu | Craniora Academy",
};

export default function NotesPage() {
  return <NotesView />;
}

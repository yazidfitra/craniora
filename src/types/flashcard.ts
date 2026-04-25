export interface FlashcardDeck {
  id: string;
  user_id: string;
  title: string;
  category: string;
  card_count: number;
  created_at: string;
}

export interface Flashcard {
  id: string;
  deck_id: string;
  front_text: string;
  back_text: string;
  image_url: string | null;
  sort_order: number;
}

export interface FlashcardProgress {
  id: string;
  user_id: string;
  flashcard_id: string;
  known: boolean;
  reviewed_at: string;
}

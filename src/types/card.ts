export interface Card {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  authorId: string;
}

export type CardShort = Pick<Card, "id" | "name">;

export interface Comment {
  id: string;
  cardId: string;
  comment: string;
  authorId: string;
}

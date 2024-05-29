import { useCallback, useState } from "react";
import { CardPage, CardList, CardDetails, CardEmpty } from "@/components/card";
import { Card, CardShort, Comment } from "@/types/card";
import useTaskResource from "@/hooks/useTaskResource";
import fetchTask from "@/utils/fetchTask";
import { all } from "effection";

const api = {
  getCards: () => fetchTask<CardShort[]>(`/api/cards`),
  getCard: (id: string) => fetchTask<Card>(`/api/card/${id}`),
  getComments: (id: string) => fetchTask<Comment[]>(`/api/card/${id}/comments`),
  *all(id: string) {
    const [card, comments] = yield* all([api.getCard(id), api.getComments(id)]);
    return { card, comments };
  },
};

interface DetailsProps {
  id: string;
}

function Details({ id }: DetailsProps) {
  const { data, loading } = useTaskResource(() => api.all(id), [id]);

  return (
    <CardDetails
      card={data?.card}
      loading={loading}
      comments={data?.comments}
    />
  );
}

export default function Page() {
  const [cardId, setCardId] = useState<string>();
  const { data, loading } = useTaskResource(() => api.getCards(), []);

  const handleCardClick = useCallback(
    (card: CardShort) => setCardId(card.id),
    []
  );

  return (
    <CardPage>
      <CardList cards={data} loading={loading} onClick={handleCardClick} />
      {cardId ? <Details id={cardId} /> : <CardEmpty />}
    </CardPage>
  );
}

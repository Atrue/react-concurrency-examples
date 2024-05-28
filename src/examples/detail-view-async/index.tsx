import { useCallback, useState } from "react";
import { CardPage, CardList, CardDetails } from "@/components/card";
import fetchAsync from "@/utils/fetchAsync";
import { Card, CardShort, Comment } from "@/types/card";
import useAsyncResource from "@/hooks/useAsyncResource";

const api = {
  getCards: (signal?: AbortSignal) =>
    fetchAsync<CardShort[]>(`/api/cards`, { signal }),
  getCard: (id: string, signal?: AbortSignal) =>
    fetchAsync<Card>(`/api/card/${id}`, { signal }),
  getComments: (id: string, signal?: AbortSignal) =>
    fetchAsync<Comment[]>(`/api/card/${id}/comments`, { signal }),
  all: async (id: string, signal?: AbortSignal) => {
    const [card, comments] = await Promise.all([
      api.getCard(id, signal),
      api.getComments(id, signal),
    ]);
    return { card, comments };
  },
};

interface DetailsProps {
  id: string;
}

function Details({ id }: DetailsProps) {
  const { data, loading } = useAsyncResource(
    (signal) => api.all(id, signal),
    [id]
  );
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
  const { data, loading } = useAsyncResource(
    (signal) => api.getCards(signal),
    []
  );

  const handleCardClick = useCallback(
    (card: CardShort) => setCardId(card.id),
    []
  );

  return (
    <CardPage>
      <CardList cards={data} loading={loading} onClick={handleCardClick} />
      {cardId && <Details id={cardId} />}
    </CardPage>
  );
}

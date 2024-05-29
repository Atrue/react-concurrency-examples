import { useCallback, useEffect, useState } from "react";
import { CardPage, CardList, CardDetails, CardEmpty } from "@/components/card";
import { CardShort } from "@/types/card";
import { Provider } from "react-redux";
import createStore, { useAppDispatch, useAppSelector } from "./store";
import { actions, selectors } from "./cardsSlice";

interface DetailsProps {
  id: string;
}

function Details({ id }: DetailsProps) {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => selectors.cardDataSelector(state, id));

  useEffect(() => {
    dispatch(actions.getCard(id));
  }, [dispatch, id]);

  return (
    <CardDetails
      card={data?.data}
      loading={data?.loading ?? true}
      comments={data?.comments}
    />
  );
}

function Page() {
  const [cardId, setCardId] = useState<string>();
  const dispatch = useAppDispatch();
  const cards = useAppSelector(selectors.listSelector);
  const loading = useAppSelector(selectors.loadingSelector);

  useEffect(() => {
    const promise = dispatch(actions.getAllCards());
    return () => promise.abort();
  }, [dispatch]);

  const handleCardClick = useCallback(
    (card: CardShort) => setCardId(card.id),
    []
  );

  return (
    <CardPage>
      <CardList cards={cards} loading={loading} onClick={handleCardClick} />
      {cardId ? <Details id={cardId} /> : <CardEmpty />}
    </CardPage>
  );
}

export default function PageWrapper() {
  return (
    <Provider store={createStore()}>
      <Page />
    </Provider>
  );
}

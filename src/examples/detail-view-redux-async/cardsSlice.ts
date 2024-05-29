import { Card, CardShort, Comment } from "@/types/card";
import fetchAsync from "@/utils/fetchAsync";
import {
  createSelector,
  asyncThunkCreator,
  buildCreateSlice,
} from "@reduxjs/toolkit";

export interface CardData {
  short?: CardShort;
  data?: Card;
  comments?: Comment[];
  loading: boolean;
  error?: string;
}

export interface CardsState {
  loading: boolean;
  error?: string;
  list: string[];
  map: Partial<Record<string, CardData>>;
}

export const sliceName = "cards";

const initialState: CardsState = {
  loading: false,
  list: [],
  map: {},
};

function createSelectors() {
  const loadingSelector = (state: CardsState) => state.loading;
  const listSelector = (state: CardsState) => state.list;
  const mapSelector = (state: CardsState) => state.map;

  return {
    loadingSelector,
    listSelector: createSelector([listSelector, mapSelector], (list, map) =>
      list.map((id) => map[id]!.short!)
    ),
    cardDataSelector: createSelector(
      [mapSelector, (_, id: string) => id],
      (map, id) => map[id]
    ),
  };
}

const createAppSlice = buildCreateSlice({
  creators: {
    asyncThunk: asyncThunkCreator,
  },
});

const cardsSlice = createAppSlice({
  name: sliceName,
  initialState,
  reducers: (create) => ({
    getAllCards: create.asyncThunk(
      async (_, { signal }) => {
        return fetchAsync<CardShort[]>(`/api/cards`, {
          signal,
        });
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        rejected: (state, action) => {
          if (action.meta.aborted) return;
          state.loading = false;
          state.error = action.error.message;
        },
        fulfilled: (state, action) => {
          const cards = action.payload;
          state.loading = false;
          state.error = undefined;
          state.list = cards.map((card) => card.id);
          state.map = cards.reduce<CardsState["map"]>((map, card) => {
            map[card.id] = {
              ...map[card.id],
              short: card,
              loading: false,
            };
            return map;
          }, {});
        },
      }
    ),
    getCard: create.asyncThunk(
      async (id: string, { signal }) => {
        const [card, comments] = await Promise.all([
          fetchAsync<Card>(`/api/card/${id}`, { signal }),
          fetchAsync<Comment[]>(`/api/card/${id}/comments`, { signal }),
        ]);
        return { card, comments };
      },
      {
        pending: (state, action) => {
          const id = action.meta.arg;
          state.map[id] = {
            ...state.map[id],
            loading: true,
          };
        },
        rejected: (state, action) => {
          const id = action.meta.arg;
          state.map[id] = {
            ...state.map[id],
            error: action.error.message,
            loading: false,
          };
        },
        fulfilled: (state, action) => {
          const id = action.meta.arg;
          const { card, comments } = action.payload;
          state.map[id] = {
            ...state.map[id],
            data: card,
            comments,
            loading: false,
          };
        },
        options: {
          condition(id, { getState }) {
            const state = getState() as Record<typeof sliceName, CardsState>;
            const card = state[sliceName].map[id];
            return !(card?.data || card?.loading);
          },
        },
      }
    ),
  }),
  selectors: createSelectors(),
});

export const { selectors, reducer, actions } = cardsSlice;

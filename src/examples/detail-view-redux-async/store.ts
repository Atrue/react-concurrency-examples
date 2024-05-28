import { configureStore } from "@reduxjs/toolkit";
import * as cardsSlice from "./cardsSlice";
import { ThunkAction } from "redux-thunk";
import { useDispatch, useSelector } from "react-redux";

interface Dispatch {
  <T extends ThunkAction<unknown, unknown, unknown, unknown>>(
    action: T
  ): T extends ThunkAction<infer K, unknown, unknown, unknown> ? K : never;
}

export const useAppDispatch = useDispatch.withTypes<Dispatch>();
export const useAppSelector =
  useSelector.withTypes<
    Record<typeof cardsSlice.sliceName, cardsSlice.CardsState>
  >();

export default function makeStore(preloadedState?: unknown) {
  return configureStore({
    reducer: {
      cards: cardsSlice.reducer,
    },
    preloadedState,
  });
}

import { DependencyList, useEffect, useState } from "react";
import useAbortSignal from "./useAbortSignal";

// Note: it uses DependencyList is the arguments, it requires adding
// additionalHooks: 'useAsyncResource' to eslint rule 'react-hooks/exhaustive-deps'

interface AsyncResult<T> {
  data?: T;
  loading: boolean;
  error?: Error;
}

export default function useAsyncResource<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic any
  T extends (abortSignal?: AbortSignal) => Promise<any>,
  R extends Awaited<ReturnType<T>>
>(fn: T, deps: DependencyList): AsyncResult<R> {
  const [data, setData] = useState<R>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const getAbortSignal = useAbortSignal();

  useEffect(() => {
    setLoading(true);
    const signal = getAbortSignal();
    fn(signal)
      .then((data) => {
        setData(data);
        setLoading(false);
        setError(undefined);
      })
      .catch((err) => {
        if ((err as Error)?.name === "AbortError") return;
        console.error("useAsync fetch error", err);
        setLoading(false);
        setError(err);
      });
    // eslint checks the deps for the usage of useAsyncResource
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}

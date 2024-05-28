import { DependencyList, useState } from "react";
import { Operation, Yielded } from "effection";
import useTaskEffect from "./useTaskEffect";

interface ResourceResult<T> {
  data?: T;
  loading: boolean;
  error?: Error;
}

// Note: it uses DependencyList is the arguments, it requires adding
// additionalHooks: 'useTaskResource' to eslint rule 'react-hooks/exhaustive-deps'

export default function useTaskResource<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic any
  T extends () => Operation<any>,
  R extends Yielded<ReturnType<T>>
>(operation: T, deps: DependencyList): ResourceResult<R> {
  const [data, setData] = useState<R>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  useTaskEffect(function* () {
    setLoading(true);
    try {
      const data = yield* operation();
      setData(data);
      setLoading(false);
      setError(undefined);
    } catch (err) {
      console.error("useTaskResource error", err);
      setLoading(false);
      setError(err as Error);
    }
    // eslint checks the deps for the usage of useTaskResource
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}

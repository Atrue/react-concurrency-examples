import { useCallback, useEffect, useRef } from "react";

export default function useAbortSignal() {
  const ref = useRef<AbortController>();

  useEffect(() => {
    return () => ref.current?.abort();
  }, []);

  return useCallback((): AbortSignal => {
    ref.current?.abort();
    ref.current = new AbortController();
    return ref.current.signal;
  }, []);
}

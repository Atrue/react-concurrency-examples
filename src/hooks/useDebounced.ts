import { useEffect, useMemo } from 'react';
import debounce from 'lodash/debounce';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export default function useDebounced<T extends (...args: any[]) => any>(
  memoizedCallback: T,
  wait: number
) {
  const debounced = useMemo(() => debounce(memoizedCallback, wait), [memoizedCallback, wait]);
  useEffect(() => {
    return () => debounced.cancel();
  }, [debounced])

  return debounced;
}

import { Operation, run, Task } from 'effection';
import { DependencyList, useCallback, useEffect, useRef } from 'react';

// Note: it uses DependencyList is the arguments, it requires adding
// additionalHooks: 'useTaskCallback' to eslint rule 'react-hooks/exhaustive-deps'

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic any
export default function useTaskCallback<T extends (...args: any[]) => Operation<any>>(
  operation: T,
  deps: DependencyList,
): [(...args: Parameters<T>) => Task<ReturnType<T>>, () => void] {
  const runningRef = useRef<Task<T>>();

  const stopTask = useCallback(() => {
    const task = runningRef.current;
    if (task) run(task.halt);
  }, []);

  useEffect(() => {
    // destroy task on unmount
    return () => stopTask();
  }, [stopTask]);

  // reduce boilerplate (useCallback + useTask = useTaskCallback)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoCallback = useCallback(operation, deps);

  const runTask = useCallback((...args: Parameters<T>): Task<ReturnType<T>> => {
    stopTask();
    const task = run(() => memoCallback(...args));
    runningRef.current = task;

    return task;
  }, [stopTask, memoCallback]);

  return [runTask, stopTask];
}

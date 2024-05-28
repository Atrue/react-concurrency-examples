import { Operation, run } from 'effection';
import { DependencyList, useEffect } from 'react';

// Note: it uses DependencyList is the arguments, it requires adding
// additionalHooks: 'useTaskEffect' to eslint rule 'react-hooks/exhaustive-deps'

export default function useTaskEffect(operation: () => Operation<void>, deps: DependencyList) {
  useEffect(() => {
    const task = run(operation);

    return () => {
      run(task.halt);
    }
    // eslint checks the deps for the usage of useTaskEffect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

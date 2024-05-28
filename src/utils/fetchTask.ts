import { call, Operation, useAbortSignal as abortSignalTask } from "effection";

export default function* fetchTask<T>(
  ...[url, params]: Parameters<typeof fetch>
): Operation<T> {
  const signal = yield* abortSignalTask();
  const response = yield* call(
    fetch(url, {
      signal,
      ...params,
    })
  );
  if (response.ok) {
    return yield* call(response.json());
  } else {
    throw new Error(response.statusText);
  }
}

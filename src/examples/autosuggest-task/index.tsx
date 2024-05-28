import { useState } from "react";
import { Country, CountryApiResponse } from "@/types/country";
import { Input, Results, GetMore } from "@/components/autosuggest";
import { Operation, sleep } from "effection";
import useTaskCallback from "@/hooks/useTaskCallback";
import fetchTask from "@/utils/fetchTask";

function* getData(name: string, skip?: number): Operation<CountryApiResponse> {
  const query = new URLSearchParams();
  query.set("name", name);
  if (skip) query.set("skip", skip.toString());
  return yield* fetchTask(`/api/country/search?${query}`);
}

const Autosuggest = () => {
  const [input, setInput] = useState("");
  const [data, setData] = useState<Country[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [skip, setSkip] = useState(0);

  const [search] = useTaskCallback(function* (
    value: string,
    skip: number = 0
  ): Operation<void> {
    console.log("search:", value);
    if (!value) {
      setLoading(false);
      setData([]);
      setHasNext(false);
      return;
    }
    setLoading(true);
    setSkip(skip);
    try {
      const { content, hasNext } = yield* getData(value, skip);
      setLoading(false);
      setData((data) => data.slice(0, skip).concat(content));
      setHasNext(hasNext);
    } catch (e) {
      console.error("search error", e);
      setError(true);
      setLoading(false);
    }
  },
  []);
  const [debouncedSearch, stopDebouncedSearch] = useTaskCallback(
    function* (value: string, skip: number = 0): Operation<void> {
      yield* sleep(300);
      yield* search(value, skip);
    },
    [search]
  );

  const onChange = (value: string) => {
    setInput(value);
    debouncedSearch(value);
  };

  const onConfirm = () => {
    stopDebouncedSearch();
    search(input);
  };

  const onLoadMore = () => {
    search(input, data.length);
  };

  return (
    <div>
      <Input value={input} onChange={onChange} onConfirm={onConfirm} />
      <Results
        data={data}
        loading={loading && skip === 0}
        error={error && skip === 0}
        onClick={console.log}
      />
      <GetMore
        loading={loading}
        error={error}
        hasNext={hasNext}
        onClick={onLoadMore}
      />
    </div>
  );
};

export default Autosuggest;

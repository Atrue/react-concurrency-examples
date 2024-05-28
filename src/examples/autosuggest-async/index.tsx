import { useCallback, useState } from "react";
import { Country, CountryApiResponse } from "@/types/country";
import useAbortSignal from "@/hooks/useAbortSignal";
import useDebounced from "@/hooks/useDebounced";
import { Input, Results, GetMore } from "@/components/autosuggest";
import fetchAsync from "@/utils/fetchAsync";

async function getData(
  name: string,
  skip?: number,
  signal?: AbortSignal
): Promise<CountryApiResponse> {
  const query = new URLSearchParams();
  query.set("name", name);
  if (skip) query.set("skip", skip.toString());
  return fetchAsync(`/api/country/search?${query}`, {
    signal,
  });
}

const Autosuggest = () => {
  const [input, setInput] = useState("");
  const [data, setData] = useState<Country[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [skip, setSkip] = useState(0);
  const getAbortSignal = useAbortSignal();

  const search = useCallback(
    async (value: string, skip: number = 0) => {
      console.log("search:", value);
      if (!value) {
        setLoading(false);
        setData([]);
        setHasNext(false);
        return;
      }
      setLoading(true);
      setSkip(skip);
      const signal = getAbortSignal();
      try {
        const { content, hasNext } = await getData(value, skip, signal);
        setLoading(false);
        setData((data) => data.slice(0, skip).concat(content));
        setHasNext(hasNext);
      } catch (e) {
        if ((e as Error)?.name === "AbortError") return;
        console.error("search error", e);
        setError(true);
        setLoading(false);
      }
    },
    [getAbortSignal]
  );
  const debouncedSearch = useDebounced(search, 300);

  const onChange = (value: string) => {
    setInput(value);
    debouncedSearch(value);
  };

  const onConfirm = () => {
    debouncedSearch.cancel();
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

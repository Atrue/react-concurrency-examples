import { ChangeEvent, KeyboardEvent } from "react";
import { Country } from "@/types/country";
import classNames from "classnames";
import S from "./styles.module.css";

interface InputProps {
  value: string;
  onChange(value: string): void;
  onConfirm(): void;
}

export const Input = ({ value, onChange, onConfirm }: InputProps) => {
  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange(value);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      onConfirm();
    }
  };

  return (
    <input type="text" value={value} onInput={onInput} onKeyDown={onKeyDown} />
  );
};

interface ResultsProps {
  data: Country[];
  loading: boolean;
  error: boolean;
  onClick(country: Country): void;
}

export const Results = ({ data, loading, error, onClick }: ResultsProps) => {
  return (
    <div className={classNames({ [S.loading]: loading })}>
      {error && <div>Critical error</div>}
      {data.map((res) => (
        <div key={res.code} onClick={() => onClick(res)}>
          {res.name}
        </div>
      ))}
    </div>
  );
};

interface GetMoreProps {
  loading: boolean;
  error: boolean;
  hasNext: boolean;
  onClick(): void;
}
export const GetMore = ({ loading, error, hasNext, onClick }: GetMoreProps) => {
  return (
    <div className={classNames({ [S.loading]: loading })}>
      {error && <div>Critical error</div>}
      {hasNext && <div onClick={onClick}>--Get More--</div>}
    </div>
  );
};

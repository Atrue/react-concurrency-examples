import { ChangeEvent } from "react";
import { Input } from "antd";

interface InputProps {
  value: string;
  onChange(value: string): void;
  onConfirm(): void;
}

export default function AutosuggestInput({
  value,
  onChange,
  onConfirm,
}: InputProps) {
  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange(value);
  };

  return (
    <Input.Search
      placeholder="input search text"
      enterButton
      value={value}
      size="large"
      onChange={onInput}
      onSearch={onConfirm}
    />
  );
}

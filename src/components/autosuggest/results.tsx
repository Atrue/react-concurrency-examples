import { Country } from "@/types/country";
import S from "./styles.module.css";

import { List, Button, Alert } from "antd";

interface ResultsProps {
  data: Country[];
  loading: boolean;
  error: boolean;
  onClick(country: Country): void;
}

export const Results = ({ data, loading, error, onClick }: ResultsProps) => {
  return (
    <div>
      {error && <Alert banner type="error" message="Critical error" />}
      <List
        bordered
        loading={loading}
        dataSource={data}
        renderItem={(res) => (
          <List.Item key={res.code}>
            <List.Item.Meta
              title={<a onClick={() => onClick(res)}>{res.name}</a>}
            />
          </List.Item>
        )}
      />
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
    <div className={S.more}>
      {error && <Alert banner type="error" message="Critical error" />}
      {hasNext && (
        <Button type="primary" loading={loading} onClick={onClick}>
          Get more
        </Button>
      )}
    </div>
  );
};

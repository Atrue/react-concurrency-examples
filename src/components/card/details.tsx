import { useMemo } from "react";
import classNames from "classnames";
import { UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  List,
  Skeleton,
  Layout,
  Spin,
  Typography,
  Descriptions,
} from "antd";
import { Card, Comment } from "@/types/card";
import S from "./styles.module.css";

interface CardListProps {
  loading: boolean;
  card?: Card;
  comments?: Comment[];
}

function CardDetailsSkeleton() {
  return (
    <Layout.Content>
      <Typography.Title>
        <Skeleton.Input active />
      </Typography.Title>
      <Skeleton active />
      <br />

      <Skeleton loading active avatar />
    </Layout.Content>
  );
}

function CardDetailsContent({ loading, card, comments }: CardListProps) {
  const descriptionItems = useMemo(
    () => [
      {
        key: "author",
        label: "Author",
        children: card?.authorId,
      },
      {
        key: "created",
        label: "createdAt",
        children:
          card && new Intl.DateTimeFormat().format(new Date(card.createdAt)),
      },
      {
        key: "description",
        label: "Description",
        children: card?.description,
      },
    ],
    [card]
  );
  if (!card) return <Skeleton />;

  return (
    <Spin spinning={loading}>
      <Layout.Content>
        <Typography.Title>{card.name}</Typography.Title>
        <Descriptions items={descriptionItems} column={1} />

        <List
          header={<Typography.Title level={5}>Comments:</Typography.Title>}
          className={S.comments}
          itemLayout="horizontal"
          dataSource={comments}
          renderItem={(comment) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={comment.authorId}
                description={comment.comment}
              />
            </List.Item>
          )}
        />
      </Layout.Content>
    </Spin>
  );
}

export default function CardDetails({
  loading,
  card,
  comments,
}: CardListProps) {
  return (
    <Layout className={classNames(S.details)}>
      {card ? (
        <CardDetailsContent card={card} loading={loading} comments={comments} />
      ) : (
        <CardDetailsSkeleton />
      )}
    </Layout>
  );
}

import { Card, Comment } from "@/types/card";
import classNames from "classnames";
import S from "./styles.module.css";

interface CardListProps {
  loading: boolean;
  card?: Card;
  comments?: Comment[];
}

function Skeleton() {
  return (
    <div className={classNames(S.details, S.loading)}>
      <div>Loading...</div>
    </div>
  );
}

export default function CardDetails({
  loading,
  card,
  comments,
}: CardListProps) {
  if (!card) return <Skeleton />;

  return (
    <div className={classNames(S.details, { [S.loading]: loading })}>
      <div>{card.name}</div>
      <div>Author: {card.authorId}</div>
      <div>Description: {card.description}</div>
      <div>
        Created at: {new Intl.DateTimeFormat().format(new Date(card.createdAt))}
      </div>
      <div>Comments:</div>
      <div>
        {comments?.map((comment) => (
          <div key={comment.id}>
            {comment.authorId}: {comment.comment}
          </div>
        ))}
      </div>
    </div>
  );
}

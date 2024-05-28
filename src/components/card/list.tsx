import { CardShort } from "@/types/card";
import classNames from "classnames";
import S from "./styles.module.css";

interface CardListProps {
  loading: boolean;
  cards?: CardShort[];
  onClick(card: CardShort): void;
}

export default function CardList({ loading, cards, onClick }: CardListProps) {
  return (
    <div className={classNames({ [S.loading]: loading })}>
      {cards?.map((card) => (
        <div key={card.id} onClick={() => onClick(card)}>
          {card.name}
        </div>
      ))}
    </div>
  );
}

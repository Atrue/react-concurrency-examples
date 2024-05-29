import { CardShort } from "@/types/card";
import { Layout, Menu, Skeleton } from "antd";
import { useMemo } from "react";

interface CardListProps {
  loading: boolean;
  cards?: CardShort[];
  onClick(card: CardShort): void;
}

const loadingSkeleton = Array(5)
  .fill(null)
  .map((_, i) => ({
    key: `loading-item-${i}`,
    disabled: true,
    label: <Skeleton.Button active block />,
  }));

export default function CardList({ loading, cards, onClick }: CardListProps) {
  const menuItems = useMemo(
    () =>
      cards?.map((card) => ({
        key: card.id,
        label: card.name,
        onClick: () => onClick(card),
      })) || loadingSkeleton,
    [cards, onClick]
  );
  return (
    <Layout.Sider>
      <Menu
        mode="inline"
        items={loading ? loadingSkeleton : menuItems}
        style={{ height: "100%" }}
      />
    </Layout.Sider>
  );
}

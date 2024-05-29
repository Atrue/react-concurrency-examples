import { ReactNode } from "react";
import { Layout } from "antd";
import S from "./styles.module.css";

interface CardPageProps {
  children: ReactNode;
}

export default function CardPage({ children }: CardPageProps) {
  return <Layout className={S.page}>{children}</Layout>;
}

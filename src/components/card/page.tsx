import { ReactNode } from "react";
import S from "./styles.module.css";

interface CardPageProps {
  children: ReactNode;
}

export default function CardPage({ children }: CardPageProps) {
  return <div className={S.page}>{children}</div>;
}

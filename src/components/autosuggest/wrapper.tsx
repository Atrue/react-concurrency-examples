import { Layout } from "antd";
import { ReactNode } from "react";
import S from "./styles.module.css";

interface AutoSuggestWrapperProps {
  children: ReactNode;
}

export default function AutoSuggestWrapper({
  children,
}: AutoSuggestWrapperProps) {
  return (
    <Layout className={S.wrapper}>
      <Layout.Content className={S.content}>{children}</Layout.Content>
    </Layout>
  );
}

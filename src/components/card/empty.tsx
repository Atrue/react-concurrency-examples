import { Layout, Result } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

export default function Empty() {
  return (
    <Layout>
      <Result icon={<ArrowLeftOutlined />} title="Select card" />
    </Layout>
  );
}

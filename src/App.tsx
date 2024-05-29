import S from "./App.module.css";
import { ComponentType, Suspense, lazy } from "react";

import { List, theme, ConfigProvider, Typography } from "antd";
import { Router, Route, Switch, Link } from "wouter";

interface Example {
  path: string;
  name: string;
  Component: ComponentType;
}
const examples: Example[] = [
  {
    path: "autosuggest-async",
    name: "Autosuggest(async)",
    Component: lazy(() => import("@/examples/autosuggest-async")),
  },
  {
    path: "autosuggest-task",
    name: "Autosuggest(task)",
    Component: lazy(() => import("@/examples/autosuggest-task")),
  },
  {
    path: "detail-view-async",
    name: "Detail View(async)",
    Component: lazy(() => import("@/examples/detail-view-async")),
  },
  {
    path: "detail-view-task",
    name: "Detail View(task)",
    Component: lazy(() => import("@/examples/detail-view-task")),
  },
  {
    path: "detail-view-redux-async",
    name: "Detail View(redux+async)",
    Component: lazy(() => import("@/examples/detail-view-redux-async")),
  },
];

interface AppProps {
  ssrPath?: string;
}

function Index() {
  return (
    <div className={S.index}>
      <Typography>
        <Typography.Title>React concurrency examples</Typography.Title>
        <Typography.Paragraph>Choose the example:</Typography.Paragraph>
      </Typography>
      <List
        className={S.list}
        bordered
        dataSource={examples}
        renderItem={({ path, name }) => (
          <List.Item key={path}>
            <List.Item.Meta title={<Link to={path}>{name}</Link>} />
          </List.Item>
        )}
      />
    </div>
  );
}

function App({ ssrPath }: AppProps) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Router ssrPath={ssrPath}>
        <Switch>
          {examples.map(({ path, Component }) => (
            <Route key={path} path={path}>
              <Suspense fallback="...">
                <Component />
              </Suspense>
            </Route>
          ))}
          <Route path="/">
            <Index />
          </Route>
        </Switch>
      </Router>
    </ConfigProvider>
  );
}

export default App;

import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "./App";

export function render(url: string) {
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <App ssrPath={url || "/"} />
    </React.StrictMode>
  );
  return { html };
}

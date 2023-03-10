import type { MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

import styles from "~/styles/global.css";
import stylesheet from "./styles/app.css";

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: stylesheet },
  ];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "xBS Tool",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-base-100">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

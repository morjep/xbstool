import type { MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

import styles from "~/styles/global.css";
import stylesheet from "./styles/app.css";

import { Navbar } from "./components/Components/Navbar";

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
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

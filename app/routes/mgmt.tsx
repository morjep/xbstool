import { json } from "@remix-run/node"; // or cloudflare/deno
import { Link, useLoaderData } from "@remix-run/react";

import invariant from "tiny-invariant";

import { getAllBreakdowns } from "~/models/breakdown.server";

export const loader = async () => {
  const breakdowns = await getAllBreakdowns();
  invariant(breakdowns, "No breakdowns found");
  console.log("Breakdowns: ", breakdowns);
  return json({ breakdowns });
};

export default function MgmtRoute() {
  const { breakdowns } = useLoaderData();

  return (
    <div>
      <h1>Breakdowns</h1>
      <ul>
        {breakdowns.map((breakdown) => (
          <li key={breakdown.id}>
            <Link to={`/layout/${breakdown.id}`}>
              <span className="link link-primary">{breakdown.breakdownName} </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

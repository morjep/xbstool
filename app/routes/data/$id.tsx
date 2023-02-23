import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";

import invariant from "tiny-invariant";

import { getBreakdownById } from "~/models/breakdown.server";

import { Navbar } from "~/components/Components/Navbar";

type LoaderData = {
  id: string;
  name: string;
  data: string;
};

// Server-side
export const loader = async ({ request, params }) => {
  const { id } = params;
  console.log("ID: ", id);
  const breakdown = await getBreakdownById(id);

  invariant(breakdown, "No breakdown found");
  invariant(breakdown.data, "No breakdown data found");

  return json({
    id,
    name: breakdown.breakdownName,
    data: breakdown.data,
  } as LoaderData);
};

// Client-side
export default function IdRoute() {
  const { id, name, data } = useLoaderData<LoaderData>();
  return (
    <div>
      <Navbar id={id} name={name} />
      <div style={{ height: 1024 }}>
        <div className="text-center">
          <p>
            <br />
            <textarea
              id="markdown"
              rows={35}
              cols={120}
              name="markdown"
              className={`font-mono border-2`}
              value={data}
            />
          </p>
          <button type="submit" className="btn bg-red-600">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

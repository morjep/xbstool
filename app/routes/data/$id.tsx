import { json, redirect } from "@remix-run/node"; // or cloudflare/deno
import type { ActionArgs } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";

import invariant from "tiny-invariant";

import { getBreakdownById, updateBreakdownData } from "~/models/breakdown.server";

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

  return json({
    id,
    name: breakdown.breakdownName,
    data: breakdown.data,
  } as LoaderData);
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const url = new URL(request.url);
  const id = url.pathname.replace(/\/data\//g, "");
  const data = formData.get("markdown") as string;

  await updateBreakdownData(id, data as string);

  return redirect("/layout/" + id);
};

// Client-side
export default function IdRoute() {
  const { id, name, data } = useLoaderData<LoaderData>();
  return (
    <div>
      <Navbar id={id} name={name} />
      <Form method="post">
        <div style={{ height: 1024 }}>
          <div className="text-center">
            <p>
              <br />
              <textarea
                id="markdown"
                rows={35}
                cols={120}
                name="markdown"
                className="textarea textarea-bordered"
                defaultValue={data}
              />
            </p>
            <button type="submit" className="btn bg-primary">
              Submit
            </button>{" "}
          </div>
        </div>
      </Form>
    </div>
  );
}

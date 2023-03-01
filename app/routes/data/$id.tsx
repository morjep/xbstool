import { json, redirect } from "@remix-run/node"; // or cloudflare/deno
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { useLoaderData, Form, useFetcher } from "@remix-run/react";

import invariant from "tiny-invariant";

import { getBreakdownById, updateBreakdownData } from "~/models/breakdown.server";

import { Navbar } from "~/components/Components/Navbar";
import debounce from "~/utils/util";

type LoaderData = {
  id: string;
  name: string;
  data: string;
};

// Server-side
export const loader = async ({ request, params }: LoaderArgs) => {
  const { id } = params;
  invariant(id, "No ID provided");
  invariant(typeof id === "string", "ID must be a string");
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

  return redirect("/data/" + id);
};

// Client-side
export default function IdRoute() {
  const { id, name, data } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();

  const _autoSave = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    fetcher.submit(e.target.form);
  };

  const autoSave = debounce((e: React.ChangeEvent<HTMLTextAreaElement>) => _autoSave(e), 500);

  return (
    <div>
      <Navbar id={id} name={name} />
      <Form reloadDocument method="post">
        <div style={{ height: 1024 }}>
          <div className="text-center ">
            <p>
              <br />
              <textarea
                id="markdown"
                rows={30}
                cols={120}
                name="markdown"
                className="textarea textarea-bordered bg-base-100"
                defaultValue={data}
                onChange={autoSave}
              />
            </p>
            {fetcher.state === "submitting" && <p>Saving...</p>}
            {/* <button type="submit" className="btn bg-primary">
              Save
            </button>{" "} */}
          </div>
        </div>
      </Form>
    </div>
  );
}

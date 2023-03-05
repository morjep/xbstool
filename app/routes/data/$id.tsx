import { json, redirect } from "@remix-run/node"; // or cloudflare/deno
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { useLoaderData, Form, useFetcher, useNavigation } from "@remix-run/react";

import invariant from "tiny-invariant";

import { getBreakdownById, updateBreakdownData } from "~/models/breakdown.server";

import { Navbar } from "~/components/Components/Navbar";
import debounce from "~/utils/util";
import { handleAIrequest } from "~/models/ai.server";
import { useEffect, useRef } from "react";

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
  let data = formData.get("markdown") as string;
  const action = formData.get("action") as string;

  if (action === "ai") {
    console.log("AI");
    const aiRequest = formData.get("ai") as string;
    data = await handleAIrequest(data, aiRequest);

    // // Delay to show spinner...
    // data = "testing delay...\n" + data;
    // await new Promise((res) => setTimeout(res, 1000));
  }
  await updateBreakdownData(id, data as string);

  return redirect("/data/" + id);
};

// Client-side
export default function IdRoute() {
  const { id, name, data } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();
  const navigation = useNavigation();

  let isRequestingAI = navigation.state === "submitting" || navigation.state === "loading";
  let formRef = useRef<HTMLFormElement>(null);

  const _autoSave = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    fetcher.submit(e.target.form);
  };

  const autoSave = debounce((e: React.ChangeEvent<HTMLTextAreaElement>) => _autoSave(e), 500);

  useEffect(() => {
    if (!isRequestingAI) {
      formRef.current?.reset();
    }
  }, [isRequestingAI]);

  return (
    <div>
      <Navbar id={id} name={name} />
      {/* <Form reloadDocument method="post">*/}
      <Form replace method="post" ref={formRef}>
        <div style={{ height: 1024 }}>
          <div className="flex text-center gap-8 justify-center">
            <div className="flex flex-col">
              <br />
              <textarea
                id="ai"
                rows={10}
                cols={50}
                name="ai"
                className="textarea textarea-bordered textarea-primary bg-base-100"
                placeholder="Write your request to the AI assistant here."
              />
              <button
                type="submit"
                name="action"
                value="ai"
                className={"btn bg-primary my-4 w-40" + (isRequestingAI ? " loading" : "")}
              >
                {isRequestingAI ? "LOADING" : "SUBMIT TO AI"}
              </button>
            </div>
            <div>
              <br />
              <textarea
                id="markdown"
                rows={30}
                cols={120}
                name="markdown"
                className="textarea textarea-bordered textarea-primary bg-base-100"
                defaultValue={data}
                onChange={autoSave}
              />

              {fetcher.state === "submitting" && <p>Saving...</p>}
            </div>
            {/* <button type="submit" className="btn bg-primary">
              Save
            </button>{" "} */}
          </div>
        </div>
      </Form>
    </div>
  );
}

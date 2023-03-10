import { json, redirect } from "@remix-run/node"; // or cloudflare/deno
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { useLoaderData, Form, useFetcher, useNavigation } from "@remix-run/react";

import invariant from "tiny-invariant";

import { getBreakdownById, updateBreakdownData } from "~/models/breakdown.server";

import { Navbar } from "~/components/Components/Navbar";
import debounce from "~/utils/util";
import { getAIreview, handleAIrequest } from "~/models/ai.server";
import { useEffect, useRef } from "react";

type LoaderData = {
  id: string;
  name: string;
  data: string;
  notes: string;
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
    notes: breakdown.notes,
  } as LoaderData);
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const url = new URL(request.url);
  const id = url.pathname.replace(/\/data\//g, "");
  let data = formData.get("markdown") as string;
  const notes = formData.get("notes") as string;
  const action = formData.get("action") as string;

  if (action === "aiRequest") {
    const userRequestToAI = formData.get("userRequestToAI") as string;
    data = await handleAIrequest(data, notes, userRequestToAI);
  }
  if (action == "aiReview") {
    data = await getAIreview(data, notes);
  }

  // // Delay to show spinner...
  // data = "testing delay...\n" + data;
  // await new Promise((res) => setTimeout(res, 1000));

  await updateBreakdownData(id, data as string, notes as string);

  return redirect("/data/" + id);
};

// Client-side
export default function IdRoute() {
  const { id, name, data, notes } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();
  const navigation = useNavigation();

  let isRequestingAI = navigation.state === "submitting" || navigation.state === "loading";
  let formRef = useRef<HTMLFormElement>(null);

  const _autoSave = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    fetcher.submit(e.target.form);
  };

  const autoSave = debounce((e: React.ChangeEvent<HTMLTextAreaElement>) => _autoSave(e), 1500);

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
              <h1 className="text-primary font-bold text-xl pt-6">AI Assistant</h1>

              <div className="divider" />
              <span className="text-primary text pb-2">
                Request the AI assistant for help with creating the WBS
              </span>
              <textarea
                id="ai"
                rows={10}
                cols={50}
                name="userRequestToAI"
                className="textarea textarea-bordered textarea-primary bg-base-100"
                placeholder="Write your request to the AI assistant here."
              />
              <div className="center">
                <button
                  type="submit"
                  name="action"
                  value="aiRequest"
                  className={"btn bg-primary my-4 w-40" + (isRequestingAI ? " loading" : "")}
                >
                  {isRequestingAI ? "LOADING" : "SUBMIT REQUEST"}
                </button>
              </div>
              <div className="divider" />

              <span className="text-primary text">Request the AI assistant to review the WBS</span>
              <div className="center">
                <button
                  type="submit"
                  name="action"
                  value="aiReview"
                  className={"btn bg-primary my-4 w-40" + (isRequestingAI ? " loading" : "")}
                >
                  {isRequestingAI ? "LOADING" : "REVIEW WBS"}
                </button>
              </div>
              <div className="divider" />
            </div>
            <div>
              <h1 className="text-primary font-bold text-xl pt-6">WBS markdown</h1>
              <div className="divider" />
              <textarea
                id="markdown"
                rows={30}
                cols={100}
                name="markdown"
                className="textarea textarea-bordered textarea-primary bg-base-100"
                defaultValue={data}
                onChange={autoSave}
              />

              {fetcher.state === "submitting" && <p>Saving...</p>}
            </div>

            <div>
              <h1 className="text-primary font-bold text-xl pt-6">WBS notes</h1>
              <div className="divider" />
              <textarea
                id="notes"
                rows={30}
                cols={50}
                name="notes"
                className="textarea textarea-bordered textarea-primary bg-base-100"
                defaultValue={notes}
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

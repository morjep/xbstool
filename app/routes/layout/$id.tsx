import Flow from "~/components/Flow";
import type { Node, Edge } from "reactflow";

// this is important! You need to import the styles from the lib to make ReactFlow
import reactFlowStyles from "reactflow/dist/style.css";
import styles from "~/styles/flow.css";

import { json, redirect } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";

import invariant from "tiny-invariant";

import { getBreakdownById } from "~/models/breakdown.server";

import generateLayoutFromData from "~/components/Flow/generateLayoutFromData";
import { Navbar } from "~/components/Components/Navbar";
import { createNewStyle } from "~/models/style.server";

type LoaderData = {
  initialNodes: Node[];
  initialEdges: Edge[];
  id: string;
  name: string;
  theme: string;
};

// Server-side
export const loader = async ({ request, params }) => {
  const { id } = params;
  const breakdown = await getBreakdownById(id);

  invariant(breakdown, "No breakdown found");

  if (breakdown.data === null) {
    return redirect("/data/" + id);
  }

  if (breakdown.style === null) {
    await createNewStyle(id);
    console.log(
      "Created new style for breakdown with id: " + id + " and name: " + breakdown.breakdownName
    );
  }
  const theme = breakdown.style?.theme || "emerald";

  const { nodes, edges } = generateLayoutFromData(breakdown.data);

  invariant(nodes.length > 0, "No nodes found");
  invariant(edges.length > 0, "No edges found");

  return json({
    initialNodes: nodes,
    initialEdges: edges,
    id,
    name: breakdown.breakdownName,
    theme,
  } as LoaderData);
};

// Client-side
export default function IdRoute() {
  const { initialNodes, initialEdges, id, name, theme } = useLoaderData<LoaderData>();
  return (
    <div>
      <Navbar id={id} name={name} />
      <div className="px-8 py-8">
        <div data-theme={theme} className="rounded-lg">
          <div style={{ height: 1024 }}>
            <div className="app bg-base-100 rounded-lg">
              <Flow initialNodes={initialNodes} initialEdges={initialEdges} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function links() {
  return [
    { rel: "stylesheet", href: reactFlowStyles },
    { rel: "stylesheet", href: styles },
  ];
}

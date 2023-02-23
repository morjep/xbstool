import Flow from "~/components/Flow";
import type { Node, Edge } from "reactflow";

// this is important! You need to import the styles from the lib to make ReactFlow
import reactFlowStyles from "reactflow/dist/style.css";
import styles from "~/styles/flow.css";

import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";

import invariant from "tiny-invariant";

import { getBreakdownById } from "~/models/breakdown.server";

import generateLayoutFromData from "~/components/Flow/generateLayoutFromData";
import { Navbar } from "~/components/Components/Navbar";

type LoaderData = {
  initialNodes: Node[];
  initialEdges: Edge[];
  id: string;
  name: string;
};

// Server-side
export const loader = async ({ request, params }) => {
  const { id } = params;
  console.log("ID: ", id);
  const breakdown = await getBreakdownById(id);

  invariant(breakdown, "No breakdown found");
  invariant(breakdown.data, "No breakdown data found");

  const { nodes, edges } = generateLayoutFromData(breakdown.data);

  invariant(nodes.length > 0, "No nodes found");
  invariant(edges.length > 0, "No edges found");

  return json({
    initialNodes: nodes,
    initialEdges: edges,
    id,
    name: breakdown.breakdownName,
  } as LoaderData);
};

// Client-side
export default function IdRoute() {
  const { initialNodes, initialEdges, id, name } = useLoaderData<LoaderData>();
  return (
    <div>
      <Navbar id={id} name={name} />
      <div style={{ height: 1024 }}>
        <div className="app">
          <Flow initialNodes={initialNodes} initialEdges={initialEdges} />
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

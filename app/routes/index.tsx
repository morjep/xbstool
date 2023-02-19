import Flow from "~/components/Flow";
import { MarkerType } from "reactflow";
import type { Node, Edge } from "reactflow";

// this is important! You need to import the styles from the lib to make ReactFlow
import reactFlowStyles from "reactflow/dist/style.css";
import styles from "~/styles/flow.css";

import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";

import invariant from "tiny-invariant";

import { getProjectWithName } from "~/models/project.server";
import { getBreakdownByProjectAndName, getAllBreakdowns } from "~/models/breakdown.server";

import generateLayoutFromData from "~/components/Flow/generateLayoutFromData";

type LoaderData = {
  initialNodes: Node[];
  initialEdges: Edge[];
};

// Server-side
export const loader = async () => {
  // The loader should be initiated with a breakdown ID - but this is just a demo
  const project = await getProjectWithName("Sparxpres");
  invariant(project, "No project found");
  console.log(await getAllBreakdowns());
  const breakdown = await getBreakdownByProjectAndName(project.id, "Card features");
  invariant(breakdown, "No breakdown found");
  console.log("Breakdown data: ", breakdown.data);
  invariant(breakdown.data, "No breakdown data found");
  const { nodes, edges } = generateLayoutFromData(breakdown.data);

  invariant(nodes.length > 0, "No nodes found");
  invariant(edges.length > 0, "No edges found");

  return json({ initialNodes: nodes, initialEdges: edges } as LoaderData);
};

// Client-side
export default function Index() {
  const { initialNodes, initialEdges } = useLoaderData<LoaderData>();
  return (
    <div className="app">
      <Flow initialNodes={initialNodes} initialEdges={initialEdges} />
    </div>
  );
}

export function links() {
  return [
    { rel: "stylesheet", href: reactFlowStyles },
    { rel: "stylesheet", href: styles },
  ];
}

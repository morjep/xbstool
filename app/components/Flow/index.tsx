import { useCallback } from "react";
import ReactFlow, { useNodesState, useEdgesState, addEdge, Controls, MiniMap } from "reactflow";
import { Edge } from "reactflow";
import type { Connection, Node } from "reactflow";

import ChildNode from "./ChildNode";
import TopNode from "./TopNode";
import ParentNode from "./ParentNode";

import Edge from "./Edge";

const nodeTypes = {
  child: ChildNode,
  top: TopNode,
  parent: ParentNode,
};

const edgeTypes = {
  custom: Edge,
};

function Flow({ initialNodes, initialEdges }: { initialNodes: Node[]; initialEdges: Edge[] }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
    >
      <Controls />
      {/* <MiniMap /> */}
    </ReactFlow>
  );
}

export default Flow;

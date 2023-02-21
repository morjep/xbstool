import { MarkerType } from "reactflow";
import type { Node, Edge } from "reactflow";

const splitLines = (str: string) => str.split(/\r?\n/);

const generateLayoutFromData = (data: String) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let parentCount = 0;
  const parentXoffset = 250;
  let parentX = 0;
  let childYoffset = 0;
  let id = 0;
  let topId = 0;
  let parentId = 0;
  let nodePosition = { x: 0, y: 0 };
  let nodeExtent = "parent";
  let nodeType = "top";
  let edgeSource = "";
  let edgeTarget = "";

  // First split the data into lines
  const lines = splitLines(data);

  // Count the number of level 2 nodes
  const level2Nodes = lines.filter((line: string) => line.trim().startsWith("** ")).length;
  console.log("Level 2 nodes:", level2Nodes);

  lines.forEach((line: string) => {
    id = id + 1;

    // Count the number of # in the line
    const level = (line.match(/\*/g) || []).length;
    // Remove the # from the line
    const label = line.replace(/\*/g, "");

    if (level != 0) {
      if (level === 1) {
        topId = id;
        nodePosition = { x: 0, y: 0 };
        nodeExtent = "parent";
        nodeType = "top";
      }
      if (level === 2) {
        parentId = id;
        parentCount = parentCount + 1;
        parentX =
          parentCount * parentXoffset - (level2Nodes * parentXoffset) / 2 - parentXoffset / 2;
        childYoffset = 100;
        nodePosition = { x: parentX, y: 100 };
        nodeExtent = "parent";
        nodeType = "parent";
        edgeSource = topId.toString();
        edgeTarget = id.toString();
      }
      if (level === 3) {
        nodePosition = { x: parentX + 35, y: childYoffset + 75 };
        nodeExtent = "default";
        nodeType = "child";

        childYoffset = childYoffset + 75; // for the next child
        edgeSource = parentId.toString();
        edgeTarget = id.toString();
      }

      // Create the node
      const node: Node = {
        id: id.toString(),
        data: { label: label.trim() },
        position: nodePosition,
        extent: nodeExtent,
        type: nodeType,
      };
      console.log("Node:", node);
      nodes.push(node);

      // Create the edge
      const edge: Edge = {
        id: id.toString(),
        source: edgeSource,
        target: edgeTarget,
        type: "smoothstep",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: "#000000",
        },
        style: {
          strokeWidth: 1,
          stroke: "#000000",
        },
      };
      edges.push(edge);
    }
  });

  return { nodes, edges };
};

export default generateLayoutFromData;

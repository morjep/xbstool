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
  let nodeType = "top";
  let edgeSource = "";
  let edgeTarget = "";

  // First split the data into lines
  const lines = splitLines(data as string);

  // Count the number of level 2 nodes
  const level2Nodes = lines.filter((line: string) => line.trim().startsWith("** ")).length;
  console.log("Level 2 nodes:", level2Nodes);

  lines.forEach((line: string) => {
    id = id + 1;

    // Count the number of # in the line
    const level = (line.match(/\*/g) || []).length;
    // Remove the # from the line
    const label = line.replace(/\*/g, "");

    // due date is indicated by __due__ in the line, so we need to extract that
    const dueDate = label.match(/__due_.*__/g);
    const dueDateStr = dueDate ? dueDate[0].replace(/__due_/g, "").replace(/__/g, "") : "";

    // Indicator is indicated by __indicator__ in the line, so we need to extract that
    // Indicator can be success, warning or error
    // Indicator also has a short form: __is__, __iw__ and __ie__
    const indicator = label.match(/__indicator_.*__/g);
    let indicatorStr = indicator
      ? indicator[0].replace(/__indicator_/g, "").replace(/__/g, "")
      : "";

    indicatorStr = label.match(/__is__/g) ? "success" : indicatorStr;
    indicatorStr = label.match(/__iw__/g) ? "warning" : indicatorStr;
    indicatorStr = label.match(/__ie__/g) ? "error" : indicatorStr;

    // Progress bar is indicated by __pbXX__ in the line, so we need to extract that
    const progress = label.match(/__pb.*__/g);
    const progressBar = progress ? true : false;
    const progressValue = progress ? progress[0].replace(/__pb/g, "").replace(/__/g, "") : "0";

    // remove the meta data from the label (should not be any left)
    let labelStr = label.replace(/__.*__/g, "");

    // Shorten the label if it is too long
    if (labelStr.length > 50) {
      labelStr = labelStr.substring(0, 50) + "...";
    }

    if (level != 0) {
      if (level === 1) {
        topId = id;
        nodePosition = { x: 0, y: 0 };
        nodeType = "top";
      }
      if (level === 2) {
        parentId = id;
        parentCount = parentCount + 1;
        parentX =
          parentCount * parentXoffset - (level2Nodes * parentXoffset) / 2 - parentXoffset / 2;
        childYoffset = 100;
        nodePosition = { x: parentX, y: 100 };
        nodeType = "parent";
        edgeSource = topId.toString();
        edgeTarget = id.toString();
      }
      if (level === 3) {
        nodePosition = { x: parentX + 35, y: childYoffset + 100 };
        nodeType = "child";
        if (labelStr.length < 26) {
          childYoffset = childYoffset + 60; // for the next child
        } else {
          childYoffset = childYoffset + 80; // for the next child
        }
        edgeSource = parentId.toString();
        edgeTarget = id.toString();
      }
      // Shorten the label if it is too long
      if (labelStr.length > 50) {
        labelStr = labelStr.substring(0, 50) + "...";
      }

      // Create the node
      const node: Node = {
        id: id.toString(),
        data: {
          label: labelStr.trim(),
          due: dueDateStr,
          indicator: indicatorStr,
          progressBar: progressBar,
          progressValue: progressValue,
        },
        position: nodePosition,
        // extent: nodeExtent,
        type: nodeType,
      };
      // console.log("Node:", node);
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
          color: "#a3a3a3",
        },
        style: {
          strokeWidth: 1,
          stroke: "#a3a3a3",
        },
      };

      edges.push(edge);
    }
  });

  return { nodes, edges };
};

export default generateLayoutFromData;

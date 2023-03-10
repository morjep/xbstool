import { MarkerType } from "reactflow";
import type { Node, Edge } from "reactflow";
import invariant from "tiny-invariant";

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
  let prevParentId = "";
  let edgePrev = "";
  let connectParents = false;

  const wbsLines = getWbsLines(data);
  const level2Nodes = getLevel2Nodes(wbsLines);

  if (wbsLines) {
    wbsLines.forEach((line: string) => {
      id = id + 1;

      const { level, content, comment } = getLevelAndContent(line);

      const dueDate = extractDueDate(content);
      const indicator = extractIndicator(content);
      const progressBar = extractProgressBar(content);
      const progressValue = extractProgressValue(content);
      const est = extractEst(content);

      // Only check if we are on the first level (i.e. top level) - remember for subsequent passes
      if (level === 1 && connectParents === false) {
        connectParents = content.match(/__connect_parents__/g) ? true : false;
      }

      // remove the meta data from the label (should not be any left)
      let label = content.replace(/__.*__/g, "");

      // Shorten the label if it is too long
      if (label.length > 50) {
        label = label.substring(0, 50) + "...";
      }

      if (level != 0 && level < 4) {
        if (level === 1) {
          topId = id;
          // Drop the top node edges if we are connecting parents
          if (connectParents) {
            topId = -1;
          }
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

          edgePrev = prevParentId;
          prevParentId = id.toString();
        }
        if (level === 3) {
          nodePosition = { x: parentX + 35, y: childYoffset + 100 };
          nodeType = "child";
          if (label.length < 26) {
            childYoffset = childYoffset + 60; // for the next child
          } else {
            childYoffset = childYoffset + 80; // for the next child
          }
          if (progressBar) {
            childYoffset = childYoffset + 30; // for the next child
          }
          edgeSource = parentId.toString();
          edgeTarget = id.toString();
        }

        // Create the node
        const node: Node = {
          id: id.toString(),
          data: {
            label: label.trim(),
            due: dueDate,
            indicator: indicator,
            progressBar: progressBar,
            progressValue: progressValue,
            est: est,
          },
          position: nodePosition,
          type: nodeType,
        };
        nodes.push(node);

        // Create the edge
        const edge: Edge = {
          id: id.toString(),
          source: edgeSource,
          sourceHandle: "source",
          target: edgeTarget,
          targetHandle: "target",
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

        // Create the edge to the previous parent
        if (connectParents && edgePrev != "") {
          const edge: Edge = {
            id: id.toString(),
            source: edgePrev,
            sourceHandle: "prev",
            target: edgeTarget,
            targetHandle: "next",
            type: "bezier",
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: "#a3a3a3",
            },
            style: {
              strokeWidth: 2,
              stroke: "#a3a3a3",
            },
          };
          edges.push(edge);
        }
      }
    });
  }

  return { nodes, edges };
};

export default generateLayoutFromData;

// Utility functions below here - hoisted to the top of the file

function getWbsLines(data: String) {
  if (data) {
    const wbsLines = data.trim().split("\n");
    return wbsLines;
  } else {
    console.log("No WBS found");
    return [];
  }
}

function getLevel2Nodes(lines: string[]): number {
  const level2Nodes = lines.filter((line: string) => line.trim().startsWith("** ")).length;
  return level2Nodes;
}

function getLevelAndContent(line: string) {
  const regex = /^(?<level>\*+)\s*(?<text>.+?)(?<comment>\s*\/\/.*)?$/gm;
  const found = regex.exec(line.trimStart());
  const level = found?.groups?.level?.length ?? 0;
  const text = found?.groups?.text ?? "";
  const comment = found?.groups?.comment?.trim() ?? "";
  console.log(`Level ${level}: ${text} ${comment}`);
  return { level, content: text, comment };
}

function extractDueDate(line: string): string {
  const dueDateRegex = /__due_(?<date>.*)__/g;
  const match = dueDateRegex.exec(line);
  const dueDateStr = match?.groups?.date ?? "";
  return dueDateStr;
}

function extractIndicator(line: string): string {
  const indicator = line.match(/__indicator_.*__/g);
  let indicatorStr = indicator ? indicator[0].replace(/__indicator_/g, "").replace(/__/g, "") : "";

  indicatorStr = line.match(/__is__/g) ? "success" : indicatorStr;
  indicatorStr = line.match(/__iw__/g) ? "warning" : indicatorStr;
  indicatorStr = line.match(/__ie__/g) ? "error" : indicatorStr;
  return indicatorStr;
}

function extractProgressBar(line: string): boolean {
  const progress = line.match(/__pb_.*__/g);
  const progressBar = progress ? true : false;
  return progressBar;
}

function extractProgressValue(line: string): string {
  const progressRegex = /__pb_(?<value>\d+)__/g;
  const match = progressRegex.exec(line);
  const progressValue = match?.groups?.value ?? "0";
  return progressValue;
}

function extractEst(line: string): string {
  const estRegex = /__est_(?<est>.*)__/g;
  const match = estRegex.exec(line);
  const est = match?.groups?.est ?? "";
  return est;
}

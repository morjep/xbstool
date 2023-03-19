import { MarkerType } from "reactflow";
import type { Node, Edge } from "reactflow";
import { WBS, WBSNode } from "./layoutUtils";

const generateLayoutFromData = (data: string) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  let nextChildYoffset = 0;

  const wbs = new WBS(data);
  if (wbs.isValidWBS()) {
    wbs.getWbsLines().forEach((wbsline: string) => {
      const wbsNode = new WBSNode(wbsline, wbs.getNewId());

      if (wbsNode.isValidLevel()) {
        wbs.addNode(wbsNode);

        if (wbsNode.level() === 1) {
          wbs.setConnectParents(wbsNode.connectParents());
        }

        if (wbsNode.level() === 2) {
          const parentNumber = wbsNode.parent.children.length;
          const totalParents = wbs.getNumberOfParentNodes();
          const { x, y } = calcParentPos(parentNumber, totalParents);
          wbsNode.setPos(x, y);
        }

        if (wbsNode.level() === 3) {
          const childNumber = wbsNode.parent.children.length;
          const parentXpos = wbsNode.parent.position.x;

          if (childNumber === 1) {
            nextChildYoffset = 0;
          }
          const { x, y } = calcChildPos(parentXpos, nextChildYoffset);
          wbsNode.setPos(x, y);

          nextChildYoffset = updateNextChildYoffset(wbsNode, nextChildYoffset);
        }
      }
    });
  }

  // push all nodes in the wbs to the nodes array and create the edges
  wbs.nodes.forEach((wbsNode: WBSNode) => {
    nodes.push(wbsNode.node);

    const edge =
      wbsNode.level() === 2 && wbs.getConnectParents()
        ? createParentParentEdge(wbsNode)
        : createParentChildEdge(wbsNode);
    edges.push(edge);
  });

  return { nodes, edges };
};

export default generateLayoutFromData;

function createParentChildEdge(wbsNode: WBSNode) {
  const edge: Edge = {
    id: wbsNode.id,
    source: wbsNode.edgeSource,
    sourceHandle: "source",
    target: wbsNode.edgeTarget,
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
  return edge;
}

function createParentParentEdge(wbsNode: WBSNode) {
  const edge: Edge = {
    id: wbsNode.id,
    source: wbsNode.edgePrevParent,
    sourceHandle: "prev",
    target: wbsNode.edgeTarget,
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
  return edge;
}

function calcParentPos(parentNumber: number, totalParents: number) {
  const parentsXdistance = 250;
  const parentsYpos = 100;

  const x = parentsXdistance * (parentNumber - 0.5 * totalParents - 0.5);

  return { x, y: parentsYpos };
}

function calcChildPos(parentXpos: number, yOffset: number) {
  const childXoffset = 35;
  const firstChildYpos = 200;

  const x = parentXpos + childXoffset;

  return { x, y: firstChildYpos + yOffset };
}

function updateNextChildYoffset(wbsNode: WBSNode, nextChildYoffset: number) {
  const { showProgressBar } = wbsNode.getProgressBar();
  const lineLabel = wbsNode.getLineLabel();

  nextChildYoffset = nextChildYoffset + 60; // standard offset for the next child

  if (lineLabel.length > 26) {
    // if the line label is longer than 26 characters, add an extra offset
    nextChildYoffset = nextChildYoffset + 20;
  }
  if (showProgressBar) {
    // if the progress bar is shown, add an extra offset
    nextChildYoffset = nextChildYoffset + 20;
  }
  return nextChildYoffset;
}

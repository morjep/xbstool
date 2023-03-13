import { MarkerType } from "reactflow";
import type { Node, Edge } from "reactflow";
import { WBS, WBSNode } from "./layoutUtils";

class TopNode {
  id: string;

  position: {
    x: number;
    y: number;
  };
  type: string;
  node: Node = {} as Node;
  constructor(id: string, wbsNode: WBSNode) {
    this.id = id;
    if (wbsNode.connectParents()) {
      this.id = "-1"; // Meaning it is not a node anyone can connect to
    }
    this.position = {
      x: 0,
      y: 0,
    };
    this.type = "top";
    const { showProgressBar, progress } = wbsNode.getProgressBar();

    this.node = {
      id: this.id,
      data: {
        label: wbsNode.getLineLabelShort(),
        due: wbsNode.getDueDate(),
        indicator: wbsNode.getIndicator(),
        est: wbsNode.getEstimate(),
        comment: wbsNode.getLineComment(),
        progressBar: showProgressBar,
        progressValue: progress,
      },
      position: this.position,
      type: this.type,
    };
  }
  getTopNodeId() {
    return this.id;
  }
}

const generateLayoutFromData = (data: string) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let parentCount = 0;
  const parentXoffset = 250;
  let parentX = 0;
  let childYoffset = 0;
  let id = 0;
  let parentId = 0;
  let nodePosition = { x: 0, y: 0 };
  let nodeType = "top";
  let edgeSource = "";
  let edgeTarget = "";
  let prevParentId = "";
  let edgePrev = "";
  let topNode = {} as TopNode;

  const wbs = new WBS(data);
  if (wbs.isValidWBS()) {
    wbs.getWbsLines().forEach((wbsline: string) => {
      id = id + 1;

      const wbsNode = new WBSNode(wbsline);
      const { showProgressBar, progress } = wbsNode.getProgressBar();

      if (wbsNode.isValidLevel()) {
        if (wbsNode.isTop()) {
          topNode = new TopNode(id.toString(), wbsNode);
        }
        if (wbsNode.isParent()) {
          parentId = id;
          parentCount = parentCount + 1;
          parentX =
            parentCount * parentXoffset -
            (wbs.getNumberOfParentNodes() * parentXoffset) / 2 -
            parentXoffset / 2;
          childYoffset = 100;
          nodePosition = { x: parentX, y: 100 };
          nodeType = "parent";
          edgeSource = topNode.getTopNodeId().toString();
          edgeTarget = id.toString();

          edgePrev = prevParentId;
          prevParentId = id.toString();
        }
        if (wbsNode.isChild()) {
          nodePosition = { x: parentX + 35, y: childYoffset + 100 };
          nodeType = "child";
          if (wbsNode.getLineLabel().length < 26) {
            childYoffset = childYoffset + 60; // for the next child
          } else {
            childYoffset = childYoffset + 80; // for the next child
          }
          if (showProgressBar) {
            childYoffset = childYoffset + 30; // for the next child
          }
          edgeSource = parentId.toString();
          edgeTarget = id.toString();
        }

        // Create the node
        if (wbsNode.isTop()) {
          nodes.push(topNode.node);
        } else {
          const _node: Node = {
            id: id.toString(),
            data: {
              label: wbsNode.getLineLabelShort(),
              due: wbsNode.getDueDate(),
              indicator: wbsNode.getIndicator(),
              progressBar: showProgressBar,
              progressValue: progress,
              est: wbsNode.getEstimate(),
            },
            position: nodePosition,
            type: nodeType,
          };
          nodes.push(_node);
        }

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
        if (wbsNode.connectParents() && edgePrev != "") {
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

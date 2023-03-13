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
  children: string[] = [];
  childCount: number = 0;

  constructor(id: string, wbsNode: WBSNode) {
    this.id = id;
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
  getId() {
    return this.id;
  }
  addChild(id: string) {
    this.children.push(id);
    this.childCount++;
  }
  getNumberOfChildren() {
    return this.childCount;
  }
}

class ParentNode {
  id: string;
  parentId: string;
  position: {
    x: number;
    y: number;
  };
  type: string;
  node: Node = {} as Node;
  edgeSource: string = "";
  edgeTarget: string = "";

  constructor(id: string, parentId: string, wbsNode: WBSNode) {
    this.id = id;
    this.parentId = parentId;
    this.position = {
      x: 0,
      y: 0,
    };
    this.type = "parent";
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
    this.edgeSource = this.parentId;
    this.edgeTarget = this.id;
  }

  getId() {
    return this.id;
  }
  getParentId() {
    return this.parentId;
  }
  setPos(x: number, y: number) {
    this.position = { x, y };
    this.node.position = this.position;
  }
  calcPos(count: number, parentsTotal: number) {
    const parentXoffset = 250;
    const parentY = 100;
    const x = count * parentXoffset - (parentsTotal * parentXoffset) / 2 - parentXoffset / 2;
    this.position = { x, y: parentY };
    this.node.position = this.position;
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
  let parentId = "";
  let nodePosition = { x: 0, y: 0 };
  let nodeType = "top";
  let edgeSource = "";
  let edgeTarget = "";
  let prevParentId = "";
  let edgePrev = "";
  let topNode = {} as TopNode;
  let parentNode = {} as ParentNode;
  let parentNodes = [] as ParentNode[];

  const wbs = new WBS(data);
  if (wbs.isValidWBS()) {
    wbs.getWbsLines().forEach((wbsline: string) => {
      id = id + 1;

      const wbsNode = new WBSNode(wbsline);
      const { showProgressBar, progress } = wbsNode.getProgressBar();

      if (wbsNode.isValidLevel()) {
        if (wbsNode.isTop()) {
          topNode = new TopNode(id.toString(), wbsNode);
          wbs.setConnectParents(wbsNode.connectParents());
        }

        if (wbsNode.isParent()) {
          parentNode = new ParentNode(id.toString(), topNode.getId(), wbsNode);
          topNode.addChild(parentNode.getId());
          parentNode.calcPos(topNode.getNumberOfChildren(), wbs.getNumberOfParentNodes());
          parentCount = parentCount + 1;
          parentX =
            parentCount * parentXoffset -
            (wbs.getNumberOfParentNodes() * parentXoffset) / 2 -
            parentXoffset / 2;
          childYoffset = 100;
          // nodePosition = { x: parentX, y: 100 };
          // parentNode.setPos(parentX, 100);
          nodeType = "parent";
          edgeSource = !wbs.getConnectParents() ? topNode.getId() : "-1";
          edgeTarget = parentNode.getId();

          edgePrev = prevParentId;
          prevParentId = parentNode.getId();

          parentId = parentNode.getId();
          parentNodes.push(parentNode);
        }

        if (wbsNode.isChild()) {
          // Get parent data from the last entry in the parentNodes array
          parentNode = parentNodes[parentNodes.length - 1];
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
        } else if (wbsNode.isParent()) {
          nodes.push(parentNode.node);
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
        if (wbs.getConnectParents() && edgePrev != "") {
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

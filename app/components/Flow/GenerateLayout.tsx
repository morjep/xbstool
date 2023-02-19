import Flow from "~/components/Flow";
import { MarkerType } from "reactflow";
import type { Node, Edge } from "reactflow";

import type { Element } from "~/models/element.server";
import invariant from "tiny-invariant";

const generateLayout = (elements: Element[]) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let xItems = new Array(5).fill(0);

  // First find how many elements are immediately  below the top element
  // This is used to distribute the top element evenly
  const topElement = elements.find((e) => e.level === 0);
  invariant(topElement, "No top element found");
  const topElementChildren = elements.filter((e) => e.parentElementId === topElement.id);
  const topElementChildrenCount = topElementChildren.length;
  console.log("Top element children count", topElementChildrenCount);

  elements.forEach((element) => {
    xItems[element.level] = xItems[element.level] + 1;

    // Top element should always be centered on viewport
    if (element.level === 0) {
      element.nodeXpos = 0;
      element.nodeYpos = 0;
      console.log("Top element", element);
    }

    // IF the element is a parent, it should be distributed evenly on the level
    const parentXoffset = 250;
    if (element.level > 0 && element.nodeExtent === "parent") {
      element.nodeXpos =
        xItems[element.level] * parentXoffset -
        (topElementChildrenCount / 2) * parentXoffset -
        parentXoffset / 2;
      element.nodeYpos = element.level * 100;
    }

    // IF the element is a child, it should be distributed in a column below the parent
    else if (element.nodeExtent === "") {
      // get nodeXpos from parent element
      const parentElement = elements.find((e) => e.id === element.parentElementId);
      invariant(parentElement, "No parent element found");
      element.nodeXpos = parentElement.nodeXpos + 35;
      element.nodeYpos = parentElement.nodeYpos + 75;
      parentElement.nodeYpos = parentElement.nodeYpos + 75;
    }

    const node: Node = {
      id: element.id,
      data: { label: element.nodeLabel },
      position: {
        x: element.nodeXpos,
        y: element.nodeYpos,
      },
      extent: element.nodeExtent,
      type: element.nodeType ? element.nodeType : "default",
    };
    nodes.push(node);
    if (element.parentElementId) {
      const edge: Edge = {
        id: element.parentElementId + "-" + element.id,
        target: element.id,
        source: element.parentElementId,
        animated: false,
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

export default generateLayout;

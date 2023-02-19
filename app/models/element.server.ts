import { prisma } from "~/utils/db.server";
import type { Element } from "@prisma/client";
import invariant from "tiny-invariant";

export async function getAllElements() {
  return prisma.element.findMany({
    select: {
      id: true,
      elementName: true,
      breakdownId: true,
      children: true,
      parentElement: true,
    },
  });
}

export async function getAllElementsByBreakdownId(breakdownId: string) {
  return prisma.element.findMany({
    where: { breakdownId },
  });
}

export async function createTopElement(elementName: string, breakdownId: string): Promise<Element> {
  const nodeLabel = elementName;
  return prisma.element.create({
    data: {
      elementName,
      breakdown: { connect: { id: breakdownId } },
      top: true,
      nodeLabel,
      nodeXpos: 0,
      nodeYpos: 0,
      nodeType: "top",
      nodeExtent: "parent",
      level: 0,
    },
  });
}

export async function createElement(
  elementName: string,
  breakdownId: string,
  parentId: string
): Promise<Element> {
  const nodeLabel = elementName;

  const parentElement = await prisma.element.findUnique({
    where: { id: parentId },
  });
  invariant(parentElement, "Parent element not found");

  let parentNodeType = "default";
  if (parentElement.nodeType === "top") parentNodeType = "top";
  else parentNodeType = "parent";

  await prisma.element.update({
    where: { id: parentId },
    data: {
      nodeExtent: "parent",
      nodeType: parentNodeType,
    },
  });

  invariant(parentElement.level !== null, "Parent element must have level set");

  return prisma.element.create({
    data: {
      elementName,
      breakdown: { connect: { id: breakdownId } },
      parentElement: { connect: { id: parentId } },
      top: false,
      nodeLabel,
      nodeXpos: 0,
      nodeYpos: 0,
      nodeExtent: "",
      nodeType: "child",
      level: parentElement.level + 1,
    },
  });
}

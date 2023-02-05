import { prisma } from "~/utils/db.server";

export async function getAllElements() {
  return prisma.element.findMany({
    select: {
      id: true,
      name: true,
      breakdownId: true,
      children: true,
      parentElement: true,
    },
  });
}

export async function createNewTopElement(name: string, breakdownId: string) {
  return prisma.element.create({
    data: {
      name,
      breakdown: { connect: { id: breakdownId } },
    },
  });
}

export async function createNewSubElement(name: string, breakdownId: string, parentId: string) {
  return prisma.element.create({
    data: {
      name,
      breakdown: { connect: { id: breakdownId } },
      parentElement: { connect: { id: parentId } },
    },
  });
}

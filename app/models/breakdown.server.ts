import { prisma } from "~/utils/db.server";

export async function getAllBreakdowns() {
  return prisma.breakdown.findMany({
    where: { deleted: false },
    select: {
      id: true,
      breakdownName: true,
      projectId: true,
      data: true,
    },
  });
}

export async function getBreakdown(breakdownId: string) {
  return prisma.breakdown.findFirst({
    where: { id: breakdownId },
    select: {
      id: true,
      breakdownName: true,
      projectId: true,
      data: true,
      notes: true,
      style: {
        select: {
          theme: true,
        },
      },
    },
  });
}

export async function updateBreakdown(breakdownId: string, data: string, notes: string) {
  return prisma.breakdown.update({
    where: { id: breakdownId },
    data: { data, notes },
  });
}

export async function newBreakdown(breakdownName: string, projectId: string) {
  return prisma.breakdown.create({
    data: {
      breakdownName,
      project: { connect: { id: projectId } },
      autoLayout: true,
    },
  });
}

export async function updateBreakdownName(breakdownId: string, breakdownName: string) {
  return prisma.breakdown.update({
    where: { id: breakdownId },
    data: { breakdownName },
  });
}

export async function deleteBreakdown(breakdownId: string) {
  return prisma.breakdown.update({
    where: { id: breakdownId },
    data: { deleted: true },
  });
}

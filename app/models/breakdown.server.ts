import { prisma } from "~/utils/db.server";

export async function getAllBreakdowns() {
  return prisma.breakdown.findMany({
    select: {
      id: true,
      breakdownName: true,
      projectId: true,
      data: true,
    },
  });
}

export async function getBreakdownByProjectAndName(projectId: string, breakdownName: string) {
  return prisma.breakdown.findFirst({
    where: { projectId, breakdownName },
    select: {
      id: true,
      breakdownName: true,
      projectId: true,
      data: true,
    },
  });
}

export async function createNewBreakdown(breakdownName: string, projectId: string) {
  return prisma.breakdown.create({
    data: {
      breakdownName,
      project: { connect: { id: projectId } },
      autoLayout: true,
    },
  });
}

export async function addDataToBreakdown(breakdownId: string, data: string) {
  return prisma.breakdown.update({
    where: { id: breakdownId },
    data: { data },
  });
}

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

export async function getBreakdownById(breakdownId: string) {
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

export async function getBreakdownByName(breakdownName: string) {
  return prisma.breakdown.findFirst({
    where: { breakdownName },
    select: {
      id: true,
      breakdownName: true,
      projectId: true,
      data: true,
    },
  });
}

export async function updateBreakdownData(breakdownId: string, data: string, notes: string) {
  return prisma.breakdown.update({
    where: { id: breakdownId },
    data: { data, notes },
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

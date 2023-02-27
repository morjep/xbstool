import { prisma } from "~/utils/db.server";

export async function createNewStyle(breakdownId: string) {
  return prisma.style.create({
    data: {
      breakdown: { connect: { id: breakdownId } },
    },
  });
}

export async function updateTheme(breakdownId: string, theme: string) {
  return prisma.style.update({
    where: { breakdownId },
    data: { theme },
  });
}

export async function getStyle(breakdownId: string) {
  return prisma.style.findFirst({
    where: { breakdownId },
    select: {
      theme: true,
      arrows: true,
      shadows: true,
    },
  });
}

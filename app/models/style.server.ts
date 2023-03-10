import { prisma } from "~/utils/db.server";

export async function createStyle(breakdownId: string) {
  return prisma.style.create({
    data: {
      breakdown: { connect: { id: breakdownId } },
    },
  });
}

export async function readStyle(breakdownId: string) {
  return prisma.style.findFirst({
    where: { breakdownId },
    select: {
      theme: true,
      arrows: true,
      shadows: true,
    },
  });
}

export async function updateStyleTheme(breakdownId: string, theme: string) {
  return prisma.style.update({
    where: { breakdownId },
    data: { theme },
  });
}

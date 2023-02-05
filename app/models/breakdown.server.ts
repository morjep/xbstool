import { prisma } from "~/utils/db.server";

export async function getAllBreakdowns() {
    return prisma.breakdown.findMany({
        select: {
            id: true,
            name: true,
            projectId: true,
        }
    });
}

export async function createNewBreakdown(name: string, projectId: string) {
    return prisma.breakdown.create({
        data: {
            name,
            project: { connect: { id: projectId } },
        },
    });
}

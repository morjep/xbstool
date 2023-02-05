import { prisma } from "~/utils/db.server";

export async function getAllProjects() {
    return prisma.project.findMany({
        select: {
            id: true,
            name: true,
        }
    });
}

export async function createNewProject(name: string) {
    return prisma.project.create({
        data: {
            name,
        },
    });
}

export async function getProjectById(id: string) {
    return prisma.project.findUnique({
        where: {
            id,
        },
    });
}
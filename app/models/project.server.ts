import { prisma } from "~/utils/db.server";

/**
 * It returns all projects in the database
 * @returns An array of objects with the id and name of each project.
 */
export async function getAllProjects() {
  return prisma.project.findMany({
    select: {
      id: true,
      name: true,
    },
  });
}

/**
 * It creates a new project with the given name
 * @param {string} name - string
 * @returns A promise that resolves to a Project object.
 */
export async function createNewProject(name: string) {
  return prisma.project.create({
    data: {
      name,
    },
  });
}

/**
 * It returns a project by its id
 * @param {string} id - The id of the project you want to get.
 * @returns A promise that resolves to a Project object.
 */
export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: {
      id,
    },
  });
}

import { prisma } from "~/utils/db.server";
import type { Project } from "@prisma/client";

export async function getAllProjects(): Promise<Project[]> {
  // Get all projects from the database
  const projects = prisma.project.findMany({});

  // Return the projects
  return projects;
}

export async function getProjectWithName(projectName: string): Promise<Project | null> {
  // Get the project with the provided name
  const project = await prisma.project.findFirst({
    where: {
      projectName,
    },
  });

  // Return the project
  return project;
}

export async function createNewProject(projectName: string): Promise<Project> {
  // Create a new project with the provided name
  const project = await prisma.project.create({
    data: {
      projectName,
    },
  });

  // Return the new project
  return project;
}

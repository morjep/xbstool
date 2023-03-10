import { prisma } from "~/utils/db.server";
import type { Project } from "@prisma/client";
import { deleteBreakdown } from "./breakdown.server";

export async function createProject(projectName: string): Promise<Project> {
  // Create a new project with the provided name
  const project = await prisma.project.create({
    data: {
      projectName,
    },
  });

  // Return the new project
  return project;
}

export async function getAllProjects(): Promise<Project[]> {
  // Get all projects from the database
  const projects = prisma.project.findMany({
    where: {
      deleted: false,
    },
  });

  // Return the projects
  return projects;
}

export async function getProjectWithName(projectName: string): Promise<Project | null> {
  // Get the project with the provided name
  const project = await prisma.project.findFirst({
    where: {
      projectName,
      deleted: false,
    },
  });

  // Return the project
  return project;
}

export async function getProject(projectId: string): Promise<Project | null> {
  // Get the project with the provided ID
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      deleted: false,
    },
  });

  // Return the project
  return project;
}

export async function updateProjectName(projectId: string, projectName: string): Promise<Project> {
  // Update the project with the provided name
  const project = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      projectName,
    },
  });

  // Return the updated project
  return project;
}

export async function deleteProject(projectId: string): Promise<Project> {
  // Delete the project with the provided ID

  // iterate over all breakdowns and delete them
  const breakdowns = await prisma.breakdown.findMany({
    where: {
      projectId,
    },
  });

  for (const breakdown of breakdowns) {
    await deleteBreakdown(breakdown.id);
  }

  const project = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      deleted: true,
    },
  });

  // Return the deleted project
  return project;
}

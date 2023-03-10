import { getAllProjects, createNewProject } from "~/models/project.server";
import {
  getAllBreakdowns,
  createNewBreakdown,
  updateBreakdownData,
} from "~/models/breakdown.server";

function log() {
  getAllProjects().then((projects) => {
    console.log(projects);
  });
  getAllBreakdowns().then((breakdown) => {
    console.log(breakdown);
  });
}

/**
 * It creates a project, a breakdown, a task, two sub tasks, and a sub sub task
 */
async function seed() {
  console.log("Seeding begun!");

  let project = await createNewProject("Test project");
  let breakdown = await createNewBreakdown("Test breakdown", project.id);
  await updateBreakdownData(
    breakdown.id,
    `* Test task
  ** Test sub task
  *** Test sub sub task
  ** Test sub task 2
  *** Test sub sub task 2
  *** Test sub sub task 3
    `,
    "Test notes"
  );

  console.log("Seeding complete!");

  log();
}

seed();

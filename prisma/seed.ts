import { readAllProjects, createProject } from "~/models/project.server";
import { readAllBreakdowns, createBreakdown, updateBreakdown } from "~/models/breakdown.server";

function log() {
  readAllProjects().then((projects) => {
    console.log(projects);
  });
  readAllBreakdowns().then((breakdown) => {
    console.log(breakdown);
  });
}

/**
 * It creates a project, a breakdown, a task, two sub tasks, and a sub sub task
 */
async function seed() {
  console.log("Seeding begun!");

  let project = await createProject("Test project");
  let breakdown = await createBreakdown("Test breakdown", project.id);
  await updateBreakdown(
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

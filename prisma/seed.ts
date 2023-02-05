import { getAllProjects, createNewProject } from "~/models/project.server";
import { getAllBreakdowns, createNewBreakdown } from "~/models/breakdown.server";
import { getAllElements, createNewTopElement, createNewSubElement } from "~/models/element.server";

function log() {
  console.log("Seeding complete!");
  getAllProjects().then((projects) => {
    console.log(projects);
  });
  getAllBreakdowns().then((breakdown) => {
    console.log(breakdown);
  });
  getAllElements().then((elements) => {
    console.log(elements);
  });
}

/**
 * It creates a project, a breakdown, a task, two sub tasks, and a sub sub task
 */
async function seed() {
  let currentProject = await createNewProject("My first project via the model");
  let currentBreakdown = await createNewBreakdown(
    "My first breakdown via the model",
    currentProject.id
  );
  let currentTopElement = await createNewTopElement(
    "My first task via the model",
    currentBreakdown.id
  );
  await createNewSubElement(
    "My first sub task via the model",
    currentBreakdown.id,
    currentTopElement.id
  );
  let element = await createNewSubElement(
    "My second sub task via the model",
    currentBreakdown.id,
    currentTopElement.id
  );
  await createNewSubElement("My first sub sub task via the model", currentBreakdown.id, element.id);
  log();
}

seed();

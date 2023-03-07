import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import {
  MgmtContainer,
  MgmtContainerButton,
  MgmtContainerInput,
  MgmtContainerSelect,
} from "~/components/Components/MgmtContainer";
import { MgmtSelect } from "~/components/Components/MgmtSelect";
import { MgmtSelectInput } from "~/components/Components/MgmtSelectInput";
import {
  deleteBreakdown,
  getAllBreakdowns,
  getBreakdownByName,
  updateBreakdownName,
} from "~/models/breakdown.server";
import {
  deleteProject,
  getAllProjects,
  getProjectWithName,
  updateProjectName,
} from "~/models/project.server";

export const loader = async () => {
  const projects = await getAllProjects();
  const breakdowns = await getAllBreakdowns();
  invariant(projects, "No projects found");
  invariant(breakdowns, "No breakdowns found");
  return json({ projects, breakdowns });
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const action = formData.get("action") as string;

  if (action === "newNameProject") {
    const selectedProject = formData.get("selectedProject") as string;
    const newNameProject = formData.get("newNameProject") as string;
    await getProjectWithName(selectedProject).then((project) => {
      if (project) {
        updateProjectName(project.id, newNameProject);
      }
    });
  }

  if (action === "newNameBreakdown") {
    const selectedBreakdown = formData.get("selectedBreakdown") as string;
    const newNameBreakdown = formData.get("newNameBreakdown") as string;
    await getBreakdownByName(selectedBreakdown).then((breakdown) => {
      if (breakdown) {
        updateBreakdownName(breakdown.id, newNameBreakdown);
      }
    });
  }

  if (action === "deleteProject") {
    const selectedProject = formData.get("selectedProject") as string;
    await getProjectWithName(selectedProject).then((project) => {
      if (project) {
        deleteProject(project.id);
      }
    });
  }

  if (action === "deleteBreakdown") {
    const selectedBreakdown = formData.get("selectedBreakdown") as string;
    await getBreakdownByName(selectedBreakdown).then((breakdown) => {
      if (breakdown) {
        deleteBreakdown(breakdown.id);
      }
    });
  }

  return redirect("/mgmt/");
};

export default function EditRoute() {
  const { projects, breakdowns } = useLoaderData();

  return (
    <Form method="post">
      <div className="divider text-lg font-bold">Rename Project</div>
      <MgmtContainer>
        <MgmtContainerSelect
          name="selectedProject"
          placeholder="Select a project"
          options={projects.map((project) => project.projectName).sort()}
        />
        <MgmtContainerInput name="newNameProject" placeholder="Enter new name of project" />
        <MgmtContainerButton action="newNameProject" buttonName="Rename" />
      </MgmtContainer>

      <div className="divider text-lg font-bold">Rename Breakdown</div>

      <MgmtSelectInput
        name="selectedBreakdown"
        nameInput="newNameBreakdown"
        placeholderSelect="Select a breakdown"
        placeholderInput="Enter name of new breakdown"
        action="newNameBreakdown"
        options={breakdowns.map((breakdown) => breakdown.breakdownName).sort()}
        buttonName="Rename"
      />
      <div className="divider text-lg font-bold">Delete Project</div>
      <MgmtSelect
        name="selectedProject"
        placeholderSelect="Select a project"
        action="deleteProject"
        options={projects.map((project) => project.projectName).sort()}
        buttonName="Delete"
      />

      <div className="divider text-lg font-bold">Delete Breakdown</div>
      <MgmtSelect
        name="selectedBreakdown"
        placeholderSelect="Select a breakdown"
        action="deleteBreakdown"
        options={breakdowns.map((breakdown) => breakdown.breakdownName).sort()}
        buttonName="Delete"
      />
    </Form>
  );
}

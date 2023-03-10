import type { ActionArgs, ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import {
  MgmtContainer,
  MgmtContainerButton,
  MgmtContainerInput,
  MgmtContainerSelectId,
} from "~/components/Components/MgmtContainer";
import { deleteBreakdown, readAllBreakdowns, updateBreakdownName } from "~/models/breakdown.server";
import { deleteProject, readAllProjects, updateProjectName } from "~/models/project.server";
import type { Project, Breakdown } from "@prisma/client";

type LoaderData = {
  projects: Project[];
  breakdowns: Breakdown[];
};

export const loader: LoaderFunction = async () => {
  const projects = await readAllProjects();
  const breakdowns = await readAllBreakdowns();
  invariant(projects, "No projects found");
  invariant(breakdowns, "No breakdowns found");
  return json<LoaderData>({ projects, breakdowns });
};

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const action = formData.get("action") as string;

  if (action === "newNameProject") {
    const projectId = formData.get("projectId") as string;
    const newNameProject = formData.get("newNameProject") as string;
    await updateProjectName(projectId, newNameProject);
  }

  if (action === "newNameBreakdown") {
    const breakdownId = formData.get("breakdownId") as string;
    const newNameBreakdown = formData.get("newNameBreakdown") as string;
    console.log(breakdownId, newNameBreakdown);
    await updateBreakdownName(breakdownId, newNameBreakdown);
  }

  if (action === "deleteProject") {
    const projectId = formData.get("projectId") as string;
    await deleteProject(projectId);
  }

  if (action === "deleteBreakdown") {
    const breakdownId = formData.get("breakdownId") as string;
    await deleteBreakdown(breakdownId);
  }

  return redirect("/mgmt/");
};

export default function EditRoute() {
  const { projects, breakdowns } = useLoaderData<LoaderData>();

  return (
    <Form method="post">
      <div className="divider text-lg font-bold pt-4">Rename Project</div>

      <MgmtContainer>
        <MgmtContainerSelectId
          name="projectId"
          placeholder="Select a project"
          options={projects
            .map((project) => {
              return { name: project.projectName, id: project.id };
            })
            .sort()}
        />
        <MgmtContainerInput name="newNameProject" placeholder="Enter new name of project" />
        <MgmtContainerButton action="newNameProject" buttonName="Rename" />
      </MgmtContainer>

      <div className="divider text-lg font-bold">Rename Breakdown</div>

      <MgmtContainer>
        <MgmtContainerSelectId
          name="breakdownId"
          placeholder="Select a breakdown"
          options={breakdowns
            .map((breakdown) => {
              const p = projects.find((project) => project.id === breakdown.projectId);
              const name = p ? p.projectName : "No project";
              return {
                name: name + ":  " + breakdown.breakdownName,
                id: breakdown.id,
                sortName: name,
              };
            })
            .sort((a, b) => {
              return a.sortName.localeCompare(b.sortName);
            })}
        />
        <MgmtContainerInput name="newNameBreakdown" placeholder="Enter new name of breakdown" />
        <MgmtContainerButton action="newNameBreakdown" buttonName="Rename" />
      </MgmtContainer>

      <div className="divider text-lg font-bold">Delete Project</div>

      <MgmtContainer>
        <MgmtContainerSelectId
          name="projectId"
          placeholder="Select a project"
          options={projects
            .map((project) => {
              return { name: project.projectName, id: project.id };
            })
            .sort()}
        />
        <MgmtContainerButton action="deleteProject" buttonName="Delete" />
      </MgmtContainer>

      <div className="divider text-lg font-bold">Delete Breakdown</div>

      <MgmtContainer>
        <MgmtContainerSelectId
          name="breakdownId"
          placeholder="Select a breakdown"
          options={breakdowns
            .map((breakdown) => {
              const p = projects.find((project) => project.id === breakdown.projectId);
              const name = p ? p.projectName : "No project";
              return {
                name: name + ":  " + breakdown.breakdownName,
                id: breakdown.id,
                sortName: name,
              };
            })
            .sort((a, b) => {
              return a.sortName.localeCompare(b.sortName);
            })}
        />
        <MgmtContainerButton action="deleteBreakdown" buttonName="Delete" />
      </MgmtContainer>
    </Form>
  );
}

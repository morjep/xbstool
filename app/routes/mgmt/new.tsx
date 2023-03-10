import type { ActionArgs } from "@remix-run/node";
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

import { createBreakdown, readAllBreakdowns } from "~/models/breakdown.server";
import {
  createNewProject,
  getAllProjects,
  getProject,
  getProjectWithName,
} from "~/models/project.server";

export const loader = async () => {
  const projects = await getAllProjects();
  invariant(projects, "No projects found");
  return json({ projects });
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const action = formData.get("action") as string;
  const newProject = formData.get("newProject") as string;
  const newBreakdown_ = formData.get("newBreakdown") as string;
  const projectId = formData.get("projectId") as string;

  if (action === "newProject") {
    await createNewProject(newProject);
  }

  if (action === "newBreakdown") {
    await createBreakdown(newBreakdown_, projectId);
  }

  return redirect("/mgmt/");
};

export default function NewRoute() {
  const { projects } = useLoaderData();

  return (
    <Form method="post">
      <div className="divider text-lg font-bold pt-4">New Project</div>

      <MgmtContainer>
        <MgmtContainerInput name="newProject" placeholder="Enter name of new project" />
        <MgmtContainerButton action="newProject" buttonName="Create" />
      </MgmtContainer>

      <div className="divider text-lg font-bold">New Breakdown</div>

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
        <MgmtContainerInput name="newBreakdown" placeholder="Enter name of new breakdown" />
        <MgmtContainerButton action="newBreakdown" buttonName="Create" />
      </MgmtContainer>
    </Form>
  );
}

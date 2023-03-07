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
import { MgmtInput } from "~/components/Components/MgmtInput";
import { MgmtSelectInput } from "~/components/Components/MgmtSelectInput";
import { createNewBreakdown, getAllBreakdowns } from "~/models/breakdown.server";
import { createNewProject, getAllProjects, getProjectWithName } from "~/models/project.server";

export const loader = async () => {
  const projects = await getAllProjects();
  invariant(projects, "No projects found");
  return json({ projects });
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const action = formData.get("action") as string;
  const newProject = formData.get("newProject") as string;
  const newBreakdown = formData.get("newBreakdown") as string;
  const selectedProject = formData.get("selectedProject") as string;

  if (action === "newProject") {
    await createNewProject(newProject);
  }

  if (action === "newBreakdown") {
    await getProjectWithName(selectedProject).then((project) => {
      if (project) {
        createNewBreakdown(newBreakdown, project.id);
      }
    });
  }

  return redirect("/mgmt/");
};

export default function NewRoute() {
  const { projects } = useLoaderData();

  return (
    <Form method="post">
      <div className="divider text-lg font-bold">New Project</div>

      <MgmtContainer>
        <MgmtContainerInput name="newProject" placeholder="Enter name of new project" />
        <MgmtContainerButton action="newProject" buttonName="Create" />
      </MgmtContainer>

      <div className="divider text-lg font-bold">New Breakdown</div>

      <MgmtContainer>
        <MgmtContainerSelect
          name="selectedProject"
          placeholder="Select a project"
          options={projects.map((project) => project.projectName).sort()}
        />
        <MgmtContainerInput name="newBreakdown" placeholder="Enter name of new breakdown" />
        <MgmtContainerButton action="newProject" buttonName="Create" />
      </MgmtContainer>
    </Form>
  );
}

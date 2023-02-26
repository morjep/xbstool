import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { createNewBreakdown, getAllBreakdowns } from "~/models/breakdown.server";
import { createNewProject, getAllProjects, getProjectWithName } from "~/models/project.server";

export const loader = async () => {
  const projects = await getAllProjects();
  const breakdowns = await getAllBreakdowns();
  invariant(projects, "No projects found");
  invariant(breakdowns, "No breakdowns found");
  return json({ projects, breakdowns });
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const newProject = formData.get("newProject") as string;
  const newBreakdown = formData.get("newBreakdown") as string;
  const selectedProject = formData.get("selectedProject") as string;

  if (newProject) {
    await createNewProject(newProject);
    return redirect("/mgmt/");
  }

  if (newBreakdown && selectedProject) {
    await getProjectWithName(selectedProject).then((project) => {
      if (project) {
        createNewBreakdown(newBreakdown, project.id);
      }
    });
    return redirect("/mgmt/");
  }

  return redirect("/mgmt/");
};

export default function NewRoute() {
  const { projects, breakdowns } = useLoaderData();

  return (
    <Form method="post">
      <div className="divider text-lg font-bold">New Project</div>
      <div className="pt-6 pb-16">
        <label className="input-group">
          <span className="w-32">Project</span>
          <input
            type="text"
            name="newProject"
            placeholder="Enter name of new project"
            className="input input-bordered w-full"
          />
        </label>
        <div className="py-2"></div>
        <button type="submit" className="btn bg-primary w-32">
          Create
        </button>{" "}
      </div>
      <div className="divider text-lg font-bold">New Breakdown</div>
      <div className="pt-6 pb-16">
        <div className="pb-4">
          <select className="select select-bordered w-64" name="selectedProject">
            <option disabled selected>
              Select a project
            </option>
            {projects.map((project) => (
              <option key={project.id}>{project.projectName}</option>
            ))}
          </select>
        </div>
        <label className="input-group">
          <span className="w-32">Breakdown</span>
          <input
            type="text"
            name="newBreakdown"
            placeholder="Enter name of new breakdown"
            className="input input-bordered w-full"
          />
        </label>
        <div className="py-2"></div>
        <button type="submit" className="btn bg-primary w-32">
          Create
        </button>{" "}
      </div>
    </Form>
  );
}

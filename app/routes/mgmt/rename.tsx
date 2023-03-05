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

  return redirect("/mgmt/");
};

export default function NewRoute() {
  const { projects, breakdowns } = useLoaderData();

  return (
    <Form method="post">
      <div className="divider text-lg font-bold">Rename Project</div>
      <div className="pt-6 pb-16 flex flex-row">
        <div className="pb-4">
          <select className="select select-bordered w-72" name="selectedProject">
            <option disabled selected>
              Select project
            </option>
            {projects.map((project) => (
              <option key={project.id}>{project.projectName}</option>
            ))}
          </select>
        </div>
        <div className="px-4 w-72">
          <input
            type="text"
            name="newProjectName"
            placeholder="Enter new name of project"
            className="input input-bordered w-full"
          />
        </div>
        <button type="submit" className="btn bg-primary text-primary-content w-32">
          Rename
        </button>{" "}
      </div>
      <div className="divider text-lg font-bold">Rename Breakdown</div>
      <div className="pt-6 pb-16 flex flex-row">
        <div className="pb-4">
          <select className="select select-bordered w-72" name="selectedProject">
            <option disabled selected>
              Select breakdown
            </option>
            {breakdowns.map((breakdown) => (
              <option key={breakdown.id}>{breakdown.breakdownName}</option>
            ))}
          </select>
        </div>
        <div className="px-4 w-72">
          <input
            type="text"
            name="newBreakdownName"
            placeholder="Enter new name of breakdown"
            className="input input-bordered w-full"
          />
        </div>
        <button type="submit" className="btn bg-primary text-primary-content w-32">
          Rename
        </button>{" "}
      </div>
    </Form>
  );
}

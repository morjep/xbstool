import { json } from "@remix-run/node"; // or cloudflare/deno
import { Link, useLoaderData } from "@remix-run/react";
import type { Project, Breakdown } from "@prisma/client";

import invariant from "tiny-invariant";
import { getAllProjects } from "~/models/project.server";
import { getAllBreakdowns } from "~/models/breakdown.server";

export const loader = async () => {
  const projects = await getAllProjects();
  const breakdowns = await getAllBreakdowns();
  invariant(projects, "No projects found");
  invariant(breakdowns, "No breakdowns found");
  return json({ projects, breakdowns });
};

export default function Index() {
  const { projects, breakdowns } = useLoaderData();

  return (
    <div className="pt-4">
      {projects.map((project: Project) => (
        <div key={project.id}>
          <div className="divider text-base-content  text-lg font-bold pt-4">
            {project.projectName}
          </div>

          <ul className="menu w-full">
            {breakdowns
              .filter((breakdown: Breakdown) => breakdown.projectId === project.id)
              .sort((a, b) => {
                return a.breakdownName.localeCompare(b.breakdownName);
              })
              .map((breakdown: Breakdown) => (
                <li key={breakdown.id} className="py-2">
                  <Link to={`/layout/${breakdown.id}`}>
                    <span className="text-base-content">{breakdown.breakdownName} </span>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

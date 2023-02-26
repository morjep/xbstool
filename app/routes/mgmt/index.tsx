import { json } from "@remix-run/node"; // or cloudflare/deno
import { Link, useLoaderData } from "@remix-run/react";

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
    <div>
      {projects.map((project) => (
        <div key={project.id}>
          <div className="divider text-lg font-bold">{project.projectName}</div>

          <ul className="menu bg-base-100 w-full rounded-md">
            {breakdowns
              .filter((breakdown) => breakdown.projectId === project.id)
              .map((breakdown) => (
                <li key={breakdown.id} className="py-2">
                  <Link to={`/layout/${breakdown.id}`}>
                    <span>{breakdown.breakdownName} </span>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

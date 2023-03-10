import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node"; // or cloudflare/deno
import { Link, useLoaderData } from "@remix-run/react";
import type { Project, Breakdown } from "@prisma/client";

import invariant from "tiny-invariant";
import { readAllProjects } from "~/models/project.server";
import { readAllBreakdowns } from "~/models/breakdown.server";

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

export default function Index() {
  const { projects, breakdowns } = useLoaderData<LoaderData>();

  return (
    <div className="pt-4">
      {projects.map((project) => (
        <div key={project.id}>
          <div className="divider text-base-content  text-lg font-bold pt-4">
            {project.projectName}
          </div>

          <ul className="menu w-full">
            {breakdowns
              .filter((breakdown) => breakdown.projectId === project.id)
              .sort((a, b) => {
                return a.breakdownName.localeCompare(b.breakdownName);
              })
              .map((breakdown) => (
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

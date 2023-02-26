import { json } from "@remix-run/node"; // or cloudflare/deno
import { Link, useLoaderData } from "@remix-run/react";

import invariant from "tiny-invariant";
import { getAllProjects } from "~/models/project.server";
import { getAllBreakdowns } from "~/models/breakdown.server";
import { Navbar } from "~/components/Components/Navbar";

export const loader = async () => {
  const projects = await getAllProjects();
  const breakdowns = await getAllBreakdowns();
  invariant(projects, "No projects found");
  invariant(breakdowns, "No breakdowns found");
  return json({ projects, breakdowns });
};

export default function MgmtRoute() {
  const { projects, breakdowns } = useLoaderData();

  return (
    <div>
      <Navbar name="Breakdowns Home" id="" />
      <div className="grid grid-cols-6 gap-12 pt-8 px-8">
        <div className="col-start-1 col-end-1">
          <ul className="menu bg-base-100 w-56 font-bold bg-base-200">
            <li>
              <a>New</a>
            </li>
            <li>
              <a>My breakdowns</a>
            </li>
            <li>
              <a>Trash</a>
            </li>
          </ul>
        </div>
        <div className="col-start-2 col-end-6">
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
      </div>
    </div>
  );
}

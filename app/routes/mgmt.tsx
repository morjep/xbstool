import { NavLink, Outlet } from "@remix-run/react";
import { Navbar } from "~/components/Components/Navbar";

// Client-side
export default function MgmtRoute() {
  return (
    <div>
      <Navbar name="Breakdowns Home" id="" />
      <div className="grid grid-cols-6 gap-12 bg-base-100">
        <div className="col-start-1 col-end-1 bg-secondary">
          <ul className="menu w-62 px-4 pt-4 font-bold ">
            <li>
              <NavLink to="/mgmt/">
                <span className="text-secondary-content">My Breakdowns</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/mgmt/new">
                <span className="text-secondary-content">New</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/mgmt/edit">
                <span className="text-secondary-content">Edit</span>
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="col-start-2 col-end-6 h-screen overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

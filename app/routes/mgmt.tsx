import { NavLink, Outlet } from "@remix-run/react";
import { Navbar } from "~/components/Components/Navbar";

// Client-side
export default function MgmtRoute() {
  return (
    <div>
      <Navbar name="Breakdowns Home" id="" />
      <div className="grid grid-cols-6 gap-12 pt-8 px-8">
        <div className="col-start-1 col-end-1">
          <ul className="menu w-56 font-bold bg-base-200">
            <li>
              <NavLink to="/mgmt/new">
                <span>New</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/mgmt/">
                <span>My Breakdowns</span>
              </NavLink>
            </li>
            <li>
              <a>Trash</a>
            </li>
          </ul>
        </div>

        <div className="col-start-2 col-end-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

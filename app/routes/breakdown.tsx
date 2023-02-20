import { Outlet, Link, NavLink } from "@remix-run/react";

const activeTab = "tab tab-bordered tab-active";
const inactiveTab = "tab tab-bordered";

// Client-side
export default function BreakdownRoute() {
  return (
    <main>
      <div className="flex justify-between my-2">
        <div className="mx-2 w-64">
          Breakdown: <strong>Card features</strong>
        </div>
        <div className="tabs">
          <NavLink
            to="/breakdown/breakdowndata"
            className={({ isActive }) => (isActive ? activeTab : inactiveTab)}
          >
            Data
          </NavLink>
          <NavLink
            to="/breakdown/breakdownlayout"
            className={({ isActive }) => (isActive ? activeTab : inactiveTab)}
          >
            Layout
          </NavLink>
          <NavLink
            to="/breakdown/breakdownstyle"
            className={({ isActive }) => (isActive ? activeTab : inactiveTab)}
          >
            Style
          </NavLink>
        </div>
        <div className="mx-2 w-64"></div>
      </div>
      <Outlet />
    </main>
  );
}

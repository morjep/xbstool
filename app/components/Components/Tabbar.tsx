import { NavLink } from "react-router-dom";

const activeTab = "tab tab-bordered tab-active";
const inactiveTab = "tab tab-bordered";

export const Tabbar = ({ name, id }) => {
  return (
    <div className="flex justify-between my-2">
      <div className="mx-2 w-64">
        Breakdown: <strong>{name}</strong>
      </div>
      <div className="tabs">
        <NavLink
          to={`/data/${id}`}
          className={({ isActive }) => (isActive ? activeTab : inactiveTab)}
        >
          Data
        </NavLink>
        <NavLink
          to={`/layout/${id}`}
          className={({ isActive }) => (isActive ? activeTab : inactiveTab)}
        >
          Layout
        </NavLink>
        <NavLink
          to={`/styling/${id}`}
          className={({ isActive }) => (isActive ? activeTab : inactiveTab)}
        >
          Style
        </NavLink>
      </div>
      <div className="mx-2 w-64"></div>
    </div>
  );
};

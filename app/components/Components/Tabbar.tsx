import { NavLink } from "react-router-dom";

const activeTab = "tab tab-bordered tab-active text-primary-content font-bold";
const inactiveTab = "tab tab-bordered text-primary-content";

export const Tabbar = ({ id }) => {
  return (
    <div className="tabs ">
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
  );
};

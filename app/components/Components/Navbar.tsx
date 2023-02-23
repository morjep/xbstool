import { NavLink } from "react-router-dom";
import { Tabbar } from "./Tabbar";

export const Navbar = ({ name, id }) => {
  return (
    <div className="navbar bg-red-600 text-primary-content">
      <div className="navbar-start">
        <NavLink to="/mgmt">
          <div className="tooltip tooltip-bottom" data-tip="Home">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </label>
          </div>
        </NavLink>
        <div>{name}</div>
      </div>
      <div className="navbar-center">{id ? <Tabbar id={id} /> : null}</div>
      <div className="navbar-end">
        <div className="avatar placeholder">
          <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
            <span>MJ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

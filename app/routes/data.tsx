import { Outlet } from "@remix-run/react";

// Client-side
export default function DataRoute() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

import { Outlet } from "@remix-run/react";

// Client-side
export default function LayoutRoute() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";

import invariant from "tiny-invariant";

import { getBreakdownById } from "~/models/breakdown.server";

import { Navbar } from "~/components/Components/Navbar";

const daisyThemes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
];

type LoaderData = {
  id: string;
  name: string;
};

// Server-side
export const loader = async ({ request, params }) => {
  const { id } = params;
  console.log("ID: ", id);
  const breakdown = await getBreakdownById(id);

  invariant(breakdown, "No breakdown found");
  invariant(breakdown.data, "No breakdown data found");

  return json({
    id,
    name: breakdown.breakdownName,
  } as LoaderData);
};

// Client-side
export default function IdRoute() {
  const { id, name } = useLoaderData<LoaderData>();
  return (
    <div>
      <Navbar id={id} name={name} />
      <div style={{ height: 1024 }}>
        <div className="divider px-32"> Theme </div>
        <div className="px-32">
          <select className="select select-bordered w-full max-w-xs">
            {daisyThemes.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

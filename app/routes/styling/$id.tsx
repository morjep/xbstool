import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node"; // or cloudflare/deno
import { useFetcher, useLoaderData } from "@remix-run/react";

import invariant from "tiny-invariant";

import { getBreakdownById } from "~/models/breakdown.server";

import { Navbar } from "~/components/Components/Navbar";
import { createNewStyle, getStyle, updateTheme } from "~/models/style.server";

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
  themeSelected: string;
  themes: string[];
};

// Server-side
export const loader = async ({ request, params }) => {
  const { id } = params;
  console.log("ID: ", id);
  const breakdown = await getBreakdownById(id);

  invariant(breakdown, "No breakdown found");
  invariant(breakdown.data, "No breakdown data found");

  if (breakdown.style === null) {
    await createNewStyle(id);
    console.log(
      "Created new style for breakdown with id: " + id + " and name: " + breakdown.breakdownName
    );
  }
  const theme = breakdown.style?.theme || "emerald";

  return json({
    id,
    name: breakdown.breakdownName,
    themeSelected: theme,
    themes: daisyThemes,
  } as LoaderData);
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const url = new URL(request.url);
  const id = url.pathname.replace(/\/styling\//g, "");
  const theme = formData.get("theme") as string;
  await updateTheme(id, theme as string);

  return redirect("/styling/" + id);
};

// Client-side
export default function IdRoute() {
  const { id, name, themeSelected, themes } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();

  return (
    <div>
      <Navbar id={id} name={name} />
      <fetcher.Form method="post">
        <div style={{ height: 1024 }}>
          <div className="divider px-32"> Theme </div>
          <div className="px-32">
            <select
              className="select select-bordered w-full max-w-xs"
              name="theme"
              onChange={(value) => fetcher.submit(value.target.form)}
            >
              {themes.map((theme) => (
                <option key={theme} value={theme} selected={theme === themeSelected}>
                  {theme}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fetcher.Form>
    </div>
  );
}

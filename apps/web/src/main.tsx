import { QueryClientProvider } from "@tanstack/solid-query";
import { RouterProvider } from "@tanstack/solid-router";
import { render } from "solid-js/web";
import { queryClient } from "./ci/api";
import { applyPrefs, loadPrefs } from "./lib/theme";
import { getRouter } from "./router";
import "virtual:uno.css";
import "./styles/app.css";

const router = getRouter();
const app = document.getElementById("app");
if (!app) {
	throw new Error("missing #app element");
}

applyPrefs(loadPrefs());

render(
	() => (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	),
	app,
);

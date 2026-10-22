import { RouterProvider } from "@tanstack/solid-router";
import { render } from "solid-js/web";
import "virtual:uno.css";
import "./styles/app.css";
import { getRouter } from "./router";

const router = getRouter();
const app = document.getElementById("app");
if (!app) {
	throw new Error("missing #app element");
}
render(() => <RouterProvider router={router} />, app);

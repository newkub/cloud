import { createFileRoute } from "@tanstack/solid-router";
import { Dashboard } from "../ci/pages/Dashboard";

export const Route = createFileRoute("/ci/")({ component: Dashboard });

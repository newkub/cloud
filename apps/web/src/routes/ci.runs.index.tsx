import { createFileRoute } from "@tanstack/solid-router";
import { Runs } from "../ci/pages/Runs";

export const Route = createFileRoute("/ci/runs/")({ component: Runs });

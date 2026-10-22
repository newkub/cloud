/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { NavProgress } from "./NavProgress";

export const preview = (): JSX.Element => <NavProgress sections={["intro", "usage", "api"]} />;

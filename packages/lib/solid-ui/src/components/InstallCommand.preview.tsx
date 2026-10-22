/**
 * Co-located preview - picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { InstallCommand } from "./InstallCommand";

export const preview = (): JSX.Element => <InstallCommand package="@wrikka/solid-ui" class="w-64" />;

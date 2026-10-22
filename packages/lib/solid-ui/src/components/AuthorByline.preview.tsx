/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { AuthorByline } from "./AuthorByline";

export const preview = (): JSX.Element => <AuthorByline name="Ada Lovelace" date="Mar 2026" />;

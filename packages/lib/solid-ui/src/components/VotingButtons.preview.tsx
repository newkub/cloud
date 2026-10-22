/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { VotingButtons } from "./VotingButtons";

export const preview = (): JSX.Element => <VotingButtons score={42} />;

/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { GiftCardInput } from "./GiftCardInput";

export const preview = (): JSX.Element => <GiftCardInput onCheck={() => Promise.resolve({ balance: 42.5 })} />;

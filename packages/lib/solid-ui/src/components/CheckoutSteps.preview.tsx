/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { CheckoutSteps } from "./CheckoutSteps";

export const preview = (): JSX.Element => <CheckoutSteps current="payment" class="w-80" />;

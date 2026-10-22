/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { ChatBubble } from "./ChatBubble";

export const preview = (): JSX.Element => (
	<ChatBubble author="Ada" time="2m ago">
		Ship it!
	</ChatBubble>
);

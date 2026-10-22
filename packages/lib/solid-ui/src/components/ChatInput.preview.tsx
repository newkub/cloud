/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { ChatInput } from "./ChatInput";

export const preview = (): JSX.Element => <ChatInput placeholder="Type a message…" class="w-72" />;

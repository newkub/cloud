/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import { createSignal, type JSX } from "solid-js";
import { CommentPin } from "./CommentPin";

export const preview = (): JSX.Element => {
	const [done, setDone] = createSignal(false);
	return (
		<CommentPin
			resolved={done()}
			onResolve={() => setDone(true)}
			onReply={() => {}}
			comment={{ author: "Ada", body: "Should we link the spec here?", ts: Date.now() - 42 * 60_000 }}
		/>
	);
};

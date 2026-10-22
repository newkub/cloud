/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { RequestBuilder } from "./RequestBuilder";

export const preview = (): JSX.Element => (
	<RequestBuilder
		method="POST"
		url="https://api.dev/v1/users"
		body={'{\n  "name": "Ada"\n}'}
		onSend={() => ({
			status: 201,
			statusText: "Created",
			ms: 84,
			body: '{\n  "id": "usr_42",\n  "name": "Ada"\n}',
		})}
		class="w-96 max-w-full"
	/>
);

/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { LogStream } from "./LogStream";

export const preview = (): JSX.Element => (
	<LogStream
		lines={[
			{ level: "debug", msg: "connection pool ready (8/8)", ts: "10:02:11" },
			{ level: "info", msg: "GET /v1/users 200 in 12ms", ts: "10:02:14" },
			{ level: "info", msg: "POST /v1/orders 201 in 38ms", ts: "10:02:19" },
			{ level: "warn", msg: "slow query on orders_idx (412ms)", ts: "10:02:20" },
			{ level: "error", msg: "upstream timeout: payments-svc", ts: "10:02:23" },
		]}
		class="w-96 max-w-full"
	/>
);

/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { PortList } from "./PortList";

export const preview = (): JSX.Element => (
	<PortList
		ports={[
			{ port: 3000, proto: "tcp", pid: 4210, process: "vite" },
			{ port: 5432, proto: "tcp", pid: 1204, process: "postgres" },
			{ port: 6379, proto: "tcp", pid: 2211, process: "redis-server" },
			{ port: 9229, proto: "tcp", pid: 8873, process: "node --inspect" },
		]}
		onKill={() => {}}
		class="w-96 max-w-full"
	/>
);

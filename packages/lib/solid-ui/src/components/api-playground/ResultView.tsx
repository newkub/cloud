export interface PlaygroundResult {
	status: number;
	ms: number;
	body: string;
}

/** Response status badge plus pretty-printed body for ApiPlayground. */
export function ResultView(props: { result: PlaygroundResult }) {
	const pretty = () => {
		try {
			return JSON.stringify(JSON.parse(props.result.body), null, 2);
		} catch {
			return props.result.body;
		}
	};
	return (
		<div>
			<div class="flex items-center gap-2 mb-1.5">
				<span class={`text-xs font-bold ${props.result.status < 400 ? "text-success" : "text-destructive"}`}>
					{props.result.status}
				</span>
				<span class="text-2xs text-muted-foreground">{props.result.ms}ms</span>
			</div>
			<pre class="m-0 p-2 rounded border border-border bg-background text-xs font-mono text-foreground overflow-auto max-h-64 whitespace-pre-wrap">
				{pretty()}
			</pre>
		</div>
	);
}

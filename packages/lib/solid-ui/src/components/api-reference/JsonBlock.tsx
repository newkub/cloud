import { CopyButton } from "./CopyButton";

export function JsonBlock(props: { value: unknown }) {
	const text = () => JSON.stringify(props.value, null, 2);
	return (
		<div class="relative rounded-lg bg-background border border-border">
			<div class="absolute top-1.5 right-1.5">
				<CopyButton text={text} />
			</div>
			<pre class="text-xs font-mono text-foreground p-3 m-0 overflow-x-auto whitespace-pre-wrap break-all">
				{text()}
			</pre>
		</div>
	);
}

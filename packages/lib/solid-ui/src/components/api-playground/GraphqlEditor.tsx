import { areaClass, labelClass } from "./styles";

export interface GraphqlEditorProps {
	query: string;
	variables: string;
	onQueryInput: (value: string) => void;
	onVariablesInput: (value: string) => void;
}

/** GraphQL query + variables editors for ApiPlayground. */
export function GraphqlEditor(props: GraphqlEditorProps) {
	return (
		<>
			<div>
				<p class={labelClass}>Query</p>
				<textarea
					value={props.query}
					onInput={(e) => props.onQueryInput(e.currentTarget.value)}
					rows={8}
					spellcheck={false}
					class={areaClass}
					aria-label="GraphQL query"
				/>
			</div>
			<div>
				<p class={labelClass}>Variables</p>
				<textarea
					value={props.variables}
					onInput={(e) => props.onVariablesInput(e.currentTarget.value)}
					rows={4}
					spellcheck={false}
					class={areaClass}
					aria-label="GraphQL variables"
				/>
			</div>
		</>
	);
}

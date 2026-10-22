/**
 * JsonForm - renders a simple form from a field schema (label/type/required).
 */
import { For, type JSX, splitProps } from "solid-js";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { FieldGroup } from "./FieldGroup";
import { Input } from "./Input";
import { Label } from "./Label";
import { Select } from "./Select";

export interface JsonField {
	/** Field key in the submitted object. */
	name: string;
	/** Label text; defaults to the name. */
	label?: string;
	/** Input kind. @default "text" */
	type?: "text" | "email" | "password" | "number" | "checkbox" | "select";
	/** Required marker. */
	required?: boolean;
	/** Options for type="select". */
	options?: { value: string; label: string }[];
	/** Placeholder. */
	placeholder?: string;
}

export interface JsonFormProps extends Omit<JSX.HTMLAttributes<HTMLFormElement>, "onSubmit"> {
	/** Field schema. */
	fields: JsonField[];
	/** Submit button label. @default "Submit" */
	submitLabel?: string;
	/** Called with the collected values. */
	onSubmit?: (values: Record<string, string | boolean>) => void;
}

export function JsonForm(props: JsonFormProps) {
	const [local, rest] = splitProps(props, ["class", "fields", "submitLabel", "onSubmit", "children"]);

	const submit = (e: SubmitEvent) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget as HTMLFormElement);
		const values: Record<string, string | boolean> = {};
		for (const f of local.fields) {
			values[f.name] = f.type === "checkbox" ? data.get(f.name) === "on" : String(data.get(f.name) ?? "");
		}
		local.onSubmit?.(values);
	};

	const className = () => ["solidui-json-form", local.class ?? ""].filter(Boolean).join(" ");

	return (
		<form class={className()} onSubmit={submit} {...rest}>
			<FieldGroup>
				<For each={local.fields}>
					{(f) => (
						<div class="flex flex-col gap-1.5">
							{f.type === "checkbox" ? (
								<Checkbox name={f.name} label={f.label ?? f.name} required={f.required} />
							) : (
								<>
									<Label for={f.name}>
										{f.label ?? f.name}
										{f.required ? <span class="text-destructive"> *</span> : null}
									</Label>
									{f.type === "select" ? (
										<Select id={f.name} name={f.name} placeholder={f.placeholder}>
											<For each={f.options ?? []}>{(o) => <option value={o.value}>{o.label}</option>}</For>
										</Select>
									) : (
										<Input
											id={f.name}
											name={f.name}
											type={f.type ?? "text"}
											required={f.required}
											placeholder={f.placeholder}
										/>
									)}
								</>
							)}
						</div>
					)}
				</For>
				<Button type="submit" variant="primary">
					{local.submitLabel ?? "Submit"}
				</Button>
				{local.children}
			</FieldGroup>
		</form>
	);
}

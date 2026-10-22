/**
 * Input that adds and removes tags
 */
import { createSignal, For, type JSX, mergeProps, splitProps } from "solid-js";
import { type ControlSize, type InputVariant, inputVariants, type Radius, radiusMap } from "../lib/variants";
import { Input } from "./Input";

const sizeMap: Record<ControlSize, string> = {
	sm: "px-2.5 py-1.5 text-xs",
	md: "px-3 py-2 text-sm",
	lg: "px-4 py-2.5 text-base",
};

export interface TagsInputProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	value?: string[];
	defaultValue?: string[];
	variant?: InputVariant;
	size?: ControlSize;
	onChange?: (value: string[]) => void;
	placeholder?: string;
	inputClass?: string;
	/** Corner radius. */
	radius?: Radius;
}

function TagItem(props: { tag: string; onRemove: () => void }) {
	return (
		<li class="inline-flex max-w-full items-center gap-1 break-all rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">
			{props.tag}
			<button
				type="button"
				aria-label={`Remove ${props.tag}`}
				class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-secondary-foreground transition-colors motion-reduce:transition-none hover:bg-secondary-foreground/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				onClick={props.onRemove}
			>
				×
			</button>
		</li>
	);
}

function TagList(props: { tags: string[]; onRemove: (tag: string) => void }) {
	return (
		<ul class="m-0 flex list-none flex-wrap items-center gap-1.5 p-0" aria-label="Tags">
			<For each={props.tags}>{(tag) => <TagItem tag={tag} onRemove={() => props.onRemove(tag)} />}</For>
		</ul>
	);
}

function tagsInputClass(extra?: string, variant: InputVariant = "default", size: ControlSize = "md") {
	return [
		"flex w-full flex-wrap items-center gap-1.5 rounded-md border transition-colors motion-reduce:transition-none focus-within:ring-1 focus-within:ring-ring",
		inputVariants[variant],
		sizeMap[size],
		extra ?? "",
	]
		.filter(Boolean)
		.join(" ");
}

export function TagsInput(props: TagsInputProps) {
	const merged = mergeProps({ defaultValue: [] as string[], placeholder: "Add tag…" }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"variant",
		"size",
		"value",
		"defaultValue",
		"onChange",
		"placeholder",
		"inputClass",
	]);
	const [internal, setInternal] = createSignal(merged.defaultValue);
	const [input, setInput] = createSignal("");

	const tags = () => (local.value !== undefined ? local.value : internal());

	const setTags = (next: string[]) => {
		if (local.value === undefined) setInternal(next);
		local.onChange?.(next);
	};

	const addTag = (tag: string) => {
		const trimmed = tag.trim();
		if (!trimmed || tags().includes(trimmed)) return;
		setTags([...tags(), trimmed]);
		setInput("");
	};

	const removeTag = (tag: string) => {
		setTags(tags().filter((t) => t !== tag));
	};

	const removeLastTag = () => {
		const list = tags();
		if (list.length === 0) return;
		setTags(list.slice(0, -1));
	};

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addTag(input());
		} else if (e.key === "Backspace" && input() === "") {
			e.preventDefault();
			removeLastTag();
		}
	};

	return (
		<div class={tagsInputClass(local.class, local.variant, local.size)} {...rest}>
			<TagList tags={tags()} onRemove={removeTag} />
			<Input
				value={input()}
				onChange={setInput}
				onKeyDown={onKeyDown}
				placeholder={local.placeholder}
				class={`min-w-20 flex-1 border-0 bg-transparent p-0 focus-visible:ring-0 ${local.inputClass ?? ""} ${merged.radius ? radiusMap[merged.radius] : ""}`}
				aria-label="Add a tag"
			/>
		</div>
	);
}

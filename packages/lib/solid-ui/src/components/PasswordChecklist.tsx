/**
 * PasswordChecklist - live password rule checklist with pass/fail indicators.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, splitProps } from "solid-js";

export interface PasswordRule {
	/** Stable key for the rule. */
	id: string;
	/** Human-readable requirement text. */
	label: string;
	/** Returns true when the password satisfies the rule. */
	test: (value: string) => boolean;
}

export const DEFAULT_PASSWORD_RULES: PasswordRule[] = [
	{ id: "length", label: "At least 8 characters", test: (v) => v.length >= 8 },
	{ id: "uppercase", label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
	{ id: "lowercase", label: "One lowercase letter", test: (v) => /[a-z]/.test(v) },
	{ id: "digit", label: "One digit", test: (v) => /\d/.test(v) },
	{ id: "symbol", label: "One symbol", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export interface PasswordChecklistProps extends JSX.HTMLAttributes<HTMLUListElement> {
	/** Current password value being evaluated. */
	value?: string;
	/** Rules to evaluate. @default DEFAULT_PASSWORD_RULES */
	rules?: PasswordRule[];
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const checkIcon = (
	<svg
		class="h-3.5 w-3.5 shrink-0"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
		aria-hidden="true"
	>
		<path d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" />
	</svg>
);

const xIcon = (
	<svg
		class="h-3.5 w-3.5 shrink-0"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
		aria-hidden="true"
	>
		<path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
	</svg>
);

export function PasswordChecklist(props: PasswordChecklistProps) {
	const [local, others] = splitProps(props, ["value", "rules", "aria-label"]);
	const { className, rest } = useComponentClasses(others, {
		base: "solidui-password-checklist m-0 flex list-none flex-col gap-1 p-0",
	});
	const rules = () => local.rules ?? DEFAULT_PASSWORD_RULES;
	const passed = (rule: PasswordRule) => {
		try {
			return rule.test(local.value ?? "");
		} catch {
			return false;
		}
	};

	return (
		<ul class={className()} aria-label={local["aria-label"] ?? "Password requirements"} {...rest}>
			<For each={rules()}>
				{(rule) => (
					<li
						class={`flex items-center gap-1.5 text-xs transition-colors motion-reduce:transition-none ${
							passed(rule) ? "text-success" : "text-muted-foreground"
						}`}
						data-rule={rule.id}
						data-passed={passed(rule) || undefined}
					>
						{passed(rule) ? checkIcon : xIcon}
						<span>{rule.label}</span>
						<span class="sr-only">{passed(rule) ? " (met)" : " (not met)"}</span>
					</li>
				)}
			</For>
		</ul>
	);
}

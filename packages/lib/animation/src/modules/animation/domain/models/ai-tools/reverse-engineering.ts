/**
 * Reverse Engineering Domain Model
 * Analyzes existing animations and generates code
 */

import type { AnimationCode, ReverseEngineeringOptions } from "../../../types";

export class ReverseEngineering {
	private options: ReverseEngineeringOptions;

	constructor(options: ReverseEngineeringOptions) {
		this.options = {
			includeTransform: true,
			includeOpacity: true,
			includeFilters: false,
			...options,
		};
	}

	public analyze(): Record<string, unknown> {
		const element = this.getElement();
		if (!element) return {};

		const computedStyle = window.getComputedStyle(element);
		const styles: Record<string, unknown> = {};

		if (this.options.includeTransform) {
			styles.transform = computedStyle.transform;
			styles.translateX = this.parseTransform(computedStyle.transform, "translateX");
			styles.translateY = this.parseTransform(computedStyle.transform, "translateY");
			styles.scale = this.parseTransform(computedStyle.transform, "scale");
			styles.rotate = this.parseTransform(computedStyle.transform, "rotate");
		}

		if (this.options.includeOpacity) {
			styles.opacity = computedStyle.opacity;
		}

		if (this.options.includeFilters) {
			styles.filter = computedStyle.filter;
		}

		return styles;
	}

	private parseTransform(transform: string, property: string): number {
		const regex = new RegExp(`${property}\\(([^)]+)\\)`);
		const match = transform.match(regex);
		if (match?.[1]) {
			return parseFloat(match[1]);
		}
		return 0;
	}

	public generateCode(language: "typescript" | "javascript" | "solidjs" = "typescript"): AnimationCode {
		const styles = this.analyze();
		const target = this.options.target;
		const targetStr = typeof target === "string" ? `"${target}"` : "element";

		let code = "";

		if (language === "solidjs") {
			code = this.generateSolidJSCode(targetStr, styles);
		} else if (language === "typescript") {
			code = this.generateTypeScriptCode(targetStr, styles);
		} else {
			code = this.generateJavaScriptCode(targetStr, styles);
		}

		return { language, code };
	}

	private generateSolidJSCode(_target: string, styles: Record<string, unknown>): string {
		let code = `import { createSignal, onMount } from "solid-js";\n\n`;
		code += `export function MyComponent() {\n`;
		code += `  const [element, setElement] = createSignal<HTMLElement | null>(null);\n\n`;
		code += `  onMount(() => {\n`;
		code += `    const el = element();\n`;
		code += `    if (el) {\n`;

		if (styles.transform || styles.translateX !== undefined) {
			code += `      el.style.transform = "translateX(${styles.translateX ?? 0}px)";\n`;
		}
		if (styles.opacity !== undefined) {
			code += `      el.style.opacity = "${styles.opacity}";\n`;
		}

		code += `    }\n`;
		code += `  });\n\n`;
		code += `  return <div ref={setElement}>Animated Element</div>;\n`;
		code += `}\n`;

		return code;
	}

	private generateTypeScriptCode(target: string, styles: Record<string, unknown>): string {
		let code = `const element = document.querySelector(${target}) as HTMLElement;\n\n`;
		code += `if (element) {\n`;

		if (styles.transform || styles.translateX !== undefined) {
			code += `  element.style.transform = "translateX(${styles.translateX ?? 0}px)";\n`;
		}
		if (styles.opacity !== undefined) {
			code += `  element.style.opacity = "${styles.opacity}";\n`;
		}

		code += `}\n`;

		return code;
	}

	private generateJavaScriptCode(target: string, styles: Record<string, unknown>): string {
		let code = `const element = document.querySelector(${target});\n\n`;
		code += `if (element) {\n`;

		if (styles.transform || styles.translateX !== undefined) {
			code += `  element.style.transform = "translateX(${styles.translateX ?? 0}px)";\n`;
		}
		if (styles.opacity !== undefined) {
			code += `  element.style.opacity = "${styles.opacity}";\n`;
		}

		code += `}\n`;

		return code;
	}

	private getElement(): HTMLElement | null {
		if (typeof this.options.target === "string") {
			return document.querySelector(this.options.target) as HTMLElement;
		}
		return this.options.target as HTMLElement;
	}
}

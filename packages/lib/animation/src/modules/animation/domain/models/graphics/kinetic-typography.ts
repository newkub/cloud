/**
 * Kinetic Typography Domain Model
 * Handles text splitting and character/word/line animation
 */

import type { KineticTypographyOptions } from "../../../types";

export class KineticTypography {
	private options: KineticTypographyOptions;
	private text: string;
	private elements: (HTMLElement | null)[] = [];

	constructor(text: string, options: KineticTypographyOptions = {}) {
		this.text = text;
		this.options = {
			splitBy: "characters",
			stagger: 0,
			reverse: false,
			...options,
		};
	}

	public split(): HTMLElement[] {
		const container = document.createElement("div");
		container.style.display = "inline-block";

		switch (this.options.splitBy) {
			case "characters":
				this.elements = this.splitByCharacters(container);
				break;
			case "words":
				this.elements = this.splitByWords(container);
				break;
			case "lines":
				this.elements = this.splitByLines(container);
				break;
			default:
				this.elements = this.splitByCharacters(container);
		}

		if (this.options.reverse) {
			this.elements.reverse();
		}

		if (this.options.random) {
			this.shuffleElements(this.options.random);
		}

		return this.elements.filter((el): el is HTMLElement => el !== null);
	}

	private splitByCharacters(container: HTMLElement): HTMLElement[] {
		const elements: HTMLElement[] = [];
		const chars = this.text.split("");

		for (const char of chars) {
			const span = document.createElement("span");
			span.textContent = char === " " ? "\u00A0" : char;
			span.style.display = "inline-block";
			span.style.whiteSpace = "pre";
			container.appendChild(span);
			elements.push(span);
		}

		return elements;
	}

	private splitByWords(container: HTMLElement): HTMLElement[] {
		const elements: HTMLElement[] = [];
		const words = this.text.split(/\s+/);

		for (let i = 0; i < words.length; i++) {
			const span = document.createElement("span");
			span.textContent = words[i] ?? "";
			span.style.display = "inline-block";
			span.style.whiteSpace = "nowrap";
			container.appendChild(span);
			elements.push(span);

			// Add space between words
			if (i < words.length - 1) {
				const space = document.createElement("span");
				space.textContent = "\u00A0";
				space.style.display = "inline-block";
				container.appendChild(space);
			}
		}

		return elements;
	}

	private splitByLines(container: HTMLElement): HTMLElement[] {
		const elements: HTMLElement[] = [];
		const lines = this.text.split("\n");

		for (const line of lines) {
			const div = document.createElement("div");
			div.textContent = line;
			div.style.display = "block";
			div.style.whiteSpace = "nowrap";
			container.appendChild(div);
			elements.push(div);
		}

		return elements;
	}

	private shuffleElements(random: () => number): void {
		for (let i = this.elements.length - 1; i > 0; i--) {
			const j = Math.floor(random() * (i + 1));
			const temp = this.elements[i];
			const tempJ = this.elements[j];
			if (temp && tempJ) {
				this.elements[i] = tempJ;
				this.elements[j] = temp;
			}
		}
	}

	public getStaggerDelays(baseDelay: number = 100): number[] {
		const delays: number[] = [];
		const total = this.elements.length;

		for (let i = 0; i < total; i++) {
			if (typeof this.options.stagger === "number") {
				delays.push(i * this.options.stagger);
			} else if (this.options.stagger) {
				// Use advanced stagger
				const from = this.options.stagger.from ?? "first";
				let progress: number;

				switch (from) {
					case "first":
						progress = i / (total - 1 || 1);
						break;
					case "last":
						progress = (total - 1 - i) / (total - 1 || 1);
						break;
					case "center":
						progress = Math.abs(i - (total - 1) / 2) / ((total - 1) / 2 || 1);
						break;
					default:
						progress = i / (total - 1 || 1);
				}

				delays.push(progress * baseDelay);
			} else {
				delays.push(0);
			}
		}

		return delays;
	}

	public getElements(): HTMLElement[] {
		return this.elements.filter((el): el is HTMLElement => el !== null);
	}

	public getOriginalText(): string {
		return this.text;
	}
}

/**
 * AI Animation Generator Domain Model
 * Generates animations from text prompts
 * Note: This is a basic rule-based implementation. For true AI generation, integrate with AI APIs.
 */

import type { AIAnimationOptions, GeneratedAnimation } from "../../../types";

export class AIAnimationGenerator {
	private options: AIAnimationOptions;

	constructor(options: AIAnimationOptions) {
		this.options = {
			duration: 1000,
			easing: "easeInOutQuad",
			style: "smooth",
			...options,
		};
	}

	public generate(): GeneratedAnimation {
		const prompt = this.options.prompt.toLowerCase();
		const style = this.options.style ?? "smooth";

		let properties: Record<string, unknown> = {};
		let keyframes: Array<{ time: number; value: Record<string, unknown> }> = [];

		// Simple rule-based generation based on prompt keywords
		if (prompt.includes("fade") || prompt.includes("opacity")) {
			properties = { opacity: 0 };
			keyframes = this.generateFadeAnimation(style);
		} else if (prompt.includes("move") || prompt.includes("slide") || prompt.includes("translate")) {
			properties = { x: 0, y: 0 };
			keyframes = this.generateMoveAnimation(prompt, style);
		} else if (prompt.includes("scale") || prompt.includes("grow") || prompt.includes("shrink")) {
			properties = { scale: 1 };
			keyframes = this.generateScaleAnimation(prompt, style);
		} else if (prompt.includes("rotate") || prompt.includes("spin")) {
			properties = { rotate: 0 };
			keyframes = this.generateRotateAnimation(style);
		} else {
			// Default: simple fade and move
			properties = { x: 0, opacity: 1 };
			keyframes = [
				{ time: 0, value: { x: 0, opacity: 0 } },
				{ time: 1, value: { x: 100, opacity: 1 } },
			];
		}

		return {
			properties,
			duration: this.options.duration ?? 1000,
			easing: this.options.easing ?? "easeInOutQuad",
			keyframes,
		};
	}

	private generateFadeAnimation(style: string): Array<{ time: number; value: Record<string, unknown> }> {
		if (style === "bounce") {
			return [
				{ time: 0, value: { opacity: 0 } },
				{ time: 0.5, value: { opacity: 1.2 } },
				{ time: 1, value: { opacity: 1 } },
			];
		} else if (style === "elastic") {
			return [
				{ time: 0, value: { opacity: 0 } },
				{ time: 0.8, value: { opacity: 1.1 } },
				{ time: 1, value: { opacity: 1 } },
			];
		}
		return [
			{ time: 0, value: { opacity: 0 } },
			{ time: 1, value: { opacity: 1 } },
		];
	}

	private generateMoveAnimation(
		prompt: string,
		style: string,
	): Array<{ time: number; value: Record<string, unknown> }> {
		const isHorizontal = prompt.includes("horizontal") || prompt.includes("x");
		const isVertical = prompt.includes("vertical") || prompt.includes("y");
		const distance = 100;

		if (style === "bounce") {
			if (isHorizontal) {
				return [
					{ time: 0, value: { x: 0 } },
					{ time: 0.3, value: { x: distance * 1.2 } },
					{ time: 0.5, value: { x: distance } },
					{ time: 0.7, value: { x: distance * 1.1 } },
					{ time: 1, value: { x: distance } },
				];
			} else if (isVertical) {
				return [
					{ time: 0, value: { y: 0 } },
					{ time: 0.3, value: { y: distance * 1.2 } },
					{ time: 0.5, value: { y: distance } },
					{ time: 0.7, value: { y: distance * 1.1 } },
					{ time: 1, value: { y: distance } },
				];
			}
		}

		return [
			{ time: 0, value: { x: 0, y: 0 } },
			{
				time: 1,
				value: { x: isHorizontal ? distance : 0, y: isVertical ? distance : 0 },
			},
		];
	}

	private generateScaleAnimation(
		prompt: string,
		style: string,
	): Array<{ time: number; value: Record<string, unknown> }> {
		const isGrow = prompt.includes("grow") || prompt.includes("expand");
		const targetScale = isGrow ? 1.5 : 0.5;

		if (style === "elastic") {
			return [
				{ time: 0, value: { scale: 1 } },
				{ time: 0.6, value: { scale: targetScale * 1.1 } },
				{ time: 1, value: { scale: targetScale } },
			];
		}

		return [
			{ time: 0, value: { scale: 1 } },
			{ time: 1, value: { scale: targetScale } },
		];
	}

	private generateRotateAnimation(style: string): Array<{ time: number; value: Record<string, unknown> }> {
		if (style === "bounce") {
			return [
				{ time: 0, value: { rotate: 0 } },
				{ time: 0.5, value: { rotate: 45 } },
				{ time: 0.7, value: { rotate: 35 } },
				{ time: 1, value: { rotate: 45 } },
			];
		}

		return [
			{ time: 0, value: { rotate: 0 } },
			{ time: 1, value: { rotate: 45 } },
		];
	}
}

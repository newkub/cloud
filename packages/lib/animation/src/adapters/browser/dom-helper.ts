import type { AnimationTarget } from "../../shared/types/animation";

/**
 * DOM Helper infrastructure - Handles DOM operations (Functional style)
 */

export const getDOMElements = (targets: AnimationTarget): HTMLElement[] => {
	if (typeof targets === "string") {
		return Array.from(document.querySelectorAll(targets)) as HTMLElement[];
	}

	if (targets instanceof NodeList) {
		return Array.from(targets) as HTMLElement[];
	}

	if (Array.isArray(targets)) {
		return targets.filter((t) => t instanceof HTMLElement) as HTMLElement[];
	}

	if (targets instanceof HTMLElement || targets instanceof SVGElement) {
		return [targets as HTMLElement];
	}

	return [];
};

export const setDOMProperty = (element: HTMLElement, property: string, value: string | number): void => {
	if (typeof value === "number") {
		element.style.setProperty(property, `${value}px`);
	} else {
		element.style.setProperty(property, value);
	}
};

export const getDOMProperty = (element: HTMLElement, property: string): string | number => {
	const value = element.style.getPropertyValue(property);
	const numValue = Number.parseFloat(value);
	return Number.isNaN(numValue) ? value : numValue;
};

export const getDOMComputedStyle = (element: HTMLElement, property: string): string | number => {
	const computed = window.getComputedStyle(element);
	const value = computed.getPropertyValue(property);
	const numValue = Number.parseFloat(value);
	return Number.isNaN(numValue) ? value : numValue;
};

export const transformDOM = (element: HTMLElement, transforms: Record<string, number | string>): void => {
	const transformString = Object.entries(transforms)
		.map(([key, value]) => `${key}(${value})`)
		.join(" ");
	element.style.transform = transformString;
};

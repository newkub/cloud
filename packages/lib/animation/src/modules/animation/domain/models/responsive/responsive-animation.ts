/**
 * Responsive Animation Domain Model
 * Handles breakpoint-based animation properties
 */

import type { ResponsiveOptions } from "../../../types";

export class ResponsiveAnimation {
	private options: ResponsiveOptions;
	private currentBreakpoint = "base";
	private resizeListener: (() => void) | null = null;

	constructor(options: ResponsiveOptions = {}) {
		this.options = {
			breakpoints: {
				sm: 640,
				md: 768,
				lg: 1024,
				xl: 1280,
			},
			properties: {},
			listener: true,
			...options,
		};

		if (this.options.listener) {
			this.setupResizeListener();
		}
	}

	private setupResizeListener(): void {
		this.updateBreakpoint();
		this.resizeListener = () => {
			this.updateBreakpoint();
		};
		window.addEventListener("resize", this.resizeListener);
	}

	private updateBreakpoint(): void {
		const width = window.innerWidth;
		const bp = this.options.breakpoints;

		if (!bp) {
			this.currentBreakpoint = "base";
			return;
		}

		if (width >= (bp.xl ?? 1280)) {
			this.currentBreakpoint = "xl";
		} else if (width >= (bp.lg ?? 1024)) {
			this.currentBreakpoint = "lg";
		} else if (width >= (bp.md ?? 768)) {
			this.currentBreakpoint = "md";
		} else if (width >= (bp.sm ?? 640)) {
			this.currentBreakpoint = "sm";
		} else {
			this.currentBreakpoint = "base";
		}
	}

	public getCurrentBreakpoint(): string {
		return this.currentBreakpoint;
	}

	public getProperties(propName: string): Record<string, number> {
		const allProps = this.options.properties?.[propName] ?? {};
		const bpProps = allProps[this.currentBreakpoint] ?? allProps.base ?? {};
		return bpProps;
	}

	public getProperty(propName: string, key: string): number {
		const props = this.getProperties(propName);
		return props[key] ?? 0;
	}

	public dispose(): void {
		if (this.resizeListener) {
			window.removeEventListener("resize", this.resizeListener);
			this.resizeListener = null;
		}
	}
}

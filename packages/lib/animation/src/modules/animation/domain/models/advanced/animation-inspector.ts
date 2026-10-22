/**
 * Animation Inspector Domain Model
 * Provides debugging and inspection tools for animations
 */

import type { AnimationInspectorData, InspectorOptions } from "../../../types";

export class AnimationInspector {
	private options: InspectorOptions;
	private overlay: HTMLElement | null = null;
	private animations: Map<string, AnimationInspectorData> = new Map();

	constructor(options: InspectorOptions = {}) {
		this.options = {
			showOverlay: true,
			showTimeline: true,
			showProperties: true,
			...options,
		};

		if (this.options.showOverlay) {
			this.createOverlay();
		}
	}

	private createOverlay(): void {
		this.overlay = document.createElement("div");
		this.overlay.style.cssText = `
			position: fixed;
			top: 10px;
			right: 10px;
			background: rgba(0, 0, 0, 0.8);
			color: white;
			padding: 10px;
			border-radius: 8px;
			font-family: monospace;
			font-size: 12px;
			z-index: 10000;
			min-width: 200px;
		`;
		document.body.appendChild(this.overlay);
	}

	public registerAnimation(id: string, data: AnimationInspectorData): void {
		this.animations.set(id, data);
		this.updateOverlay();
	}

	public unregisterAnimation(id: string): void {
		this.animations.delete(id);
		this.updateOverlay();
	}

	public updateAnimation(id: string, data: Partial<AnimationInspectorData>): void {
		const existing = this.animations.get(id);
		if (existing) {
			this.animations.set(id, { ...existing, ...data });
			this.updateOverlay();
		}
	}

	private updateOverlay(): void {
		if (!this.overlay) return;

		this.overlay.textContent = ""; // Clear previous content

		const title = document.createElement("strong");
		title.textContent = "Animation Inspector";
		this.overlay.appendChild(title);

		const count = document.createElement("div");
		count.textContent = `Active Animations: ${this.animations.size}`;
		this.overlay.appendChild(count);

		const separator = document.createElement("br");
		this.overlay.appendChild(separator);

		this.animations.forEach((data, id) => {
			const container = document.createElement("div");
			container.style.cssText = "margin-bottom: 8px; border-bottom: 1px solid #333; padding-bottom: 4px;";

			const idLabel = document.createElement("strong");
			idLabel.textContent = id;
			container.appendChild(idLabel);

			const progressLabel = document.createElement("div");
			progressLabel.textContent = `Progress: ${(data.progress * 100).toFixed(1)}%`;
			container.appendChild(progressLabel);

			const durationLabel = document.createElement("div");
			durationLabel.textContent = `Duration: ${data.duration}ms`;
			container.appendChild(durationLabel);

			const playingLabel = document.createElement("div");
			playingLabel.textContent = `Playing: ${data.isPlaying ? "Yes" : "No"}`;
			container.appendChild(playingLabel);

			this.overlay?.appendChild(container);
		});
	}

	public getAnimationData(id: string): AnimationInspectorData | undefined {
		return this.animations.get(id);
	}

	public getAllAnimations(): AnimationInspectorData[] {
		return Array.from(this.animations.values());
	}

	public dispose(): void {
		if (this.overlay) {
			document.body.removeChild(this.overlay);
			this.overlay = null;
		}
		this.animations.clear();
	}
}

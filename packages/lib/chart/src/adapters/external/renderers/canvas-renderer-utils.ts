// Canvas renderer utilities

const DEFAULT_COLORS = [
	"#3b82f6",
	"#ef4444",
	"#10b981",
	"#f59e0b",
	"#8b5cf6",
	"#ec4899",
	"#06b6d4",
	"#84cc16",
] as const;

export const getDefaultColor = (index: number): string => {
	const colorIndex = index % DEFAULT_COLORS.length;
	return DEFAULT_COLORS[colorIndex] ?? DEFAULT_COLORS[0];
};

export const clearCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
	ctx.clearRect(0, 0, width, height);
};

export const drawAxes = (ctx: CanvasRenderingContext2D, width: number, height: number, padding: number): void => {
	ctx.strokeStyle = "#ccc";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(padding, padding);
	ctx.lineTo(padding, height - padding);
	ctx.lineTo(width - padding, height - padding);
	ctx.stroke();
};

type Point = { readonly x: number; readonly y: number };

const tokenizePath = (d: string): number[] => {
	const cleaned = d
		.replace(/([MLHVCSQTAZ])/gi, " $1 ")
		.replace(/,/g, " ")
		.replace(/-/g, " -")
		.replace(/\s+/g, " ")
		.trim();
	const tokens = cleaned.split(" ");
	const numbers: number[] = [];
	for (const token of tokens) {
		const num = Number.parseFloat(token);
		if (!Number.isNaN(num)) {
			numbers.push(num);
		}
	}
	return numbers;
};

const sampleCubicBezier = (p0: Point, p1: Point, p2: Point, p3: Point): Point[] => {
	const points: Point[] = [];
	for (let i = 0; i <= 10; i++) {
		const t = i / 10;
		const u = 1 - t;
		const x = u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x;
		const y = u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y;
		points.push({ x, y });
	}
	return points;
};

export const computePathBounds = (
	d: string,
): {
	readonly minX: number;
	readonly minY: number;
	readonly maxX: number;
	readonly maxY: number;
} | null => {
	const regex = /([MLHVCSQTAZ])([^MLHVCSQTAZ]*)/gi;
	const numbers = d.match(regex) ?? [];
	let current: Point = { x: 0, y: 0 };
	let start: Point = current;
	let first = true;
	let minX = Number.POSITIVE_INFINITY;
	let minY = Number.POSITIVE_INFINITY;
	let maxX = Number.NEGATIVE_INFINITY;
	let maxY = Number.NEGATIVE_INFINITY;

	const addPoint = (p: Point) => {
		if (first) {
			minX = maxX = p.x;
			minY = maxY = p.y;
			first = false;
		} else {
			minX = Math.min(minX, p.x);
			minY = Math.min(minY, p.y);
			maxX = Math.max(maxX, p.x);
			maxY = Math.max(maxY, p.y);
		}
	};

	for (const match of numbers) {
		const command = match[0]?.toUpperCase() ?? "";
		const values = tokenizePath(match.slice(1));
		let i = 0;

		switch (command) {
			case "M": {
				if (values.length >= 2) {
					current = { x: values[i++] ?? 0, y: values[i++] ?? 0 };
					start = current;
					addPoint(current);
				}
				while (i + 1 < values.length) {
					current = { x: values[i++] ?? 0, y: values[i++] ?? 0 };
					addPoint(current);
				}
				break;
			}
			case "L": {
				while (i + 1 < values.length) {
					current = { x: values[i++] ?? 0, y: values[i++] ?? 0 };
					addPoint(current);
				}
				break;
			}
			case "H": {
				while (i < values.length) {
					current = { x: values[i++] ?? 0, y: current.y };
					addPoint(current);
				}
				break;
			}
			case "V": {
				while (i < values.length) {
					current = { x: current.x, y: values[i++] ?? 0 };
					addPoint(current);
				}
				break;
			}
			case "C": {
				while (i + 5 < values.length) {
					const cp1 = { x: values[i++] ?? 0, y: values[i++] ?? 0 };
					const cp2 = { x: values[i++] ?? 0, y: values[i++] ?? 0 };
					const end = { x: values[i++] ?? 0, y: values[i++] ?? 0 };
					for (const p of sampleCubicBezier(current, cp1, cp2, end)) {
						addPoint(p);
					}
					current = end;
				}
				break;
			}
			case "Z": {
				current = start;
				break;
			}
		}
	}

	if (first) return null;
	return { minX, minY, maxX, maxY };
};

export const drawSvgPath = (
	ctx: CanvasRenderingContext2D,
	d: string,
	x: number,
	y: number,
	width: number,
	height: number,
): void => {
	if (typeof Path2D === "undefined") {
		ctx.fillRect(x, y, width, height);
		return;
	}

	const bounds = computePathBounds(d);
	if (!bounds) {
		ctx.fillRect(x, y, width, height);
		return;
	}

	const pathWidth = bounds.maxX - bounds.minX || 1;
	const pathHeight = bounds.maxY - bounds.minY || 1;
	const scale = Math.min(width / pathWidth, height / pathHeight) * 0.9;
	const scaledWidth = pathWidth * scale;
	const scaledHeight = pathHeight * scale;
	const offsetX = x + (width - scaledWidth) / 2 - bounds.minX * scale;
	const offsetY = y + (height - scaledHeight) / 2 - bounds.minY * scale;

	const path = new Path2D(d);

	ctx.save();
	ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
	ctx.fill(path);
	ctx.stroke(path);
	ctx.restore();
};

// Gauge chart drawing utilities

export const drawArc = (
	ctx: CanvasRenderingContext2D,
	centerX: number,
	centerY: number,
	radius: number,
	startAngle: number,
	endAngle: number,
	color: string,
	width: number,
) => {
	ctx.strokeStyle = color;
	ctx.lineWidth = width;
	ctx.lineCap = "round";
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, startAngle, endAngle);
	ctx.stroke();
};

export const drawNeedle = (
	ctx: CanvasRenderingContext2D,
	centerX: number,
	centerY: number,
	length: number,
	angle: number,
	width: number,
) => {
	const endPoint = {
		x: centerX + length * Math.cos(angle),
		y: centerY + length * Math.sin(angle),
	};

	ctx.strokeStyle = "#374151";
	ctx.lineWidth = width;
	ctx.lineCap = "round";
	ctx.beginPath();
	ctx.moveTo(centerX, centerY);
	ctx.lineTo(endPoint.x, endPoint.y);
	ctx.stroke();

	// Draw center circle
	ctx.fillStyle = "#374151";
	ctx.beginPath();
	ctx.arc(centerX, centerY, width * 2, 0, Math.PI * 2);
	ctx.fill();
};

/**
 * Kinetic Typography Types
 */

export interface KineticTypographyOptions {
	splitBy?: "characters" | "words" | "lines";
	stagger?: number | import("./stagger").StaggerOptions;
	reverse?: boolean;
	random?: () => number;
}

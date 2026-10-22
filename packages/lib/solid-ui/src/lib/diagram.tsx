/**
 * Shared diagram engine — node/edge model, layered layout, SVG renderer,
 * and a Mermaid-syntax subset parser. All painting uses theme tokens.
 * Implementation lives in `./diagram/` — this barrel keeps the public API.
 */
export * from "./diagram/model";
export { DiagramSvg } from "./diagram/svg";

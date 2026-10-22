import type { ImageFit, ImageFormat, ImageTransform } from "../../models";
export declare const DEFAULT_FORMAT: ImageFormat;
export declare const DEFAULT_QUALITY = 80;
export declare const DEFAULT_FIT: ImageFit;
export declare const normalizeTransform: (options: ImageTransform) => Required<ImageTransform> & {
    format: ImageFormat;
    quality: number;
    fit: ImageFit;
};

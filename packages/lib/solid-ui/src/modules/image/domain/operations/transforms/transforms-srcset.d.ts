import type { ImageTransform } from "../../models";
export declare const generateSrcsetForProvider: (src: string, widths: number[], options: ImageTransform, provider: string, providerConfig?: {
    cloudName?: string;
    accountId?: string;
}) => string;

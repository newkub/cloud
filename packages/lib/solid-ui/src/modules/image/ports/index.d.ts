import type { ImageCrop, ImageFit, ImageFormat, ImageOptions, ImagePreset, ImageTransform, PresetDefinition } from "../domain/models";
export type { ImageCrop, ImageFit, ImageFormat, ImageOptions, ImagePreset, ImageTransform, PresetDefinition };
export interface ProviderConfig {
    readonly baseURL?: string;
    readonly key?: string;
}
export interface CloudinaryConfig extends ProviderConfig {
    readonly cloudName?: string;
}
export interface ImagekitConfig extends ProviderConfig {
    readonly accountId?: string;
}
export interface ImageServicePort {
    getImageUrl(src: string, options?: ImageTransform): string;
    generateSrcset(src: string, sizes: number[], options?: ImageTransform): string;
}

import type { ImageTransform, PresetDefinition } from "../../models";
export declare const DEFAULT_PRESETS: Record<string, PresetDefinition>;
export declare const resolvePreset: (presetName: string, customPresets?: Record<string, PresetDefinition>) => PresetDefinition | undefined;
export declare const mergePresetWithOptions: (preset: PresetDefinition, options: ImageTransform) => ImageTransform;

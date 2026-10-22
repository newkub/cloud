export declare const DEFAULT_SCREENS: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    "2xl": number;
};
export declare const generateSizes: (screens?: Record<string, number>, sizes?: string) => string;
export declare const generateWidths: (baseWidth: number, multipliers?: number[]) => number[];

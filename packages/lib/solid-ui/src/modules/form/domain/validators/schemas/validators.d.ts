import type { Type } from "arktype";
/**
 * Required Validator Schema
 */
export declare const requiredSchema: import("arktype").BaseType<string | number | boolean | string[] | File[] | File, {}>;
/**
 * Email Validator Schema
 */
export declare const emailSchema: import("arktype/internal/variants/string.ts").StringType<string, {}>;
/**
 * Min Length Validator Schema
 */
export declare const minLengthSchema: (min: number) => import("arktype").BaseType<string | unknown[], {}>;
/**
 * Max Length Validator Schema
 */
export declare const maxLengthSchema: (max: number) => import("arktype").BaseType<string | unknown[], {}>;
/**
 * Min Validator Schema
 */
export declare const minSchema: (min: number) => import("arktype/internal/variants/number.ts").NumberType<number, {}>;
/**
 * Max Validator Schema
 */
export declare const maxSchema: (max: number) => import("arktype/internal/variants/number.ts").NumberType<number, {}>;
/**
 * Pattern Validator Schema - Using regex literal with type inference
 */
export declare const patternSchema: (pattern: string) => import("arktype/internal/variants/string.ts").StringType<string, {}>;
/**
 * URL Validator Schema
 */
export declare const urlSchema: import("arktype/internal/variants/string.ts").StringType<string, {}>;
/**
 * Phone Validator Schema - Using regex literal with type inference
 */
export declare const telSchema: import("arktype/internal/variants/string.ts").StringType<string, {}>;
/**
 * Max Size Validator Schema
 */
export declare const maxSizeSchema: (maxSize: number) => import("arktype/internal/variants/object.ts").ObjectType<{
    size: number;
}, {}>;
/**
 * File Type Validator Schema
 */
export declare const fileTypeSchema: () => import("arktype/internal/variants/string.ts").StringType<string, {}>;
/**
 * Integer Validator Schema
 */
export declare const integerSchema: import("arktype/internal/variants/number.ts").NumberType<number, {}>;
/**
 * Positive Validator Schema
 */
export declare const positiveSchema: import("arktype/internal/variants/number.ts").NumberType<number, {}>;
/**
 * Alphanumeric Validator Schema
 */
export declare const alphanumericSchema: import("arktype/internal/variants/string.ts").StringType<string, {}>;
/**
 * Alpha Validator Schema - Using regex literal with type inference
 */
export declare const alphaSchema: import("arktype/internal/variants/string.ts").StringType<string, {}>;
/**
 * Numeric Validator Schema - Using regex literal with type inference
 */
export declare const numericSchema: import("arktype/internal/variants/string.ts").StringType<string, {}>;
/**
 * JSON String Parser Schema - Using .pipe() for transformation
 */
export declare const jsonStringSchema: Type<unknown>;
/**
 * Date String Parser Schema - Using .pipe() for transformation
 */
export declare const dateStringSchema: import("arktype/internal/variants/object.ts").ObjectType<(In: string) => import("arktype/internal/attributes.ts").To<Date>, {}>;
/**
 * Semver String Schema - Using format keyword
 */
export declare const semverSchema: import("arktype/internal/variants/string.ts").StringType<string, {}>;
/**
 * ISO Date String Schema
 */
export declare const isoDateSchema: import("arktype/internal/variants/string.ts").StringType<string, {}>;
/**
 * Base64 String Schema - Using format keyword
 */
export declare const base64Schema: import("arktype/internal/variants/string.ts").StringType<string, {}>;

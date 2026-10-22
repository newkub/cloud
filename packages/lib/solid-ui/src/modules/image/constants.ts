/**
 * Image transformation service base URLs.
 * These are intentionally centralized so callers can override account/endpoint
 * values without scattering hardcoded URLs across transform builders.
 */

export const DEFAULT_CLOUDINARY_CLOUD_NAME = "demo";
export const CLOUDINARY_FETCH_BASE_URL = "https://res.cloudinary.com";

export const DEFAULT_IMAGEKIT_ACCOUNT_ID = "your accountId";
export const IMAGEKIT_BASE_URL = "https://ik.imagekit.io";

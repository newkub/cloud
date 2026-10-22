import { type Accessor, createSignal } from "solid-js";

export interface UserAgentState {
	/** Raw `navigator.userAgent` — `""` when `navigator` is unavailable */
	ua: Accessor<string>;
	/** Detected browser — `"Edge" | "Opera" | "Chrome" | "Firefox" | "Safari" | "IE" | "Unknown"` */
	browser: Accessor<string>;
	/** Detected OS — `"Windows" | "macOS" | "iOS" | "Android" | "ChromeOS" | "Linux" | "Unknown"` */
	os: Accessor<string>;
	/** True when the UA looks like a phone/tablet */
	isMobile: Accessor<boolean>;
	/** True when the UA looks like a desktop browser */
	isDesktop: Accessor<boolean>;
}

const parseBrowser = (ua: string): string => {
	if (/edg/i.test(ua)) return "Edge";
	if (/opr|opera/i.test(ua)) return "Opera";
	if (/firefox|fxios/i.test(ua)) return "Firefox";
	if (/chrome|crios|chromium/i.test(ua)) return "Chrome";
	if (/safari/i.test(ua)) return "Safari";
	if (/msie|trident/i.test(ua)) return "IE";
	return "Unknown";
};

const parseOs = (ua: string): string => {
	if (/windows phone/i.test(ua)) return "Windows Phone";
	if (/windows/i.test(ua)) return "Windows";
	if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
	if (/android/i.test(ua)) return "Android";
	if (/cros/i.test(ua)) return "ChromeOS";
	if (/mac os|macintosh/i.test(ua)) return "macOS";
	if (/linux/i.test(ua)) return "Linux";
	return "Unknown";
};

const MOBILE_RE = /mobi|android|iphone|ipad|ipod|windows phone|iemobile/i;

/**
 * Lightweight `navigator.userAgent` parse — `browser`, `os`, `isMobile` and
 * `isDesktop` accessors with no dependency. The snapshot is taken once when the
 * hook is created (UA strings don't change at runtime).
 *
 * @returns `{ ua, browser, os, isMobile, isDesktop }`
 *
 * @example
 * const { browser, os, isMobile } = useUserAgent();
 * <Show when={isMobile()}><MobileNav /></Show>
 */
export function useUserAgent(): UserAgentState {
	const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
	const mobile = ua !== "" && MOBILE_RE.test(ua);
	const [uaSignal] = createSignal(ua);
	const [browser] = createSignal(parseBrowser(ua));
	const [os] = createSignal(parseOs(ua));
	const [isMobile] = createSignal(mobile);
	const [isDesktop] = createSignal(ua !== "" && !mobile);
	return { ua: uaSignal, browser, os, isMobile, isDesktop };
}

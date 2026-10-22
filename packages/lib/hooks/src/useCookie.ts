import { type Accessor, createSignal } from "solid-js";

export interface CookieOptions {
	/** Days until expiry — ignored when `maxAge` is set */
	days?: number;
	/** `Max-Age` in seconds — takes precedence over `days` */
	maxAge?: number;
	/** Cookie path — @default "/" */
	path?: string;
	/** Cookie domain */
	domain?: string;
	/** `SameSite` attribute */
	sameSite?: "Strict" | "Lax" | "None";
	/** Add the `Secure` attribute */
	secure?: boolean;
}

export interface CookieControls {
	/** Decoded cookie value — `null` when absent. Re-read on every `set`/`remove` call */
	value: Accessor<string | null>;
	/** Write the cookie (URL-encoded) and update `value` */
	set: (v: string, opts?: CookieOptions) => void;
	/** Expire the cookie and reset `value` to `null` — pass the same `path`/`domain` used at `set` time */
	remove: (opts?: Pick<CookieOptions, "path" | "domain">) => void;
}

const readCookie = (name: string): string | null => {
	if (typeof document === "undefined") return null;
	const prefix = `${encodeURIComponent(name)}=`;
	for (const part of document.cookie.split(";")) {
		const trimmed = part.trim();
		if (trimmed.startsWith(prefix)) return decodeURIComponent(trimmed.slice(prefix.length));
	}
	return null;
};

/**
 * Single `document.cookie` entry as a signal — `set()` writes attributes
 * (`days`/`maxAge`, `path`, `domain`, `sameSite`, `secure`) and `remove()`
 * expires it. Values are URL-encoded; `value` is read eagerly on creation.
 *
 * @param name — Cookie name (URL-encoded on write)
 * @returns `{ value, set, remove }`
 *
 * @example
 * const banner = useCookie("seen-banner");
 * <Show when={!banner.value()}><Banner onClose={() => banner.set("1", { days: 30 })} /></Show>
 */
export function useCookie(name: string): CookieControls {
	const [value, setValue] = createSignal<string | null>(readCookie(name));

	const set = (v: string, opts: CookieOptions = {}) => {
		if (typeof document === "undefined") return;
		let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(v)}`;
		cookie += `; path=${opts.path ?? "/"}`;
		if (opts.domain) cookie += `; domain=${opts.domain}`;
		if (opts.maxAge !== undefined) cookie += `; max-age=${opts.maxAge}`;
		else if (opts.days !== undefined) {
			cookie += `; expires=${new Date(Date.now() + opts.days * 864e5).toUTCString()}`;
		}
		if (opts.sameSite) cookie += `; samesite=${opts.sameSite}`;
		if (opts.secure) cookie += "; secure";
		// biome-ignore lint/suspicious/noDocumentCookie: document.cookie is the API this hook wraps
		document.cookie = cookie;
		setValue(v);
	};

	const remove = (opts?: Pick<CookieOptions, "path" | "domain">) => {
		if (typeof document === "undefined") return;
		let cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
		cookie += `; path=${opts?.path ?? "/"}`;
		if (opts?.domain) cookie += `; domain=${opts.domain}`;
		// biome-ignore lint/suspicious/noDocumentCookie: expiring requires assigning document.cookie
		document.cookie = cookie;
		setValue(null);
	};

	return { value, set, remove };
}

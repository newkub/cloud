import { type Accessor, createSignal, onCleanup } from "solid-js";

export interface OtpCredentialLike {
	readonly id: string;
	readonly type: string;
	/** The one-time code delivered over `transport` */
	readonly code: string;
}

interface OtpCredentialsLike {
	get(options: { otp: { transport: string[] }; signal?: AbortSignal }): Promise<OtpCredentialLike | null>;
}

const credentials = (): OtpCredentialsLike | undefined =>
	typeof navigator === "undefined" ? undefined : (navigator as { credentials?: OtpCredentialsLike }).credentials;

const isSupported = () =>
	typeof navigator !== "undefined" && "credentials" in navigator && "OTPCredential" in globalThis;

export interface OtpState {
	/** WebOTP support flag (`credentials` container + `OTPCredential`) */
	supported: boolean;
	/** True while a `receive()` request is in flight */
	receiving: Accessor<boolean>;
	/** Last error message (abort included) */
	error: Accessor<string | undefined>;
	/**
	 * Requests an OTP via `credentials.get({ otp })` — resolves the code,
	 * or `undefined` on abort/error. Aborts any previous pending request.
	 */
	receive: (transport?: string) => Promise<string | undefined>;
	/** Aborts the in-flight `receive()` request */
	abort: () => void;
}

/**
 * WebOTP — one-shot SMS one-time-code retrieval via `OTPCredential`.
 * `supported` is `false` where `OTPCredential` is missing (jsdom, most
 * desktop browsers); `receive` then resolves `undefined` instead of throwing.
 * Disposing the owner aborts any pending request.
 *
 * @returns `{ supported, receiving, error, receive, abort }`
 *
 * @example
 * const otp = useOtp();
 * <button disabled={!otp.supported} onClick={async () => setCode(await otp.receive())}>
 *   {otp.receiving() ? "waiting for sms…" : "fill code from sms"}
 * </button>
 */
export function useOtp(): OtpState {
	const supported = isSupported();
	const [receiving, setReceiving] = createSignal(false);
	const [error, setError] = createSignal<string>();
	let controller: AbortController | undefined;

	const abort = () => {
		controller?.abort();
		controller = undefined;
		setReceiving(false);
	};

	const receive = async (transport = "sms") => {
		const api = credentials();
		if (!api) return undefined;
		abort();
		const ctrl = new AbortController();
		controller = ctrl;
		setReceiving(true);
		try {
			const cred = await api.get({ otp: { transport: [transport] }, signal: ctrl.signal });
			setError(undefined);
			return cred?.code;
		} catch (e) {
			setError(e instanceof Error ? e.message : "otp request failed");
			return undefined;
		} finally {
			if (controller === ctrl) {
				controller = undefined;
				setReceiving(false);
			}
		}
	};

	onCleanup(abort);

	return { supported, receiving, error, receive, abort };
}

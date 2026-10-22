import { type Accessor, createSignal } from "solid-js";

export interface PublicKeyCredentialLike {
	readonly id: string;
	readonly type: string;
	readonly rawId: ArrayBuffer;
	readonly response: unknown;
	readonly authenticatorAttachment?: string | null;
}

export interface WebAuthnCreateOptions {
	/** `PublicKeyCredentialCreationOptions` — kept as a record to avoid lib.dom drift */
	publicKey: Record<string, unknown>;
	signal?: AbortSignal;
}

export interface WebAuthnGetOptions {
	/** `PublicKeyCredentialRequestOptions` — kept as a record to avoid lib.dom drift */
	publicKey: Record<string, unknown>;
	mediation?: "silent" | "optional" | "conditional" | "required";
	signal?: AbortSignal;
}

interface CredentialsContainerLike {
	create(options?: Record<string, unknown>): Promise<PublicKeyCredentialLike | null>;
	get(options?: Record<string, unknown>): Promise<PublicKeyCredentialLike | null>;
}

const credentials = (): CredentialsContainerLike | undefined =>
	typeof navigator === "undefined" ? undefined : (navigator as { credentials?: CredentialsContainerLike }).credentials;

const isSupported = () =>
	typeof navigator !== "undefined" && "credentials" in navigator && "PublicKeyCredential" in globalThis;

export interface WebAuthnState {
	/** `navigator.credentials` + `PublicKeyCredential` support flag */
	supported: boolean;
	/** Last credential produced by `create`/`get` */
	credential: Accessor<PublicKeyCredentialLike | undefined>;
	/** Last ceremony error message (user cancel included) */
	error: Accessor<string | undefined>;
	/** `navigator.credentials.create` — registers a passkey; resolves `undefined` on cancel/error */
	create: (options: WebAuthnCreateOptions) => Promise<PublicKeyCredentialLike | undefined>;
	/** `navigator.credentials.get` — authenticates with an existing passkey; resolves `undefined` on cancel/error */
	get: (options: WebAuthnGetOptions) => Promise<PublicKeyCredentialLike | undefined>;
}

/**
 * WebAuthn / passkeys — wraps `navigator.credentials.create` and `.get`.
 * `supported` is `false` where `PublicKeyCredential` or the credentials
 * container is missing (jsdom, insecure contexts); the ceremonies then
 * resolve `undefined` instead of throwing.
 *
 * @returns `{ supported, credential, error, create, get }`
 *
 * @example
 * const auth = useWebAuthn();
 * <button disabled={!auth.supported} onClick={() => auth.create({ publicKey: creationOpts })}>
 *   register passkey
 * </button>
 */
export function useWebAuthn(): WebAuthnState {
	const supported = isSupported();
	const [credential, setCredential] = createSignal<PublicKeyCredentialLike>();
	const [error, setError] = createSignal<string>();

	const run = async (call: (api: CredentialsContainerLike) => Promise<PublicKeyCredentialLike | null>) => {
		const api = credentials();
		if (!api) return undefined;
		try {
			const cred = await call(api);
			if (cred) setCredential(cred);
			setError(undefined);
			return cred ?? undefined;
		} catch (e) {
			setError(e instanceof Error ? e.message : "credential request failed");
			return undefined;
		}
	};

	return {
		supported,
		credential,
		error,
		create: (options) => run((api) => api.create(options as unknown as Record<string, unknown>)),
		get: (options) => run((api) => api.get(options as unknown as Record<string, unknown>)),
	};
}

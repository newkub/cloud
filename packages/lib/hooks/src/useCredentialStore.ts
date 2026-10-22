import { type Accessor, createSignal } from "solid-js";

export interface CredentialLike {
	readonly id: string;
	readonly type: string;
	readonly name?: string;
	readonly iconURL?: string;
}

export interface CredentialStoreRequestOptions {
	/** Request a password credential */
	password?: boolean;
	/** Federated identity providers, e.g. `{ providers: ["https://accounts.google.com"] }` */
	federated?: Record<string, unknown>;
	/** Credential mediation requirement */
	mediation?: "silent" | "optional" | "conditional" | "required";
	signal?: AbortSignal;
}

interface CredentialStoreLike {
	get(options?: Record<string, unknown>): Promise<CredentialLike | null>;
	store(credential: CredentialLike): Promise<CredentialLike>;
	preventSilentAccess(): Promise<void>;
}

const credentials = (): CredentialStoreLike | undefined =>
	typeof navigator === "undefined"
		? undefined
		: (navigator as unknown as { credentials?: CredentialStoreLike }).credentials;

export interface CredentialStoreState {
	/** `navigator.credentials` support flag */
	supported: boolean;
	/** Last credential returned by `get` or persisted by `store` */
	credential: Accessor<CredentialLike | undefined>;
	/** Last error message */
	error: Accessor<string | undefined>;
	/** `navigator.credentials.get` — resolves `undefined` when unsupported or on error */
	get: (options?: CredentialStoreRequestOptions) => Promise<CredentialLike | undefined>;
	/** `navigator.credentials.store` — persists a credential after sign-in */
	store: (credential: CredentialLike) => Promise<CredentialLike | undefined>;
	/** `navigator.credentials.preventSilentAccess` — call on sign-out */
	preventSilentAccess: () => Promise<void>;
}

/**
 * Credential Management API — fetch, persist and gate stored credentials
 * via `navigator.credentials`. `supported` is `false` where the container
 * is missing; `get`/`store` then resolve `undefined` instead of throwing.
 *
 * @returns `{ supported, credential, error, get, store, preventSilentAccess }`
 *
 * @example
 * const store = useCredentialStore();
 * await store.store({ id: user.id, type: "password", name: user.name });
 * <button onClick={() => store.preventSilentAccess()}>sign out</button>
 */
export function useCredentialStore(): CredentialStoreState {
	const supported = typeof navigator !== "undefined" && "credentials" in navigator;
	const [credential, setCredential] = createSignal<CredentialLike>();
	const [error, setError] = createSignal<string>();

	const get = async (options?: CredentialStoreRequestOptions) => {
		const api = credentials();
		if (!api) return undefined;
		try {
			const cred = await api.get((options ?? {}) as Record<string, unknown>);
			if (cred) setCredential(cred);
			setError(undefined);
			return cred ?? undefined;
		} catch (e) {
			setError(e instanceof Error ? e.message : "credentials.get failed");
			return undefined;
		}
	};

	const store = async (cred: CredentialLike) => {
		const api = credentials();
		if (!api) return undefined;
		try {
			const stored = await api.store(cred);
			setCredential(stored);
			setError(undefined);
			return stored;
		} catch (e) {
			setError(e instanceof Error ? e.message : "credentials.store failed");
			return undefined;
		}
	};

	const preventSilentAccess = async () => {
		const api = credentials();
		if (!api) return;
		try {
			await api.preventSilentAccess();
			setError(undefined);
		} catch (e) {
			setError(e instanceof Error ? e.message : "preventSilentAccess failed");
		}
	};

	return { supported, credential, error, get, store, preventSilentAccess };
}

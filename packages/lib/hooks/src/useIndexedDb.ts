import { type Accessor, createSignal, onCleanup } from "solid-js";

export interface IndexedDbControls {
	/** `indexedDB` support flag */
	supported: boolean;
	/** True once the database has been opened (lazy — first op triggers the open) */
	ready: Accessor<boolean>;
	/** Read a value — `undefined` on miss, failure, or when unsupported */
	get: <T = unknown>(key: IDBValidKey) => Promise<T | undefined>;
	/** Write a value — resolves `false` on failure or when unsupported */
	set: (key: IDBValidKey, value: unknown) => Promise<boolean>;
	/** Delete a key — resolves `false` on failure or when unsupported */
	del: (key: IDBValidKey) => Promise<boolean>;
	/** All keys in the store — `[]` on failure or when unsupported */
	keys: () => Promise<IDBValidKey[]>;
	/** Last error message */
	error: Accessor<string | undefined>;
}

/**
 * Promise-based key/value store over IndexedDB — the database opens lazily on
 * the first operation (creating the object store during `upgradeneeded`) and
 * closes on cleanup. All ops resolve to a benign fallback when `indexedDB`
 * is unavailable.
 *
 * @param dbName — Database name
 * @param options — `store` object-store name (@default "store"), `version` (@default 1)
 * @returns `{ supported, ready, get, set, del, keys, error }`
 *
 * @example
 * const db = useIndexedDb("app", { store: "prefs" });
 * await db.set("theme", "dark");
 * const theme = await db.get<string>("theme");
 */
export function useIndexedDb(
	dbName: string,
	options?: {
		/** Object-store name, created on upgrade when missing. @default "store" */
		store?: string;
		/** Schema version. @default 1 */
		version?: number;
	},
): IndexedDbControls {
	const storeName = options?.store ?? "store";
	const version = options?.version ?? 1;
	const supported = typeof indexedDB !== "undefined";
	const [ready, setReady] = createSignal(false);
	const [error, setError] = createSignal<string>();
	let dbPromise: Promise<IDBDatabase> | undefined;
	let db: IDBDatabase | undefined;

	const open = (): Promise<IDBDatabase> => {
		dbPromise ??= new Promise<IDBDatabase>((resolve, reject) => {
			const req = indexedDB.open(dbName, version);
			req.onupgradeneeded = () => {
				if (!req.result.objectStoreNames.contains(storeName)) req.result.createObjectStore(storeName);
			};
			req.onsuccess = () => {
				db = req.result;
				setReady(true);
				resolve(req.result);
			};
			req.onerror = () => reject(req.error ?? new Error("indexedDB.open failed"));
		});
		return dbPromise;
	};
	onCleanup(() => db?.close());

	const withStore = async <T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>) => {
		const d = await open();
		const req = fn(d.transaction(storeName, mode).objectStore(storeName));
		return new Promise<T>((resolve, reject) => {
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => reject(req.error ?? new Error("IndexedDB request failed"));
		});
	};

	const safe = async <T>(fn: () => Promise<T>, fallback: T): Promise<T> => {
		if (!supported) return fallback;
		try {
			const value = await fn();
			setError(undefined);
			return value;
		} catch (e) {
			setError(e instanceof Error ? e.message : "IndexedDB error");
			return fallback;
		}
	};

	return {
		supported,
		ready,
		get: <T = unknown>(key: IDBValidKey) =>
			safe(() => withStore("readonly", (s) => s.get(key)) as Promise<T | undefined>, undefined),
		set: (key, value) => safe(() => withStore("readwrite", (s) => s.put(value, key)).then(() => true), false),
		del: (key) => safe(() => withStore("readwrite", (s) => s.delete(key)).then(() => true), false),
		keys: () => safe(() => withStore("readonly", (s) => s.getAllKeys()).then((k) => [...k]), [] as IDBValidKey[]),
		error,
	};
}

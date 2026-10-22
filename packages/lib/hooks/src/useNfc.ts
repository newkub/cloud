import { type Accessor, createSignal, onCleanup } from "solid-js";

export interface NDEFRecordLike {
	readonly recordType: string;
	readonly mediaType?: string;
	readonly data?: unknown;
	[key: string]: unknown;
}

export interface NDEFMessageLike {
	readonly records: ReadonlyArray<NDEFRecordLike>;
}

export interface NDEFReadingEventLike extends Event {
	readonly message: NDEFMessageLike;
	readonly serialNumber?: string;
}

export interface NDEFReaderLike extends EventTarget {
	scan(options?: { signal?: AbortSignal }): Promise<void>;
	write(data: unknown, options?: { signal?: AbortSignal; overwrite?: boolean }): Promise<void>;
}

interface NDEFReaderCtor {
	new (): NDEFReaderLike;
}

export interface NfcControls {
	/** `NDEFReader` support flag */
	supported: boolean;
	/** True while a `scan()` is active */
	scanning: Accessor<boolean>;
	/**
	 * Subscribe to tag reads — starts a scan on first call.
	 * Returns a stop function that removes just this listener.
	 */
	read: (cb: (message: NDEFMessageLike, event: NDEFReadingEventLike) => void) => () => void;
	/** Write an NDEF message — resolves `false` when unsupported or on error */
	write: (data: unknown) => Promise<boolean>;
	/** Abort the active scan */
	stopScanning: () => void;
	/** Last error message */
	error: Accessor<string | undefined>;
}

/**
 * Web NFC — wraps a lazily-created `NDEFReader`. `read(cb)` registers a
 * `"reading"` listener and kicks off `scan()` once; `write(data)` proxies
 * `NDEFReader.write`. The scan is aborted on cleanup.
 *
 * @returns `{ supported, scanning, read, write, stopScanning, error }`
 *
 * @example
 * const nfc = useNfc();
 * nfc.read((msg) => console.log(msg.records));
 * <button disabled={!nfc.supported} onClick={() => nfc.write("https://…")}>write tag</button>
 */
export function useNfc(): NfcControls {
	const Ctor = typeof window === "undefined" ? undefined : (window as { NDEFReader?: NDEFReaderCtor }).NDEFReader;
	const supported = !!Ctor;
	const [scanning, setScanning] = createSignal(false);
	const [error, setError] = createSignal<string>();
	let reader: NDEFReaderLike | undefined;
	let scanCtl: AbortController | undefined;

	const ensure = () => (reader ??= Ctor ? new Ctor() : undefined);
	const fail = (e: unknown) => setError(e instanceof Error ? e.message : "NFC operation failed");

	const read = (cb: (message: NDEFMessageLike, event: NDEFReadingEventLike) => void) => {
		const r = ensure();
		if (!r) return () => {};
		const onReading = (e: Event) => {
			const ev = e as NDEFReadingEventLike;
			cb(ev.message, ev);
		};
		const onReadingError = () => setError("NFC reading error");
		r.addEventListener("reading", onReading);
		r.addEventListener("readingerror", onReadingError);
		if (!scanCtl) {
			scanCtl = new AbortController();
			const ctl = scanCtl;
			r.scan({ signal: ctl.signal })
				.then(() => {
					if (scanCtl === ctl && !ctl.signal.aborted) setScanning(true);
				})
				.catch((e) => {
					if (!ctl.signal.aborted) fail(e);
				});
		}
		return () => {
			r.removeEventListener("reading", onReading);
			r.removeEventListener("readingerror", onReadingError);
		};
	};

	const write = async (data: unknown) => {
		const r = ensure();
		if (!r) return false;
		try {
			await r.write(data);
			setError(undefined);
			return true;
		} catch (e) {
			fail(e);
			return false;
		}
	};

	const stopScanning = () => {
		scanCtl?.abort();
		scanCtl = undefined;
		setScanning(false);
	};
	onCleanup(stopScanning);

	return { supported, scanning, read, write, stopScanning, error };
}

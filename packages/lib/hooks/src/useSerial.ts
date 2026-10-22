import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface SerialWriterLike {
	write(data: BufferSource): Promise<void>;
	releaseLock(): void;
	close?(): Promise<void>;
}

export interface SerialPortLike extends EventTarget {
	open(options: { baudRate: number; [key: string]: unknown }): Promise<void>;
	close(): Promise<void>;
	readonly readable?: unknown;
	readonly writable?: { getWriter(): SerialWriterLike } | null;
	getInfo?(): Record<string, unknown>;
}

export interface SerialLike extends EventTarget {
	requestPort(options?: { filters?: ReadonlyArray<Record<string, unknown>> }): Promise<SerialPortLike>;
	getPorts(): Promise<SerialPortLike[]>;
}

export interface SerialState {
	/** `navigator.serial` support flag */
	supported: boolean;
	/** The selected port — first granted port or the one picked via `requestPort` */
	port: Accessor<SerialPortLike | undefined>;
	/** True after `open()` succeeds, false after `close()`/`disconnect` */
	connected: Accessor<boolean>;
	/** Last error message */
	error: Accessor<string | undefined>;
	/** Open the browser port picker — resolves `undefined` on cancel/unsupported */
	requestPort: (filters?: ReadonlyArray<Record<string, unknown>>) => Promise<SerialPortLike | undefined>;
	/** Open the port — resolves `false` without a port or on failure. @default `{ baudRate: 9600 }` */
	open: (options?: { baudRate: number; [key: string]: unknown }) => Promise<boolean>;
	/** Close the port — resolves `false` without a port or on failure */
	close: () => Promise<boolean>;
	/** Write bytes (string is UTF-8 encoded) — resolves `false` when no writable port */
	write: (data: BufferSource | string) => Promise<boolean>;
}

/**
 * Web Serial — tracks the selected port and its open state, picks up
 * previously granted ports on mount, and writes through a short-lived
 * stream writer. All ops resolve benign fallbacks where `navigator.serial`
 * is missing.
 *
 * @returns `{ supported, port, connected, error, requestPort, open, close, write }`
 *
 * @example
 * const serial = useSerial();
 * <button onClick={async () => { await serial.requestPort(); await serial.open({ baudRate: 115200 }); }}>
 *   connect
 * </button>
 */
export function useSerial(): SerialState {
	const api = () => (typeof navigator === "undefined" ? undefined : (navigator as { serial?: SerialLike }).serial);
	const supported = typeof navigator !== "undefined" && "serial" in navigator;
	const [port, setPort] = createSignal<SerialPortLike>();
	const [connected, setConnected] = createSignal(false);
	const [error, setError] = createSignal<string>();
	const fail = (e: unknown) => setError(e instanceof Error ? e.message : "Serial operation failed");

	const attach = (p: SerialPortLike) => {
		setPort(p);
		p.addEventListener?.("disconnect", () => setConnected(false));
	};

	onMount(() => {
		const serial = api();
		if (!serial) return;
		serial
			.getPorts?.()
			.then((ports) => {
				if (ports[0]) attach(ports[0]);
			})
			.catch(() => {});
		const onConnect = (e: Event) => {
			const p = (e as Event & { port?: SerialPortLike }).port;
			if (p) attach(p);
		};
		serial.addEventListener?.("connect", onConnect);
		onCleanup(() => serial.removeEventListener?.("connect", onConnect));
	});

	return {
		supported,
		port,
		connected,
		error,
		requestPort: async (filters) => {
			const serial = api();
			if (!serial) return undefined;
			try {
				const p = await serial.requestPort(filters ? { filters } : undefined);
				attach(p);
				setError(undefined);
				return p;
			} catch (e) {
				fail(e);
				return undefined;
			}
		},
		open: async (options = { baudRate: 9600 }) => {
			const p = port();
			if (!p) return false;
			try {
				await p.open(options);
				setConnected(true);
				setError(undefined);
				return true;
			} catch (e) {
				fail(e);
				return false;
			}
		},
		close: async () => {
			const p = port();
			if (!p) return false;
			try {
				await p.close();
				setConnected(false);
				setError(undefined);
				return true;
			} catch (e) {
				fail(e);
				return false;
			}
		},
		write: async (data) => {
			const w = port()?.writable;
			if (!w) return false;
			const payload = typeof data === "string" ? new TextEncoder().encode(data) : data;
			const writer = w.getWriter();
			try {
				await writer.write(payload);
				setError(undefined);
				return true;
			} catch (e) {
				fail(e);
				return false;
			} finally {
				writer.releaseLock();
			}
		},
	};
}

import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface BeforeInstallPromptEventLike extends Event {
	/** Show the browser install dialog — consumes the event */
	prompt(): Promise<void>;
	/** Resolves with the user's choice after `prompt()` */
	readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform?: string }>;
}

export interface InstallPromptState {
	/** Whether the browser advertises `beforeinstallprompt` support */
	supported: boolean;
	/** True once `beforeinstallprompt` has fired and a deferred prompt is held */
	canInstall: Accessor<boolean>;
	/** The user's answer to the last `prompt()` call */
	outcome: Accessor<"accepted" | "dismissed" | undefined>;
	/** True after the `appinstalled` event */
	installed: Accessor<boolean>;
	/** Show the install dialog — resolves the outcome, or `undefined` when nothing is deferred */
	prompt: () => Promise<"accepted" | "dismissed" | undefined>;
}

/**
 * PWA install prompt — captures `beforeinstallprompt`, exposes `canInstall`
 * for a custom install button, and replays the deferred event via `prompt()`.
 * `installed` flips on `appinstalled`. When the browser never fires the event
 * (unsupported or already installed) `canInstall` simply stays `false`.
 *
 * @returns `{ supported, canInstall, outcome, installed, prompt }`
 *
 * @example
 * const install = useInstallPrompt();
 * <Show when={install.canInstall()}>
 *   <button onClick={() => install.prompt()}>install app</button>
 * </Show>
 */
export function useInstallPrompt(): InstallPromptState {
	const supported = typeof window !== "undefined" && "onbeforeinstallprompt" in window;
	const [canInstall, setCanInstall] = createSignal(false);
	const [outcome, setOutcome] = createSignal<"accepted" | "dismissed">();
	const [installed, setInstalled] = createSignal(false);
	let deferred: BeforeInstallPromptEventLike | undefined;

	onMount(() => {
		if (typeof window === "undefined") return;
		const onBefore = (e: Event) => {
			e.preventDefault();
			deferred = e as BeforeInstallPromptEventLike;
			setCanInstall(true);
		};
		const onInstalled = () => {
			deferred = undefined;
			setCanInstall(false);
			setInstalled(true);
		};
		window.addEventListener("beforeinstallprompt", onBefore);
		window.addEventListener("appinstalled", onInstalled);
		onCleanup(() => {
			window.removeEventListener("beforeinstallprompt", onBefore);
			window.removeEventListener("appinstalled", onInstalled);
		});
	});

	const prompt = async () => {
		const d = deferred;
		if (!d) return undefined;
		deferred = undefined;
		setCanInstall(false);
		try {
			await d.prompt();
			const choice = await d.userChoice;
			setOutcome(choice.outcome);
			return choice.outcome;
		} catch {
			return undefined;
		}
	};

	return { supported, canInstall, outcome, installed, prompt };
}

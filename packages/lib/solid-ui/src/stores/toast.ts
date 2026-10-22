import { createSignal } from "solid-js";
import type { ToastVariant } from "../components/Toast";

export interface ToastItem {
	id: string;
	title?: string;
	description?: string;
	variant?: ToastVariant;
}

const [toasts, setToasts] = createSignal<ToastItem[]>([]);

export function addToast(item: Omit<ToastItem, "id">) {
	const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
	setToasts((prev) => [...prev, { ...item, id }]);
	return id;
}

export function removeToast(id: string) {
	setToasts((prev) => prev.filter((t) => t.id !== id));
}

export function clearToasts() {
	setToasts([]);
}

export { toasts };

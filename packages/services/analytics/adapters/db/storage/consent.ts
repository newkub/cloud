export function optOut(): void {
	localStorage.setItem("analytics_consent", "false");
}

export function optIn(): void {
	localStorage.setItem("analytics_consent", "true");
}

export function getConsent(): boolean {
	const storedConsent = localStorage.getItem("analytics_consent");
	return storedConsent === null ? true : storedConsent === "true";
}

export function setConsent(consent: boolean): void {
	localStorage.setItem("analytics_consent", consent ? "true" : "false");
}

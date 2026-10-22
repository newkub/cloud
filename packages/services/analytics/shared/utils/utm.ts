/**
 * UTM Parameters Utilities
 * Pure functions for parsing UTM parameters from URLs
 */

import type { UTMParameters } from "#analytics/shared/types";

const pick = (params: URLSearchParams, key: string): string | undefined => {
	const value = params.get(key);
	return value === null ? undefined : value;
};

const utmFromParams = (params: URLSearchParams): UTMParameters => {
	const source = pick(params, "utm_source");
	const medium = pick(params, "utm_medium");
	const campaign = pick(params, "utm_campaign");
	const term = pick(params, "utm_term");
	const content = pick(params, "utm_content");

	const result: {
		source?: string;
		medium?: string;
		campaign?: string;
		term?: string;
		content?: string;
	} = {};
	if (source !== undefined) result.source = source;
	if (medium !== undefined) result.medium = medium;
	if (campaign !== undefined) result.campaign = campaign;
	if (term !== undefined) result.term = term;
	if (content !== undefined) result.content = content;
	return result as UTMParameters;
};

/**
 * Parse UTM parameters from current URL (browser only)
 */
export const getUTMParameters = (): UTMParameters => {
	if (typeof window === "undefined") {
		return {};
	}

	const url = new URL(window.location.href);
	return utmFromParams(url.searchParams);
};

/**
 * Parse UTM parameters from a URL string
 */
export const parseUTMParameters = (urlString: string): UTMParameters => {
	try {
		const url = new URL(urlString);
		return utmFromParams(url.searchParams);
	} catch {
		return {};
	}
};

/**
 * Check if UTM parameters exist
 */
export const hasUTMParameters = (utm: UTMParameters): boolean =>
	!!(utm.source || utm.medium || utm.campaign || utm.term || utm.content);

/**
 * Convert UTM parameters to query string
 */
export const utmToQueryString = (utm: UTMParameters): string => {
	const params = new URLSearchParams();

	if (utm.source) params.set("utm_source", utm.source);
	if (utm.medium) params.set("utm_medium", utm.medium);
	if (utm.campaign) params.set("utm_campaign", utm.campaign);
	if (utm.term) params.set("utm_term", utm.term);
	if (utm.content) params.set("utm_content", utm.content);

	const query = params.toString();
	return query ? `?${query}` : "";
};

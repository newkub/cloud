/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import { createSignal, type JSX } from "solid-js";
import { SearchBar } from "./SearchBar";

export const preview = (): JSX.Element => {
	const [query, setQuery] = createSignal("");
	return <SearchBar value={query()} onInput={setQuery} resultCount={12} placeholder="Search docs…" />;
};

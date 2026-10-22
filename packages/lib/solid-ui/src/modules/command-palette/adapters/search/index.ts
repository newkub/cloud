/**
 * Search Adapters - Search implementations
 * Functional implementations of search ports
 */

export {
	aiSearcher,
	createAICommandSearcher,
	searchWithAI,
} from "./ai-command-searcher";
export {
	createCustomCommandSearcher,
	searchWithCustom,
} from "./fuse-command-searcher";

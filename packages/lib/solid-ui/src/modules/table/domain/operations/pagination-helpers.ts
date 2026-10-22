// Table Domain Operations - Pagination Helpers

export function calculateTotalPages(total: number, pageSize: number): number {
	return Math.ceil(total / pageSize);
}

export function isValidPage(page: number, totalPages: number): boolean {
	return page >= 1 && page <= totalPages;
}

export function getPageRange(currentPage: number, totalPages: number, maxVisible = 7): number[] {
	const pages: number[] = [];
	const half = Math.floor(maxVisible / 2);

	let start = Math.max(1, currentPage - half);
	const end = Math.min(totalPages, start + maxVisible - 1);

	if (end - start + 1 < maxVisible) {
		start = Math.max(1, end - maxVisible + 1);
	}

	for (let i = start; i <= end; i++) {
		pages.push(i);
	}

	return pages;
}

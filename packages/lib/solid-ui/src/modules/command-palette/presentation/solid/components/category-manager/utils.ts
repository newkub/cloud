import type { CategoryGroup } from "../../../../types";

export function getCategoryCommandCount(categoryId: string, categoryGroups?: readonly CategoryGroup[]): number {
	return categoryGroups?.find((g) => g.category.id === categoryId)?.count ?? 0;
}

import { Show, splitProps } from "solid-js";
import type { CategoryCardProps } from "./types";

export function CategoryCard(props: CategoryCardProps) {
	const [local] = splitProps(props, ["category", "commandCount", "onEdit", "onDelete"]);

	return (
		<div class="category-card">
			<div class="category-header">
				<div class="category-info">
					<Show when={local.category.icon}>
						<span class="category-icon">{local.category.icon}</span>
					</Show>
					<span class="category-name">{local.category.name}</span>
					<span class="category-count">{local.commandCount} commands</span>
				</div>
				<div class="category-actions">
					<button class="action-button edit" onClick={() => local.onEdit(local.category)} type="button">
						Edit
					</button>
					<button class="action-button delete" onClick={() => local.onDelete(local.category.id)} type="button">
						Delete
					</button>
				</div>
			</div>

			<Show when={local.category.description}>
				<p class="category-description">{local.category.description}</p>
			</Show>

			<div class="category-meta">
				<Show when={local.category.color}>
					<div class="color-indicator" style={{ "background-color": local.category.color }} />
				</Show>
				<span class="category-order">Order: {local.category.order}</span>
			</div>
		</div>
	);
}

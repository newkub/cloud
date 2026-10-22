// Events panel component

import { Alert, Badge, List, ListItem } from "@wrikka/solid-ui";
import { For, Show } from "solid-js";
import type { Event } from "#analytics/modules/analytics/types";

interface EventsPanelProps {
	events?: readonly Event[];
}

export function EventsPanel(props: EventsPanelProps) {
	return (
		<div class="events-panel">
			<Show when={props.events && props.events.length > 0}>
				<List class="events-list" unstyled>
					<For each={props.events}>
						{(event) => (
							<ListItem class="event-item">
								<div class="event-name">{event.name}</div>
								<div class="event-time">
									{new Date(event.timestamp).toLocaleString()}
								</div>
								<Show when={event.userId}>
									<Badge class="event-user">User: {event.userId}</Badge>
								</Show>
							</ListItem>
						)}
					</For>
				</List>
			</Show>
			<Show when={!props.events || props.events.length === 0}>
				<Alert class="empty-state">No events recorded</Alert>
			</Show>
		</div>
	);
}

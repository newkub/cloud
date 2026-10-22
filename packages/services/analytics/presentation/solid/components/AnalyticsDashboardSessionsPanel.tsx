// Sessions panel component

import { Alert, Badge, List, ListItem } from "@wrikka/solid-ui";
import { For, Show } from "solid-js";
import type { Session } from "#analytics/modules/analytics/types";

interface SessionsPanelProps {
	sessions?: readonly Session[];
}

export function SessionsPanel(props: SessionsPanelProps) {
	return (
		<div class="sessions-panel">
			<Show when={props.sessions && props.sessions.length > 0}>
				<List class="sessions-list" unstyled>
					<For each={props.sessions}>
						{(session) => (
							<ListItem class="session-item">
								<div class="session-id">{session.id}</div>
								<div class="session-duration">{session.duration}s</div>
								<div class="session-page-views">
									{session.pageViews} page views
								</div>
								<Show when={session.device}>
									<Badge class="session-device">{session.device}</Badge>
								</Show>
							</ListItem>
						)}
					</For>
				</List>
			</Show>
			<Show when={!props.sessions || props.sessions.length === 0}>
				<Alert class="empty-state">No sessions recorded</Alert>
			</Show>
		</div>
	);
}

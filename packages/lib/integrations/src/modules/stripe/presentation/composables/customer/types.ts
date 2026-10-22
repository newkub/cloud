// ============================================================================
// Presentation - Customer Composables Types
// ============================================================================

import type { Accessor } from "solid-js";
import type { Customer, CustomerFilters } from "#modules/customer/types";

export interface CustomerUIState {
	customers: Accessor<readonly Customer[]>;
	selectedCustomer: Accessor<Customer | null>;
	isLoading: Accessor<boolean>;
	error: Accessor<string | null>;
	filters: Accessor<CustomerFilters>;
}

export interface CustomerUIDerivedState {
	hasCustomers: Accessor<boolean>;
	customerCount: Accessor<number>;
	hasError: Accessor<boolean>;
}

export interface CustomerUIActions {
	fetchCustomers: (filters?: CustomerFilters) => Promise<void>;
	fetchCustomer: (customerId: string) => Promise<void>;
	createCustomer: (data: {
		email: string;
		name?: string;
		phone?: string;
		description?: string;
		metadata?: Record<string, string>;
	}) => Promise<void>;
	updateCustomer: (
		customerId: string,
		updates: Record<string, unknown>,
	) => Promise<void>;
	deleteCustomer: (customerId: string) => Promise<void>;
	setFilters: (filters: CustomerFilters) => void;
	clearError: () => void;
	selectCustomer: (customer: Customer | null) => void;
}

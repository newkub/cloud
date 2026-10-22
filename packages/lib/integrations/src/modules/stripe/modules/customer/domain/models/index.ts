// ============================================================================
// Customer Module - Domain Models (Readonly Data Models)
// ============================================================================

// Customer Model
export interface Customer {
	readonly id: string;
	readonly email: string;
	readonly name?: string;
	readonly phone?: string;
	readonly description?: string;
	readonly metadata?: Record<string, string>;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

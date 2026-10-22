export interface PaginationState {
    readonly page: number;
    readonly pageSize: number;
    readonly total: number;
    readonly totalPages: number;
}
export interface PaginationConfig {
    readonly page?: number;
    readonly pageSize?: number;
    readonly pageSizes?: ReadonlyArray<number>;
    readonly showPageSizeSelector?: boolean;
    readonly showPageInfo?: boolean;
    readonly showTotal?: boolean;
}

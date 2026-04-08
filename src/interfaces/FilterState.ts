export interface FilterState {
    search: string;
    sortKey: string;
    sortOrder: 'asc' | 'desc';
    page: number;
    pageSize: number;
}

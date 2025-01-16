export interface IPaginatorStoreSettings {
  page: number;
  offset: number;
  limit: number;
  pageSizeOptions: number[];
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

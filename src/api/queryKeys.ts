// ---------------------------------------------------------------------------
// Query key factory for TanStack Query
// ---------------------------------------------------------------------------

export const requestKeys = {
  all: ['requests'] as const,

  list: (filters: RequestFilters) =>
    [...requestKeys.all, 'list', filters] as const,

  detail: (id: string) =>
    [...requestKeys.all, 'detail', id] as const,

  recent: (limit: number = 10) =>
    [...requestKeys.all, 'recent', { limit }] as const,

  stats: () =>
    [...requestKeys.all, 'stats'] as const,
};

// ---------------------------------------------------------------------------
// Types used by query keys
// ---------------------------------------------------------------------------

export interface RequestFilters {
  search?: string;
  status?: string;
  priority?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

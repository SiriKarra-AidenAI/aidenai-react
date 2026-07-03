import { apiClient } from './client';
import type {
  Request,
  ListResponse,
  ItemResponse,
  CreateRequestDTO,
  DraftRequestDTO,
  StructureValidationDTO,
  StructureValidationResult,
} from '../types/request';
import type { RequestFilters } from './queryKeys';

// ---------------------------------------------------------------------------
// Request API — maps to Endpoints #1-8 from discovery-api-contracts.md
// ---------------------------------------------------------------------------

export const requestsApi = {
  // Endpoint #1 — recent requests (Dashboard)
  listRecent: (limit: number = 10) =>
    apiClient
      .get<ListResponse<Request>>('/requests', { params: { limit } })
      .then((r) => r.data),

  // Endpoint #2 — paginated, filtered list (TrackingPanel)
  list: (filters: RequestFilters = {}) =>
    apiClient
      .get<ListResponse<Request>>('/requests', { params: filters })
      .then((r) => r.data),

  // Single request detail (needed for edit/detail views)
  get: (id: string) =>
    apiClient
      .get<ItemResponse<Request>>(`/requests/${id}`)
      .then((r) => r.data),

  // Endpoint #3 — create (submit)
  create: (data: CreateRequestDTO) =>
    apiClient
      .post<ItemResponse<Request>>('/requests', data)
      .then((r) => r.data),

  // Endpoint #4 — save draft
  saveDraft: (data: DraftRequestDTO) =>
    apiClient
      .post<ItemResponse<Request>>('/requests', { ...data, status: 'DRAFT' })
      .then((r) => r.data),

  // Endpoint #5 — validate SMILES/InChI structure
  validateStructure: (data: StructureValidationDTO) =>
    apiClient
      .post<StructureValidationResult>('/validate-structure', data)
      .then((r) => r.data),

  // Endpoints #6-8 — file uploads
  uploadMolecularStructure: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return apiClient
      .post('/upload/molecular-structure', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  uploadSupportingProtocol: (files: File[]) => {
    const fd = new FormData();
    files.forEach((f) => fd.append('files', f));
    return apiClient
      .post('/upload/supporting-protocol', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  uploadAnalogueCompounds: (files: File[]) => {
    const fd = new FormData();
    files.forEach((f) => fd.append('files', f));
    return apiClient
      .post('/upload/analogue-compounds', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { requestsApi } from '../api/requests';
import { requestKeys } from '../api/queryKeys';
import type { RequestFilters } from '../api/queryKeys';
import type {
  CreateRequestDTO,
  DraftRequestDTO,
  StructureValidationDTO,
} from '../types/request';

// ---------------------------------------------------------------------------
// Queries — replace ExtJS store autoLoad
// ---------------------------------------------------------------------------

/** Dashboard recent requests (Endpoint #1) */
export function useRecentRequestsQuery(limit: number = 10) {
  return useQuery({
    queryKey: requestKeys.recent(limit),
    queryFn: () => requestsApi.listRecent(limit),
    staleTime: 60_000, // Dashboard KPI — 60s staleness acceptable
  });
}

/** TrackingPanel paginated, filtered list (Endpoint #2) */
export function useRequestsQuery(filters: RequestFilters = {}) {
  return useQuery({
    queryKey: requestKeys.list(filters),
    queryFn: () => requestsApi.list(filters),
    staleTime: 30_000, // Tracking — fresher data
    placeholderData: (prev) => prev, // keepPreviousData
  });
}

/** Single request detail */
export function useRequestQuery(id: string | undefined) {
  return useQuery({
    queryKey: requestKeys.detail(id!),
    queryFn: () => requestsApi.get(id!),
    staleTime: 5 * 60 * 1000, // 5min — detail views rarely change while viewing
    enabled: id != null && id.length > 0,
  });
}

// ---------------------------------------------------------------------------
// Mutations — replace ExtJS store writer + form submit
// ---------------------------------------------------------------------------

/** Create (submit) — Endpoint #3 */
export function useCreateRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRequestDTO) => requestsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: requestKeys.all });
      toast.success('Request submitted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit request');
    },
  });
}

/** Save draft — Endpoint #4 */
export function useCreateDraft() {
  return useMutation({
    mutationFn: (data: DraftRequestDTO) => requestsApi.saveDraft(data),
    onSuccess: () => toast.success('Draft saved'),
    onError: (error: Error) =>
      toast.error(error.message || 'Failed to save draft'),
  });
}

/** Validate SMILES/InChI structure — Endpoint #5 */
export function useValidateStructure() {
  return useMutation({
    mutationFn: (data: StructureValidationDTO) =>
      requestsApi.validateStructure(data),
  });
}

/** Upload molecular structure — Endpoint #6 */
export function useUploadMolecularStructure() {
  return useMutation({
    mutationFn: (file: File) => requestsApi.uploadMolecularStructure(file),
    onError: (error: Error) =>
      toast.error(error.message || 'Failed to upload molecular structure'),
  });
}

/** Upload supporting protocol — Endpoint #7 */
export function useUploadSupportingProtocol() {
  return useMutation({
    mutationFn: (files: File[]) => requestsApi.uploadSupportingProtocol(files),
    onError: (error: Error) =>
      toast.error(error.message || 'Failed to upload supporting protocol'),
  });
}

/** Upload analogue compounds — Endpoint #8 */
export function useUploadAnalogueCompounds() {
  return useMutation({
    mutationFn: (files: File[]) => requestsApi.uploadAnalogueCompounds(files),
    onError: (error: Error) =>
      toast.error(error.message || 'Failed to upload analogue compounds'),
  });
}

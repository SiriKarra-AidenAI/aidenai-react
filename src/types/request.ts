import { z } from 'zod';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const DEPARTMENTS = [
  'Medicinal Chemistry',
  'Discovery Biology',
  'Pharmacology',
  'Toxicology',
] as const;
export type Department = (typeof DEPARTMENTS)[number];

export const PATHWAYS = [
  'GPCR Signaling',
  'Kinase Inhibition',
  'Protease Inhibition',
  'Ion Channel Modulation',
  'Other',
] as const;
export type TargetPathway = (typeof PATHWAYS)[number];

export const PRIORITY_LEVELS = ['Low', 'Medium', 'High'] as const;
export type PriorityLevel = (typeof PRIORITY_LEVELS)[number];

export const REQUEST_STATUSES = [
  'SUBMITTED',
  'PRE_SCREENING',
  'SUPERVISOR_REVIEW',
  'APPROVED',
  'ASSIGNED',
  'IN_SYNTHESIS',
  'QUALITY_CHECK',
  'COMPLETED',
] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

// ---------------------------------------------------------------------------
// Shapes
// ---------------------------------------------------------------------------

/** Inferred Request model — 27 fields from grid dataIndex + form field names */
export interface Request {
  id: string;
  compoundName: string;
  priorityLevel: PriorityLevel;
  status: RequestStatus;
  statusDisplay: string;
  progressPercentage: number;
  requestDate: string;
  timelineRequired: string;
  requesterName: string;
  department: Department;
  email: string;
  supervisorName: string;
  smilesString: string;
  inchiString?: string;
  casNumber?: string;
  molecularWeight?: number;
  targetPathway: TargetPathway;
  proposedUse: string;
  controlledSubstance: boolean;
  relatedCompoundIds?: string;
  justification?: string;
  requestedQuantity: number;
  purityRequirement: number;
  ipSensitive: boolean;
  externalDisclosureRisk: boolean;
  disclosureCommentText?: string;
  references?: string;
}

/** Paginated list response shape */
export interface ListResponse<T> {
  success: boolean;
  total: number;
  data: T[];
}

/** Single item response shape */
export interface ItemResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/** Validation error response */
export interface ValidationErrorResponse {
  success: false;
  errors: Record<string, string>;
  message: string;
}

// ---------------------------------------------------------------------------
// Zod schemas — map ExtJS validators (regex, minLength, maxLength, allowBlank,
// minValue, maxValue, forceSelection) to Zod
// ---------------------------------------------------------------------------

export const requestFormSchema = z.object({
  // ── Section 1: Requestor Information ──
  requesterName: z.string().optional(),
  department: z.enum(DEPARTMENTS, { required_error: 'Department is required' }),
  email: z.string().email().optional(),
  supervisorName: z.string().min(1, 'Supervisor name is required'),
  requestDate: z.string().optional(),

  // ── Section 2: Compound Information ──
  compoundName: z
    .string()
    .min(1, 'Compound name is required')
    .max(100, 'Compound name must be 100 characters or fewer')
    .regex(
      /^[A-Za-z0-9\s\-_]+$/,
      'Compound name contains invalid characters',
    ),
  smilesString: z.string().min(1, 'SMILES string is required'),
  inchiString: z.string().optional(),
  casNumber: z
    .string()
    .regex(/^\d{1,7}-\d{2}-\d$/, 'Invalid CAS number format')
    .optional()
    .or(z.literal('')),
  molecularWeight: z.number().min(100).max(800).optional(),
  targetPathway: z.enum(PATHWAYS, { required_error: 'Target pathway is required' }),
  proposedUse: z
    .string()
    .min(1, 'Proposed use is required')
    .min(20, 'Proposed use must be at least 20 characters'),
  controlledSubstance: z.boolean().default(false),
  relatedCompoundIds: z.string().optional(),

  // ── Section 3: Request Details ──
  priorityLevel: z.enum(PRIORITY_LEVELS, {
    required_error: 'Priority level is required',
  }),
  justification: z.string().optional(),
  requestedQuantity: z
    .number({ required_error: 'Requested quantity is required' })
    .int()
    .min(1, 'Quantity must be at least 1 mg')
    .max(500, 'Quantity must be at most 500 mg'),
  purityRequirement: z
    .number({ required_error: 'Purity requirement is required' })
    .int()
    .min(90, 'Purity must be at least 90%')
    .max(100, 'Purity must be at most 100%'),
  timelineRequired: z.string().min(1, 'Timeline is required'),
  ipSensitive: z.boolean().default(false),
  externalDisclosureRisk: z.boolean().default(false),
  disclosureCommentText: z.string().optional(),

  // ── Section 4: Supporting Documents ──
  references: z.string().optional(),
});

/** Conditional refinements */
export const requestFormSchemaRefined = requestFormSchema.superRefine(
  (data, ctx) => {
    // justification required when priorityLevel === 'High'
    if (
      data.priorityLevel === 'High' &&
      (!data.justification || data.justification.trim().length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['justification'],
        message: 'Justification is required for high priority requests',
      });
    }

    // disclosureCommentText required when externalDisclosureRisk === true
    if (
      data.externalDisclosureRisk &&
      (!data.disclosureCommentText ||
        data.disclosureCommentText.trim().length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['disclosureCommentText'],
        message: 'Disclosure risk comment is required',
      });
    }
  },
);

export type CreateRequestDTO = z.infer<typeof requestFormSchema>;
export type CreateRequestDTOStrict = z.infer<typeof requestFormSchemaRefined>;

/** Draft save — partial data, relaxed validation */
export const draftRequestSchema = requestFormSchema.partial();
export type DraftRequestDTO = z.infer<typeof draftRequestSchema>;

/** Structure validation */
export const structureValidationSchema = z.object({
  smilesString: z.string().min(1, 'SMILES string is required'),
  inchiString: z.string().optional(),
});
export type StructureValidationDTO = z.infer<typeof structureValidationSchema>;

export interface StructureValidationResult {
  success: boolean;
  valid: boolean;
  molecularWeight?: number;
  errors?: string[];
}

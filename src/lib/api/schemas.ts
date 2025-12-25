import { z } from 'zod';

export const classifyRequestSchema = z.object({
  latex: z.string().min(1, 'LaTeX expression is required'),
  options: z
    .object({
      threshold: z.number().min(0).max(1).optional(),
      maxResults: z.number().int().positive().optional(),
    })
    .optional(),
});

export const matchExpressionRequestSchema = z.object({
  latex: z.string().min(1, 'LaTeX expression is required'),
  options: z
    .object({
      threshold: z.number().min(0).max(1).optional(),
      maxResults: z.number().int().positive().optional(),
      includeArchetype: z.boolean().optional(),
    })
    .optional(),
});

export const searchStandardsRequestSchema = z.object({
  query: z.string().optional(),
  grade: z.string().optional(),
  domain: z.string().optional(),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional(),
});

export const standardIdSchema = z.string().min(1, 'Standard ID is required');

export type ClassifyRequest = z.infer<typeof classifyRequestSchema>;
export type MatchExpressionRequest = z.infer<typeof matchExpressionRequestSchema>;
export type SearchStandardsRequest = z.infer<typeof searchStandardsRequestSchema>;

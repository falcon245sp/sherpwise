import { NextRequest } from 'next/server';
import { classifyRequestSchema, handleApiError, createSuccessResponse } from '@/lib/api';
import { classifyExpression } from '@/lib/sdk-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = classifyRequestSchema.parse(body);

    const result = await classifyExpression(validatedData.latex);

    return createSuccessResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

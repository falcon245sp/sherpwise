import { NextRequest } from 'next/server';
import { standardIdSchema, handleApiError, createSuccessResponse } from '@/lib/api';
import { getStandardById } from '@/lib/sdk-client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const validatedId = standardIdSchema.parse(id);

    const standard = await getStandardById(validatedId);

    if (!standard) {
      return createSuccessResponse({ error: 'Standard not found' }, 404);
    }

    return createSuccessResponse(standard);
  } catch (error) {
    return handleApiError(error);
  }
}

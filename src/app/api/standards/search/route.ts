import { NextRequest } from 'next/server';
import { searchStandardsRequestSchema, handleApiError, createSuccessResponse } from '@/lib/api';
import { searchStandards } from '@/lib/sdk-client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const params = {
      query: searchParams.get('query') || undefined,
      grade: searchParams.get('grade') || undefined,
      domain: searchParams.get('domain') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined,
    };

    const validatedParams = searchStandardsRequestSchema.parse(params);

    const result = await searchStandards(validatedParams);

    return createSuccessResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedParams = searchStandardsRequestSchema.parse(body);

    const result = await searchStandards(validatedParams);

    return createSuccessResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

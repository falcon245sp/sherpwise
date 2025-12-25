import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/standards/[id]/route';
import { getStandardById } from '@/lib/sdk-client';
import type { Standard } from '@ontara/core-sdk';
import type { NextRequest } from 'next/server';

vi.mock('@/lib/sdk-client', () => ({
  getStandardById: vi.fn(),
}));

describe('GET /api/standards/[id]', () => {
  const mockGetStandardById = vi.mocked(getStandardById);

  const mockStandard: Standard = {
    id: 'HSA-SSE.A.1',
    name: 'Interpret expressions',
    description: 'Interpret expressions that represent a quantity in terms of its context',
    grade: '9-12',
    domain: 'Algebra',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully retrieve a standard by ID', async () => {
    mockGetStandardById.mockResolvedValue(mockStandard);

    const request = new Request('http://localhost:3000/api/standards/HSA-SSE.A.1') as NextRequest;
    const params = Promise.resolve({ id: 'HSA-SSE.A.1' });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockStandard);
    expect(mockGetStandardById).toHaveBeenCalledWith('HSA-SSE.A.1');
  });

  it('should return 404 when standard is not found', async () => {
    mockGetStandardById.mockResolvedValue(null);

    const request = new Request('http://localhost:3000/api/standards/INVALID-ID') as NextRequest;
    const params = Promise.resolve({ id: 'INVALID-ID' });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Standard not found');
  });

  it('should return 400 for empty ID', async () => {
    const request = new Request('http://localhost:3000/api/standards/') as NextRequest;
    const params = Promise.resolve({ id: '' });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation Error');
  });

  it('should handle SDK errors', async () => {
    mockGetStandardById.mockRejectedValue(new Error('Database error'));

    const request = new Request('http://localhost:3000/api/standards/HSA-SSE.A.1') as NextRequest;
    const params = Promise.resolve({ id: 'HSA-SSE.A.1' });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal Server Error');
  });
});

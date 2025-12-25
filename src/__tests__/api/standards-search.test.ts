import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/standards/search/route';
import { searchStandards } from '@/lib/sdk-client';
import type { SearchStandardsResult } from '@ontara/core-sdk';
import type { NextRequest } from 'next/server';

vi.mock('@/lib/sdk-client', () => ({
  searchStandards: vi.fn(),
}));

describe('/api/standards/search', () => {
  const mockSearchStandards = vi.mocked(searchStandards);

  const mockResult: SearchStandardsResult = {
    standards: [
      {
        id: 'HSA-SSE.A.1',
        name: 'Interpret expressions',
        description: 'Interpret expressions that represent a quantity in terms of its context',
        grade: '9-12',
        domain: 'Algebra',
      },
      {
        id: 'HSA-SSE.A.2',
        name: 'Use the structure of an expression',
        description: 'Use the structure of an expression to identify ways to rewrite it',
        grade: '9-12',
        domain: 'Algebra',
      },
    ],
    total: 2,
    limit: 10,
    offset: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should successfully search standards with query parameters', async () => {
      mockSearchStandards.mockResolvedValue(mockResult);

      const url = new URL('http://localhost:3000/api/standards/search?query=algebra&grade=9-12&limit=10');
      const request = Object.assign(new Request(url), { nextUrl: url }) as NextRequest;

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockResult);
      expect(mockSearchStandards).toHaveBeenCalledWith({
        query: 'algebra',
        grade: '9-12',
        limit: 10,
        domain: undefined,
        offset: undefined,
      });
    });

    it('should work with no query parameters', async () => {
      mockSearchStandards.mockResolvedValue(mockResult);

      const url = new URL('http://localhost:3000/api/standards/search');
      const request = Object.assign(new Request(url), { nextUrl: url }) as NextRequest;

      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockSearchStandards).toHaveBeenCalledWith({
        query: undefined,
        grade: undefined,
        domain: undefined,
        limit: undefined,
        offset: undefined,
      });
    });

    it('should handle invalid limit parameter', async () => {
      const url = new URL('http://localhost:3000/api/standards/search?limit=150');
      const request = Object.assign(new Request(url), { nextUrl: url }) as NextRequest;

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation Error');
    });

    it('should handle SDK errors', async () => {
      mockSearchStandards.mockRejectedValue(new Error('Database connection failed'));

      const url = new URL('http://localhost:3000/api/standards/search');
      const request = Object.assign(new Request(url), { nextUrl: url }) as NextRequest;

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal Server Error');
    });
  });

  describe('POST', () => {
    it('should successfully search standards with POST body', async () => {
      mockSearchStandards.mockResolvedValue(mockResult);

      const request = new Request('http://localhost:3000/api/standards/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'algebra',
          grade: '9-12',
          limit: 10,
        }),
      }) as NextRequest;

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockResult);
      expect(mockSearchStandards).toHaveBeenCalledWith({
        query: 'algebra',
        grade: '9-12',
        limit: 10,
      });
    });

    it('should return 400 for invalid request body', async () => {
      const request = new Request('http://localhost:3000/api/standards/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: -5 }),
      }) as NextRequest;

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation Error');
    });
  });
});

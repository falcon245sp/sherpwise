import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/classify/route';
import { classifyExpression } from '@/lib/sdk-client';
import type { MatchExpressionResult } from '@ontara/core-sdk';
import type { NextRequest } from 'next/server';

vi.mock('@/lib/sdk-client', () => ({
  classifyExpression: vi.fn(),
}));

describe('POST /api/classify', () => {
  const mockClassifyExpression = vi.mocked(classifyExpression);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully classify a valid LaTeX expression', async () => {
    const mockResult: MatchExpressionResult = {
      expression: 'x^2 + 2x + 1',
      matches: [
        {
          standardId: 'HSA-SSE.A.2',
          confidence: 0.95,
          standard: {
            id: 'HSA-SSE.A.2',
            name: 'Use the structure of an expression',
            description: 'Use the structure of an expression to identify ways to rewrite it',
            grade: '9-12',
            domain: 'Algebra',
          },
        },
      ],
    };

    mockClassifyExpression.mockResolvedValue(mockResult);

    const request = new Request('http://localhost:3000/api/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latex: 'x^2 + 2x + 1' }),
    }) as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockResult);
    expect(mockClassifyExpression).toHaveBeenCalledWith('x^2 + 2x + 1');
  });

  it('should return 400 for invalid request (missing latex)', async () => {
    const request = new Request('http://localhost:3000/api/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    }) as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation Error');
  });

  it('should return 400 for empty latex string', async () => {
    const request = new Request('http://localhost:3000/api/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latex: '' }),
    }) as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation Error');
  });

  it('should handle SDK errors gracefully', async () => {
    mockClassifyExpression.mockRejectedValue(new Error('Backend service unavailable'));

    const request = new Request('http://localhost:3000/api/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latex: 'x^2' }),
    }) as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal Server Error');
  });
});

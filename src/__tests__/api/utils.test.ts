import { describe, it, expect } from 'vitest';
import { handleApiError, createSuccessResponse } from '@/lib/api/utils';
import { ZodError } from 'zod';
import {
  OntaraError,
  OntaraAuthError,
  OntaraNetworkError,
  OntaraValidationError,
} from '@ontara/core-sdk';

describe('API Utilities', () => {
  describe('handleApiError', () => {
    it('should handle ZodError with 400 status', async () => {
      const zodError = new ZodError([
        {
          code: 'too_small',
          minimum: 1,
          type: 'string',
          inclusive: true,
          exact: false,
          path: ['latex'],
          message: 'String must contain at least 1 character(s)',
        } as any,
      ]);

      const response = handleApiError(zodError);
      
      expect(response.status).toBe(400);
      
      const responseClone = response.clone();
      const data = await responseClone.json();
      
      expect(data.error).toBe('Validation Error');
      expect(data.message).toBe('Invalid request parameters');
    });

    it('should handle OntaraValidationError with 400 status', async () => {
      const error = new OntaraValidationError('Invalid expression format');

      const response = handleApiError(error);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation Error');
      expect(data.message).toBe('Invalid expression format');
    });

    it('should handle OntaraAuthError with 401 status', async () => {
      const error = new OntaraAuthError('Invalid API key');

      const response = handleApiError(error);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication Error');
      expect(data.message).toBe('Invalid API key');
    });

    it('should handle OntaraNetworkError with 503 status', async () => {
      const error = new OntaraNetworkError('Connection timeout');

      const response = handleApiError(error);
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.error).toBe('Network Error');
      expect(data.message).toBe('Failed to communicate with backend service');
    });

    it('should handle OntaraError with 500 status', async () => {
      const error = new OntaraError('Internal backend error');

      const response = handleApiError(error);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Backend Error');
      expect(data.message).toBe('Internal backend error');
    });

    it('should handle unknown errors with 500 status', async () => {
      const error = new Error('Unexpected error');

      const response = handleApiError(error);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal Server Error');
      expect(data.message).toBe('An unexpected error occurred');
    });
  });

  describe('createSuccessResponse', () => {
    it('should create a success response with default status 200', async () => {
      const data = { result: 'success' };
      const response = createSuccessResponse(data);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual(data);
    });

    it('should create a success response with custom status', async () => {
      const data = { created: true };
      const response = createSuccessResponse(data, 201);
      const responseData = await response.json();

      expect(response.status).toBe(201);
      expect(responseData).toEqual(data);
    });
  });
});

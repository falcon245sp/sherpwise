import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  getOntaraClient, 
  resetOntaraClient,
  classifyExpression,
  matchExpression,
  searchStandards,
  getSchema,
  checkHealth,
} from '../sdk-client';

vi.mock('@ontara/core-sdk', () => {
  class MockOntaraClient {
    matchExpression = vi.fn();
    classifyExpression = vi.fn();
    searchStandards = vi.fn();
    getSchema = vi.fn();
    health = vi.fn();
    
    constructor(public config: unknown) {}
  }

  return {
    OntaraClient: MockOntaraClient,
    OntaraError: class OntaraError extends Error {
      constructor(message: string, public code?: string, public statusCode?: number, public details?: unknown) {
        super(message);
        this.name = 'OntaraError';
      }
    },
    OntaraAuthError: class OntaraAuthError extends Error {
      constructor(message: string, public details?: Record<string, unknown>) {
        super(message);
        this.name = 'OntaraAuthError';
      }
    },
    OntaraNetworkError: class OntaraNetworkError extends Error {
      constructor(message: string, public details?: Record<string, unknown>) {
        super(message);
        this.name = 'OntaraNetworkError';
      }
    },
    OntaraValidationError: class OntaraValidationError extends Error {
      constructor(message: string, public details?: Record<string, unknown>) {
        super(message);
        this.name = 'OntaraValidationError';
      }
    },
  };
});

describe('SDK Client Wrapper', () => {
  beforeEach(() => {
    resetOntaraClient();
    vi.clearAllMocks();
  });

  describe('getOntaraClient', () => {
    it('should create a singleton instance', () => {
      const client1 = getOntaraClient();
      const client2 = getOntaraClient();
      expect(client1).toBe(client2);
    });

    it('should initialize with environment variables', () => {
      const client = getOntaraClient() as { config: { baseUrl: string; timeout: number } };
      expect(client.config).toHaveProperty('baseUrl');
      expect(client.config).toHaveProperty('timeout');
    });

    it('should use default values when env vars are not set', () => {
      const originalEnv = { ...process.env };
      delete process.env.NEXT_PUBLIC_ONTARA_MCP_URL;
      delete process.env.ONTARA_API_TIMEOUT;
      
      resetOntaraClient();
      const client = getOntaraClient() as { config: { baseUrl: string; timeout: number } };
      
      expect(client.config).toMatchObject({
        baseUrl: 'http://localhost:3001',
        timeout: 30000,
      });
      
      process.env = originalEnv;
    });
  });

  describe('resetOntaraClient', () => {
    it('should reset the singleton instance', () => {
      const client1 = getOntaraClient();
      resetOntaraClient();
      const client2 = getOntaraClient();
      expect(client1).not.toBe(client2);
    });
  });

  describe('classifyExpression', () => {
    it('should call classifyExpression on the client', async () => {
      const mockResult = {
        expression: undefined,
        related: undefined,
        archetype: undefined,
        found: false,
      };
      
      const client = getOntaraClient() as { classifyExpression: ReturnType<typeof vi.fn> };
      client.classifyExpression.mockResolvedValue(mockResult);
      
      const result = await classifyExpression('x^2 + 2x + 1');
      
      expect(client.classifyExpression).toHaveBeenCalledWith('x^2 + 2x + 1');
      expect(result).toEqual(mockResult);
    });
  });

  describe('matchExpression', () => {
    it('should call matchExpression on the client', async () => {
      const mockResult = {
        expression: undefined,
        related: undefined,
        archetype: undefined,
        found: false,
      };
      
      const client = getOntaraClient() as { matchExpression: ReturnType<typeof vi.fn> };
      client.matchExpression.mockResolvedValue(mockResult);
      
      const result = await matchExpression({ latex: 'x^2 + 2x + 1' });
      
      expect(client.matchExpression).toHaveBeenCalledWith({ latex: 'x^2 + 2x + 1' });
      expect(result).toEqual(mockResult);
    });
  });

  describe('searchStandards', () => {
    it('should call searchStandards on the client', async () => {
      const mockResult = {
        standards: [
          {
            id: 'std-1',
            identifier: 'CCSS.MATH.8.EE.A.2',
            description: 'Use square root and cube root symbols',
            domain: 'Expressions and Equations',
            grade: '8',
          },
        ],
        total: 1,
      };
      
      const client = getOntaraClient() as { searchStandards: ReturnType<typeof vi.fn> };
      client.searchStandards.mockResolvedValue(mockResult);
      
      const result = await searchStandards({ query: 'algebra', limit: 10, offset: 0 });
      
      expect(client.searchStandards).toHaveBeenCalledWith({
        query: 'algebra',
        limit: 10,
        offset: 0,
      });
      expect(result).toEqual(mockResult);
    });

    it('should work with empty params', async () => {
      const mockResult = {
        standards: [],
        total: 0,
      };
      
      const client = getOntaraClient() as { searchStandards: ReturnType<typeof vi.fn> };
      client.searchStandards.mockResolvedValue(mockResult);
      
      const result = await searchStandards();
      
      expect(client.searchStandards).toHaveBeenCalledWith({});
      expect(result).toEqual(mockResult);
    });
  });

  describe('getSchema', () => {
    it('should call getSchema on the client', async () => {
      const mockSchema = {
        labels: ['Standard', 'Expression', 'Archetype'],
        relationshipTypes: ['ALIGNS_WITH', 'REPRESENTED_BY'],
        nodeCounts: [
          { label: 'Standard', count: 100 },
          { label: 'Expression', count: 500 },
        ],
        propertyKeys: ['id', 'identifier', 'description'],
        summary: 'Math ontology graph with standards and expressions',
      };
      
      const client = getOntaraClient() as { getSchema: ReturnType<typeof vi.fn> };
      client.getSchema.mockResolvedValue(mockSchema);
      
      const result = await getSchema();
      
      expect(client.getSchema).toHaveBeenCalled();
      expect(result).toEqual(mockSchema);
    });
  });

  describe('checkHealth', () => {
    it('should call health on the client', async () => {
      const mockHealth = {
        status: 'ok',
        service: 'ontara-mcp-server',
        version: '1.0.0',
      };
      
      const client = getOntaraClient() as { health: ReturnType<typeof vi.fn> };
      client.health.mockResolvedValue(mockHealth);
      
      const result = await checkHealth();
      
      expect(client.health).toHaveBeenCalled();
      expect(result).toEqual(mockHealth);
    });
  });
});

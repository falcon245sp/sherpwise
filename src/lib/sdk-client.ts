import { OntaraClient } from '@ontara/core-sdk';
import type {
  OntaraClientConfig,
  MatchExpressionParams,
  MatchExpressionResult,
  SearchStandardsParams,
  SearchStandardsResult,
  Standard,
  SchemaInfo,
} from '@ontara/core-sdk';

let ontaraClient: OntaraClient | null = null;

export function getOntaraClient(): OntaraClient {
  if (!ontaraClient) {
    const config: OntaraClientConfig = {
      baseUrl: process.env.NEXT_PUBLIC_ONTARA_MCP_URL || 'http://localhost:3001',
      apiKey: process.env.ONTARA_API_KEY,
      timeout: parseInt(process.env.ONTARA_API_TIMEOUT || '30000', 10),
      retries: parseInt(process.env.ONTARA_API_RETRIES || '3', 10),
      retryDelay: parseInt(process.env.ONTARA_API_RETRY_DELAY || '1000', 10),
    };

    ontaraClient = new OntaraClient(config);
  }

  return ontaraClient;
}

export function resetOntaraClient(): void {
  ontaraClient = null;
}

export async function classifyExpression(latex: string): Promise<MatchExpressionResult> {
  const client = getOntaraClient();
  return client.classifyExpression(latex);
}

export async function matchExpression(params: MatchExpressionParams): Promise<MatchExpressionResult> {
  const client = getOntaraClient();
  return client.matchExpression(params);
}

export async function searchStandards(params: SearchStandardsParams = {}): Promise<SearchStandardsResult> {
  const client = getOntaraClient();
  return client.searchStandards(params);
}

export async function getSchema(): Promise<SchemaInfo> {
  const client = getOntaraClient();
  return client.getSchema();
}

export async function checkHealth(): Promise<{ status: string; service: string; version: string }> {
  const client = getOntaraClient();
  return client.health();
}

export type {
  MatchExpressionParams,
  MatchExpressionResult,
  SearchStandardsParams,
  SearchStandardsResult,
  Standard,
  SchemaInfo,
};

import { OdooRpcClient } from './client';
import { OdooSessionInfo } from './types';

export interface AuthResult {
  uid: number;
  sessionId: string;
  sessionInfo: OdooSessionInfo;
}

export async function authenticate(
  serverUrl: string,
  database: string,
  login: string,
  password: string,
): Promise<AuthResult> {
  const client = new OdooRpcClient(serverUrl);
  const result = await client.call<OdooSessionInfo>('common', 'login', [
    database,
    login,
    password,
  ]);

  if (!result || !result.uid) {
    throw new Error('Invalid credentials');
  }

  // Extract session_id from response headers or result
  const sessionId = result.session_id ?? '';

  return {
    uid: result.uid,
    sessionId,
    sessionInfo: result,
  };
}

export async function getSessionInfo(
  serverUrl: string,
  sessionId: string,
): Promise<OdooSessionInfo | null> {
  try {
    const client = new OdooRpcClient(serverUrl);
    client.setSession(sessionId);
    const result = await client.call<OdooSessionInfo>('common', 'get_session_info', []);
    return result;
  } catch {
    return null;
  }
}

export async function getDatabases(serverUrl: string): Promise<string[]> {
  const client = new OdooRpcClient(serverUrl);
  try {
    const result = await client.call<string[]>('db', 'list', []);
    return result ?? [];
  } catch {
    // If /web/jsonrpc fails, try the HTTP endpoint
    const response = await fetch(`${serverUrl}/web/database/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'call', params: {} }),
    });
    const data = await response.json();
    return data?.result ?? [];
  }
}

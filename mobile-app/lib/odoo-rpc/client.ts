import { OdooRpcRequest, OdooRpcResponse, OdooRpcError } from './types';

let _requestId = 1;

export class OdooRpcClient {
  private serverUrl: string;
  private sessionId: string | null = null;

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl.replace(/\/+$/, '');
  }

  setSession(sessionId: string | null) {
    this.sessionId = sessionId;
  }

  async call<T = unknown>(
    service: string,
    method: string,
    args: unknown[] = [],
  ): Promise<T> {
    const payload: OdooRpcRequest = {
      jsonrpc: '2.0',
      method: 'call',
      id: _requestId++,
      params: { service, method, args },
    };

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.sessionId) {
      headers['Cookie'] = `session_id=${this.sessionId}`;
    }

    const response = await fetch(`${this.serverUrl}/web/jsonrpc`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: OdooRpcResponse<T> = await response.json();

    if (data.error) {
      throw new OdooError(data.error);
    }

    return data.result as T;
  }

  // Convenience: call /web/dataset/call_kw
  async callKw<T = unknown>(
    model: string,
    method: string,
    args: unknown[] = [],
    kwargs: Record<string, unknown> = {},
  ): Promise<T> {
    return this.call<T>('object', 'execute_kw', [
      model,
      method,
      args,
      kwargs,
    ]);
  }
}

export class OdooError extends Error {
  constructor(public readonly error: OdooRpcError) {
    super(error.data?.message ?? error.message);
    this.name = 'OdooError';
  }
}

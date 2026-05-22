// Odoo JSON-RPC types
export interface OdooRpcRequest {
  jsonrpc: '2.0';
  method: 'call';
  id: number;
  params: {
    service: string;
    method: string;
    args: unknown[];
  };
}

export interface OdooRpcResponse<T = unknown> {
  jsonrpc: '2.0';
  id: number;
  result?: T;
  error?: OdooRpcError;
}

export interface OdooRpcError {
  code: number;
  message: string;
  data: {
    name: string;
    debug: string;
    message: string;
    arguments: unknown[];
    exception_type: string;
  };
}

export interface OdooSessionInfo {
  uid: number;
  name: string;
  username: string;
  partner_id: number;
  company_id: number;
  lang: string;
  tz: string;
  session_id: string;
}

export interface OdooDatabase {
  name: string;
}

import { OdooRpcClient, OdooError } from '@/lib/odoo-rpc/client';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('OdooRpcClient', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('sends correct JSON-RPC payload', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ jsonrpc: '2.0', id: 1, result: 42 }),
    });

    const client = new OdooRpcClient('https://demo.odoo.com');
    const result = await client.call('common', 'version', []);
    expect(result).toBe(42);

    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toBe('https://demo.odoo.com/web/jsonrpc');
    const body = JSON.parse(opts.body as string);
    expect(body.jsonrpc).toBe('2.0');
    expect(body.params.service).toBe('common');
    expect(body.params.method).toBe('version');
  });

  it('throws OdooError on RPC error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        jsonrpc: '2.0', id: 1,
        error: {
          code: 200,
          message: 'Odoo Server Error',
          data: { name: 'AccessError', debug: '', message: 'Access denied', arguments: [], exception_type: 'access_error' },
        },
      }),
    });
    const client = new OdooRpcClient('https://demo.odoo.com');
    await expect(client.call('object', 'execute_kw', [])).rejects.toBeInstanceOf(OdooError);
  });

  it('throws on HTTP error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500, statusText: 'Internal Server Error' });
    const client = new OdooRpcClient('https://demo.odoo.com');
    await expect(client.call('common', 'version', [])).rejects.toThrow('HTTP 500');
  });

  it('sets session cookie header', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ jsonrpc: '2.0', id: 1, result: 'ok' }),
    });
    const client = new OdooRpcClient('https://demo.odoo.com');
    client.setSession('abc123');
    await client.call('common', 'version', []);
    const [, opts] = mockFetch.mock.calls[0];
    expect((opts.headers as Record<string, string>)['Cookie']).toBe('session_id=abc123');
  });

  it('strips trailing slash from server URL', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ jsonrpc: '2.0', id: 1, result: 'ok' }),
    });
    const client = new OdooRpcClient('https://demo.odoo.com///');
    await client.call('common', 'version', []);
    const [url] = mockFetch.mock.calls[0];
    expect(url).toBe('https://demo.odoo.com/web/jsonrpc');
  });
});

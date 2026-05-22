import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { OdooSessionInfo } from '@/lib/odoo-rpc/types';
import { authenticate, getSessionInfo, getDatabases } from '@/lib/odoo-rpc/auth';
import { OdooRpcClient } from '@/lib/odoo-rpc/client';

const SECURE_KEY = 'odoo_auth';

interface PersistedAuth {
  serverUrl: string;
  database: string;
  sessionId: string;
}

interface AuthState {
  // Connection
  serverUrl: string | null;
  database: string | null;
  availableDatabases: string[];

  // Session
  uid: number | null;
  sessionId: string | null;
  sessionInfo: OdooSessionInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // RPC client (singleton per session)
  client: OdooRpcClient | null;

  // Actions
  setServerUrl: (url: string) => Promise<void>;
  login: (login: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  serverUrl: null,
  database: null,
  availableDatabases: [],
  uid: null,
  sessionId: null,
  sessionInfo: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  client: null,

  setServerUrl: async (url: string) => {
    set({ isLoading: true, error: null });
    try {
      const dbs = await getDatabases(url);
      set({
        serverUrl: url,
        availableDatabases: dbs,
        database: dbs.length === 1 ? dbs[0] : null,
        isLoading: false,
      });
    } catch (e: unknown) {
      set({ error: (e as Error).message, isLoading: false });
      throw e;
    }
  },

  login: async (login: string, password: string) => {
    const { serverUrl, database } = get();
    if (!serverUrl || !database) throw new Error('Server or database not set');

    set({ isLoading: true, error: null });
    try {
      const { uid, sessionId, sessionInfo } = await authenticate(serverUrl, database, login, password);
      const client = new OdooRpcClient(serverUrl);
      client.setSession(sessionId);

      // Persist to secure storage
      await SecureStore.setItemAsync(SECURE_KEY, JSON.stringify({ serverUrl, database, sessionId } as PersistedAuth));

      set({
        uid,
        sessionId,
        sessionInfo,
        client,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (e: unknown) {
      set({ error: (e as Error).message, isLoading: false });
      throw e;
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(SECURE_KEY);
    set({
      uid: null,
      sessionId: null,
      sessionInfo: null,
      client: null,
      isAuthenticated: false,
      error: null,
    });
  },

  restoreSession: async () => {
    set({ isLoading: true });
    try {
      const raw = await SecureStore.getItemAsync(SECURE_KEY);
      if (!raw) {
        set({ isLoading: false });
        return;
      }
      const { serverUrl, database, sessionId } = JSON.parse(raw) as PersistedAuth;
      const info = await getSessionInfo(serverUrl, sessionId);
      if (info && info.uid) {
        const client = new OdooRpcClient(serverUrl);
        client.setSession(sessionId);
        set({
          serverUrl,
          database,
          sessionId,
          sessionInfo: info,
          uid: info.uid,
          client,
          isAuthenticated: true,
        });
      }
    } catch {
      // Ignore restore failure — user will see login screen
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

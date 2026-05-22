import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/auth';

interface QueryOptions<T> {
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface QueryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useOdooQuery<T>(
  model: string,
  method: string,
  args: unknown[] = [],
  kwargs: Record<string, unknown> = {},
  options: QueryOptions<T> = {},
): QueryResult<T> {
  const { client } = useAuthStore();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const { enabled = true, onSuccess, onError } = options;

  const fetchData = useCallback(async () => {
    if (!client || !enabled) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await client.callKw<T>(model, method, args, kwargs);
      setData(result);
      onSuccess?.(result);
    } catch (e: unknown) {
      const msg = (e as Error).message;
      setError(msg);
      onError?.(e as Error);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, model, method, enabled, tick]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: () => setTick((t) => t + 1),
  };
}

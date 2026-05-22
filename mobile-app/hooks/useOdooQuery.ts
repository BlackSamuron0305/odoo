import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '@/stores/auth';

interface QueryOptions<T> {
  enabled?: boolean;
  fields?: string[];
  domain?: unknown[][];
  limit?: number;
  offset?: number;
  order?: string;
  onSuccess?: (data: T[]) => void;
  onError?: (error: Error) => void;
}

interface QueryResult<T> {
  data: T[];
  total: number;
  isLoading: boolean;
  isFetchingMore: boolean;
  error: string | null;
  refetch: () => void;
  fetchMore: () => void;
  hasMore: boolean;
}

export function useOdooQuery<T extends Record<string, unknown>>(
  model: string,
  options: QueryOptions<T> = {},
): QueryResult<T> {
  const { client } = useAuthStore();
  const {
    enabled = true,
    fields = [],
    domain = [],
    limit = 40,
    order = 'id desc',
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (reset = true) => {
    if (!client || !enabled) return;

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const currentOffset = reset ? 0 : offset;
    if (reset) {
      setIsLoading(true);
      setOffset(0);
    } else {
      setIsFetchingMore(true);
    }
    setError(null);

    try {
      const [records, count] = await Promise.all([
        client.callKw<T[]>(model, 'search_read', [], {
          domain,
          fields: fields.length ? fields : undefined,
          limit,
          offset: currentOffset,
          order,
        }),
        reset
          ? client.callKw<number>(model, 'search_count', [domain])
          : Promise.resolve(total),
      ]);

      if (reset) {
        setData(records ?? []);
        setTotal(count);
      } else {
        setData((prev) => [...prev, ...(records ?? [])]);
        setOffset(currentOffset + (records?.length ?? 0));
      }
      onSuccess?.(records ?? []);
    } catch (e: unknown) {
      const msg = (e as Error).message;
      setError(msg);
      onError?.(e as Error);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, model, enabled, tick, JSON.stringify(domain), JSON.stringify(fields), limit, order]);

  useEffect(() => {
    fetchData(true);
    return () => abortRef.current?.abort();
  }, [fetchData]);

  return {
    data,
    total,
    isLoading,
    isFetchingMore,
    error,
    refetch: () => setTick((t) => t + 1),
    fetchMore: () => fetchData(false),
    hasMore: data.length < total,
  };
}

import { useCallback, useEffect, useState } from 'react';

export type AsyncState<TData> =
  | { status: 'loading' }
  | { status: 'error'; error: unknown }
  | { status: 'success'; data: TData };

export type AsyncResult<TData> = AsyncState<TData> & { reload: () => void };

interface SettledRequest<TData> {
  loader: () => Promise<TData>;
  attempt: number;
  state: AsyncState<TData>;
}

/**
 * Executa `loader` e expõe os estados de carregamento, erro e sucesso.
 * O `loader` deve ser estável (função de módulo ou useCallback).
 */
export function useAsync<TData>(loader: () => Promise<TData>): AsyncResult<TData> {
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<SettledRequest<TData> | null>(null);

  useEffect(() => {
    let isActive = true;

    loader().then(
      (data) => {
        if (isActive) setSettled({ loader, attempt, state: { status: 'success', data } });
      },
      (error: unknown) => {
        if (isActive) setSettled({ loader, attempt, state: { status: 'error', error } });
      },
    );

    return () => {
      isActive = false;
    };
  }, [loader, attempt]);

  const reload = useCallback(() => setAttempt((current) => current + 1), []);

  // Enquanto a requisição atual não termina, o estado é "loading" (sem setState síncrono no efeito).
  const isCurrent = settled !== null && settled.loader === loader && settled.attempt === attempt;
  const state: AsyncState<TData> = isCurrent ? settled.state : { status: 'loading' };

  return { ...state, reload };
}

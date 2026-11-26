import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';
import { errorMessage } from '../utils/format';

interface State<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/** Loads data whenever the screen gains focus; exposes loading/error/reload. */
export function useFocusData<T>(loader: () => Promise<T>) {
  const [state, setState] = useState<State<T>>({ data: null, loading: true, error: null });
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const reload = useCallback(async () => {
    setState(s => ({ ...s, loading: s.data === null, error: null }));
    try {
      const data = await loaderRef.current();
      setState({ data, loading: false, error: null });
    } catch (e) {
      setState(s => ({ data: s.data, loading: false, error: errorMessage(e) }));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  return { ...state, reload };
}

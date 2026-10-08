import { useState, useEffect, useCallback } from 'react';
import { getShowRomaji, setShowRomaji, subscribeToStorage } from '../utils/storage';

/**
 * Custom React hook untuk membaca dan mengubah preferensi Romaji global
 * Reaktif secara real-time antar komponen dan sinkron ke localStorage
 */
export function useShowRomaji(): [boolean, (show: boolean) => void, () => void] {
  const [showRomaji, setLocalShowRomaji] = useState<boolean>(getShowRomaji);

  useEffect(() => {
    // Sinkronisasi bila ada perubahan di localStorage atau dari komponen lain
    const unsubscribe = subscribeToStorage(() => {
      setLocalShowRomaji(getShowRomaji());
    });
    return unsubscribe;
  }, []);

  const updateShowRomaji = useCallback((show: boolean) => {
    setShowRomaji(show);
  }, []);

  const toggle = useCallback(() => {
    setShowRomaji(!getShowRomaji());
  }, []);

  return [showRomaji, updateShowRomaji, toggle];
}

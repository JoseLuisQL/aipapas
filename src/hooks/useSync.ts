import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { prepareDatabase } from '../db';
import { runSync } from '../services/sync/worker';

export function useSync() {
  useEffect(() => {
    const sub = NetInfo.addEventListener(async (state) => {
      if (state.isConnected) {
        const db = await prepareDatabase();
        runSync(db);
      }
    });
    return () => sub();
  }, []);
}


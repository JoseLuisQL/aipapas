import React from 'react';
import { View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';
import { prepareDatabase } from '../../db';
import { runSync } from '../../services/sync/worker';

export default function SettingsScreen() {
  const [net, setNet] = React.useState<any>(null);

  React.useEffect(() => {
    const sub = NetInfo.addEventListener(setNet);
    return () => sub();
  }, []);

  const syncNow = async () => {
    const db = await prepareDatabase();
    await runSync(db);
    alert('Sincronización simulada completada');
  };

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Card>
        <Card.Title title="Configuración" />
        <Card.Content>
          <Text>Red: {net?.isConnected ? 'Online' : 'Offline'}</Text>
          <Button mode="contained" onPress={syncNow} style={{ marginTop: 8 }}>Sincronizar ahora</Button>
        </Card.Content>
      </Card>
    </View>
  );
}


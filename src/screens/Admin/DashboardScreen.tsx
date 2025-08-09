import React from 'react';
import { View } from 'react-native';
import { Text, Card } from 'react-native-paper';

export default function DashboardScreen() {
  return (
    <View style={{ flex: 1, padding: 12, gap: 12 }}>
      <Card>
        <Card.Title title="Métricas" subtitle="Mock" />
        <Card.Content>
          <Text>Total usuarios: 2</Text>
          <Text>Identificaciones hoy: 3</Text>
          <Text>Variedades registradas: 3</Text>
        </Card.Content>
      </Card>
    </View>
  );
}


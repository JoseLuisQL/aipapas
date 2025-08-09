import React from 'react';
import { View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { prepareDatabase } from '../../db';
import { exportToCSV } from '../../services/export/csv';

export default function ReportsScreen() {
  const exportUsers = async () => {
    const db = await prepareDatabase();
    const rows = await db.getAllAsync(`SELECT * FROM users`);
    const path = await exportToCSV('users.csv', rows);
    alert(`Exportado a: ${path}`);
  };
  const exportVarieties = async () => {
    const db = await prepareDatabase();
    const rows = await db.getAllAsync(`SELECT * FROM varieties`);
    const path = await exportToCSV('varieties.csv', rows);
    alert(`Exportado a: ${path}`);
  };

  return (
    <View style={{ flex: 1, padding: 12, gap: 12 }}>
      <Card>
        <Card.Title title="Reportes" />
        <Card.Content>
          <Text>Exporta datos a CSV (cache local)</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <Button mode="contained" onPress={exportUsers}>Usuarios CSV</Button>
            <Button mode="contained" onPress={exportVarieties}>Variedades CSV</Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}


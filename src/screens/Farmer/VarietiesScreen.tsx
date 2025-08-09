import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { TextInput, List, SegmentedButtons } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { prepareDatabase } from '../../db';
import { listVarieties } from '../../repos/varietiesRepo';

export default function VarietiesScreen() {
  const [search, setSearch] = useState('');
  const [color, setColor] = useState<string | undefined>(undefined);

  const { data } = useQuery({
    queryKey: ['varieties', { search, color }],
    queryFn: async () => {
      const db = await prepareDatabase();
      return listVarieties(db, { color });
    },
  });

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <TextInput value={search} onChangeText={setSearch} placeholder="Buscar" style={{ marginBottom: 8 }} />
      <SegmentedButtons
        value={color ?? ''}
        onValueChange={(v) => setColor(v || undefined)}
        buttons={[
          { value: '', label: 'Todas' },
          { value: 'amarilla', label: 'Amarilla' },
          { value: 'morada', label: 'Morada' },
          { value: 'blanca', label: 'Blanca' },
        ]}
        style={{ marginBottom: 8 }}
      />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item title={item.name} description={item.description} />
        )}
      />
    </View>
  );
}


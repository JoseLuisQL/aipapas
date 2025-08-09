import React from 'react';
import { View, FlatList, Image } from 'react-native';
import { Text, List } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { prepareDatabase } from '../../db';
import { listIdentifications } from '../../repos/identificationsRepo';

export default function HistoryScreen() {
  const { data } = useQuery({
    queryKey: ['identifications'],
    queryFn: async () => {
      const db = await prepareDatabase();
      return listIdentifications(db);
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={`${item.result} (${Math.round(item.confidence * 100)}%)`}
            description={item.timestamp}
            left={() => <Image source={{ uri: item.image_path }} style={{ width: 56, height: 56, borderRadius: 8 }} />}
          />
        )}
        ListEmptyComponent={<Text style={{ padding: 16 }}>Sin identificaciones aún.</Text>}
      />
    </View>
  );
}


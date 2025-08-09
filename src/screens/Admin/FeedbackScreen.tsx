import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { Button, SegmentedButtons, List, Text } from 'react-native-paper';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { prepareDatabase } from '../../db';
import { listFeedback, updateFeedbackStatus } from '../../repos/feedbackRepo';

export default function FeedbackScreen() {
  const qc = useQueryClient();
  const [status, setStatus] = useState<string>('all');

  const { data } = useQuery({
    queryKey: ['feedback', { status }],
    queryFn: async () => {
      const db = await prepareDatabase();
      return listFeedback(db, { status: status === 'all' ? undefined : status });
    },
  });

  const onChangeStatus = async (id: string, status: string) => {
    const db = await prepareDatabase();
    await updateFeedbackStatus(db, id, status);
    qc.invalidateQueries({ queryKey: ['feedback'] });
  };

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <SegmentedButtons
        value={status}
        onValueChange={setStatus as any}
        buttons={[{ value: 'all', label: 'Todos' }, { value: 'new', label: 'Nuevos' }, { value: 'reviewed', label: 'Revisados' }, { value: 'resolved', label: 'Resueltos' }]}
        style={{ marginBottom: 8 }}
      />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.message}
            description={`${item.created_at} — ${item.status}`}
            right={() => (
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <Button onPress={() => onChangeStatus(item.id, 'reviewed')}>Revisar</Button>
                <Button onPress={() => onChangeStatus(item.id, 'resolved')}>Resolver</Button>
              </View>
            )}
          />
        )}
        ListEmptyComponent={<Text>No hay feedback.</Text>}
      />
    </View>
  );
}


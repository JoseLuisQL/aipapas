import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { Button, Dialog, Portal, Text, TextInput, List, SegmentedButtons } from 'react-native-paper';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { prepareDatabase } from '../../db';
import { createContent, deleteContent, listContent, updateContent } from '../../repos/contentRepo';

export default function ContentScreen() {
  const qc = useQueryClient();
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('draft');
  const [scheduledAt, setScheduledAt] = useState('');
  const [body, setBody] = useState('');
  const [search, setSearch] = useState('');

  const { data } = useQuery({
    queryKey: ['content', { search }],
    queryFn: async () => {
      const db = await prepareDatabase();
      return listContent(db, { search });
    },
  });

  const openCreate = () => {
    setEditing(null);
    setTitle(''); setCategory(''); setStatus('draft'); setScheduledAt(''); setBody('');
    setVisible(true);
  };
  const openEdit = (c: any) => {
    setEditing(c);
    setTitle(c.title); setCategory(c.category ?? ''); setStatus(c.status ?? 'draft'); setScheduledAt(c.scheduled_at ?? ''); setBody(c.body ?? '');
    setVisible(true);
  };

  const onSave = async () => {
    const db = await prepareDatabase();
    const payload = {
      id: editing?.id ?? `c_${Date.now()}`,
      title, category, status, scheduled_at: scheduledAt || null,
      body,
      media: [],
    };
    if (editing) await updateContent(db, payload); else await createContent(db, payload);
    setVisible(false); setEditing(null);
    qc.invalidateQueries({ queryKey: ['content'] });
  };

  const onDelete = async (id: string) => {
    const db = await prepareDatabase();
    await deleteContent(db, id);
    qc.invalidateQueries({ queryKey: ['content'] });
  };

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
        <TextInput style={{ flex: 1 }} placeholder="Buscar" value={search} onChangeText={setSearch} />
        <Button icon="plus" mode="contained" onPress={openCreate}>Nuevo</Button>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={`${item.title} (${item.status})`}
            description={item.category}
            onPress={() => openEdit(item)}
            right={() => <Button onPress={() => onDelete(item.id)}>Eliminar</Button>}
          />
        )}
      />

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>{editing ? 'Editar' : 'Crear'} contenido</Dialog.Title>
          <Dialog.Content>
            <TextInput label="Título" value={title} onChangeText={setTitle} style={{ marginBottom: 8 }} />
            <TextInput label="Categoría" value={category} onChangeText={setCategory} style={{ marginBottom: 8 }} />
            <SegmentedButtons
              value={status}
              onValueChange={setStatus as any}
              buttons={[{ value: 'draft', label: 'Borrador' }, { value: 'published', label: 'Publicado' }]}
              style={{ marginBottom: 8 }}
            />
            <TextInput label="Programación (ISO opcional)" value={scheduledAt} onChangeText={setScheduledAt} style={{ marginBottom: 8 }} />
            {/* WYSIWYG mock: TextInput multiline */}
            <TextInput label="Contenido" value={body} onChangeText={setBody} multiline numberOfLines={6} style={{ marginBottom: 8 }} />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Cancelar</Button>
            <Button onPress={onSave} mode="contained">Guardar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}


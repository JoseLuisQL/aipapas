import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { Button, Dialog, Portal, Text, TextInput, List, SegmentedButtons } from 'react-native-paper';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { prepareDatabase } from '../../db';
import { createUser, listUsers, updateUser, softDeleteUser } from '../../repos/usersRepo';

export default function UsersScreen() {
  const qc = useQueryClient();
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('farmer');
  const [search, setSearch] = useState('');

  const { data } = useQuery({
    queryKey: ['users', { search, roleFilter: role }],
    queryFn: async () => {
      const db = await prepareDatabase();
      return listUsers(db, { search, role: role === 'all' ? undefined : role });
    },
  });

  const openCreate = () => {
    setEditing(null);
    setName(''); setEmail(''); setRole('farmer');
    setVisible(true);
  };
  const openEdit = (u: any) => {
    setEditing(u);
    setName(u.name); setEmail(u.email); setRole(u.role);
    setVisible(true);
  };

  const onSave = async () => {
    const db = await prepareDatabase();
    const payload = { id: editing?.id ?? `u_${Date.now()}`, name, email, role };
    if (editing) await updateUser(db, payload); else await createUser(db, payload);
    setVisible(false); setEditing(null);
    qc.invalidateQueries({ queryKey: ['users'] });
  };

  const onDelete = async (id: string) => {
    const db = await prepareDatabase();
    await softDeleteUser(db, id);
    qc.invalidateQueries({ queryKey: ['users'] });
  };

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
        <TextInput style={{ flex: 1 }} placeholder="Buscar" value={search} onChangeText={setSearch} />
        <Button icon="plus" mode="contained" onPress={openCreate}>Nuevo</Button>
      </View>
      <SegmentedButtons
        value={role}
        onValueChange={setRole as any}
        buttons={[
          { value: 'all', label: 'Todos' },
          { value: 'farmer', label: 'Agricultor' },
          { value: 'admin', label: 'Admin' },
        ]}
        style={{ marginBottom: 8 }}
      />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={`${item.name} (${item.role})`}
            description={item.email}
            onPress={() => openEdit(item)}
            right={() => <Button onPress={() => onDelete(item.id)}>Eliminar</Button>}
          />
        )}
      />

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>{editing ? 'Editar' : 'Crear'} usuario</Dialog.Title>
          <Dialog.Content>
            <TextInput label="Nombre" value={name} onChangeText={setName} style={{ marginBottom: 8 }} />
            <TextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={{ marginBottom: 8 }} />
            <SegmentedButtons
              value={role}
              onValueChange={setRole as any}
              buttons={[{ value: 'farmer', label: 'Agricultor' }, { value: 'admin', label: 'Admin' }]}
            />
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


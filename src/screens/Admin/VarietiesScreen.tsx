import React, { useState } from 'react';
import { View, FlatList, Image, ScrollView } from 'react-native';
import { Button, Dialog, Portal, Text, TextInput, List, SegmentedButtons, Chip } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { prepareDatabase } from '../../db';
import { createVariety, deleteVariety, listVarieties, updateVariety } from '../../repos/varietiesRepo';

export default function VarietiesScreen() {
  const qc = useQueryClient();
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [forma, setForma] = useState('');
  const [origen, setOrigen] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const { data } = useQuery({
    queryKey: ['admin-varieties'],
    queryFn: async () => {
      const db = await prepareDatabase();
      return listVarieties(db);
    },
  });

  const openCreate = () => {
    setEditing(null);
    setName(''); setDescription(''); setColor(''); setForma(''); setOrigen(''); setImages([]);
    setVisible(true);
  };
  const openEdit = (v: any) => {
    setEditing(v);
    setName(v.name); setDescription(v.description ?? '');
    const ch = JSON.parse(v.characteristics ?? '{}');
    setColor(ch.color ?? ''); setForma(ch.forma ?? ''); setOrigen(ch.origen ?? '');
    setImages(JSON.parse(v.images ?? '[]'));
    setVisible(true);
  };

  const pickImages = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true, mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!res.canceled) {
      const newUris = res.assets.map(a => a.uri);
      setImages((prev) => [...prev, ...newUris]);
    }
  };

  const onSave = async () => {
    const db = await prepareDatabase();
    const payload = {
      id: editing?.id ?? `v_${Date.now()}`,
      name,
      description,
      characteristics: { color, forma, origen },
      images,
    };
    if (editing) {
      await updateVariety(db, payload);
    } else {
      await createVariety(db, payload);
    }
    setVisible(false); setEditing(null);
    qc.invalidateQueries({ queryKey: ['admin-varieties'] });
  };

  const onDelete = async (id: string) => {
    const db = await prepareDatabase();
    await deleteVariety(db, id);
    qc.invalidateQueries({ queryKey: ['admin-varieties'] });
  };

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Button icon="plus" mode="contained" onPress={openCreate} style={{ marginBottom: 8 }}>Nueva variedad</Button>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={item.description}
            onPress={() => openEdit(item)}
            right={() => <Button onPress={() => onDelete(item.id)}>Eliminar</Button>}
          />
        )}
      />

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>{editing ? 'Editar' : 'Crear'} variedad</Dialog.Title>
          <Dialog.Content>
            <ScrollView style={{ maxHeight: 400 }}>
              <TextInput label="Nombre" value={name} onChangeText={setName} style={{ marginBottom: 8 }} />
              <TextInput label="Descripción" value={description} onChangeText={setDescription} multiline style={{ marginBottom: 8 }} />
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TextInput label="Color" value={color} onChangeText={setColor} style={{ flex: 1 }} />
                <TextInput label="Forma" value={forma} onChangeText={setForma} style={{ flex: 1 }} />
              </View>
              <TextInput label="Origen" value={origen} onChangeText={setOrigen} style={{ marginVertical: 8 }} />

              <Button onPress={pickImages} mode="outlined">Agregar imágenes</Button>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {images.map((u) => (
                  <Image key={u} source={{ uri: u }} style={{ width: 64, height: 64, borderRadius: 6 }} />
                ))}
              </View>
            </ScrollView>
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


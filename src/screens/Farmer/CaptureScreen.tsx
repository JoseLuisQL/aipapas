import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { Button, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { prepareDatabase } from '../../db';
import { addIdentification } from '../../repos/identificationsRepo';

export default function CaptureScreen() {
  const [uri, setUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onPick = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!res.canceled) setUri(res.assets[0].uri);
  };

  const onIdentify = async () => {
    if (!uri) return;
    setLoading(true);
    try {
      // Simula IA + guardado
      const db = await prepareDatabase();
      const ident = {
        id: `i_${Date.now()}`,
        image_path: uri,
        result: 'Papa Amarilla',
        confidence: 0.9,
        location: 'Cusco, PE',
        timestamp: new Date().toISOString(),
      };
      await addIdentification(db, ident);
      setUri(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button mode="outlined" onPress={onPick} style={{ marginBottom: 16 }}>Seleccionar imagen</Button>
      {uri && (
        <>
          <Image source={{ uri }} style={{ width: '100%', height: 240, borderRadius: 8 }} />
          <Button mode="contained" onPress={onIdentify} loading={loading} style={{ marginTop: 16 }}>Identificar (mock)</Button>
        </>
      )}
      {!uri && <Text>Seleccione o capture una imagen para identificar.</Text>}
    </View>
  );
}


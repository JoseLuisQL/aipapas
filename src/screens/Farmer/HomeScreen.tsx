import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text variant="headlineMedium">Identificador de Papas Nativas</Text>
      <Text>Bienvenido</Text>
    </View>
  );
}


import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { useAuthStore } from '../state/useAuthStore';
import { Button } from 'react-native-paper';
import HomeScreen from '../screens/Farmer/HomeScreen';
import CaptureScreen from '../screens/Farmer/CaptureScreen';
import HistoryScreen from '../screens/Farmer/HistoryScreen';
import FarmerVarietiesScreen from '../screens/Farmer/VarietiesScreen';
import UsersScreen from '../screens/Admin/UsersScreen';
import DashboardScreen from '../screens/Admin/DashboardScreen';
import AdminVarietiesScreen from '../screens/Admin/VarietiesScreen';
import ContentScreen from '../screens/Admin/ContentScreen';
import FeedbackScreen from '../screens/Admin/FeedbackScreen';
import ReportsScreen from '../screens/Admin/ReportsScreen';
import SettingsScreen from '../screens/Admin/SettingsScreen';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const Placeholder = ({ label }: { label: string }) => {
  const { role, setRole } = useAuthStore();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <Text>{label}</Text>
      <Text>Rol actual: {role}</Text>
      <Button mode="contained" onPress={() => setRole(role === 'farmer' ? 'admin' : 'farmer')}>
        Cambiar a {role === 'farmer' ? 'admin' : 'farmer'}
      </Button>
    </View>
  );
};

function FarmerTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Capturar" component={CaptureScreen} />
      <Tab.Screen name="Historial" component={HistoryScreen} />
      <Tab.Screen name="Variedades" component={FarmerVarietiesScreen} />
    </Tab.Navigator>
  );
}

function FarmerDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="InicioTabs" component={FarmerTabs} options={{ title: 'Agricultor' }} />
      <Drawer.Screen name="Educación" children={() => <Placeholder label="Educación" />} />
      <Drawer.Screen name="Perfil" children={() => <Placeholder label="Perfil" />} />
    </Drawer.Navigator>
  );
}

function AdminDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Usuarios" component={UsersScreen} />
      <Drawer.Screen name="Variedades" component={AdminVarietiesScreen} />
      <Drawer.Screen name="Contenido" component={ContentScreen} />
      <Drawer.Screen name="Feedback" component={FeedbackScreen} />
      <Drawer.Screen name="Reportes" component={ReportsScreen} />
      <Drawer.Screen name="Configuración" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

export default function RootNavigator() {
  const { role } = useAuthStore();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {role === 'farmer' ? (
        <Stack.Screen name="Farmer" component={FarmerDrawer} />
      ) : (
        <Stack.Screen name="Admin" component={AdminDrawer} />
      )}
    </Stack.Navigator>
  );
}


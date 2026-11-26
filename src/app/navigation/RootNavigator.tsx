import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SplashScreen } from '../../features/authentication/screens/SplashScreen';
import { WelcomeScreen } from '../../features/authentication/screens/WelcomeScreen';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';
import { MainTabs } from './MainTabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const isReady = useAppStore(s => s.isReady);
  const authStatus = useAuthStore(s => s.status);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isReady ? (
        <Stack.Screen name="Splash" component={SplashScreen} />
      ) : authStatus === 'signedIn' ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
      )}
    </Stack.Navigator>
  );
}

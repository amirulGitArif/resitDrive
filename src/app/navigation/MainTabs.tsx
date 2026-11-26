import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../../components/Icon';
import { CategoriesScreen } from '../../features/categories/screens/CategoriesScreen';
import { CaptureScreen } from '../../features/receipts/screens/CaptureScreen';
import { HomeScreen } from '../../features/receipts/screens/HomeScreen';
import { ReceiptListScreen } from '../../features/receipts/screens/ReceiptListScreen';
import { SettingsScreen } from '../../features/settings/screens/SettingsScreen';
import { colors } from '../../theme';
import { CaptureTabButton } from './CaptureTabButton';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const icon = (name: string) => ({ color }: { color: string }) => (
  <Icon name={name} color={color} />
);

export function MainTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 62 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 6,
        },
      }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: icon('home') }} />
      <Tab.Screen
        name="Receipts"
        component={ReceiptListScreen}
        options={{ tabBarIcon: icon('receipts') }}
      />
      <Tab.Screen
        name="Capture"
        component={CaptureScreen}
        options={{ tabBarLabel: () => null, tabBarButton: CaptureTabButton }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ tabBarIcon: icon('categories') }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarIcon: icon('settings') }}
      />
    </Tab.Navigator>
  );
}

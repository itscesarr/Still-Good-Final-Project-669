import { Tabs } from 'expo-router';
import { color } from '../../community/ui';

export default function MainTabs() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: color.paper },
        headerTintColor: color.ink,
        headerShadowVisible: false,
        tabBarActiveTintColor: color.green,
        tabBarActiveBackgroundColor: color.pale,
        tabBarInactiveTintColor: color.muted,
        tabBarStyle: { backgroundColor: color.paper, borderTopColor: color.line },
        tabBarIconStyle: { display: 'none' },
        tabBarLabelStyle: { fontSize: 15, fontWeight: '600' },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen name="community/index" options={{ title: 'Community', headerShown: false }} />
      <Tabs.Screen name="community/inbox" options={{ title: 'Messages' }} />
    </Tabs>
  );
}

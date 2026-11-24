import { Stack } from 'expo-router';
import { BoardProvider } from '../community/BoardProvider';
import { color } from '../community/ui';

export default function Layout() {
  return <BoardProvider><Stack screenOptions={{ headerTintColor: color.green, headerStyle: { backgroundColor: color.paper }, headerShadowVisible: false, contentStyle: { backgroundColor: color.paper } }}>
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    <Stack.Screen name="community/new" options={{ title: 'New post' }} />
    <Stack.Screen name="community/chat/[postId]" options={{ title: 'Conversation' }} />
  </Stack></BoardProvider>;
}

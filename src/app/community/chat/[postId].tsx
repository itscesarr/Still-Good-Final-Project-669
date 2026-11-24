import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { useBoard } from '../../../community/BoardProvider';
import { newId, viewer, type Message } from '../../../community/data';
import { Action, color, s } from '../../../community/ui';

export default function Chat() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const { board, setBoard } = useBoard();
  const post = board.posts.find(item => item.id === postId);
  const [draft, setDraft] = useState('');
  const list = useRef<FlatList<Message>>(null);
  const inset = useSafeAreaInsets();
  const header = useHeaderHeight();
  if (!post || post.authorId === viewer.authorId) return <View style={s.column}><Text style={s.body}>Conversation unavailable.</Text><Action label="Open community" onPress={() => router.replace('/community')} /></View>;
  const messages = board.chats[postId] ?? [];
  function send() {
    const text = draft.trim();
    if (!text) return;
    const message = { id: newId(), text, sentAt: Date.now() };
    setBoard(current => ({ ...current, chats: { ...current.chats, [postId]: [...(current.chats[postId] ?? []), message] } }));
    setDraft('');
  }
  return <KeyboardAvoidingView style={s.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={header}>
    <View style={[s.column, { flex: 1, paddingBottom: Math.max(12, inset.bottom) }]}>
      <View style={[s.divider, { gap: 5, paddingVertical: 16 }]}>
        <Text accessibilityRole="header" style={s.title}>{post.author}</Text><Text style={s.muted}>About · {post.title}</Text>
      </View>
      <FlatList ref={list} style={{ flex: 1 }} data={messages} keyExtractor={item => item.id} keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ gap: 10, paddingVertical: 18 }}
        onContentSizeChange={() => list.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={<Text style={s.muted}>{post.kind === 'Ingredient' ? 'Ask about availability or arrange a pickup.' : 'Ask the author about this recipe.'}</Text>}
        renderItem={({ item }) => <View style={{ alignSelf: 'flex-end', maxWidth: '84%', gap: 3 }}>
          <View style={{ backgroundColor: color.pale, borderRadius: 12, padding: 12 }}><Text style={s.body}>{item.text}</Text></View>
          <Text style={[s.muted, { textAlign: 'right', fontSize: 12 }]}>You · {new Date(item.sentAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</Text>
        </View>} />
      <Text style={[s.muted, { paddingVertical: 6 }]}>Demo conversation · saved on this device</Text>
      <View style={s.row}><TextInput value={draft} onChangeText={setDraft} accessibilityLabel="Message" placeholder="Write a message" placeholderTextColor={color.muted}
        multiline maxLength={2000} style={[s.input, { flex: 1, maxHeight: 120 }]} />
        <Action primary label="Send" disabled={!draft.trim()} onPress={send} /></View>
    </View>
  </KeyboardAvoidingView>;
}

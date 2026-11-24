import { router } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useBoard } from '../../community/BoardProvider';
import { Action, s } from '../../community/ui';

export default function Inbox() {
  const { board } = useBoard();
  const threads = board.posts.flatMap(post => {
    const messages = board.chats[post.id] ?? [];
    const last = messages[messages.length - 1];
    return last ? [{ post, last }] : [];
  }).sort((a, b) => b.last.sentAt - a.last.sentAt);
  return <FlatList style={s.page} contentContainerStyle={s.column} data={threads} keyExtractor={item => item.post.id}
    ListEmptyComponent={<View style={{ gap: 12, paddingVertical: 24, alignItems: 'flex-start' }}>
      <Text style={s.title}>No conversations yet</Text><Text style={s.body}>Open a community post to message its author.</Text>
      <Action label="Browse posts" onPress={() => router.dismissTo('/community')} />
    </View>}
    renderItem={({ item: { post, last } }) => <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/community/chat/[postId]', params: { postId: post.id } })}
      style={[s.divider, { paddingVertical: 18, gap: 4 }]}>
      <Text style={s.label}>{post.author}</Text><Text style={s.title}>{post.title}</Text><Text numberOfLines={1} style={s.muted}>You · {last.text}</Text>
    </Pressable>} />;
}

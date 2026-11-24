import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBoard } from '../../../community/BoardProvider';
import { viewer, type Kind, type Post } from '../../../community/data';
import { Action, color, s, serif } from '../../../community/ui';

function PostCard({ post }: { post: Post }) {
  const { board, setBoard } = useBoard();
  const liked = board.liked.includes(post.id);
  function toggleLike() {
    setBoard(current => ({ ...current, liked: current.liked.includes(post.id)
      ? current.liked.filter(id => id !== post.id) : [...current.liked, post.id] }));
  }
  return <View style={[s.divider, { paddingVertical: 22, gap: 9 }]}>
    <Text style={[s.label, { color: post.kind === 'Ingredient' ? color.green : color.clay }]}>{post.kind === 'Ingredient' ? 'Ingredient offer' : 'Shared recipe'}  ·  {post.author}</Text>
    <Text accessibilityRole="header" style={s.title}>{post.title}</Text>
    {post.kind === 'Recipe' && <Text style={s.label}>{post.ingredients}</Text>}
    <Text style={s.body}>{post.details}</Text>
    {post.pickup ? <Text style={s.muted}>Pickup · {post.pickup}</Text> : null}
    <View style={[s.row, { marginTop: 4 }]}>
      {post.authorId !== viewer.authorId && <Action label={'Message ' + post.author} onPress={() => router.push({ pathname: '/community/chat/[postId]', params: { postId: post.id } })} />}
      <Pressable accessibilityRole="button" accessibilityState={{ selected: liked }} onPress={toggleLike} style={s.action}>
        <Text style={s.muted}>{liked ? 'Liked' : 'Like'} · {post.likes + Number(liked)}</Text>
      </Pressable>
    </View>
  </View>;
}

export default function Feed() {
  const { ingredient, published } = useLocalSearchParams<{ ingredient?: string; published?: string }>();
  return <FeedList key={JSON.stringify([ingredient, published])} ingredient={ingredient} />;
}

function FeedList({ ingredient }: { ingredient?: string }) {
  const [query, setQuery] = useState(ingredient ?? '');
  const [kind, setKind] = useState<Kind | 'All'>('All');
  const { board } = useBoard();
  const needle = query.trim().toLowerCase();
  const posts = board.posts.filter(post => (kind === 'All' || post.kind === kind)
    && (post.ingredients + ' ' + post.title).toLowerCase().includes(needle));
  return <SafeAreaView style={s.page} edges={['top', 'left', 'right']}>
    <FlatList keyboardShouldPersistTaps="handled" contentContainerStyle={s.column} data={posts} keyExtractor={post => post.id}
      ListHeaderComponent={<View>
        <View style={[s.row, s.divider, { justifyContent: 'space-between', paddingVertical: 9 }]}>
          <Text style={{ fontFamily: serif, fontSize: 24, fontStyle: 'italic', color: color.green }}>Still Good</Text>
        </View>
        <View style={[s.row, { paddingTop: 22, paddingBottom: 16, justifyContent: 'space-between' }]}>
          <Text accessibilityRole="header" style={s.heading}>Community</Text>
          <Action primary label="New post" onPress={() => router.push('/community/new')} />
        </View>
        <TextInput accessibilityLabel="Search ingredients" placeholder="Search ingredients" placeholderTextColor={color.muted}
          value={query} onChangeText={setQuery} returnKeyType="search" style={s.input} />
        <View style={[s.row, s.divider, { paddingVertical: 9 }]}>
          {(['All', 'Ingredient', 'Recipe'] as const).map(type =>
            <Pressable accessibilityRole="button" accessibilityState={{ selected: kind === type }} key={type} onPress={() => setKind(type)}
              style={[s.action, kind === type && s.primary]}>
              <Text style={[s.label, { color: kind === type ? 'white' : color.muted }]}>{type === 'All' ? 'All posts' : type + 's'}</Text>
            </Pressable>)}
        </View>
      </View>}
      ListEmptyComponent={<View style={{ gap: 12, paddingTop: 30, alignItems: 'flex-start' }}>
        <Text style={s.title}>No matching posts</Text>
        <Action label="Clear filters" onPress={() => { setQuery(''); setKind('All'); }} />
      </View>}
      renderItem={({ item }) => <PostCard post={item} />} />
  </SafeAreaView>;
}

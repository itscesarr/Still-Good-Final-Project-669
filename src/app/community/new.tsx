import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { useBoard } from '../../community/BoardProvider';
import { newId, viewer, type Kind } from '../../community/data';
import { Action, s } from '../../community/ui';

export default function NewPost() {
  const { setBoard } = useBoard();
  const [kind, setKind] = useState<Kind>('Ingredient');
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [details, setDetails] = useState('');
  const [pickup, setPickup] = useState('');
  const offer = kind === 'Ingredient';
  const fields = [
    { label: 'Title', value: title, change: setTitle, max: 90 },
    { label: 'Ingredients', value: ingredients, change: setIngredients, max: 200 },
    { label: offer ? 'Offer details' : 'Recipe instructions', value: details, change: setDetails, max: 1800, multiline: true },
    ...(offer ? [{ label: 'Pickup location', value: pickup, change: setPickup, max: 120 }] : []),
  ];
  const complete = fields.every(field => field.value.trim().length > 0);
  function publish() {
    if (!complete) return;
    const post = { ...viewer, kind, id: newId(), title: title.trim(), ingredients: ingredients.trim(),
      details: details.trim(), pickup: offer ? pickup.trim() : '', likes: 0 };
    setBoard(current => ({ ...current, posts: [post, ...current.posts] }));
    router.dismissTo({ pathname: '/community', params: { published: post.id, ingredient: '' } });
  }
  return <KeyboardAvoidingView style={s.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[s.column, { gap: 18, paddingTop: 16 }]}>
      <Text style={s.title}>What are you sharing?</Text>
      <View style={s.row}>{(['Ingredient', 'Recipe'] as const).map(type =>
        <Action key={type} selected={kind === type} primary={kind === type} label={type} onPress={() => setKind(type)} />)}</View>
      {fields.map(field => <View key={field.label} style={{ gap: 6 }}>
        <Text style={s.label}>{field.label}</Text>
        <TextInput accessibilityLabel={field.label} value={field.value} onChangeText={field.change} maxLength={field.max}
          multiline={field.multiline} style={[s.input, field.multiline && { minHeight: 94, textAlignVertical: 'top' }]} />
      </View>)}
      <Action primary disabled={!complete} label="Share post" onPress={publish} />
    </ScrollView>
  </KeyboardAvoidingView>;
}

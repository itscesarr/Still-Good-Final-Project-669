import { Platform, Pressable, StyleSheet, Text } from 'react-native';

export const color = { paper: '#FBFAF5', ink: '#1E3026', green: '#28583F', muted: '#506456', line: '#CFD6C9', pale: '#E6EDDF', clay: '#88452D' };
export const serif = Platform.select({ ios: 'Georgia', android: 'serif', web: 'Georgia' });
export const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: color.paper },
  column: { width: '100%', maxWidth: 640, alignSelf: 'center', paddingHorizontal: 22, paddingBottom: 32 },
  heading: { fontFamily: serif, fontSize: 40, color: color.ink, lineHeight: 48 },
  title: { fontFamily: serif, fontSize: 27, lineHeight: 34, color: color.ink },
  body: { fontSize: 16, lineHeight: 24, color: color.ink },
  muted: { fontSize: 14, lineHeight: 21, color: color.muted },
  label: { fontSize: 15, fontWeight: '600', color: color.ink },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  input: { minHeight: 46, borderRadius: 9, borderWidth: 1, borderColor: '#859485', paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: color.ink, backgroundColor: '#FFFFFF' },
  action: { minHeight: 44, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  primary: { backgroundColor: color.green }, quiet: { backgroundColor: color.pale },
  divider: { borderBottomWidth: 1, borderBottomColor: color.line },
});
export function Action({ label, onPress, primary, disabled, selected }: { label: string; onPress: () => void; primary?: boolean; disabled?: boolean; selected?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled, selected }} disabled={disabled} onPress={onPress}
    style={({ pressed }) => [s.action, primary ? s.primary : s.quiet, { opacity: disabled ? 0.55 : pressed ? 0.75 : 1 }]}>
    <Text style={[s.label, { color: primary ? '#FFFFFF' : color.green }]}>{label}</Text>
  </Pressable>;
}

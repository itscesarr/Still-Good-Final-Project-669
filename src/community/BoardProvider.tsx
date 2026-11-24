import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { Text, View } from 'react-native';
import { initialBoard, type Board } from './data';

const key = 'still-good:community:v1';
type Context = { board: Board; setBoard: Dispatch<SetStateAction<Board>> };
const Community = createContext<Context | null>(null);

export function BoardProvider({ children }: { children: ReactNode }) {
  const [board, setBoard] = useState(initialBoard);
  const [ready, setReady] = useState(false);
  const [warning, setWarning] = useState('');
  const writes = useRef(Promise.resolve());
  const previous = useRef(initialBoard);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const saved = await AsyncStorage.getItem(key);
        if (active && saved) {
          const parsed = JSON.parse(saved) as Board;
          if (!Array.isArray(parsed.posts) || !Array.isArray(parsed.liked) || !parsed.chats) throw Error();
          previous.current = parsed;
          setBoard(parsed);
        }
      } catch {
        if (active) setWarning('Saved activity could not be loaded.');
      } finally {
        if (active) setReady(true);
      }
    }
    void load();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!ready || previous.current === board) return;
    previous.current = board;
    writes.current = writes.current.then(() => AsyncStorage.setItem(key, JSON.stringify(board)))
      .then(() => setWarning('')).catch(() => setWarning('Changes are available for this session. Saving failed.'));
  }, [board, ready]);

  if (!ready) return <View><Text>Loading community…</Text></View>;
  return <Community.Provider value={{ board, setBoard }}>
    {warning ? <Text accessibilityRole="alert">{warning}</Text> : null}{children}
  </Community.Provider>;
}
export function useBoard() {
  const value = useContext(Community);
  if (!value) throw Error('Community screens require BoardProvider');
  return value;
}

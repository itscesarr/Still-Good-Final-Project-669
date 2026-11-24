export type Kind = 'Ingredient' | 'Recipe';
export type Post = {
  id: string; kind: Kind; title: string; ingredients: string;
  details: string; pickup: string; author: string; authorId: string; likes: number;
};
export type Message = { id: string; text: string; sentAt: number };
export type Board = { posts: Post[]; liked: string[]; chats: Record<string, Message[]> };
export const viewer = { author: 'Hao', authorId: 'hao' };

export const initialBoard: Board = {
  posts: [
    { id: 'garden-mint', kind: 'Ingredient', title: 'A handful of garden mint', ingredients: 'Mint', details: 'My balcony mint has outgrown its pot. I have two small bunches to share if anyone is making tea or a salad.', pickup: 'Kerrytown Farmers Market', author: 'Nora', authorId: 'nora', likes: 3 },
    { id: 'tomato-toast', kind: 'Recipe', title: 'Tomato toast for two', ingredients: 'Tomato, sourdough, olive oil', details: 'Toast two thick slices of bread. Rub with a cut tomato, add olive oil and a pinch of salt, and eat while warm.', pickup: '', author: 'Eli', authorId: 'eli', likes: 5 },
    { id: 'lemons', kind: 'Ingredient', title: 'Three extra lemons', ingredients: 'Lemon', details: 'I bought a bag for baking and have three whole lemons left. Happy to split them.', pickup: 'West Park entrance', author: 'Maya', authorId: 'maya', likes: 1 },
  ],
  liked: [], chats: {},
};

export function newId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
}

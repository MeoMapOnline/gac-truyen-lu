export interface User {
  id: number;
  encrypted_yw_id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'author' | 'admin';
  gold_balance: number;
  coin_balance: number;
  unlockedChapters: number[]; // IDs of unlocked chapters
}

export interface Chapter {
  id: number;
  story_id: number;
  title: string;
  content: string;
  chapter_order: number;
  price: number;
  view_count: number;
  created_at: string;
  isLocked?: boolean; // Frontend computed
}

export interface Story {
  id: number;
  title: string;
  author: string;
  cover: string;
  description: string;
  tags: string[];
  status: 'ongoing' | 'completed';
  view_count: number;
  chapters: Chapter[];
  rating?: number; // Optional/Mock for now
}

export interface Comment {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

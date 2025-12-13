import { create } from 'zustand';
import { Story } from '../types';

interface StoryState {
  stories: Story[];
  currentStory: Story | null;
  isLoading: boolean;
  fetchStories: () => Promise<void>;
  fetchStoryById: (id: string) => Promise<void>;
  incrementView: (storyId: string) => void;
}

const API_URL = 'gac-truyen-lu.moralie0789.workers.dev';

export const useStoryStore = create<StoryState>((set) => ({
  stories: [],
  currentStory: null,
  isLoading: false,

  fetchStories: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_URL}/stories`);
      const stories = await res.json();
      set({ stories, isLoading: false });
    } catch (error) {
      console.error('Fetch stories failed:', error);
      set({ isLoading: false });
    }
  },

  fetchStoryById: async (id) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_URL}/stories/${id}`);
      const story = await res.json();
      set({ currentStory: story, isLoading: false });
    } catch (error) {
      console.error('Fetch story failed:', error);
      set({ isLoading: false });
    }
  },

  incrementView: async (storyId) => {
    // Optimistic update
    set((state) => ({
      stories: state.stories.map((s) =>
        String(s.id) === String(storyId) ? { ...s, view_count: s.view_count + 1 } : s
      ),
      currentStory: state.currentStory && String(state.currentStory.id) === String(storyId) 
        ? { ...state.currentStory, view_count: state.currentStory.view_count + 1 } 
        : state.currentStory
    }));
    
    try {
      await fetch(`${API_URL}/stories/${storyId}/view`, { method: 'POST' });
    } catch (error) {
      console.error('Increment view failed:', error);
    }
  },
}));

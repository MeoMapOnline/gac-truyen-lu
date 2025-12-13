import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MobileLayout } from './components/layout/MobileLayout';
import { Home } from './pages/Home';
import { StoryDetail } from './pages/StoryDetail';
import { ReadChapter } from './pages/ReadChapter';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MobileLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/bookshelf" element={<div className="p-4 text-center text-gray-500 mt-10">Tủ sách đang phát triển...</div>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
        
        <Route path="/story/:id" element={<StoryDetail />} />
        <Route path="/read/:storyId/:chapterId" element={<ReadChapter />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

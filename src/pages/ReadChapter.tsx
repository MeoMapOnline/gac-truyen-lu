import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Settings, MessageSquare, Menu } from 'lucide-react';
import { useStoryStore } from '../store/useStoryStore';
import { useAuthStore } from '../store/useAuthStore';

export const ReadChapter: React.FC = () => {
  const { storyId, chapterId } = useParams<{ storyId: string; chapterId: string }>();
  const navigate = useNavigate();
  const { currentStory, fetchStoryById, incrementView } = useStoryStore();
  const { user } = useAuthStore();
  const [chapter, setChapter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (storyId && !currentStory) {
      fetchStoryById(storyId);
    }
  }, [storyId, currentStory, fetchStoryById]);

  useEffect(() => {
    const fetchChapter = async () => {
      if (!chapterId) return;
      setLoading(true);
      try {
        const res = await fetch(`https://backend.youware.com/api/chapters/${chapterId}`, {
          headers: {
            // The browser automatically sends X-Encrypted-Yw-ID if we are in the platform
            // But we can't manually set it easily if we are just fetching.
            // However, the backend relies on the header injected by the proxy.
            // So a simple fetch should work if the user is logged in via platform.
          }
        });
        
        if (res.status === 403) {
          // Locked
          alert('Chương này đã bị khóa. Vui lòng mở khóa để đọc.');
          navigate(`/story/${storyId}`);
          return;
        }
        
        const data = await res.json();
        setChapter(data);
      } catch (error) {
        console.error('Failed to fetch chapter', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [chapterId, storyId, navigate]);

  useEffect(() => {
    if (storyId) {
      incrementView(storyId);
    }
  }, [storyId, incrementView]);

  if (loading) return <div className="p-10 text-center">Đang tải nội dung...</div>;
  if (!chapter) return <div className="p-10 text-center">Không tìm thấy chương</div>;

  // Find next/prev chapter
  const currentIndex = currentStory?.chapters?.findIndex(c => String(c.id) === String(chapterId));
  const prevChapter = currentIndex !== undefined && currentIndex > 0 ? currentStory?.chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex !== undefined && currentIndex < (currentStory?.chapters?.length || 0) - 1 ? currentStory?.chapters[currentIndex + 1] : null;

  const handleNext = () => {
    if (nextChapter) {
      navigate(`/read/${storyId}/${nextChapter.id}`);
    } else {
      alert('Đã hết chương!');
    }
  };

  const handlePrev = () => {
    if (prevChapter) {
      navigate(`/read/${storyId}/${prevChapter.id}`);
    }
  };

  return (
    <div className="bg-[#F8F4E9] min-h-screen text-gray-800">
      {/* Reader Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur shadow-sm px-4 py-3 flex justify-between items-center z-40 pt-safe-top">
        <div className="flex items-center">
          <button onClick={() => navigate(`/story/${storyId}`)} className="mr-3">
            <ChevronLeft size={24} />
          </button>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">{currentStory?.title}</span>
            <span className="text-sm font-bold">{chapter.title}</span>
          </div>
        </div>
        <div className="flex space-x-4 text-gray-600">
          <Settings size={20} />
          <Menu size={20} />
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-24 pb-20 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8 font-serif">{chapter.title}</h1>
        <div className="prose prose-lg prose-p:indent-8 prose-p:text-justify font-serif leading-loose">
          {chapter.content.split('\n').map((para: string, idx: number) => (
            <p key={idx} className="mb-4">{para}</p>
          ))}
        </div>
      </div>

      {/* Reader Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 pb-safe-bottom flex justify-between items-center z-40">
        <button 
          onClick={handlePrev}
          disabled={!prevChapter}
          className={`text-gray-400 ${!prevChapter ? 'opacity-50' : 'hover:text-primary'}`}
        >
          Chương trước
        </button>
        <div className="flex items-center space-x-2 text-gray-500">
          <MessageSquare size={20} />
          <span className="text-xs">12</span>
        </div>
        <button 
          onClick={handleNext}
          disabled={!nextChapter}
          className={`font-medium ${!nextChapter ? 'text-gray-400 opacity-50' : 'text-primary'}`}
        >
          Chương sau
        </button>
      </div>
    </div>
  );
};

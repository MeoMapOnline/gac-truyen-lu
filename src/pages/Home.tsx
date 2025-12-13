import React, { useEffect, useState } from 'react';
import { Search, Bell, Trophy, Flame, Clock, Book, User, PenTool, Gift } from 'lucide-react';
import { useStoryStore } from '../store/useStoryStore';
import { StoryCard } from '../components/StoryCard';
import { Story } from '../types';

export const Home: React.FC = () => {
  const { stories, fetchStories, isLoading } = useStoryStore();
  const [filter, setFilter] = useState<string>('all');
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredStories(stories);
    } else if (filter === 'completed') {
      setFilteredStories(stories.filter(s => s.status === 'completed'));
    } else if (filter === 'exclusive') {
      // Mock exclusive logic
      setFilteredStories(stories.filter(s => s.tags?.includes('Độc Quyền')));
    } else if (filter === 'free') {
      // Mock free logic (all chapters price 0)
      setFilteredStories(stories.filter(s => s.chapters?.every(c => c.price === 0)));
    } else {
      setFilteredStories(stories);
    }
  }, [filter, stories]);

  const handleQuickAction = (action: string) => {
    if (action === 'compose') {
      alert('Tính năng Sáng Tác đang được phát triển!');
      return;
    }
    if (action === 'request') {
      alert('Tính năng Yêu Cầu đang được phát triển!');
      return;
    }
    setFilter(action);
  };

  return (
    <div className="bg-gray-50 min-h-full pb-20">
      {/* Header */}
      <header className="bg-teal-400 text-white pt-safe-top px-4 pb-4 sticky top-0 z-40 shadow-md">
        <div className="flex justify-between items-center mb-4 mt-2">
          <h1 className="text-xl font-bold">Gác Truyện Lú</h1>
          <div className="flex space-x-4">
            <Search size={24} />
            <Bell size={24} />
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-5 gap-2 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
          <div onClick={() => handleQuickAction('completed')} className="flex flex-col items-center justify-center text-white active:scale-95 transition-transform cursor-pointer">
            <div className="bg-white/20 p-2 rounded-full mb-1"><Book size={20} /></div>
            <span className="text-[10px] text-center leading-tight">Hoàn Thành</span>
          </div>
          <div onClick={() => handleQuickAction('request')} className="flex flex-col items-center justify-center text-white active:scale-95 transition-transform cursor-pointer">
            <div className="bg-white/20 p-2 rounded-full mb-1"><User size={20} /></div>
            <span className="text-[10px] text-center leading-tight">Yêu Cầu</span>
          </div>
          <div onClick={() => handleQuickAction('compose')} className="flex flex-col items-center justify-center text-white active:scale-95 transition-transform cursor-pointer">
            <div className="bg-white/20 p-2 rounded-full mb-1"><PenTool size={20} /></div>
            <span className="text-[10px] text-center leading-tight">Sáng Tác</span>
          </div>
          <div onClick={() => handleQuickAction('exclusive')} className="flex flex-col items-center justify-center text-white active:scale-95 transition-transform cursor-pointer">
            <div className="bg-white/20 p-2 rounded-full mb-1"><Trophy size={20} /></div>
            <span className="text-[10px] text-center leading-tight">Độc Quyền</span>
          </div>
          <div onClick={() => handleQuickAction('free')} className="flex flex-col items-center justify-center text-white active:scale-95 transition-transform cursor-pointer">
            <div className="bg-white/20 p-2 rounded-full mb-1"><Clock size={20} /></div>
            <span className="text-[10px] text-center leading-tight">Miễn Phí</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-6">
        {isLoading ? (
          <div className="text-center py-10 text-gray-500">Đang tải truyện...</div>
        ) : (
          <>
            {/* Featured Section */}
            <section>
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-gray-800 flex items-center">
                  <Flame size={18} className="text-orange-500 mr-1" />
                  {filter === 'all' ? 'Thành Viên Bố Cáo' : `Danh sách: ${filter}`}
                </h2>
                <span className="text-xs text-gray-500" onClick={() => setFilter('all')}>Xem tất cả</span>
              </div>
              <div className="flex overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                {filteredStories.map(story => (
                  <StoryCard key={story.id} story={story} variant="vertical" />
                ))}
                {filteredStories.length === 0 && (
                  <div className="text-sm text-gray-400 italic w-full text-center py-4">Không có truyện nào</div>
                )}
              </div>
            </section>

            {/* New Updates */}
            <section>
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-gray-800 flex items-center">
                  <Clock size={18} className="text-blue-500 mr-1" />
                  Mới Cập Nhật
                </h2>
              </div>
              <div className="space-y-1">
                {stories.map(story => (
                  <StoryCard key={`list-${story.id}`} story={story} variant="horizontal" />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

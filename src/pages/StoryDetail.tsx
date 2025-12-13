import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, MoreHorizontal, Star, Eye, List, Lock, User as UserIcon } from 'lucide-react';
import { useStoryStore } from '../store/useStoryStore';
import { useAuthStore } from '../store/useAuthStore';

export const StoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentStory, fetchStoryById, isLoading } = useStoryStore();
  const { user, unlockChapter } = useAuthStore();
  const [showUnlockModal, setShowUnlockModal] = useState<number | null>(null);
  const [unlockPrice, setUnlockPrice] = useState<number>(0);

  useEffect(() => {
    if (id) {
      fetchStoryById(id);
    }
  }, [id, fetchStoryById]);

  if (isLoading || !currentStory) return <div className="p-10 text-center">Đang tải...</div>;

  const handleChapterClick = (chapterId: number, isLocked: boolean, price: number) => {
    const isUnlocked = user?.unlockedChapters?.some(id => Number(id) === Number(chapterId));
    
    if (!isLocked || isUnlocked) {
      navigate(`/read/${currentStory.id}/${chapterId}`);
    } else {
      setUnlockPrice(price);
      setShowUnlockModal(chapterId);
    }
  };

  const handleUnlock = async (chapterId: number, price: number) => {
    if (!user) {
      alert('Vui lòng đăng nhập để mở khóa!');
      navigate('/profile');
      return;
    }
    
    const success = await unlockChapter(String(chapterId), price);
    if (success) {
      setShowUnlockModal(null);
      navigate(`/read/${currentStory.id}/${chapterId}`);
    } else {
      alert('Số dư không đủ! Vui lòng nạp thêm.');
    }
  };

  return (
    <div className="bg-white min-h-full pb-20">
      {/* Header Image */}
      <div className="relative h-64">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
        <img src={currentStory.cover} alt={currentStory.title} className="w-full h-full object-cover" />
        
        {/* Navbar */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-safe-top z-20 flex justify-between text-white">
          <button onClick={() => navigate(-1)} className="bg-black/30 p-2 rounded-full backdrop-blur-md">
            <ChevronLeft size={24} />
          </button>
          <div className="flex space-x-3">
            <button className="bg-black/30 p-2 rounded-full backdrop-blur-md">
              <Share2 size={24} />
            </button>
            <button className="bg-black/30 p-2 rounded-full backdrop-blur-md">
              <MoreHorizontal size={24} />
            </button>
          </div>
        </div>

        {/* Story Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
          <h1 className="text-xl font-bold mb-2 line-clamp-2">{currentStory.title}</h1>
          <div className="flex items-center text-sm text-gray-300 mb-2">
            <UserIcon size={14} className="mr-1" />
            {currentStory.author}
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center text-yellow-400">
              <Star size={14} className="fill-current mr-1" />
              {currentStory.rating || 5.0}
            </div>
            <div className="flex items-center">
              <Eye size={14} className="mr-1" />
              {currentStory.view_count.toLocaleString()}
            </div>
            <div className="flex items-center">
              <List size={14} className="mr-1" />
              {currentStory.chapters?.length || 0} chương
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 sticky top-0 bg-white z-30">
        <button className="flex-1 py-3 text-sm font-medium text-primary border-b-2 border-primary">
          Giới Thiệu
        </button>
        <button className="flex-1 py-3 text-sm font-medium text-gray-500">
          D.S. Chương
        </button>
        <button className="flex-1 py-3 text-sm font-medium text-gray-500">
          Bình Luận
        </button>
      </div>

      {/* Description */}
      <div className="p-4">
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
          {currentStory.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {currentStory.tags?.map(tag => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Chapter List */}
      <div className="px-4 mt-2">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-800">Chương Mới Nhất</h3>
          <span className="text-xs text-primary">Xem tất cả</span>
        </div>
        <div className="border rounded-lg overflow-hidden">
          {currentStory.chapters?.map((chapter) => {
            const isUnlocked = user?.unlockedChapters?.some(id => Number(id) === Number(chapter.id));
            const isLocked = chapter.price > 0 && !isUnlocked;

            return (
              <div 
                key={chapter.id}
                onClick={() => handleChapterClick(chapter.id, isLocked, chapter.price)}
                className={`p-3 border-b last:border-b-0 flex justify-between items-center active:bg-gray-50 ${
                  isLocked ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isLocked ? 'text-gray-500' : 'text-gray-800'}`}>
                    {chapter.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(chapter.created_at).toLocaleDateString()}
                  </p>
                </div>
                {isLocked && (
                  <div className="flex items-center text-yellow-600 text-xs font-medium bg-yellow-50 px-2 py-1 rounded-full">
                    <Lock size={12} className="mr-1" />
                    {chapter.price} Xu
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Unlock Modal */}
      {showUnlockModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-teal-50 p-4 border-b border-teal-100 text-center">
              <h3 className="font-bold text-teal-800">Mở Khóa Chương VIP</h3>
            </div>
            <div className="p-6">
              <p className="text-center text-gray-600 mb-6">
                Bạn cần ủng hộ <span className="font-bold text-yellow-600">{unlockPrice} Xu</span> để đọc chương này
              </p>
              
              <div className="space-y-3 text-xs text-gray-500 mb-6">
                <p className="flex items-start">
                  <span className="mr-2">👉</span>
                  Bạn có thể xem chương này không giới hạn số lần
                </p>
                <p className="flex items-start">
                  <span className="mr-2">👉</span>
                  Hệ thống chỉ trừ Xu khi xem lần đầu tiên
                </p>
              </div>

              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowUnlockModal(null)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-600 font-medium text-sm"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => handleUnlock(showUnlockModal, unlockPrice)}
                  className="flex-1 py-2.5 bg-primary text-white rounded-lg font-medium text-sm shadow-lg shadow-primary/30"
                >
                  Mở Khóa Ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

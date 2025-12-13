import React from 'react';
import { Star, Eye, Book, User } from 'lucide-react';
import { Story } from '../types';
import { useNavigate } from 'react-router-dom';

interface StoryCardProps {
  story: Story;
  variant?: 'vertical' | 'horizontal';
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, variant = 'vertical' }) => {
  const navigate = useNavigate();

  if (variant === 'horizontal') {
    return (
      <div 
        onClick={() => navigate(`/story/${story.id}`)}
        className="flex space-x-3 bg-white p-3 rounded-lg shadow-sm mb-3 active:scale-95 transition-transform"
      >
        <img 
          src={story.cover} 
          alt={story.title} 
          className="w-20 h-28 object-cover rounded-md flex-shrink-0"
        />
        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
          <div>
            <h3 className="font-bold text-gray-900 line-clamp-2 text-sm mb-1">{story.title}</h3>
            <div className="flex items-center text-xs text-gray-500 mb-2">
              <span className="flex items-center mr-3">
                <User size={12} className="mr-1" />
                {story.author}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center text-yellow-500">
              <Star size={12} className="mr-1 fill-current" />
              {story.rating || 5.0}
            </span>
            <span className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
              {story.tags?.[0] || 'Truyện'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => navigate(`/story/${story.id}`)}
      className="flex flex-col w-28 mr-3 flex-shrink-0 active:scale-95 transition-transform"
    >
      <div className="relative mb-2">
        <img 
          src={story.cover} 
          alt={story.title} 
          className="w-28 h-40 object-cover rounded-lg shadow-sm"
        />
        <div className="absolute top-1 right-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center">
          <Star size={8} className="mr-0.5 fill-current" />
          {story.rating || 5.0}
        </div>
      </div>
      <h3 className="font-medium text-gray-900 text-xs line-clamp-2 h-8">{story.title}</h3>
      <p className="text-[10px] text-gray-500 mt-0.5 truncate">{story.author}</p>
    </div>
  );
};

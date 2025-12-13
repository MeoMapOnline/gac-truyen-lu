import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, User, Menu } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const MobileLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-full h-dvh bg-gray-50 flex flex-col">
      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden w-full relative" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="min-h-full pb-20"> {/* Padding for bottom nav */}
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe-bottom z-50">
        <div className="flex justify-around items-center h-16 px-2">
          <button
            onClick={() => navigate('/')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              isActive('/') ? 'text-primary' : 'text-gray-500'
            }`}
          >
            <Home size={24} />
            <span className="text-xs font-medium">Trang Chủ</span>
          </button>

          <button
            onClick={() => navigate('/bookshelf')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              isActive('/bookshelf') ? 'text-primary' : 'text-gray-500'
            }`}
          >
            <BookOpen size={24} />
            <span className="text-xs font-medium">Tủ Sách</span>
          </button>

          <button
            onClick={() => navigate('/profile')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              isActive('/profile') ? 'text-primary' : 'text-gray-500'
            }`}
          >
            <User size={24} />
            <span className="text-xs font-medium">Cá Nhân</span>
          </button>
          
          {user?.role === 'admin' && (
             <button
             onClick={() => navigate('/admin')}
             className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
               isActive('/admin') ? 'text-primary' : 'text-gray-500'
             }`}
           >
             <Menu size={24} />
             <span className="text-xs font-medium">Quản Trị</span>
           </button>
          )}
        </div>
      </nav>
    </div>
  );
};

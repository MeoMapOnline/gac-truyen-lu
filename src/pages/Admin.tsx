import React from 'react';
import { BarChart3, Users, BookOpen, DollarSign, Settings } from 'lucide-react';

export const Admin: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-full pb-20">
      <header className="bg-white p-4 pt-safe-top border-b sticky top-0 z-40">
        <h1 className="text-xl font-bold text-gray-800">Quản Trị Hệ Thống</h1>
      </header>

      <div className="p-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-xs">Doanh thu hôm nay</span>
              <DollarSign size={16} className="text-green-500" />
            </div>
            <p className="text-xl font-bold">2,500,000 ₫</p>
            <span className="text-xs text-green-500">+12% so với hôm qua</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-xs">Người dùng mới</span>
              <Users size={16} className="text-blue-500" />
            </div>
            <p className="text-xl font-bold">128</p>
            <span className="text-xs text-green-500">+5% so với hôm qua</span>
          </div>
        </div>

        {/* Charts Placeholder */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Biểu đồ doanh thu</h3>
            <BarChart3 size={20} className="text-gray-400" />
          </div>
          <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            [Biểu đồ trực quan sẽ hiển thị ở đây]
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b font-bold text-gray-800">Quản lý</div>
          <div className="divide-y">
            <div className="p-4 flex justify-between items-center active:bg-gray-50">
              <div className="flex items-center space-x-3">
                <BookOpen size={20} className="text-orange-500" />
                <span>Duyệt truyện mới</span>
              </div>
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">5</span>
            </div>
            <div className="p-4 flex justify-between items-center active:bg-gray-50">
              <div className="flex items-center space-x-3">
                <DollarSign size={20} className="text-green-500" />
                <span>Yêu cầu rút tiền</span>
              </div>
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">2</span>
            </div>
            <div className="p-4 flex justify-between items-center active:bg-gray-50">
              <div className="flex items-center space-x-3">
                <Users size={20} className="text-blue-500" />
                <span>Quản lý người dùng</span>
              </div>
            </div>
            <div className="p-4 flex justify-between items-center active:bg-gray-50">
              <div className="flex items-center space-x-3">
                <Settings size={20} className="text-gray-500" />
                <span>Cấu hình hệ thống</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

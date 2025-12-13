import React, { useEffect, useState } from 'react';
import { 
  Settings, Info, CloudUpload, Library, MessageSquare, Gift, Target, 
  ShoppingBag, Banknote, Users, LogOut, ChevronRight, Headphones, 
  FileText, Star, Trash2, User as UserIcon, Copy, X 
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

// Simple JWT decode
function parseJwt (token: string) {
    try {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return {};
    }
}

export const Profile: React.FC = () => {
  const { user, isAuthenticated, loginWithGoogle, logout, deposit } = useAuthStore();
  const [showDepositModal, setShowDepositModal] = useState(false);

  // Load Google Script
  useEffect(() => {
    if (!isAuthenticated) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      
      script.onload = () => {
        // @ts-ignore
        if (window.google) {
          // @ts-ignore
          window.google.accounts.id.initialize({
            client_id: '147892204264-ddg59379fbja4rdr0botsufhoqfr45vb.apps.googleusercontent.com',
            callback: (response: any) => {
              console.log('Google response:', response);
              const userInfo = parseJwt(response.credential);
              loginWithGoogle(response.credential, userInfo);
            }
          });
          // @ts-ignore
          window.google.accounts.id.renderButton(
            document.getElementById('google-signin-btn'),
            { theme: 'outline', size: 'large', width: '100%' }
          );
        }
      };

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [isAuthenticated, loginWithGoogle]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
        <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-6">
          <UserIcon size={40} className="text-teal-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Gác Truyện Lú</h1>
        <p className="text-gray-500 mb-8 text-center">Đăng nhập để tiếp tục đọc truyện và quản lý tài khoản của bạn</p>
        
        <div id="google-signin-btn" className="w-full mb-4 min-h-[40px]"></div>
      </div>
    );
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Đã sao chép: ' + text);
  };

  const menuItems = [
    { icon: <CloudUpload size={20} className="text-blue-500" />, label: 'Đăng truyện', count: null },
    { icon: <Library size={20} className="text-orange-500" />, label: 'Quản Lý Truyện', count: 2 },
    { icon: <MessageSquare size={20} className="text-blue-400" />, label: 'Bình luận', count: null },
    { icon: <Gift size={20} className="text-yellow-500" />, label: 'Event', count: null },
    { icon: <Target size={20} className="text-purple-500" />, label: 'Nhiệm vụ', count: 20 },
    { icon: <ShoppingBag size={20} className="text-brown-500" />, label: 'Cửa hàng', count: null },
    { icon: <Banknote size={20} className="text-green-500" />, label: 'Nạp vàng', action: () => setShowDepositModal(true) },
    { icon: <Banknote size={20} className="text-red-500" />, label: 'Rút tiền', count: null },
    { icon: <Users size={20} className="text-teal-600" />, label: 'Thành Viên', count: null },
    { icon: <LogOut size={20} className="text-red-500" />, label: 'Đăng Xuất', action: logout },
  ];

  return (
    <div className="bg-gray-100 min-h-full pb-24">
      {/* Header Profile */}
      <div className="bg-gray-800 text-white p-6 pt-safe-top pb-16 relative">
        <div className="absolute top-safe-top right-4 flex flex-col space-y-3">
          <button className="bg-teal-400 p-2 rounded-full shadow-lg"><Info size={20} /></button>
          <button className="bg-teal-400 p-2 rounded-full shadow-lg"><Settings size={20} /></button>
        </div>
        
        <div className="flex items-center space-x-4 mt-4">
          <img src={user?.avatar} alt={user?.name} className="w-16 h-16 rounded-full border-2 border-gray-600 object-cover" />
          <div>
            <h2 className="font-bold text-lg">{user?.name}</h2>
            <p className="text-gray-400 text-xs">{user?.email}</p>
            <p className="text-gray-500 text-xs mt-1">ID thành viên: {user?.id}</p>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="mx-4 -mt-8 bg-gradient-to-r from-[#E6C88B] to-[#F5E1B5] rounded-xl p-3 shadow-lg relative z-10 text-brown-900 mb-6">
        <div className="flex justify-between text-center divide-x divide-brown-900/20">
          <div className="flex-1 py-1">
            <p className="text-xl font-bold text-brown-900">{user?.gold_balance}</p>
            <p className="text-xs font-medium uppercase opacity-70">Vàng</p>
          </div>
          <div className="flex-1 py-1">
            <p className="text-xl font-bold text-brown-900">{user?.coin_balance}</p>
            <p className="text-xs font-medium uppercase opacity-70">Ánh Kim</p>
          </div>
        </div>
      </div>

      {/* Account Menu */}
      <div className="px-4 space-y-6">
        <div>
          <h3 className="text-xs font-medium text-gray-500 mb-2 uppercase ml-1">Tài khoản</h3>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            {menuItems.map((item, idx) => (
              <div 
                key={idx}
                onClick={item.action}
                className="flex items-center justify-between p-3.5 border-b border-gray-100 last:border-b-0 active:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg ${item.label === 'Đăng Xuất' ? 'bg-red-50' : 'bg-gray-50'} flex items-center justify-center`}>
                    {item.icon}
                  </div>
                  <span className={`text-sm font-medium ${item.label === 'Đăng Xuất' ? 'text-red-500' : 'text-gray-700'}`}>
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.count && (
                    <span className="bg-gray-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {item.count}
                    </span>
                  )}
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="text-xs font-medium text-gray-500 mb-2 uppercase ml-1">Hỗ trợ</h3>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-3.5 active:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <Headphones size={20} className="text-green-500" />
                </div>
                <span className="text-sm font-medium text-gray-700">Liên hệ hỗ trợ</span>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          </div>
        </div>

        {/* App Section */}
        <div>
          <h3 className="text-xs font-medium text-gray-500 mb-2 uppercase ml-1">Ứng dụng</h3>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-3.5 border-b border-gray-100 active:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Info size={20} className="text-blue-500" />
                </div>
                <span className="text-sm font-medium text-gray-700">Về chúng tôi</span>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </div>
            <div className="flex items-center justify-between p-3.5 border-b border-gray-100 active:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                  <FileText size={20} className="text-gray-500" />
                </div>
                <span className="text-sm font-medium text-gray-700">Terms of Service</span>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </div>
            <div className="flex items-center justify-between p-3.5 active:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
                  <Star size={20} className="text-yellow-500" />
                </div>
                <span className="text-sm font-medium text-gray-700">Đánh giá app 5 sao</span>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          </div>
        </div>

        {/* Delete Account */}
        <button className="w-full bg-red-500 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2 active:bg-red-600 transition-colors">
          <Trash2 size={18} />
          <span>Xoá tài khoản</span>
        </button>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-gray-800">Nạp Vàng</h3>
              <button onClick={() => setShowDepositModal(false)}><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <p className="text-sm text-green-800 font-medium mb-2">Thông tin chuyển khoản:</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ngân hàng:</span>
                    <span className="font-bold">Vietcombank</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Số tài khoản:</span>
                    <div className="flex items-center">
                      <span className="font-bold mr-2">1027269399</span>
                      <Copy size={14} className="text-gray-400 cursor-pointer" onClick={() => handleCopy('1027269399')} />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Nội dung:</span>
                    <div className="flex items-center">
                      <span className="font-bold text-blue-600 mr-2">NAP {user?.id}</span>
                      <Copy size={14} className="text-gray-400 cursor-pointer" onClick={() => handleCopy(`NAP ${user?.id}`)} />
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                Vui lòng chuyển khoản đúng nội dung để hệ thống tự động cộng vàng.
              </p>

              <button 
                onClick={() => {
                  deposit(1000); // Mock deposit for MVP
                  alert('Đã gửi yêu cầu nạp tiền! Vui lòng chờ hệ thống xử lý.');
                  setShowDepositModal(false);
                }}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-bold shadow-lg shadow-green-200"
              >
                Tôi đã chuyển khoản
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Card, Button, Input } from './ui/Components';
import { Brain, Eye, EyeOff } from 'lucide-react';

interface AuthScreenProps {
  onLogin: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-[400px] p-8 shadow-md">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-2 mb-8">
          <div className="bg-primary-50 p-3 rounded-xl mb-2">
            <Brain className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold font-heading text-slate-900">KnoLlm</h1>
          <h2 className="text-xl font-semibold text-slate-900">Chào mừng trở lại</h2>
          <p className="text-sm text-slate-500">
            Nhập thông tin để truy cập bộ não thứ hai của bạn
          </p>
        </div>

        {/* Social Login */}
        <div className="space-y-4">
          <Button variant="outline" className="w-full relative" onClick={onLogin}>
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Tiếp tục với Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">HOẶC</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              id="email" 
              label="Email" 
              placeholder="name@example.com" 
              type="email" 
              required
            />
            
            <div className="relative">
               <Input 
                id="password" 
                label="Mật khẩu" 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              isLoading={isLoading}
            >
              Đăng nhập
            </Button>
          </form>

          {/* Footer Links */}
          <div className="flex flex-col space-y-2 text-center text-sm mt-6">
            <a href="#" className="text-primary-600 hover:underline font-medium">
              Chưa có tài khoản? Đăng ký ngay
            </a>
            <a href="#" className="text-slate-500 hover:text-slate-800">
              Quên mật khẩu?
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AuthScreen;
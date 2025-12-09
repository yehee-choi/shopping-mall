'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // localStorage에서 사용자 정보 확인
    const checkUser = () => {
      if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
          } catch (error) {
            localStorage.removeItem('user');
          }
        }
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      // localStorage에서 사용자 정보 삭제
      localStorage.removeItem('user');
      setUser(null);
      
      alert('로그아웃되었습니다.');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-[#1a1a1a] text-white sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 영역 */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-xs">
              ZERBER
            </div>
            <div className="text-sm">
              <div className="text-gray-400">감각적인 디자인과 편리하고 풍요로운 삶을 추구합니다</div>
            </div>
          </Link>

          {/* 검색창 */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="검색어를 입력해주세요"
                className="w-[300px] px-4 py-2 rounded-full bg-[#2a2a2a] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#03C75A]"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            
            {/* 장바구니 아이콘 (항상 표시) */}
  <Link href="/cart" className="hover:text-[#03C75A] transition">
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m10 6v6a1 1 0 01-1 1H9a1 1 0 01-1-1v-6m8 0V9a1 1 0 00-1-1H9a1 1 0 00-1 1v4.01" />
    </svg>
  </Link>
  
            {/* 로그인/로그아웃 영역 */}
            {loading ? (
              <div className="text-sm text-gray-400">로딩중...</div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-300">
  {user.name || user.email}님 안녕하세요!
</span>
                <button
                  onClick={handleLogout}
                  className="text-sm hover:text-[#03C75A] transition"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-sm hover:text-[#03C75A] transition">
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
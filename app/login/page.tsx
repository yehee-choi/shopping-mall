'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  
  // 로그인 정보
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 회원가입 정보
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
  // 로그인
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
if (!res.ok) throw new Error(data.error || '로그인에 실패했습니다.');

// 🎯 프로필 정보도 함께 저장
localStorage.setItem('user', JSON.stringify({ 
  email: email,
  id: data.user?.id,
  name: data.profile?.name || email // API에서 받은 이름 사용
}));
  
  alert('로그인 성공!');
  window.location.href = '/';
} else {
        // 회원가입 유효성 검사
        if (signupPassword !== confirmPassword) {
          throw new Error('비밀번호가 일치하지 않습니다.');
        }
        
        if (signupPassword.length < 6) {
          throw new Error('비밀번호는 6자 이상이어야 합니다.');
        }

        // 회원가입
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: signupEmail, 
            password: signupPassword, 
            name,
            phone,
            birthdate,
            postalCode,
            address,
            detailedAddress
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || '회원가입에 실패했습니다.');
        
        alert('회원가입 성공! 로그인해주세요.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* 로고 */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-gray-900">
            저버코리아
          </Link>
          <p className="mt-2 text-gray-600">
            {isLogin ? '로그인하여 쇼핑을 시작하세요' : '회원가입하고 다양한 혜택을 받으세요'}
          </p>
        </div>

        {/* 탭 */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex gap-4 mb-6 border-b">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`pb-3 px-4 font-medium transition ${
                isLogin
                  ? 'text-[#03C75A] border-b-2 border-[#03C75A]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              로그인
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={`pb-3 px-4 font-medium transition ${
                !isLogin
                  ? 'text-[#03C75A] border-b-2 border-[#03C75A]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              회원가입
            </button>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isLogin ? (
              // 로그인 폼
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03C75A] focus:border-transparent"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03C75A] focus:border-transparent"
                    placeholder="비밀번호 입력"
                  />
                </div>
              </>
            ) : (
              // 회원가입 폼
              <>
                {/* 이메일 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03C75A] focus:border-transparent"
                    placeholder="example@email.com"
                  />
                </div>

                {/* 비밀번호 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    비밀번호 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03C75A] focus:border-transparent"
                    placeholder="6자 이상 입력"
                  />
                </div>

                {/* 비밀번호 확인 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    비밀번호 재확인 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03C75A] focus:border-transparent"
                    placeholder="비밀번호 재입력"
                  />
                  {confirmPassword && signupPassword !== confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">비밀번호가 일치하지 않습니다.</p>
                  )}
                </div>

                {/* 이름 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03C75A] focus:border-transparent"
                    placeholder="홍길동"
                  />
                </div>

                {/* 핸드폰번호 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    핸드폰번호 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03C75A] focus:border-transparent"
                    placeholder="010-1234-5678"
                  />
                </div>

                {/* 생년월일 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    생년월일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03C75A] focus:border-transparent"
                  />
                </div>

                {/* 주소 */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      우편번호 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03C75A] focus:border-transparent"
                      placeholder="12345"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      className="w-full h-12 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                      주소검색
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    주소 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03C75A] focus:border-transparent"
                    placeholder="서울시 강남구 테헤란로 123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    상세주소
                  </label>
                  <input
                    type="text"
                    value={detailedAddress}
                    onChange={(e) => setDetailedAddress(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03C75A] focus:border-transparent"
                    placeholder="101호, 2층 등"
                  />
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#03C75A] text-white py-3 rounded-lg font-medium hover:bg-[#00C73C] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '처리중...' : isLogin ? '로그인' : '회원가입'}
            </button>
          </form>

          {isLogin && (
            <div className="mt-4 text-center">
              <button className="text-sm text-gray-600 hover:text-gray-900">
                비밀번호를 잊으셨나요?
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: number;
  quantity: number;
  created_at: string;
  products: {
    id: number;
    name: string;
    price: number;
    original_price: number | null;
    stock: number;
    product_images: Array<{
      image_url: string;
      is_main: boolean;
    }>;
  };
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      // localStorage에서 사용자 정보 확인
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/login');
        return;
      }

      const user = JSON.parse(userData);

      const res = await fetch(`/api/cart?userId=${user.id}`);
      if (!res.ok) {
        throw new Error('장바구니 조회에 실패했습니다.');
      }

      const data = await res.json();
      setCartItems(data);
    } catch (error) {
      console.error('장바구니 조회 에러:', error);
      alert('장바구니를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      setUpdating(cartItemId);

      const res = await fetch(`/api/cart/${cartItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!res.ok) {
        throw new Error('수량 변경에 실패했습니다.');
      }

      // 로컬 상태 업데이트
      setCartItems(items =>
        items.map(item =>
          item.id === cartItemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error('수량 변경 에러:', error);
      alert('수량 변경에 실패했습니다.');
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (cartItemId: number) => {
    if (!confirm('이 상품을 장바구니에서 제거하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/cart/${cartItemId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('상품 삭제에 실패했습니다.');
      }

      // 로컬 상태에서 제거
      setCartItems(items => items.filter(item => item.id !== cartItemId));
      alert('상품이 장바구니에서 제거되었습니다.');
    } catch (error) {
      console.error('상품 삭제 에러:', error);
      alert('상품 삭제에 실패했습니다.');
    }
  };

  // 총 가격 계산
  const totalAmount = cartItems.reduce((total, item) => {
    return total + (item.products.price * item.quantity);
  }, 0);

  const totalOriginalAmount = cartItems.reduce((total, item) => {
    const originalPrice = item.products.original_price || item.products.price;
    return total + (originalPrice * item.quantity);
  }, 0);

  const totalDiscount = totalOriginalAmount - totalAmount;

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#03C75A]"></div>
          <p className="mt-4 text-gray-600">장바구니를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">장바구니</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m10 6v6a1 1 0 01-1 1H9a1 1 0 01-1-1v-6m8 0V9a1 1 0 00-1-1H9a1 1 0 00-1 1v4.01" />
          </svg>
          <h2 className="text-xl font-medium text-gray-900 mb-2">장바구니가 비어있습니다</h2>
          <p className="text-gray-600 mb-6">원하는 상품을 장바구니에 담아보세요!</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-[#03C75A] text-white rounded-lg hover:bg-[#00C73C] transition"
          >
            쇼핑 계속하기
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 장바구니 상품 목록 */}
          <div className="lg:col-span-2">
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h2 className="font-medium text-gray-900">
                  상품 정보 ({cartItems.length}개)
                </h2>
              </div>

              <div className="divide-y">
                {cartItems.map((item) => {
                  const mainImage = item.products.product_images?.find(img => img.is_main) || item.products.product_images?.[0];
                  const discountRate = item.products.original_price 
                    ? Math.round((1 - item.products.price / item.products.original_price) * 100) 
                    : 0;

                  return (
                    <div key={item.id} className="p-6">
                      <div className="flex gap-4">
                        {/* 상품 이미지 */}
                        <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={mainImage?.image_url || '/placeholder.png'}
                            alt={item.products.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* 상품 정보 */}
                        <div className="flex-1">
                          <Link
                            href={`/product/${item.products.id}`}
                            className="text-gray-900 hover:text-[#03C75A] transition"
                          >
                            <h3 className="font-medium mb-2">{item.products.name}</h3>
                          </Link>

                          {/* 가격 */}
                          <div className="flex items-center gap-2 mb-3">
                            {discountRate > 0 && (
                              <span className="text-lg font-bold text-red-500">{discountRate}%</span>
                            )}
                            <span className="text-lg font-bold text-gray-900">
                              {item.products.price.toLocaleString()}원
                            </span>
                            {item.products.original_price && (
                              <span className="text-gray-400 line-through text-sm">
                                {item.products.original_price.toLocaleString()}원
                              </span>
                            )}
                          </div>

                          {/* 수량 조절 및 삭제 */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={updating === item.id || item.quantity <= 1}
                                className="w-8 h-8 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                -
                              </button>
                              <span className="w-8 text-center text-gray-900">
                                {updating === item.id ? '...' : item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={updating === item.id || item.quantity >= item.products.stock}
                                className="w-8 h-8 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-500 transition"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>

                          {/* 재고 부족 경고 */}
                          {item.quantity > item.products.stock && (
                            <p className="text-red-500 text-sm mt-2">
                              재고가 {item.products.stock}개만 남았습니다.
                            </p>
                          )}
                        </div>

                        {/* 상품별 총 가격 */}
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {(item.products.price * item.quantity).toLocaleString()}원
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 주문 금액 */}
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-lg p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">주문 금액</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>상품금액</span>
                  <span>{totalOriginalAmount.toLocaleString()}원</span>
                </div>
                
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>할인금액</span>
                    <span>-{totalDiscount.toLocaleString()}원</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-600">
                  <span>배송비</span>
                  <span>{totalAmount >= 30000 ? '무료' : '3,000원'}</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>총 결제금액</span>
                    <span className="text-[#03C75A]">
                      {(totalAmount + (totalAmount >= 30000 ? 0 : 3000)).toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full h-12 bg-[#03C75A] text-white rounded-lg font-medium hover:bg-[#00C73C] transition">
                  주문하기
                </button>
                <Link
                  href="/"
                  className="block w-full h-12 border border-gray-300 rounded-lg text-center leading-[48px] text-gray-700 hover:bg-gray-50 transition"
                >
                  쇼핑 계속하기
                </Link>
              </div>

              {totalAmount < 30000 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600">
                    💡 {(30000 - totalAmount).toLocaleString()}원 더 구매하시면 무료배송!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
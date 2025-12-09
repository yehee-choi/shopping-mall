'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ProductDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'detail' | 'review' | 'qna' | 'delivery'>('detail');
  const [loading, setLoading] = useState(false);

  // 샘플 상품 데이터
  const product = {
    id: params.id,
    name: '저버 알람 은온매트 전자파 없는 카본 탄소 매트 침대형 싱글사이즈',
    price: 125000,
    originalPrice: 225000,
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
    description: '전자파 걱정 없는 은온매트로 따뜻하고 건강한 겨울을 보내세요.',
    features: [
      '전자파 ZERO',
      '탄소 발열체 사용',
      '온도 조절 가능',
      '세탁 가능한 커버',
      '1년 무상 A/S',
    ],
    detailImages: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200',
      'https://images.unsplash.com/photo-1616627577184-c5ae5e6d9950?w=1200',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200',
    ],
    specifications: {
      '제조사': '저버코리아',
      '모델명': 'ZB-EM-2024',
      '크기': '100cm x 200cm (싱글)',
      '소비전력': '120W',
      '소재': '탄소섬유 + 폴리에스터',
      '무게': '2.5kg',
      '원산지': '대한민국',
      '인증': 'KC 안전인증',
    },
    reviews: [
      {
        id: 1,
        author: '김**',
        rating: 5,
        date: '2024.03.15',
        content: '전자파 걱정 없이 따뜻하게 잘 쓰고 있어요. 온도 조절도 편리하고 좋습니다!',
        images: [],
      },
      {
        id: 2,
        author: '이**',
        rating: 5,
        date: '2024.03.10',
        content: '가격 대비 성능이 훌륭해요. 빠른 발열이 마음에 듭니다.',
        images: [],
      },
    ],
  };

  const discountRate = Math.round((1 - product.price / product.originalPrice) * 100);
  const totalPrice = product.price * quantity;

  const handleAddToCart = async () => {
  try {
    // localStorage에서 사용자 정보 확인
    const userData = localStorage.getItem('user');
    if (!userData) {
      // 🎯 로그인 안된 경우 안내 후 로그인 페이지로
      const goToLogin = confirm('로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?');
      if (goToLogin) {
        router.push('/login');
      }
      return;
    }

    const user = JSON.parse(userData);
    
    setLoading(true);
    
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        productId: parseInt(product.id),
        quantity: quantity
      }),
    });

    if (!res.ok) {
      throw new Error('장바구니 추가에 실패했습니다.');
    }

    alert('장바구니에 추가되었습니다!');
    
    const goToCart = confirm('장바구니로 이동하시겠습니까?');
    if (goToCart) {
      router.push('/cart');
    }
  } catch (error) {
    console.error('장바구니 추가 에러:', error);
    alert('장바구니 추가에 실패했습니다.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      {/* 상품 기본 정보 */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* 이미지 영역 */}
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* 상품 정보 영역 */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* 가격 정보 */}
          <div className="border-t border-b py-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl font-bold text-red-500">{discountRate}%</span>
              <span className="text-3xl font-bold text-gray-900">
                {product.price.toLocaleString()}원
              </span>
            </div>
            <div className="text-gray-400 line-through text-lg">
              {product.originalPrice.toLocaleString()}원
            </div>
          </div>

          {/* 주요 특징 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">주요 특징</h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5 text-[#03C75A]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* 수량 선택 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">수량</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border rounded-lg hover:bg-gray-100"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 h-10 text-center border rounded-lg"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border rounded-lg hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* 총 금액 */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between text-xl font-bold">
              <span>총 상품금액</span>
              <span className="text-[#03C75A]">{totalPrice.toLocaleString()}원</span>
            </div>
          </div>

          {/* 구매 버튼 */}
          <div className="flex gap-3">
            <button
  onClick={handleAddToCart}
  disabled={loading}
  className="flex-1 h-14 bg-[#03C75A] text-white rounded-lg font-bold hover:bg-[#00C73C] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
>
  {loading ? '추가중...' : '장바구니'}
</button>
            <button className="flex-1 h-14 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition">
              바로구매
            </button>
          </div>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="border-b mb-8">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('detail')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'detail'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            상세정보
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'review'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            리뷰 ({product.reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('qna')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'qna'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Q&A
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'delivery'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            배송/교환/반품
          </button>
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="min-h-[600px]">
        {/* 상세정보 탭 */}
        {activeTab === 'detail' && (
          <div className="space-y-8">
            {/* 상세 이미지들 */}
            <div className="space-y-4">
              {product.detailImages.map((image, index) => (
                <div key={index} className="relative w-full aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`상세 이미지 ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* 제품 사양 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">제품 사양</h3>
              <table className="w-full">
                <tbody>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <tr key={key} className="border-b last:border-b-0">
                      <td className="py-3 font-medium text-gray-700 w-32">{key}</td>
                      <td className="py-3 text-gray-900">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 상세 설명 */}
            <div className="prose max-w-none">
              <h3 className="text-xl font-bold mb-4">상품 상세 설명</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                저버 은온매트는 전자파 걱정 없이 따뜻하고 건강한 겨울을 보낼 수 있도록 설계된 프리미엄 온열매트입니다. 
                탄소 발열체를 사용하여 전자파가 발생하지 않으며, 빠른 발열과 균일한 온도 분포로 최상의 수면 환경을 제공합니다.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                원터치 온도 조절 시스템으로 간편하게 온도를 설정할 수 있으며, 세탁 가능한 커버로 위생적인 관리가 가능합니다. 
                1년 무상 A/S를 제공하여 안심하고 사용하실 수 있습니다.
              </p>
            </div>
          </div>
        )}

        {/* 리뷰 탭 */}
        {activeTab === 'review' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">구매후기 ({product.reviews.length})</h3>
              <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                리뷰 작성하기
              </button>
            </div>

            {product.reviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{review.author}</span>
                  <span className="text-sm text-gray-400">{review.date}</span>
                </div>
                <p className="text-gray-700">{review.content}</p>
                <p className="text-white-500">{review.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* Q&A 탭 */}
        {activeTab === 'qna' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">상품 Q&A</h3>
              <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                문의하기
              </button>
            </div>
            <div className="text-center py-20 text-gray-500">
              아직 등록된 문의가 없습니다.
            </div>
          </div>
        )}

        {/* 배송/교환/반품 탭 */}
        {activeTab === 'delivery' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-4">배송 안내</h3>
              <div className="bg-gray-50 p-6 rounded-lg space-y-2 text-gray-700">
                <p>• 배송비: 무료배송 (제주/도서산간 3,000원 추가)</p>
                <p>• 배송기간: 주문 후 1-2일 이내 출고 (주말/공휴일 제외)</p>
                <p>• 택배사: CJ대한통운</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">교환/반품 안내</h3>
              <div className="bg-gray-50 p-6 rounded-lg space-y-2 text-gray-700">
                <p>• 교환/반품 기간: 수령 후 7일 이내</p>
                <p>• 교환/반품 비용: 왕복 배송비 6,000원 (단순 변심 시)</p>
                <p>• 교환/반품 불가: 개봉 후 사용한 제품, 상품 가치가 훼손된 경우</p>
                <p>• 문의: 고객센터 1588-0000 (평일 09:00-18:00)</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">A/S 안내</h3>
              <div className="bg-gray-50 p-6 rounded-lg space-y-2 text-gray-700">
                <p>• 제조사 보증기간: 1년</p>
                <p>• A/S 접수: 고객센터 또는 제조사 직접 문의</p>
                <p>• 무상 A/S: 정상적인 사용 중 발생한 제품 하자</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
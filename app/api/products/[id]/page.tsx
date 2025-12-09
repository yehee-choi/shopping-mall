'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  stock: number;
  product_images: Array<{
    id: number;
    image_url: string;
    is_main: boolean;
    display_order: number;
  }>;
  product_details: {
    manufacturer: string;
    model_name: string;
    size: string;
    weight: string;
    origin: string;
    specifications: any;
    features: string[];
  } | null;
  categories: {
    name: string;
  } | null;
  reviews: Array<{
    id: number;
    rating: number;
    content: string;
    created_at: string;
    profiles: { name: string } | null;
  }>;
}

export default function ProductDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'detail' | 'review' | 'qna' | 'delivery'>('detail');

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (!res.ok) {
          throw new Error('상품을 찾을 수 없습니다.');
        }
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error('상품 로드 실패:', error);
        alert('상품을 불러올 수 없습니다.');
        router.push('/');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#03C75A]"></div>
          <p className="mt-4 text-gray-600">상품 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="text-center py-20">
          <p className="text-gray-600">상품을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const discountRate = product.original_price 
    ? Math.round((1 - product.price / product.original_price) * 100) 
    : 0;
  const totalPrice = product.price * quantity;
  const mainImage = product.product_images?.find(img => img.is_main) || product.product_images?.[0];

  const handleAddToCart = () => {
    alert('장바구니에 추가되었습니다!');
    router.push('/cart');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* 이미지 영역 */}
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={mainImage?.image_url || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* 상품 정보 영역 */}
        <div className="space-y-6">
          <div>
            <div className="text-sm text-gray-500 mb-2">
              {product.categories?.name}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* 가격 정보 */}
          <div className="border-t border-b py-6">
            <div className="flex items-center gap-3 mb-2">
              {discountRate > 0 && (
                <span className="text-3xl font-bold text-red-500">{discountRate}%</span>
              )}
              <span className="text-3xl font-bold text-gray-900">
                {product.price.toLocaleString()}원
              </span>
            </div>
            {product.original_price && (
              <div className="text-gray-400 line-through text-lg">
                {product.original_price.toLocaleString()}원
              </div>
            )}
          </div>

          {/* 주요 특징 */}
          {product.product_details?.features && (
            <div>
              <h3 className="font-bold text-gray-900 mb-3">주요 특징</h3>
              <ul className="space-y-2">
                {product.product_details.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-[#03C75A]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 재고 정보 */}
          <div className="text-sm text-gray-600">
            재고: <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
              {product.stock > 0 ? `${product.stock}개 남음` : '품절'}
            </span>
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
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                className="w-16 h-10 text-center border rounded-lg"
                max={product.stock}
              />
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
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
              disabled={product.stock === 0}
              className="flex-1 h-14 bg-[#03C75A] text-white rounded-lg font-bold hover:bg-[#00C73C] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {product.stock > 0 ? '장바구니' : '품절'}
            </button>
            <button 
              disabled={product.stock === 0}
              className="flex-1 h-14 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {product.stock > 0 ? '바로구매' : '품절'}
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
            리뷰 ({product.reviews?.length || 0})
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
        {activeTab === 'detail' && (
          <div className="space-y-8">
            {/* 제품 사양 */}
            {product.product_details?.specifications && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">제품 사양</h3>
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.product_details.specifications).map(([key, value]) => (
                      <tr key={key} className="border-b last:border-b-0">
                        <td className="py-3 font-medium text-gray-700 w-32">{key}</td>
                        <td className="py-3 text-gray-900">
  {typeof value === 'string' || typeof value === 'number' 
    ? value 
    : JSON.stringify(value)
  }
</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="prose max-w-none">
              <h3 className="text-xl font-bold mb-4">상품 상세 설명</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description || '상세 설명이 준비 중입니다.'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'review' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">구매후기 ({product.reviews?.length || 0})</h3>
            </div>

            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review) => (
                <div key={review.id} className="border-b pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {review.profiles?.name || '익명'}
                    </span>
                    <span className="text-sm text-gray-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.content}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-gray-500">
                아직 등록된 리뷰가 없습니다.
              </div>
            )}
          </div>
        )}

        {activeTab === 'qna' && (
          <div className="text-center py-20 text-gray-500">
            아직 등록된 문의가 없습니다.
          </div>
        )}

        {activeTab === 'delivery' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-4">배송 안내</h3>
              <div className="bg-gray-50 p-6 rounded-lg space-y-2 text-gray-700">
                <p>• 배송비: 무료배송 (제주/도서산간 3,000원 추가)</p>
                <p>• 배송기간: 주문 후 1-2일 이내 출고</p>
                <p>• 택배사: CJ대한통운</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">교환/반품 안내</h3>
              <div className="bg-gray-50 p-6 rounded-lg space-y-2 text-gray-700">
                <p>• 교환/반품 기간: 수령 후 7일 이내</p>
                <p>• 교환/반품 비용: 왕복 배송비 6,000원 (단순 변심 시)</p>
                <p>• 문의: 고객센터 1588-0000</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
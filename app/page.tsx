'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';

const sortOptions = [
  { label: '인기순', value: 'popular' },
  { label: '최신등록순', value: 'latest' },
  { label: '낮은 가격순', value: 'price_asc' },
  { label: '높은 가격순', value: 'price_desc' },
  { label: '할인율순', value: 'discount_rate' },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [originalProducts, setOriginalProducts] = useState<Product[]>([]);  // 원본 데이터 저장
  const [loading, setLoading] = useState(true);
  const [selectedSort, setSelectedSort] = useState('popular');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setOriginalProducts(data);  // 원본 저장
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  // 정렬 함수
  const sortProducts = (sortType: string) => {
    let sortedProducts = [...originalProducts];

    switch (sortType) {
      case 'popular':
        // 판매량(sold_count) + 조회수(view_count) 기준
        sortedProducts.sort((a, b) => {
          const popularityA = (a.sold_count || 0) + (a.view_count || 0);
          const popularityB = (b.sold_count || 0) + (b.view_count || 0);
          return popularityB - popularityA;
        });
        break;
      
      case 'latest':
        // 최신등록순 (created_at 기준)
        sortedProducts.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      
      case 'price_asc':
        // 낮은 가격순
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      
      case 'price_desc':
        // 높은 가격순
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'discount_rate':
      sortedProducts.sort((a, b) => {
        // 할인율 계산 (original_price가 있는 경우만)
        const discountA = a.original_price && a.original_price > a.price 
          ? ((a.original_price - a.price) / a.original_price) * 100 
          : 0;
        const discountB = b.original_price && b.original_price > b.price 
          ? ((b.original_price - b.price) / b.original_price) * 100 
          : 0;
        return discountB - discountA; // 높은 할인율순
      });
      break;
      // case '': 

      //   break;
      default:
        // 기본: ID 순
        sortedProducts.sort((a, b) => a.id - b.id);
    }

    setProducts(sortedProducts);
  };

  // 정렬 옵션 변경 시
  useEffect(() => {
    if (originalProducts.length > 0) {
      sortProducts(selectedSort);
    }
  }, [selectedSort, originalProducts]);

  // 정렬 버튼 클릭 핸들러
  const handleSortChange = (sortValue: string) => {
    setSelectedSort(sortValue);
  };

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#03C75A]"></div>
          <p className="mt-4 text-gray-600">상품을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center mb-6">전체상품</h2>
        
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`px-4 py-2 text-sm rounded-full transition ${
                selectedSort === option.value
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border hover:border-gray-400'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600">등록된 상품이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              id={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.original_price}
              imageUrl={product.image_url || ''}
            />
          ))}
        </div>
      )}
    </div>
  );
}
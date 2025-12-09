'use client';

import { useState } from 'react';
import ProductCard from '@/components/ProductCard';

// 전체 상품 데이터
const allProducts = [
  {
    id: 1,
    name: '저버 알람 은온매트 전자파 없는 카본 탄소 매트 침대형 싱글사이즈',
    price: 125000,
    originalPrice: 225000,
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
    category: 'digital-heating',
  },
  {
    id: 2,
    name: '저버 오호 우드 선풍기 저소음 인테리어 리모컨선풍기',
    price: 49900,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    category: 'digital-air',
  },
  {
    id: 3,
    name: '저버 에코매트 전기방석 민무늬 전원형 온도 숏캐 전기 매트',
    price: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800',
    category: 'digital-heating',
  },
  {
    id: 4,
    name: '저버 탄소매트 프리미엄 전자파없는 그래핀 슈퍼싱글',
    price: 268000,
    imageUrl: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800',
    category: 'digital-heating',
  },
  {
    id: 5,
    name: '저버 탄소 은온매트 전자파 없는 카본 매트',
    price: 268000,
    imageUrl: 'https://images.unsplash.com/photo-1616627577184-c5ae5e6d9950?w=800',
    category: 'digital-heating',
  },
  {
    id: 6,
    name: '저버 온수매트 퓨어 EMF ZERO 전자파차단',
    price: 189000,
    originalPrice: 289000,
    imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    category: 'digital-heating',
  },
  {
    id: 7,
    name: '저버 미니 온풍기 가정용 사무실 욕실 캠핑용',
    price: 35900,
    imageUrl: 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=800',
    category: 'digital-heating',
  },
  {
    id: 8,
    name: '저버 프리미엄 온수매트 EMF차단 더블',
    price: 329000,
    originalPrice: 429000,
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
    category: 'digital-heating',
  },
];

const categoryNames: { [key: string]: string } = {
  'digital': '디지털/가전',
  'digital-heating': '냉난방기기',
  'digital-air': '공기관리',
  'furniture': '가구/인테리어',
  'furniture-bedroom': '침실가구',
  'furniture-storage': '수납가구',
  'sports': '스포츠/레저',
  'sports-camping': '캠핑용품',
};

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryPath = params.slug;
  const categoryName = categoryNames[categoryPath] || '상품';

  const filteredProducts = allProducts.filter(product => {
    return product.category.startsWith(categoryPath);
  });

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{categoryName}</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}

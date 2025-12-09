import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number | null;
  imageUrl: string;
  badge?: string;
}

export default function ProductCard({ id, name, price, originalPrice, imageUrl, badge }: ProductCardProps) {
  const discountRate = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;

  return (
    <Link href={`/product/${id}`} className="group block">
      <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* 이미지 영역 */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {badge && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              {badge}
            </span>
          )}
        </div>

        {/* 상품 정보 */}
        <div className="p-4">
          <h3 className="text-sm text-gray-800 line-clamp-2 mb-2 leading-relaxed">
            {name}
          </h3>
          
          <div className="flex items-center gap-2">
            {discountRate > 0 && (
              <span className="text-red-500 font-bold text-lg">{discountRate}%</span>
            )}
            <span className="text-lg font-bold text-gray-900">
              {price.toLocaleString()}원
            </span>
          </div>
          
          {originalPrice && (
            <div className="text-sm text-gray-400 line-through mt-1">
              {originalPrice.toLocaleString()}원
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

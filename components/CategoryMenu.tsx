'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CategoryMenu() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const router = useRouter();

  // 드롭다운이 있는 카테고리들
  const dropdownCategories = [
    {
      name: '디지털/가전',
      path: '/category/digital',
      subCategories: [
        { 
          name: '계절가전', 
          path: '/category/digital/seasonal',
          items: [
            { name: '냉난방기기', path: '/category/digital/heating' },
            { name: '공기관리', path: '/category/digital/air' },
          ]
        },
        { 
          name: '주방가전', 
          path: '/category/digital/kitchen',
          items: [
            { name: '선풍기', path: '/category/digital/fan' },
            { name: '전기요/담요/방석', path: '/category/digital/electric-blanket' },
          ]
        },
      ]
    },
    {
      name: '스포츠/레저',
      path: '/category/sports',
      subCategories: [
        { 
          name: '캠핑', 
          path: '/category/sports/camping',
          items: [
            { name: '캠핑용품', path: '/category/sports/camping/equipment' },
            { name: '캠핑가구', path: '/category/sports/camping/furniture' },
          ]
        },
        { 
          name: '운동', 
          path: '/category/sports/exercise',
          items: [
            { name: '운동기구', path: '/category/sports/exercise/equipment' },
            { name: '요가/필라테스', path: '/category/sports/exercise/yoga' },
          ]
        },
      ]
    },
    {
      name: '가구/인테리어',
      path: '/category/furniture',
      subCategories: [
        { 
          name: '가구', 
          path: '/category/furniture/furniture',
          items: [
            { name: '침실가구', path: '/category/furniture/bedroom' },
            { name: '수납가구', path: '/category/furniture/storage' },
          ]
        },
        { 
          name: '인테리어소품', 
          path: '/category/furniture/interior',
          items: [
            { name: '조명', path: '/category/furniture/lighting' },
            { name: '커튼/블라인드', path: '/category/furniture/curtain' },
          ]
        },
      ]
    },
  ];

  // 일반 메뉴들
  const normalMenus = [
    { name: '베스트', path: '/best' },
    { name: '전체상품', path: '/' },
    { name: '블로그', path: '/blog' },
    { name: '공지사항', path: '/notice' },
    { name: '리뷰이벤트', path: '/review-event' },
    { name: '쇼핑스토리', path: '/story' },
    { name: '판매자 정보', path: '/seller-info' },
  ];

  return (
    <nav className="bg-white border-b sticky top-16 z-40">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-center justify-center gap-8 px-4 h-12">
          {/* 베스트 메뉴 */}
          <button 
            onClick={() => router.push(normalMenus[0].path)}
            className="text-sm font-medium text-gray-700 hover:text-[#03C75A] whitespace-nowrap"
          >
            {normalMenus[0].name}
          </button>

          {/* 드롭다운 카테고리들 */}
          {dropdownCategories.map((category) => (
            <div
              key={category.name}
              className="relative h-full flex items-center"
              onMouseEnter={() => setOpenMenu(category.name)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button
                onClick={() => router.push(category.path)}
                className="text-sm font-medium text-gray-700 hover:text-[#03C75A] whitespace-nowrap h-full flex items-center"
              >
                {category.name} ▾
              </button>
              
              {/* 2단계 드롭다운 메뉴 */}
              {openMenu === category.name && (
                <div className="absolute top-full left-0 pt-0 bg-white shadow-lg rounded-lg border border-gray-200 min-w-[500px]">
                  <div className="grid grid-cols-2 gap-4 p-4">
                    {category.subCategories.map((subCategory) => (
                      <div key={subCategory.name} className="space-y-2">
                        {/* 중분류 제목 */}
                        <button
                          onClick={() => router.push(subCategory.path)}
                          className="font-bold text-sm text-gray-900 hover:text-[#03C75A] block w-full text-left pb-2 border-b"
                        >
                          {subCategory.name}
                        </button>
                        
                        {/* 소분류 항목들 */}
                        <div className="space-y-1">
                          {subCategory.items.map((item) => (
                            <button
                              key={item.name}
                              onClick={() => router.push(item.path)}
                              className="block w-full text-left px-2 py-1.5 text-sm text-gray-600 hover:text-[#03C75A] hover:bg-gray-50 rounded"
                            >
                              {item.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* 나머지 일반 메뉴들 */}
          {normalMenus.slice(1).map((menu) => (
            <button
              key={menu.name}
              onClick={() => router.push(menu.path)}
              className="text-sm font-medium text-gray-700 hover:text-[#03C75A] whitespace-nowrap"
            >
              {menu.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
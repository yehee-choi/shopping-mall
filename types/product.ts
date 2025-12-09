// export interface Product {
//   id: number;
//   name: string;
//   description?: string;
//   price: number;
//   original_price?: number | null;
//   image_url?: string;
//   category_id?: number;
//   stock?: number;
//   is_active?: boolean;
//   created_at?: string;
// }

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  image_url?: string;
  category_id?: number;
  stock?: number;
  sold_count?: number;        // 이 줄 추가
  view_count?: number;        // 이 줄 추가
  is_active?: boolean;
  is_featured?: boolean;
  created_at: string;
  updated_at?: string;
}
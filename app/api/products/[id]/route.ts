import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 상품 기본 정보 + 이미지 + 상세정보 + 카테고리
    const { data: product, error: productError } = await supabase
      .from('products')
      .select(`
        *,
        product_images (
          id,
          image_url,
          is_main,
          display_order
        ),
        product_details (
          manufacturer,
          model_name,
          size,
          weight,
          origin,
          specifications,
          features
        ),
        categories (
          name
        )
      `)
      .eq('id', params.id)
      .eq('is_active', true)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: '상품을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 리뷰 정보
    const { data: reviews } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        content,
        created_at,
        profiles (name)
      `)
      .eq('product_id', params.id)
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      ...product,
      reviews: reviews || []
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  let query = supabase
    .from('products')
    .select(`
      *,
      product_images (
        id,
        image_url,
        is_main
      )
    `)
    .eq('is_active', true)
    .order('id', { ascending: true });

  if (category) {
    query = query.eq('category_id', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 이미지 처리: 첫 번째 이미지를 image_url로
  const products = data?.map(product => ({
    ...product,
    image_url: product.product_images?.[0]?.image_url || '',
    product_images: undefined
  })) || [];

  return NextResponse.json(products);
}
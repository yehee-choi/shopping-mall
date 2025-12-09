import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 장바구니 목록 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('cart')
      .select(`
        *,
        products (
          id,
          name,
          price,
          original_price,
          stock,
          product_images (
            image_url,
            is_main
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 장바구니에 상품 추가
// 장바구니에 상품 추가
export async function POST(request: Request) {
  console.log('🚀 장바구니 추가 API 시작');
  try {
    const body = await request.json();
    console.log('📨 받은 데이터:', body);
    
    const { userId, productId, quantity } = body;

    if (!userId || !productId || !quantity) {
      console.log('❌ 필수 필드 누락:', { userId, productId, quantity });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('📋 기존 상품 확인 중...');
    // 기존에 같은 상품이 있는지 확인
    const { data: existing, error: existingError } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    console.log('📊 기존 상품 결과:', existing);
    console.log('❌ 기존 상품 에러:', existingError);

    if (existing) {
      console.log('🔄 기존 상품 수량 업데이트 중...');
      // 기존 상품이 있으면 수량 업데이트
      const { data, error } = await supabase
        .from('cart')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select()
        .single();

      console.log('📊 업데이트 결과:', data);
      console.log('❌ 업데이트 에러:', error);

      if (error) {
        console.error('💥 업데이트 실패:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      console.log('✅ 수량 업데이트 성공');
      return NextResponse.json(data);
    } else {
      console.log('➕ 새 상품 추가 중...');
      // 새 상품 추가
      const { data, error } = await supabase
        .from('cart')
        .insert({
          user_id: userId,
          product_id: productId,
          quantity: quantity
        })
        .select()
        .single();

      console.log('📊 삽입 결과:', data);
      console.log('❌ 삽입 에러:', error);

      if (error) {
        console.error('💥 삽입 실패:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      console.log('✅ 새 상품 추가 성공');
      return NextResponse.json(data);
    }
  } catch (error: any) {
    console.error('💥 POST 전체 에러:', error);
    console.error('💥 에러 스택:', error.stack);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

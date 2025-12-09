import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 장바구니 아이템 수량 변경
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { quantity } = await request.json();

    const { data, error } = await supabase
      .from('cart')
      .update({ quantity })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 장바구니 아이템 삭제
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
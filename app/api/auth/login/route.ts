import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. 로그인
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // 2. 바로 프로필 정보도 함께 가져오기
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('name, email, phone')
      .eq('id', authData.user.id)
      .single();

    return NextResponse.json({
      user: authData.user,
      session: authData.session,
      profile: profileData, // 🎯 프로필 정보 함께 반환
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { 
      email, 
      password, 
      name, 
      phone, 
      birthdate, 
      postalCode, 
      address, 
      detailedAddress 
    } = await request.json();

    // 1. Supabase Auth로 회원가입
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // 2. profiles 테이블에 모든 정보 저장
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: authData.user.email,
          name: name,
          phone: phone,
          birthdate: birthdate,
          postal_code: postalCode,
          address: address,
          detailed_address: detailedAddress,
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        return NextResponse.json(
          { error: '프로필 생성 중 오류가 발생했습니다.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      user: authData.user,
      message: '회원가입이 완료되었습니다.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
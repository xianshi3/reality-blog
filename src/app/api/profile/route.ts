import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabaseServer';

const DEFAULT_PROFILE = {
  id: 1,
  name: 'Reality',
  title: 'Full Stack Developer',
  avatar_url: '/avatar.png',
  github_url: 'https://github.com/xianshi3',
  twitter_url: 'https://x.com/xianshi_3',
};

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error && error.code === 'PGRST116') {
      return NextResponse.json(DEFAULT_PROFILE);
    }
    if (error) throw error;

    if (!data) {
      return NextResponse.json(DEFAULT_PROFILE);
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const supabase = await createServerSupabase();
    const body = await req.json();
    const { id, ...updateData } = body;

    const { data, error } = await supabase
      .from('profile')
      .upsert({ id: 1, ...updateData })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

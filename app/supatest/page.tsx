'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SupaTestPage() {
    const router = useRouter();
    const [msg, setMsg] = useState('checking...');

    useEffect(() => {
        if (!supabase) {
            router.replace('/');
            return;
        }
        const sb = supabase;

        async function test() {
            try {
                const { data, error } = await sb
                    .from('profiles')
                    .select('*')
                    .limit(1);

                if (error) setMsg('❌ Error: ' + error.message);
                else setMsg('✅ Supabase OK. Query succeeded.');
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : 'Unknown error';
                setMsg('❌ Exception: ' + message);
            }
        }

        test();
    }, [router]);

    if (!supabase) return null;

    return (
        <main style={{ padding: 32, color: 'white', fontSize: 18 }}>
            <h1>Supabase test page</h1>
            <p style={{ marginTop: 16 }}>Status: {msg}</p>
        </main>
    );
}

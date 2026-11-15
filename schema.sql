-- ===================================================
-- Astro World (أسترو وورلد) - NASA Database Schema
-- كود إنشاء الجدول في سوبابيز (Supabase SQL Editor)
-- ===================================================

-- 1. إنشاء جدول رواد الفضاء (astro_users) مع معرف مركب (email + full_name)
CREATE TABLE IF NOT EXISTS public.astro_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    composite_key TEXT UNIQUE,
    full_name TEXT NOT NULL,
    age INTEGER NOT NULL,
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    preferred_language TEXT DEFAULT 'ar',
    role TEXT DEFAULT 'cadet',
    astro_points INTEGER DEFAULT 100
);

-- إزالة أي قيد تفرد قديم على البريد وحده لتمكين فصل الحسابات حسب الاسم والبريد
ALTER TABLE public.astro_users DROP CONSTRAINT IF EXISTS astro_users_email_key;
ALTER TABLE public.astro_users DROP CONSTRAINT IF EXISTS astro_users_email_fullname_key;
ALTER TABLE public.astro_users ADD CONSTRAINT astro_users_email_fullname_key UNIQUE (email, full_name);

-- 2. تفعيل نظام حماية البيانات (Row Level Security)
ALTER TABLE public.astro_users ENABLE ROW LEVEL SECURITY;

-- 3. السماح لأي رائد فضاء بالتسجيل (Insert Policy)
DROP POLICY IF EXISTS "Allow public insert for registration" ON public.astro_users;
CREATE POLICY "Allow public insert for registration"
ON public.astro_users
FOR INSERT
TO anon, authenticated, service_role
WITH CHECK (true);

-- 4. السماح بقراءة وتحديث البيانات (Select/Update Policy)
DROP POLICY IF EXISTS "Allow public read" ON public.astro_users;
CREATE POLICY "Allow public read"
ON public.astro_users
FOR SELECT
TO anon, authenticated, service_role
USING (true);

DROP POLICY IF EXISTS "Allow public update" ON public.astro_users;
CREATE POLICY "Allow public update"
ON public.astro_users
FOR UPDATE
TO anon, authenticated, service_role
USING (true);

-- 5. إعطاء الصلاحيات اللازمة
GRANT ALL ON TABLE public.astro_users TO anon, authenticated, service_role;

-- 6. فهارس سريعة
CREATE INDEX IF NOT EXISTS idx_astro_users_composite ON public.astro_users (composite_key);
CREATE INDEX IF NOT EXISTS idx_astro_users_email ON public.astro_users (email);

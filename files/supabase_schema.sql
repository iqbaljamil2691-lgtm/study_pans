-- ========================================================
-- STUDYPULSE AI LMS PLATFORM - SUPABASE DATABASE SCHEMA
-- Copy and paste this script into your Supabase SQL Editor
-- ========================================================

-- 1. Create Profiles Table (Linked to Auth.Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  avatar_url TEXT,
  major_or_subject TEXT DEFAULT 'Computer Science & Engineering',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Documents Table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  word_count INT DEFAULT 0,
  file_size TEXT,
  parsed_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Study Plans Table
CREATE TABLE IF NOT EXISTS public.study_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  weeks_count INT DEFAULT 4,
  plan_json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Quiz Results Table
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  score_percent INT NOT NULL,
  total_questions INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- Create Policies for Student & Admin Data Access
CREATE POLICY "Users can read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own documents" ON public.documents FOR ALL USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Users can manage own study plans" ON public.study_plans FOR ALL USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Users can manage own quiz results" ON public.quiz_results FOR ALL USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Automatically Create Profile on User Signup (Database Trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    CASE WHEN LOWER(NEW.email) = 'admin@gmail.com' THEN 'admin' ELSE COALESCE(NEW.raw_user_meta_data->>'role', 'student') END
  )
  ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================================
-- HELPER QUERY: Set admin@gmail.com as Admin in Supabase
-- (Run this AFTER signing up admin@gmail.com in your app)
-- ========================================================
UPDATE public.profiles
SET role = 'admin'
WHERE LOWER(email) = 'admin@gmail.com';

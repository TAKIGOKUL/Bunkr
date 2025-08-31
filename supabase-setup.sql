-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  roll_no TEXT,
  timezone TEXT DEFAULT 'Asia/Kolkata',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('present', 'late', 'absent', 'excused')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create duty_leave table
CREATE TABLE duty_leave (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  reason TEXT,
  file_path TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_courses_owner ON courses(owner);
CREATE INDEX idx_sessions_course_id ON sessions(course_id);
CREATE INDEX idx_sessions_date ON sessions(date);
CREATE INDEX idx_duty_leave_user_id ON duty_leave(user_id);
CREATE INDEX idx_duty_leave_status ON duty_leave(status);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE duty_leave ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Courses policies
CREATE POLICY "Users can view own courses" ON courses
  FOR SELECT USING (auth.uid() = owner);

CREATE POLICY "Users can insert own courses" ON courses
  FOR INSERT WITH CHECK (auth.uid() = owner);

CREATE POLICY "Users can update own courses" ON courses
  FOR UPDATE USING (auth.uid() = owner);

CREATE POLICY "Users can delete own courses" ON courses
  FOR DELETE USING (auth.uid() = owner);

-- Sessions policies (users can only access sessions for courses they own)
CREATE POLICY "Users can view sessions for own courses" ON sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM courses WHERE courses.id = sessions.course_id AND courses.owner = auth.uid()
    )
  );

CREATE POLICY "Users can insert sessions for own courses" ON sessions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses WHERE courses.id = sessions.course_id AND courses.owner = auth.uid()
    )
  );

CREATE POLICY "Users can update sessions for own courses" ON sessions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM courses WHERE courses.id = sessions.course_id AND courses.owner = auth.uid()
    )
  );

CREATE POLICY "Users can delete sessions for own courses" ON sessions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM courses WHERE courses.id = sessions.course_id AND courses.owner = auth.uid()
    )
  );

-- Duty leave policies
CREATE POLICY "Users can view own duty leave" ON duty_leave
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own duty leave" ON duty_leave
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own duty leave" ON duty_leave
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own duty leave" ON duty_leave
  FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for duty leave documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'duty-leave',
  'duty-leave',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png']
);

-- Storage policies for duty leave bucket
CREATE POLICY "Users can upload own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'duty-leave' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'duty-leave' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own documents" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'duty-leave' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'duty-leave' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_duty_leave_updated_at BEFORE UPDATE ON duty_leave
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

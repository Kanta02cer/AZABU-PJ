-- ==========================================================
-- AZABU+ Project — Supabase Migration Script
-- Supabase Dashboard > SQL Editor で実行してください
-- ==========================================================

-- =====================
-- 1. テーブル作成
-- =====================

-- news テーブル
CREATE TABLE IF NOT EXISTS news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT NOT NULL DEFAULT 'お知らせ',
  thumbnail TEXT DEFAULT '',
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- columns テーブル
CREATE TABLE IF NOT EXISTS columns (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT NOT NULL DEFAULT 'キャリア',
  thumbnail TEXT DEFAULT '',
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- interviews テーブル
CREATE TABLE IF NOT EXISTS interviews (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL DEFAULT '',
  department TEXT DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT DEFAULT '',
  quote TEXT DEFAULT '',
  photo TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  sort_order INT DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- interview_sections テーブル（Q&A セクション）
CREATE TABLE IF NOT EXISTS interview_sections (
  id BIGSERIAL PRIMARY KEY,
  interview_id BIGINT NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- interview_messages テーブル（メッセージセクション）
CREATE TABLE IF NOT EXISTS interview_messages (
  id BIGSERIAL PRIMARY KEY,
  interview_id BIGINT NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  heading TEXT NOT NULL,
  body TEXT NOT NULL
);

-- =====================
-- 2. RLS 有効化
-- =====================
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_messages ENABLE ROW LEVEL SECURITY;

-- =====================
-- 3. RLS ポリシー
-- =====================

-- 公開読取ポリシー（published=true のみ誰でも読取可）
CREATE POLICY "Public read news" ON news
  FOR SELECT USING (published = true);

CREATE POLICY "Public read columns" ON columns
  FOR SELECT USING (published = true);

CREATE POLICY "Public read interviews" ON interviews
  FOR SELECT USING (published = true);

CREATE POLICY "Public read interview_sections" ON interview_sections
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM interviews WHERE interviews.id = interview_sections.interview_id AND interviews.published = true)
  );

CREATE POLICY "Public read interview_messages" ON interview_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM interviews WHERE interviews.id = interview_messages.interview_id AND interviews.published = true)
  );

-- 認証済みユーザーは全操作可（管理画面用）
CREATE POLICY "Admin full access news" ON news
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access columns" ON columns
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access interviews" ON interviews
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access interview_sections" ON interview_sections
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access interview_messages" ON interview_messages
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================
-- 4. インデックス
-- =====================
CREATE INDEX IF NOT EXISTS idx_news_date ON news(date DESC);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published);
CREATE INDEX IF NOT EXISTS idx_columns_date ON columns(date DESC);
CREATE INDEX IF NOT EXISTS idx_columns_published ON columns(published);
CREATE INDEX IF NOT EXISTS idx_interviews_sort ON interviews(sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_interviews_published ON interviews(published);
CREATE INDEX IF NOT EXISTS idx_interview_sections_interview ON interview_sections(interview_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_interview_messages_interview ON interview_messages(interview_id);

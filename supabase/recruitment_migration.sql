-- ==========================================================
-- AZABU+ Recruitment Platform — Migration Script
-- Supabase Dashboard > SQL Editor で実行してください
-- ==========================================================

-- =====================
-- 1. 求職者テーブル
-- =====================
CREATE TABLE IF NOT EXISTS job_seekers (
  id BIGSERIAL PRIMARY KEY,
  -- 基本情報
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT DEFAULT '',
  current_job TEXT DEFAULT '',
  current_company TEXT DEFAULT '',
  -- スキル・経験
  skills TEXT[] DEFAULT '{}',
  experience_years INT DEFAULT 0,
  current_salary INT DEFAULT 0,        -- 万円
  industry TEXT DEFAULT '',
  -- 希望条件
  desired_salary_min INT DEFAULT 0,    -- 万円
  desired_salary_max INT DEFAULT 0,    -- 万円
  desired_industry TEXT DEFAULT '',
  desired_job_type TEXT DEFAULT '',
  switch_timing TEXT DEFAULT '',       -- 'immediately'|'within_3months'|'within_6months'|'over_6months'
  work_style TEXT DEFAULT '',          -- 'remote'|'hybrid'|'office'
  message TEXT DEFAULT '',
  -- AI生成フィールド
  ai_profile TEXT DEFAULT '',          -- Claude が生成したプロファイルサマリー
  ai_strengths TEXT[] DEFAULT '{}',    -- Claude が抽出した強み
  market_value_score INT DEFAULT 0,    -- 市場価値スコア（0-100）
  estimated_salary_min INT DEFAULT 0,  -- AI推定年収レンジ下限
  estimated_salary_max INT DEFAULT 0,  -- AI推定年収レンジ上限
  -- ステータス
  status TEXT DEFAULT 'active',        -- 'active'|'placed'|'hold'|'withdrawn'
  rank TEXT DEFAULT '',                -- 'S'|'A'|'B'|'C'
  notes TEXT DEFAULT '',               -- 担当者メモ
  source TEXT DEFAULT 'web_form',      -- 'web_form'|'referral'|'scout'
  referrer_name TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 2. 企業テーブル
-- =====================
CREATE TABLE IF NOT EXISTS companies (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  industry TEXT DEFAULT '',
  company_size TEXT DEFAULT '',        -- 'startup'|'sme'|'mid'|'large'
  website TEXT DEFAULT '',
  description TEXT DEFAULT '',
  culture TEXT DEFAULT '',
  work_style TEXT DEFAULT '',          -- 'remote'|'hybrid'|'office'
  -- 採用担当者向けSaaS利用
  plan TEXT DEFAULT 'free',            -- 'free'|'starter'|'pro'
  status TEXT DEFAULT 'active',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 3. 求人票テーブル
-- =====================
CREATE TABLE IF NOT EXISTS job_listings (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  required_skills TEXT[] DEFAULT '{}',
  preferred_skills TEXT[] DEFAULT '{}',
  industry TEXT DEFAULT '',
  job_type TEXT DEFAULT '',
  salary_min INT DEFAULT 0,            -- 万円
  salary_max INT DEFAULT 0,            -- 万円
  work_style TEXT DEFAULT '',
  hiring_timeline TEXT DEFAULT '',     -- 'immediate'|'within_1month'|'within_3months'|'flexible'
  headcount INT DEFAULT 1,
  -- AI分析
  ai_difficulty_score INT DEFAULT 0,   -- 採用難易度スコア（0-100）
  ai_market_comment TEXT DEFAULT '',
  -- ステータス
  status TEXT DEFAULT 'open',          -- 'open'|'filled'|'paused'|'closed'
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 4. マッチングテーブル
-- =====================
CREATE TABLE IF NOT EXISTS matches (
  id BIGSERIAL PRIMARY KEY,
  job_seeker_id BIGINT NOT NULL REFERENCES job_seekers(id) ON DELETE CASCADE,
  job_listing_id BIGINT NOT NULL REFERENCES job_listings(id) ON DELETE CASCADE,
  -- スコアリング詳細
  total_score INT DEFAULT 0,           -- 0-100
  skill_score INT DEFAULT 0,           -- 0-40
  salary_score INT DEFAULT 0,          -- 0-20
  industry_score INT DEFAULT 0,        -- 0-20
  urgency_score INT DEFAULT 0,         -- 0-10
  culture_score INT DEFAULT 0,         -- 0-10
  rank TEXT DEFAULT '',                -- 'S'|'A'|'B'|'C'
  -- プロセス管理
  status TEXT DEFAULT 'pending',       -- 'pending'|'approached'|'interested'|'declined'|'interviewing'|'offered'|'placed'|'rejected'
  approach_sent_at TIMESTAMPTZ,
  seeker_responded_at TIMESTAMPTZ,
  company_approved_at TIMESTAMPTZ,
  -- 面接管理
  interview_scheduled_at TIMESTAMPTZ,
  calendly_event_url TEXT DEFAULT '',
  -- 採用・請求
  placed_at TIMESTAMPTZ,
  placed_salary INT DEFAULT 0,         -- 採用年収（万円）
  success_fee_rate DECIMAL DEFAULT 0.20, -- 成功報酬率（デフォルト20%）
  success_fee_amount INT DEFAULT 0,    -- 請求額（円）
  stripe_payment_intent_id TEXT DEFAULT '',
  stripe_invoice_url TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_seeker_id, job_listing_id)
);

-- =====================
-- 5. 面接テーブル
-- =====================
CREATE TABLE IF NOT EXISTS interviews (
  id BIGSERIAL PRIMARY KEY,
  match_id BIGINT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ,
  format TEXT DEFAULT '',              -- 'online'|'offline'
  location TEXT DEFAULT '',
  calendly_event_id TEXT DEFAULT '',
  status TEXT DEFAULT 'scheduled',     -- 'scheduled'|'completed'|'cancelled'|'rescheduled'
  -- フォロー
  seeker_feedback TEXT DEFAULT '',
  company_feedback TEXT DEFAULT '',
  next_action TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 6. 紹介プログラムテーブル
-- =====================
CREATE TABLE IF NOT EXISTS referrals (
  id BIGSERIAL PRIMARY KEY,
  referrer_name TEXT NOT NULL,
  referrer_email TEXT NOT NULL,
  referred_seeker_id BIGINT REFERENCES job_seekers(id),
  status TEXT DEFAULT 'pending',       -- 'pending'|'joined'|'placed'|'rewarded'
  reward_amount INT DEFAULT 10000,     -- インセンティブ（円）
  reward_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 7. RLS 有効化
-- =====================
ALTER TABLE job_seekers ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- =====================
-- 8. RLS ポリシー
-- =====================

-- 求職者：自分自身のデータのみ読取（emailベース）
-- 管理者は全操作可
CREATE POLICY "Admin full access job_seekers" ON job_seekers
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public insert job_seekers" ON job_seekers
  FOR INSERT WITH CHECK (true);

-- 企業：管理者のみ
CREATE POLICY "Admin full access companies" ON companies
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public insert companies" ON companies
  FOR INSERT WITH CHECK (true);

-- 求人：公開中は誰でも読取
CREATE POLICY "Public read job_listings" ON job_listings
  FOR SELECT USING (published = true AND status = 'open');

CREATE POLICY "Admin full access job_listings" ON job_listings
  FOR ALL USING (auth.role() = 'authenticated');

-- マッチング・面接・紹介：管理者のみ
CREATE POLICY "Admin full access matches" ON matches
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access interviews" ON interviews
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access referrals" ON referrals
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================
-- 9. インデックス
-- =====================
CREATE INDEX IF NOT EXISTS idx_job_seekers_email ON job_seekers(email);
CREATE INDEX IF NOT EXISTS idx_job_seekers_status ON job_seekers(status);
CREATE INDEX IF NOT EXISTS idx_job_seekers_rank ON job_seekers(rank);
CREATE INDEX IF NOT EXISTS idx_job_seekers_skills ON job_seekers USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_job_seekers_created ON job_seekers(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);

CREATE INDEX IF NOT EXISTS idx_job_listings_company ON job_listings(company_id);
CREATE INDEX IF NOT EXISTS idx_job_listings_status ON job_listings(status);
CREATE INDEX IF NOT EXISTS idx_job_listings_skills ON job_listings USING GIN(required_skills);

CREATE INDEX IF NOT EXISTS idx_matches_seeker ON matches(job_seeker_id);
CREATE INDEX IF NOT EXISTS idx_matches_listing ON matches(job_listing_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_rank ON matches(rank);
CREATE INDEX IF NOT EXISTS idx_matches_score ON matches(total_score DESC);

-- =====================
-- 10. updated_at トリガー
-- =====================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_job_seekers_updated_at
  BEFORE UPDATE ON job_seekers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_listings_updated_at
  BEFORE UPDATE ON job_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

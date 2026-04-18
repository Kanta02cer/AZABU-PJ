-- ==========================================================
-- UpBoard — Supabase Migration Script
-- 学歴不問 × 上場企業特化 AI人材紹介プラットフォーム
-- Supabase Dashboard > SQL Editor で実行してください
-- ==========================================================

-- =====================
-- 1. 求職者（候補者）テーブル
-- =====================
CREATE TABLE IF NOT EXISTS upboard_candidates (
  id BIGSERIAL PRIMARY KEY,

  -- STEP1: 基本情報
  name TEXT NOT NULL DEFAULT '',
  age INT,
  gender TEXT DEFAULT '',             -- 'male'|'female'|'other'|'no_answer'
  email TEXT NOT NULL UNIQUE,
  tel TEXT DEFAULT '',
  education TEXT DEFAULT '',          -- 'junior_high'|'high_school'|'vocational'|'junior_college'|'university_low'|'university_mid'|'graduate'
  area TEXT DEFAULT '',               -- 都道府県
  employment_status TEXT DEFAULT '',  -- 'employed'|'freelance'|'student'|'job_hunting'|'unemployed'

  -- STEP2: 現状
  current_income INT DEFAULT 0,       -- 万円（0=未入力）
  want_income INT DEFAULT 0,          -- 万円
  timing TEXT DEFAULT '',             -- 'immediately'|'2-3months'|'6months'|'not_urgent'
  job_type TEXT DEFAULT '',           -- 'engineer_backend'|'engineer_infra'|'engineer_frontend'|'engineer_fullstack'|'pm'|'general'|'other'

  -- STEP3: スキル・経験
  skills TEXT[] DEFAULT '{}',
  exp_years DECIMAL DEFAULT 0,        -- 経験年数（0=未経験）
  portfolio_url TEXT DEFAULT '',      -- GitHub / Portfolio URL

  -- STEP4: 志望
  reason TEXT DEFAULT '',             -- 転職理由
  industries TEXT[] DEFAULT '{}',     -- 希望業界（複数選択）
  message TEXT DEFAULT '',

  -- AI分析結果
  score INT DEFAULT 0,                -- スコア合計（仕様通り: 最大123）
  rank TEXT DEFAULT '',               -- 'S'|'A'|'B'
  score_skill INT DEFAULT 0,
  score_breadth INT DEFAULT 0,
  score_exp INT DEFAULT 0,
  score_urgency INT DEFAULT 0,
  score_portfolio INT DEFAULT 0,
  ai_profile TEXT DEFAULT '',         -- AIが生成したプロファイルサマリー
  estimated_salary_min INT DEFAULT 0, -- AI推定年収レンジ（万円）
  estimated_salary_max INT DEFAULT 0,

  -- 管理・進捗
  status TEXT DEFAULT 'new',          -- 'new'|'contacted'|'interviewing'|'offered'|'placed'|'rejected'|'withdrawn'
  agent_memo TEXT DEFAULT '',
  scout_sent_at TIMESTAMPTZ,
  scout_text TEXT DEFAULT '',         -- 最後に生成されたスカウト文

  -- 同意・メタ
  privacy_agreed BOOLEAN DEFAULT false,
  scout_agreed BOOLEAN DEFAULT false,
  source TEXT DEFAULT 'web',          -- 'web'|'diagnosis_only'|'sns'|'referral'|'event'
  referrer TEXT DEFAULT '',
  utm_source TEXT DEFAULT '',
  utm_medium TEXT DEFAULT '',
  utm_campaign TEXT DEFAULT '',

  registered_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 2. AI診断（軽量リード）テーブル
-- =====================
CREATE TABLE IF NOT EXISTS upboard_diagnosis_leads (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT DEFAULT '',
  score INT DEFAULT 0,
  rank TEXT DEFAULT '',
  skills TEXT[] DEFAULT '{}',
  exp_years DECIMAL DEFAULT 0,
  timing TEXT DEFAULT '',
  job_type TEXT DEFAULT '',
  portfolio_url TEXT DEFAULT '',
  converted BOOLEAN DEFAULT false,    -- フル登録に転換したか
  candidate_id BIGINT REFERENCES upboard_candidates(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 3. スカウト管理テーブル
-- =====================
CREATE TABLE IF NOT EXISTS upboard_scouts (
  id BIGSERIAL PRIMARY KEY,
  candidate_id BIGINT NOT NULL REFERENCES upboard_candidates(id) ON DELETE CASCADE,
  company_name TEXT DEFAULT '',
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  replied_at TIMESTAMPTZ,
  result TEXT DEFAULT 'pending',      -- 'pending'|'interested'|'declined'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 4. 提携企業テーブル
-- =====================
CREATE TABLE IF NOT EXISTS upboard_companies (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  listing_type TEXT DEFAULT '',       -- 'prime'|'standard'|'growth'|'other'
  industry TEXT DEFAULT '',
  requirements TEXT[] DEFAULT '{}',   -- 求めるスキル
  salary_min INT DEFAULT 0,
  salary_max INT DEFAULT 0,
  culture TEXT DEFAULT '',
  contact_email TEXT DEFAULT '',
  contract_signed BOOLEAN DEFAULT false,
  fee_rate DECIMAL DEFAULT 0.20,      -- 成功報酬率
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 5. 成約管理テーブル
-- =====================
CREATE TABLE IF NOT EXISTS upboard_placements (
  id BIGSERIAL PRIMARY KEY,
  candidate_id BIGINT NOT NULL REFERENCES upboard_candidates(id),
  company_id BIGINT REFERENCES upboard_companies(id),
  company_name TEXT DEFAULT '',        -- 企業IDがない場合の社名
  placed_salary INT DEFAULT 0,         -- 採用年収（万円）
  fee_rate DECIMAL DEFAULT 0.20,
  fee_amount INT DEFAULT 0,            -- 紹介料（円）= placed_salary × 10000 × fee_rate
  contract_date DATE,
  placed_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT DEFAULT ''
);

-- =====================
-- 6. RLS有効化
-- =====================
ALTER TABLE upboard_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE upboard_diagnosis_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE upboard_scouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE upboard_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE upboard_placements ENABLE ROW LEVEL SECURITY;

-- =====================
-- 7. RLSポリシー
-- =====================

-- 求職者: 誰でもINSERT可（登録フォーム）、認証済みのみ全操作
CREATE POLICY "Public insert upboard_candidates" ON upboard_candidates
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full upboard_candidates" ON upboard_candidates
  FOR ALL USING (auth.role() = 'authenticated');

-- 診断リード: 誰でもINSERT
CREATE POLICY "Public insert diagnosis_leads" ON upboard_diagnosis_leads
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full diagnosis_leads" ON upboard_diagnosis_leads
  FOR ALL USING (auth.role() = 'authenticated');

-- スカウト・企業・成約: 認証済みのみ
CREATE POLICY "Admin full upboard_scouts" ON upboard_scouts
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full upboard_companies" ON upboard_companies
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full upboard_placements" ON upboard_placements
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================
-- 8. インデックス
-- =====================
CREATE INDEX IF NOT EXISTS idx_ub_candidates_email ON upboard_candidates(email);
CREATE INDEX IF NOT EXISTS idx_ub_candidates_rank ON upboard_candidates(rank);
CREATE INDEX IF NOT EXISTS idx_ub_candidates_status ON upboard_candidates(status);
CREATE INDEX IF NOT EXISTS idx_ub_candidates_timing ON upboard_candidates(timing);
CREATE INDEX IF NOT EXISTS idx_ub_candidates_skills ON upboard_candidates USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_ub_candidates_score ON upboard_candidates(score DESC);
CREATE INDEX IF NOT EXISTS idx_ub_candidates_registered ON upboard_candidates(registered_at DESC);
CREATE INDEX IF NOT EXISTS idx_ub_diagnosis_email ON upboard_diagnosis_leads(email);
CREATE INDEX IF NOT EXISTS idx_ub_scouts_candidate ON upboard_scouts(candidate_id);

-- =====================
-- 9. updated_at トリガー
-- =====================
CREATE OR REPLACE FUNCTION upboard_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_upboard_candidates_updated
  BEFORE UPDATE ON upboard_candidates
  FOR EACH ROW EXECUTE FUNCTION upboard_update_updated_at();

CREATE TRIGGER trg_upboard_companies_updated
  BEFORE UPDATE ON upboard_companies
  FOR EACH ROW EXECUTE FUNCTION upboard_update_updated_at();

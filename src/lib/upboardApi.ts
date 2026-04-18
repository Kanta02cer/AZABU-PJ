import { supabase } from './supabase';

export interface CandidateRow {
  id: number;
  name: string;
  age: number;
  gender: string;
  email: string;
  tel: string;
  education: string;
  area: string;
  employment_status: string;
  current_income: number;
  want_income: number;
  timing: string;
  job_type: string;
  skills: string[];
  exp_years: number;
  portfolio_url: string;
  reason: string;
  industries: string[];
  message: string;
  score: number;
  rank: string;
  score_skill: number;
  score_breadth: number;
  score_exp: number;
  score_urgency: number;
  score_portfolio: number;
  ai_profile: string;
  estimated_salary_min: number;
  estimated_salary_max: number;
  status: string;
  agent_memo: string;
  scout_sent_at: string | null;
  scout_text: string;
  privacy_agreed: boolean;
  scout_agreed: boolean;
  source: string;
  registered_at: string;
  updated_at: string;
}

export type CandidateInsert = Omit<CandidateRow, 'id' | 'registered_at' | 'updated_at'>;

// 求職者登録
export async function insertCandidate(data: Partial<CandidateInsert>) {
  return supabase
    .from('upboard_candidates')
    .insert([data])
    .select()
    .single();
}

// 求職者一覧取得
export async function getCandidates(filters?: {
  rank?: string;
  status?: string;
  timing?: string;
}) {
  let q = supabase
    .from('upboard_candidates')
    .select('*')
    .order('score', { ascending: false });

  if (filters?.rank) q = q.eq('rank', filters.rank);
  if (filters?.status) q = q.eq('status', filters.status);
  if (filters?.timing) q = q.eq('timing', filters.timing);

  return q;
}

// ステータス更新
export async function updateCandidateStatus(id: number, updates: Partial<CandidateRow>) {
  return supabase
    .from('upboard_candidates')
    .update(updates)
    .eq('id', id);
}

// 診断リード保存（メール・スコアのみ先に保存）
export async function saveDiagnosisLead(data: {
  email: string;
  name?: string;
  score: number;
  rank: string;
  skills: string[];
  exp_years: number;
  timing: string;
  job_type: string;
  portfolio_url?: string;
}) {
  return supabase
    .from('upboard_diagnosis_leads')
    .insert([data])
    .select()
    .single();
}

// 統計取得
export async function getCandidateStats() {
  const today = new Date().toISOString().split('T')[0];

  const [total, sRank, todayCount, immediately] = await Promise.all([
    supabase.from('upboard_candidates').select('id', { count: 'exact', head: true }),
    supabase.from('upboard_candidates').select('id', { count: 'exact', head: true }).eq('rank', 'S'),
    supabase.from('upboard_candidates').select('id', { count: 'exact', head: true })
      .gte('registered_at', today),
    supabase.from('upboard_candidates').select('id', { count: 'exact', head: true })
      .eq('timing', 'immediately'),
  ]);

  return {
    total: total.count ?? 0,
    sRank: sRank.count ?? 0,
    today: todayCount.count ?? 0,
    immediately: immediately.count ?? 0,
  };
}

// 成約登録
export async function recordPlacement(data: {
  candidate_id: number;
  company_name: string;
  placed_salary: number;
  fee_rate?: number;
}) {
  const fee_amount = Math.floor(data.placed_salary * 10000 * (data.fee_rate ?? 0.20));
  const { error: placeError } = await supabase
    .from('upboard_placements')
    .insert([{ ...data, fee_amount }]);

  if (!placeError) {
    await supabase
      .from('upboard_candidates')
      .update({ status: 'placed' })
      .eq('id', data.candidate_id);
  }
  return { error: placeError };
}

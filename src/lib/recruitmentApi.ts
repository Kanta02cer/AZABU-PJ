import { supabase } from './supabase';

// =====================
// 型定義
// =====================

export interface JobSeekerInput {
  name: string;
  email: string;
  phone: string;
  current_job: string;
  current_company: string;
  skills: string[];
  experience_years: number;
  current_salary: number;
  industry: string;
  desired_salary_min: number;
  desired_salary_max: number;
  desired_industry: string;
  desired_job_type: string;
  switch_timing: string;
  work_style: string;
  message: string;
  source?: string;
  referrer_name?: string;
}

export interface JobSeekerRow extends JobSeekerInput {
  id: number;
  ai_profile: string;
  ai_strengths: string[];
  market_value_score: number;
  estimated_salary_min: number;
  estimated_salary_max: number;
  status: string;
  rank: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyInput {
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  industry: string;
  company_size: string;
  website: string;
  description: string;
  culture: string;
  work_style: string;
}

export interface JobListingInput {
  company_id: number;
  title: string;
  description: string;
  required_skills: string[];
  preferred_skills: string[];
  industry: string;
  job_type: string;
  salary_min: number;
  salary_max: number;
  work_style: string;
  hiring_timeline: string;
  headcount: number;
}

export interface MatchRow {
  id: number;
  job_seeker_id: number;
  job_listing_id: number;
  total_score: number;
  skill_score: number;
  salary_score: number;
  industry_score: number;
  urgency_score: number;
  culture_score: number;
  rank: string;
  status: string;
  placed_salary: number;
  success_fee_rate: number;
  success_fee_amount: number;
  created_at: string;
  job_seekers?: JobSeekerRow;
  job_listings?: { title: string; companies?: { name: string } };
}

// =====================
// 求職者API
// =====================

export async function registerJobSeeker(data: JobSeekerInput): Promise<{ data: JobSeekerRow | null; error: Error | null }> {
  const { data: result, error } = await supabase
    .from('job_seekers')
    .insert([{
      ...data,
      source: data.source ?? 'web_form',
    }])
    .select()
    .single();

  return { data: result as JobSeekerRow | null, error: error as Error | null };
}

export async function getJobSeekers(filters?: { status?: string; rank?: string }) {
  let query = supabase
    .from('job_seekers')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.rank) query = query.eq('rank', filters.rank);

  return query;
}

export async function updateJobSeekerAiProfile(id: number, aiData: {
  ai_profile: string;
  ai_strengths: string[];
  market_value_score: number;
  estimated_salary_min: number;
  estimated_salary_max: number;
  rank: string;
}) {
  return supabase
    .from('job_seekers')
    .update(aiData)
    .eq('id', id);
}

// =====================
// 企業API
// =====================

export async function registerCompany(data: CompanyInput) {
  return supabase
    .from('companies')
    .insert([data])
    .select()
    .single();
}

export async function getCompanies() {
  return supabase
    .from('companies')
    .select('*, job_listings(*)')
    .order('created_at', { ascending: false });
}

// =====================
// 求人API
// =====================

export async function createJobListing(data: JobListingInput) {
  return supabase
    .from('job_listings')
    .insert([data])
    .select()
    .single();
}

export async function getJobListings(status = 'open') {
  return supabase
    .from('job_listings')
    .select('*, companies(name, industry)')
    .eq('status', status)
    .order('created_at', { ascending: false });
}

// =====================
// マッチングAPI
// =====================

export async function saveMatch(matchData: {
  job_seeker_id: number;
  job_listing_id: number;
  total_score: number;
  skill_score: number;
  salary_score: number;
  industry_score: number;
  urgency_score: number;
  culture_score: number;
  rank: string;
}) {
  return supabase
    .from('matches')
    .upsert([matchData], { onConflict: 'job_seeker_id,job_listing_id' })
    .select()
    .single();
}

export async function getMatches(filters?: { status?: string; rank?: string }) {
  let query = supabase
    .from('matches')
    .select(`
      *,
      job_seekers(id, name, email, skills, desired_salary_min, desired_salary_max, switch_timing),
      job_listings(id, title, required_skills, salary_min, salary_max, companies(name))
    `)
    .order('total_score', { ascending: false });

  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.rank) query = query.eq('rank', filters.rank);

  return query;
}

export async function updateMatchStatus(id: number, status: string, extra?: Record<string, unknown>) {
  return supabase
    .from('matches')
    .update({ status, ...extra })
    .eq('id', id);
}

export async function recordPlacement(matchId: number, placedSalary: number, feeRate = 0.20) {
  const feeAmount = Math.floor(placedSalary * 10000 * feeRate);
  return supabase
    .from('matches')
    .update({
      status: 'placed',
      placed_at: new Date().toISOString(),
      placed_salary: placedSalary,
      success_fee_rate: feeRate,
      success_fee_amount: feeAmount,
    })
    .eq('id', matchId);
}

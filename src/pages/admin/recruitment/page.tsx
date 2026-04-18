import { useState, useEffect, useCallback } from 'react';
import { SEO } from '../../../components/SEO';
import { getJobSeekers, getMatches, getCompanies, getJobListings, updateMatchStatus, recordPlacement, saveMatch } from '../../../lib/recruitmentApi';
import { calcMatchScore } from '../../../lib/matchingEngine';

// =====================
// 型定義
// =====================

type TabType = 'seekers' | 'matching' | 'companies' | 'pipeline' | 'revenue';

interface Seeker {
  id: number;
  name: string;
  email: string;
  skills: string[];
  industry: string;
  desired_salary_min: number;
  desired_salary_max: number;
  switch_timing: string;
  work_style: string;
  experience_years: number;
  desired_industry: string;
  desired_job_type: string;
  market_value_score: number;
  rank: string;
  status: string;
  created_at: string;
}

interface Match {
  id: number;
  total_score: number;
  skill_score: number;
  salary_score: number;
  industry_score: number;
  urgency_score: number;
  culture_score: number;
  rank: string;
  status: string;
  placed_salary: number;
  success_fee_amount: number;
  created_at: string;
  job_seekers: Seeker;
  job_listings: {
    id: number;
    title: string;
    companies: { name: string };
  };
}

interface Company {
  id: number;
  name: string;
  contact_person: string;
  email: string;
  industry: string;
  status: string;
  created_at: string;
}

interface JobListing {
  id: number;
  title: string;
  required_skills: string[];
  salary_min: number;
  salary_max: number;
  status: string;
  hiring_timeline: string;
  work_style: string;
  industry: string;
  company_id: number;
  companies: { name: string; industry: string };
}

// =====================
// ユーティリティ
// =====================

const RANK_COLOR: Record<string, string> = {
  S: '#FF6B00', A: '#2563EB', B: '#059669', C: '#6B7280',
};

const STATUS_LABEL: Record<string, string> = {
  pending: '未対応',
  approached: 'アプローチ済',
  interested: '興味あり',
  declined: '辞退',
  interviewing: '面接中',
  offered: 'オファー',
  placed: '採用決定',
  rejected: '不採用',
};

const STATUS_COLOR: Record<string, string> = {
  pending: '#6B7280',
  approached: '#2563EB',
  interested: '#059669',
  declined: '#EF4444',
  interviewing: '#FF6B00',
  offered: '#7C3AED',
  placed: '#111111',
  rejected: '#9CA3AF',
};

function RankBadge({ rank }: { rank: string }) {
  return (
    <span
      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0"
      style={{ backgroundColor: RANK_COLOR[rank] || '#6B7280' }}
    >
      {rank || '-'}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: STATUS_COLOR[status] || '#6B7280' }}
    >
      {STATUS_LABEL[status] || status}
    </span>
  );
}

// =====================
// タブコンポーネント
// =====================

function SeekerCard({ seeker }: { seeker: Seeker }) {
  return (
    <div className="bg-white border border-black/10 rounded-xl p-4 hover:border-[#FF6B00]/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <RankBadge rank={seeker.rank} />
          <div>
            <p className="font-bold text-sm text-[#111111]">{seeker.name}</p>
            <p className="text-xs text-black/50">{seeker.email}</p>
          </div>
        </div>
        {seeker.market_value_score > 0 && (
          <div className="text-right">
            <p className="text-xs text-black/40">市場価値</p>
            <p className="text-lg font-black" style={{ color: RANK_COLOR[seeker.rank] || '#6B7280' }}>
              {seeker.market_value_score}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {seeker.skills.slice(0, 5).map(s => (
          <span key={s} className="px-2 py-0.5 bg-black/5 rounded text-xs text-black/60">{s}</span>
        ))}
        {seeker.skills.length > 5 && (
          <span className="text-xs text-black/40">+{seeker.skills.length - 5}</span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs text-black/50">
        <div>
          <p className="font-medium text-black/70">{seeker.desired_salary_min}〜{seeker.desired_salary_max}万</p>
          <p>希望年収</p>
        </div>
        <div>
          <p className="font-medium text-black/70">{seeker.industry || '—'}</p>
          <p>現業界</p>
        </div>
        <div>
          <p className="font-medium text-black/70">
            {seeker.switch_timing === 'immediately' ? '即時' :
             seeker.switch_timing === 'within_3months' ? '3ヶ月以内' :
             seeker.switch_timing === 'within_6months' ? '6ヶ月以内' : '6ヶ月超'}
          </p>
          <p>転職時期</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-black/5 text-xs text-black/40">
        登録: {new Date(seeker.created_at).toLocaleDateString('ja-JP')}
      </div>
    </div>
  );
}

// =====================
// メインコンポーネント
// =====================

export default function AdminRecruitmentPage() {
  const [activeTab, setActiveTab] = useState<TabType>('seekers');
  const [seekers, setSeekers] = useState<Seeker[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [listings, setListings] = useState<JobListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rankFilter, setRankFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isRunningMatch, setIsRunningMatch] = useState(false);
  const [matchProgress, setMatchProgress] = useState('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const [seekersRes, matchesRes, companiesRes, listingsRes] = await Promise.all([
      getJobSeekers(),
      getMatches(),
      getCompanies(),
      getJobListings(),
    ]);
    setSeekers((seekersRes.data as Seeker[]) ?? []);
    setMatches((matchesRes.data as Match[]) ?? []);
    setCompanies((companiesRes.data as Company[]) ?? []);
    setListings((listingsRes.data as JobListing[]) ?? []);
    setIsLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // AIマッチング実行
  const runMatching = async () => {
    setIsRunningMatch(true);
    setMatchProgress('求職者データを読み込み中...');

    let created = 0;
    for (const seeker of seekers) {
      for (const listing of listings) {
        setMatchProgress(`${seeker.name} × ${listing.title} をスコアリング中...`);
        const score = calcMatchScore(
          {
            skills: seeker.skills,
            current_salary: 0,
            desired_salary_min: seeker.desired_salary_min,
            desired_salary_max: seeker.desired_salary_max,
            industry: seeker.industry,
            desired_industry: seeker.desired_industry,
            switch_timing: seeker.switch_timing,
            work_style: seeker.work_style,
            experience_years: seeker.experience_years,
            desired_job_type: seeker.desired_job_type,
          },
          {
            required_skills: listing.required_skills,
            preferred_skills: [],
            salary_min: listing.salary_min,
            salary_max: listing.salary_max,
            industry: listing.industry,
            work_style: listing.work_style,
            hiring_timeline: listing.hiring_timeline,
            job_type: '',
          }
        );

        await saveMatch({
          job_seeker_id: seeker.id,
          job_listing_id: listing.id,
          total_score: score.total,
          skill_score: score.skill,
          salary_score: score.salary,
          industry_score: score.industry,
          urgency_score: score.urgency,
          culture_score: score.culture,
          rank: score.rank,
        });
        created++;
        await new Promise(r => setTimeout(r, 30)); // レート制限
      }
    }

    setMatchProgress(`完了 — ${created}件のマッチを生成しました`);
    await loadData();
    setTimeout(() => {
      setIsRunningMatch(false);
      setMatchProgress('');
    }, 2000);
  };

  // 収益統計
  const placed = matches.filter(m => m.status === 'placed');
  const totalRevenue = placed.reduce((sum, m) => sum + (m.success_fee_amount || 0), 0);
  const sRankMatches = matches.filter(m => m.rank === 'S');
  const pendingMatches = matches.filter(m => m.status === 'pending' && m.rank === 'S');

  const filteredSeekers = seekers.filter(s =>
    (!rankFilter || s.rank === rankFilter)
  );
  const filteredMatches = matches.filter(m =>
    (!rankFilter || m.rank === rankFilter) &&
    (!statusFilter || m.status === statusFilter)
  );

  const TABS: { key: TabType; label: string; count?: number }[] = [
    { key: 'seekers', label: '求職者', count: seekers.length },
    { key: 'matching', label: 'マッチング', count: sRankMatches.length },
    { key: 'pipeline', label: 'パイプライン', count: pendingMatches.length },
    { key: 'companies', label: '企業', count: companies.length },
    { key: 'revenue', label: '収益' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <SEO title="採用管理ダッシュボード | AZABU+" description="" />

      {/* ヘッダー */}
      <div className="bg-white border-b border-black/10 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-[#111111]">AZABU+ 採用管理</h1>
            <p className="text-xs text-black/50">AIマッチングダッシュボード</p>
          </div>
          <div className="flex items-center gap-3">
            {/* KPIサマリー */}
            <div className="hidden sm:flex items-center gap-4 text-right">
              <div>
                <p className="text-xs text-black/40">求職者数</p>
                <p className="text-xl font-black text-[#111111]">{seekers.length}</p>
              </div>
              <div>
                <p className="text-xs text-black/40">Sランク</p>
                <p className="text-xl font-black text-[#FF6B00]">{sRankMatches.length}</p>
              </div>
              <div>
                <p className="text-xs text-black/40">成約件数</p>
                <p className="text-xl font-black text-[#111111]">{placed.length}</p>
              </div>
              <div>
                <p className="text-xs text-black/40">成功報酬合計</p>
                <p className="text-lg font-black text-[#111111]">{(totalRevenue / 10000).toFixed(0)}万円</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* タブナビ */}
      <div className="bg-white border-b border-black/10 px-4">
        <div className="max-w-6xl mx-auto flex gap-0 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-[#FF6B00] text-[#FF6B00]'
                  : 'border-transparent text-black/50 hover:text-black/70'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === tab.key ? 'bg-[#FF6B00]/10 text-[#FF6B00]' : 'bg-black/5 text-black/40'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* コンテンツ */}
      <div className="max-w-6xl mx-auto px-4 py-6">

        {isLoading && (
          <div className="text-center py-20 text-black/40">
            <div className="w-8 h-8 border-2 border-black/20 border-t-[#FF6B00] rounded-full animate-spin mx-auto mb-3" />
            読み込み中...
          </div>
        )}

        {/* ==================== 求職者タブ ==================== */}
        {!isLoading && activeTab === 'seekers' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#111111]">登録求職者一覧</h2>
              <div className="flex gap-2">
                <select value={rankFilter} onChange={e => setRankFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-black/15 text-sm bg-white">
                  <option value="">全ランク</option>
                  <option value="S">Sランク</option>
                  <option value="A">Aランク</option>
                  <option value="B">Bランク</option>
                  <option value="C">Cランク</option>
                </select>
                <a href="/tenshoku/register" target="_blank"
                  className="px-3 py-1.5 rounded-lg bg-[#FF6B00] text-white text-sm font-medium hover:bg-[#FF8C00] transition-colors">
                  + 求職者登録フォーム
                </a>
              </div>
            </div>

            {filteredSeekers.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-black/10">
                <p className="text-4xl mb-3">👥</p>
                <p className="text-black/40 text-sm">まだ求職者が登録されていません</p>
                <a href="/tenshoku/register" target="_blank"
                  className="inline-block mt-4 px-5 py-2 rounded-full bg-[#FF6B00] text-white text-sm font-medium">
                  登録フォームを開く
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSeekers.map(seeker => (
                  <SeekerCard key={seeker.id} seeker={seeker} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== マッチングタブ ==================== */}
        {!isLoading && activeTab === 'matching' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#111111]">AIマッチング管理</h2>
              <button
                onClick={runMatching}
                disabled={isRunningMatch || seekers.length === 0 || listings.length === 0}
                className="px-4 py-2 rounded-lg bg-[#FF6B00] text-white text-sm font-bold hover:bg-[#FF8C00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunningMatch ? '🤖 実行中...' : '🤖 AIマッチングを実行'}
              </button>
            </div>

            {isRunningMatch && (
              <div className="bg-[#FFF7F0] border border-[#FF6B00]/20 rounded-xl p-4 mb-4 text-sm text-[#FF6B00]">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#FF6B00]/30 border-t-[#FF6B00] rounded-full animate-spin shrink-0" />
                  {matchProgress}
                </div>
              </div>
            )}

            {/* ランク別フィルター */}
            <div className="flex gap-2 mb-4">
              {['', 'S', 'A', 'B', 'C'].map(r => (
                <button key={r} onClick={() => setRankFilter(r)}
                  className={`px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${
                    rankFilter === r
                      ? 'text-white'
                      : 'bg-white border border-black/15 text-black/50'
                  }`}
                  style={rankFilter === r ? { backgroundColor: r ? RANK_COLOR[r] : '#111111' } : {}}>
                  {r || '全て'}
                </button>
              ))}
            </div>

            {filteredMatches.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-black/10">
                <p className="text-4xl mb-3">🤖</p>
                <p className="text-black/40 text-sm mb-4">
                  {listings.length === 0
                    ? '求人が登録されていません。企業登録フォームから求人を追加してください。'
                    : seekers.length === 0
                    ? '求職者がまだいません。'
                    : 'AIマッチングを実行してください。'}
                </p>
                {listings.length > 0 && seekers.length > 0 && (
                  <button onClick={runMatching} disabled={isRunningMatch}
                    className="px-5 py-2 rounded-full bg-[#FF6B00] text-white text-sm font-bold">
                    マッチングを実行
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredMatches.map(match => (
                  <div key={match.id} className="bg-white border border-black/10 rounded-xl p-4 hover:border-[#FF6B00]/20 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <RankBadge rank={match.rank} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-sm text-[#111111]">{match.job_seekers?.name}</p>
                            <span className="text-black/30 text-xs">×</span>
                            <p className="text-sm text-black/70">{match.job_listings?.companies?.name} — {match.job_listings?.title}</p>
                          </div>
                          {/* スコアバー */}
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 h-1.5 bg-black/10 rounded-full overflow-hidden">
                              <div
                                className="h-1.5 rounded-full transition-all"
                                style={{
                                  width: `${match.total_score}%`,
                                  backgroundColor: RANK_COLOR[match.rank] || '#6B7280',
                                }}
                              />
                            </div>
                            <span className="text-xs font-bold text-black/60 shrink-0">{match.total_score}点</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <StatusBadge status={match.status} />
                        {match.status === 'pending' && match.rank === 'S' && (
                          <button
                            onClick={() => updateMatchStatus(match.id, 'approached', {
                              approach_sent_at: new Date().toISOString(),
                            }).then(loadData)}
                            className="px-3 py-1 rounded-lg bg-[#FF6B00] text-white text-xs font-bold hover:bg-[#FF8C00] transition-colors"
                          >
                            アプローチ送信
                          </button>
                        )}
                        {match.status === 'interviewing' && (
                          <button
                            onClick={() => {
                              const salary = Number(prompt('採用年収（万円）を入力:'));
                              if (salary > 0) recordPlacement(match.id, salary).then(loadData);
                            }}
                            className="px-3 py-1 rounded-lg bg-[#111111] text-white text-xs font-bold"
                          >
                            採用決定
                          </button>
                        )}
                      </div>
                    </div>

                    {/* スコア詳細 */}
                    <div className="grid grid-cols-5 gap-1 mt-3 pt-3 border-t border-black/5">
                      {[
                        { label: 'スキル', score: match.skill_score ?? 0, max: 40 },
                        { label: '年収', score: match.salary_score ?? 0, max: 20 },
                        { label: '業界', score: match.industry_score ?? 0, max: 20 },
                        { label: '緊急度', score: match.urgency_score ?? 0, max: 10 },
                        { label: '文化', score: match.culture_score ?? 0, max: 10 },
                      ].map(item => (
                        <div key={item.label} className="text-center">
                          <p className="text-xs font-bold text-[#111111]">{item.score}</p>
                          <p className="text-xs text-black/40">{item.label}</p>
                          <div className="h-1 bg-black/5 rounded-full mt-0.5 overflow-hidden">
                            <div
                              className="h-1 rounded-full bg-[#FF6B00]"
                              style={{ width: `${(item.score / item.max) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== パイプラインタブ ==================== */}
        {!isLoading && activeTab === 'pipeline' && (
          <div>
            <h2 className="font-bold text-[#111111] mb-4">採用パイプライン</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-6">
              {Object.entries(STATUS_LABEL).map(([status, label]) => {
                const count = matches.filter(m => m.status === status).length;
                return (
                  <div key={status}
                    className="bg-white rounded-xl border border-black/10 p-3 text-center cursor-pointer hover:border-[#FF6B00]/30"
                    onClick={() => setStatusFilter(status === statusFilter ? '' : status)}>
                    <p className="text-2xl font-black text-[#111111]">{count}</p>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full text-white mt-1 inline-block"
                      style={{ backgroundColor: STATUS_COLOR[status] }}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* フィルタリング済みリスト */}
            <div className="space-y-2">
              {matches
                .filter(m => !statusFilter || m.status === statusFilter)
                .sort((a, b) => b.total_score - a.total_score)
                .map(match => (
                  <div key={match.id} className="bg-white border border-black/10 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <RankBadge rank={match.rank} />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-[#111111] truncate">{match.job_seekers?.name}</p>
                        <p className="text-xs text-black/50 truncate">
                          {match.job_listings?.companies?.name} — {match.job_listings?.title}
                        </p>
                      </div>
                      <StatusBadge status={match.status} />
                      <select
                        value={match.status}
                        onChange={e => updateMatchStatus(match.id, e.target.value).then(loadData)}
                        className="text-xs border border-black/15 rounded-lg px-2 py-1 bg-white"
                      >
                        {Object.entries(STATUS_LABEL).map(([v, l]) => (
                          <option key={v} value={v}>{l}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ==================== 企業タブ ==================== */}
        {!isLoading && activeTab === 'companies' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#111111]">登録企業・求人一覧</h2>
              <a href="/companies/register" target="_blank"
                className="px-3 py-1.5 rounded-lg bg-[#111111] text-white text-sm font-medium hover:bg-black/80 transition-colors">
                + 企業登録フォーム
              </a>
            </div>

            {companies.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-black/10">
                <p className="text-4xl mb-3">🏢</p>
                <p className="text-black/40 text-sm">まだ企業が登録されていません</p>
              </div>
            ) : (
              <div className="space-y-3">
                {companies.map(company => (
                  <div key={company.id} className="bg-white border border-black/10 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-[#111111]">{company.name}</p>
                        <p className="text-sm text-black/50">{company.industry} — 担当: {company.contact_person}</p>
                        <p className="text-xs text-black/40 mt-1">{company.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-black/40">
                          登録: {new Date(company.created_at).toLocaleDateString('ja-JP')}
                        </p>
                        <p className="text-xs text-black/50 mt-1">
                          求人: {listings.filter(l => l.company_id === company.id).length}件
                        </p>
                      </div>
                    </div>

                    {/* 求人一覧 */}
                    {listings.filter(l => l.company_id === company.id).map(listing => (
                      <div key={listing.id} className="mt-3 pl-3 border-l-2 border-[#FF6B00]/20">
                        <p className="text-sm font-medium text-[#111111]">{listing.title}</p>
                        <p className="text-xs text-black/50">
                          {listing.salary_min}〜{listing.salary_max}万円 | {listing.required_skills.slice(0, 3).join('、')}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== 収益タブ ==================== */}
        {!isLoading && activeTab === 'revenue' && (
          <div className="space-y-6">
            <h2 className="font-bold text-[#111111]">収益ダッシュボード</h2>

            {/* KPIカード */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: '成約件数', value: `${placed.length}件`, color: '#111111' },
                { label: '成功報酬合計', value: `${(totalRevenue / 10000).toFixed(0)}万円`, color: '#FF6B00' },
                { label: '平均成功報酬', value: placed.length ? `${Math.round(totalRevenue / placed.length / 10000)}万円` : '—', color: '#2563EB' },
                { label: 'Sランクマッチ', value: `${sRankMatches.length}件`, color: '#FF6B00' },
              ].map(kpi => (
                <div key={kpi.label} className="bg-white rounded-2xl border border-black/10 p-5">
                  <p className="text-xs text-black/50 mb-1">{kpi.label}</p>
                  <p className="text-3xl font-black" style={{ color: kpi.color }}>{kpi.value}</p>
                </div>
              ))}
            </div>

            {/* 成功報酬シミュレーター */}
            <div className="bg-white rounded-2xl border border-black/10 p-6">
              <h3 className="font-bold text-[#111111] mb-4">月次収益シミュレーション</h3>
              <div className="space-y-3">
                {[
                  { label: '成功報酬（3件 × 100万円）', value: '300万円', type: '柱1' },
                  { label: 'SaaS（30社 × 29,800円）', value: '89万円', type: '柱2' },
                  { label: '求職者サービス（100人 × 4,980円）', value: '50万円', type: '柱3' },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between py-3 border-b border-black/5 last:border-0">
                    <div>
                      <span className="text-xs font-bold text-[#FF6B00] mr-2">{row.type}</span>
                      <span className="text-sm text-black/70">{row.label}</span>
                    </div>
                    <span className="font-bold text-[#111111]">{row.value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-3 border-t-2 border-[#FF6B00]/20">
                  <span className="font-bold text-[#111111]">月収合計目標（6ヶ月目）</span>
                  <span className="text-2xl font-black text-[#FF6B00]">約440万円</span>
                </div>
              </div>
            </div>

            {/* 採用決定一覧 */}
            {placed.length > 0 && (
              <div className="bg-white rounded-2xl border border-black/10 p-6">
                <h3 className="font-bold text-[#111111] mb-4">採用決定一覧</h3>
                <div className="space-y-3">
                  {placed.map(match => (
                    <div key={match.id} className="flex items-center justify-between p-3 bg-[#F8F8F8] rounded-xl">
                      <div>
                        <p className="font-bold text-sm text-[#111111]">{match.job_seekers?.name}</p>
                        <p className="text-xs text-black/50">{match.job_listings?.companies?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#111111]">年収 {match.placed_salary}万円</p>
                        <p className="text-xs text-[#FF6B00] font-bold">
                          成功報酬 {(match.success_fee_amount / 10000).toFixed(0)}万円
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

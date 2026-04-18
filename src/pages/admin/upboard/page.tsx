import { useState, useEffect, useCallback } from 'react';
import { SEO } from '../../../components/SEO';
import { getCandidates, getCandidateStats, updateCandidateStatus, recordPlacement, type CandidateRow } from '../../../lib/upboardApi';
import { generateScoutMessage, formatCandidateForCSV } from '../../../lib/upboardScoring';

// =====================
// 定数・型
// =====================

type TabType = 'dashboard' | 'leads' | 'pipeline' | 'scout' | 'revenue';

const RANK_CONFIG = {
  S: { color: 'bg-amber-500', text: 'text-amber-600', badge: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Sランク' },
  A: { color: 'bg-blue-600', text: 'text-blue-600', badge: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Aランク' },
  B: { color: 'bg-emerald-600', text: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Bランク' },
};

const STATUS_OPTIONS = [
  { value: 'new', label: '未対応', color: '#6B7280' },
  { value: 'contacted', label: '連絡済', color: '#2563EB' },
  { value: 'interviewing', label: '面接中', color: '#F59E0B' },
  { value: 'offered', label: 'オファー', color: '#7C3AED' },
  { value: 'placed', label: '成約', color: '#059669' },
  { value: 'rejected', label: '不採用', color: '#EF4444' },
  { value: 'withdrawn', label: '辞退', color: '#9CA3AF' },
];

const EDU_LABEL: Record<string, string> = {
  junior_high: '中卒',
  high_school: '高卒',
  vocational: '専門卒',
  junior_college: '短大卒',
  university_low: '大卒（低偏差値）',
  university_mid: '大卒（中偏差値）',
  graduate: '大学院卒',
};

const JOB_LABEL: Record<string, string> = {
  engineer_backend: 'バックエンドEng.',
  engineer_frontend: 'フロントEng.',
  engineer_infra: 'インフラEng.',
  engineer_fullstack: 'フルスタックEng.',
  pm: 'PM',
  general: '総合職',
  other: 'その他',
};

const TIMING_LABEL: Record<string, string> = {
  immediately: '今すぐ 🔥',
  '2-3months': '2〜3ヶ月',
  '6months': '半年以内',
  not_urgent: '情報収集',
};

// =====================
// CSV出力
// =====================

function downloadCSV(candidates: CandidateRow[]) {
  const rows = candidates.map(c => formatCandidateForCSV(c as unknown as Record<string, unknown>));
  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `upboard_leads_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// =====================
// 詳細モーダル
// =====================

function CandidateModal({
  candidate,
  onClose,
  onStatusChange,
  onPlaced,
}: {
  candidate: CandidateRow;
  onClose: () => void;
  onStatusChange: (status: string) => void;
  onPlaced: (salary: number) => void;
}) {
  const [scoutCopied, setScoutCopied] = useState(false);
  const [scoutGenerated, setScoutGenerated] = useState(false);
  const [scout, setScout] = useState({ subject: '', body: '' });
  const [placedSalary, setPlacedSalary] = useState('');
  const [showPlaceForm, setShowPlaceForm] = useState(false);

  const rc = RANK_CONFIG[candidate.rank as keyof typeof RANK_CONFIG] ?? RANK_CONFIG.B;

  const generateScout = () => {
    const msg = generateScoutMessage({
      name: candidate.name,
      skills: candidate.skills,
      exp_years: Number(candidate.exp_years),
      job_type: candidate.job_type,
      rank: candidate.rank,
      want_income: candidate.want_income,
    });
    setScout(msg);
    setScoutGenerated(true);
  };

  const copyScout = async () => {
    const text = `件名: ${scout.subject}\n\n${scout.body}`;
    await navigator.clipboard.writeText(text);
    setScoutCopied(true);
    setTimeout(() => setScoutCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl my-6 shadow-2xl">
        {/* ヘッダー */}
        <div className="bg-[#0A0F1E] rounded-t-3xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${rc.color} flex items-center justify-center text-lg font-black text-white`}>
                {candidate.rank}
              </div>
              <div>
                <p className="font-black text-xl">{candidate.name}</p>
                <p className="text-white/60 text-sm">{candidate.email}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white text-2xl">×</button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-black">{candidate.score}</p>
              <p className="text-white/50 text-xs">AIスコア</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-sm font-bold">{candidate.estimated_salary_min}〜{candidate.estimated_salary_max}</p>
              <p className="text-white/50 text-xs">推定年収（万円）</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-sm font-bold">{TIMING_LABEL[candidate.timing] ?? candidate.timing}</p>
              <p className="text-white/50 text-xs">転職時期</p>
            </div>
          </div>
        </div>

        {/* 基本情報 */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '年齢', value: candidate.age ? `${candidate.age}歳` : '—' },
              { label: '学歴', value: EDU_LABEL[candidate.education] ?? candidate.education },
              { label: '居住地', value: candidate.area || '—' },
              { label: '希望職種', value: JOB_LABEL[candidate.job_type] ?? candidate.job_type },
              { label: '現年収', value: candidate.current_income ? `${candidate.current_income}万円` : '—' },
              { label: '希望年収', value: candidate.want_income ? `${candidate.want_income}万円〜` : '—' },
              { label: '就業状況', value: candidate.employment_status || '—' },
              { label: '登録日', value: new Date(candidate.registered_at).toLocaleDateString('ja-JP') },
            ].map(r => (
              <div key={r.label} className="bg-[#F8F9FF] rounded-xl p-3">
                <p className="text-xs text-black/40 mb-0.5">{r.label}</p>
                <p className="text-sm font-bold text-[#0A0F1E]">{r.value}</p>
              </div>
            ))}
          </div>

          {/* スキル */}
          <div>
            <p className="text-sm font-bold text-[#0A0F1E] mb-2">保有スキル</p>
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills.map(s => (
                <span key={s} className="px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-medium text-blue-700">{s}</span>
              ))}
              {candidate.skills.length === 0 && <span className="text-sm text-black/40">未登録</span>}
            </div>
          </div>

          {/* ポートフォリオ */}
          {candidate.portfolio_url && (
            <div>
              <p className="text-sm font-bold text-[#0A0F1E] mb-1">ポートフォリオ</p>
              <a href={candidate.portfolio_url} target="_blank" rel="noopener noreferrer"
                className="text-blue-600 text-sm hover:underline break-all">{candidate.portfolio_url}</a>
            </div>
          )}

          {/* メッセージ */}
          {candidate.message && (
            <div>
              <p className="text-sm font-bold text-[#0A0F1E] mb-1">本人からのメッセージ</p>
              <p className="text-sm text-black/70 bg-[#F8F9FF] rounded-xl p-3">{candidate.message}</p>
            </div>
          )}

          {/* スコア内訳 */}
          <div>
            <p className="text-sm font-bold text-[#0A0F1E] mb-3">スコア内訳</p>
            <div className="space-y-2">
              {[
                { label: 'スキルセット一致度', score: candidate.score_skill, max: 40 },
                { label: 'スキルの幅', score: candidate.score_breadth, max: 10 },
                { label: 'エンジニア経験年数', score: candidate.score_exp, max: 25 },
                { label: '転職緊急度', score: candidate.score_urgency, max: 10 },
                { label: 'ポートフォリオ', score: candidate.score_portfolio, max: 8 },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="text-xs text-black/50 w-32 shrink-0">{item.label}</span>
                  <div className="flex-1 h-2 bg-black/8 rounded-full overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                      style={{ width: `${(item.score / item.max) * 100}%` }} />
                  </div>
                  <span className="text-xs font-bold text-[#0A0F1E] w-10 text-right">{item.score}/{item.max}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ステータス変更 */}
          <div>
            <p className="text-sm font-bold text-[#0A0F1E] mb-2">ステータス変更</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map(s => (
                <button key={s.value} type="button"
                  onClick={() => onStatusChange(s.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                    candidate.status === s.value
                      ? 'text-white border-transparent'
                      : 'bg-white border-black/15 text-black/60 hover:border-black/30'
                  }`}
                  style={candidate.status === s.value ? { backgroundColor: s.color, borderColor: s.color } : {}}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* スカウト文生成 */}
          <div className="border-t border-black/8 pt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-[#0A0F1E]">スカウト文（AI自動生成）</p>
              <button onClick={generateScout}
                className="px-4 py-1.5 rounded-full bg-[#0A0F1E] text-white text-xs font-bold hover:bg-black/80">
                {scoutGenerated ? '再生成' : '生成する'}
              </button>
            </div>

            {scoutGenerated && (
              <div className="relative">
                <div className="bg-[#F8F9FF] rounded-xl p-4 text-xs text-black/70 whitespace-pre-wrap max-h-64 overflow-y-auto font-mono leading-relaxed">
                  <p className="font-bold text-[#0A0F1E] mb-2">件名: {scout.subject}</p>
                  {scout.body}
                </div>
                <button onClick={copyScout}
                  className="mt-2 w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors">
                  {scoutCopied ? '✓ コピーしました！' : '📋 スカウト文をコピー'}
                </button>
              </div>
            )}
          </div>

          {/* 成約登録 */}
          {candidate.status === 'offered' && (
            <div className="border-t border-black/8 pt-4">
              <p className="text-sm font-bold text-[#0A0F1E] mb-3">成約登録</p>
              {!showPlaceForm ? (
                <button onClick={() => setShowPlaceForm(true)}
                  className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700">
                  採用成功 → 成約登録
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input type="number" value={placedSalary}
                      onChange={e => setPlacedSalary(e.target.value)}
                      placeholder="500" min={200}
                      className="flex-1 px-4 py-3 rounded-xl border border-black/15 text-sm outline-none" />
                    <span className="text-sm text-black/50 shrink-0">万円で採用</span>
                  </div>
                  {placedSalary && (
                    <div className="bg-emerald-50 rounded-xl p-3 text-sm">
                      <p className="text-emerald-700 font-bold">
                        紹介料（20%）: {Math.round(Number(placedSalary) * 10000 * 0.20 / 10000)}万円
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => { if (placedSalary) onPlaced(Number(placedSalary)); }}
                    disabled={!placedSalary}
                    className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm disabled:opacity-50">
                    成約を確定する
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =====================
// メインダッシュボード
// =====================

export default function AdminUpBoardPage() {
  const [tab, setTab] = useState<TabType>('dashboard');
  const [candidates, setCandidates] = useState<CandidateRow[]>([]);
  const [stats, setStats] = useState({ total: 0, sRank: 0, today: 0, immediately: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [rankFilter, setRankFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [timingFilter, setTimingFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateRow | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    const [candidatesRes, statsRes] = await Promise.all([
      getCandidates(),
      getCandidateStats(),
    ]);
    setCandidates((candidatesRes.data as CandidateRow[]) ?? []);
    setStats(statsRes);
    setIsLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = candidates.filter(c => {
    if (rankFilter && c.rank !== rankFilter) return false;
    if (statusFilter && c.status !== statusFilter) return false;
    if (timingFilter && c.timing !== timingFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.skills?.some(s => s.toLowerCase().includes(q)) ||
        EDU_LABEL[c.education]?.includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = async (status: string) => {
    if (!selectedCandidate) return;
    await updateCandidateStatus(selectedCandidate.id, { status });
    setSelectedCandidate({ ...selectedCandidate, status });
    await load();
  };

  const handlePlaced = async (salary: number) => {
    if (!selectedCandidate) return;
    await recordPlacement({
      candidate_id: selectedCandidate.id,
      company_name: '（未設定）',
      placed_salary: salary,
    });
    setSelectedCandidate(null);
    await load();
  };

  const placed = candidates.filter(c => c.status === 'placed');
  const totalRevenue = placed.reduce((sum) => sum + 0, 0); // DB から計算 (placements テーブルが必要)
  const sRankNew = candidates.filter(c => c.rank === 'S' && c.status === 'new');

  const TABS: { key: TabType; label: string; badge?: number | string }[] = [
    { key: 'dashboard', label: 'ダッシュボード' },
    { key: 'leads', label: 'リード一覧', badge: candidates.length },
    { key: 'pipeline', label: 'パイプライン', badge: sRankNew.length > 0 ? `${sRankNew.length}件要対応` : undefined },
    { key: 'scout', label: 'スカウト管理' },
    { key: 'revenue', label: '収益管理' },
  ];

  return (
    <div className="min-h-screen bg-[#F0F4FF]">
      <SEO title="UpBoard 管理ダッシュボード" description="" />

      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onStatusChange={handleStatusChange}
          onPlaced={handlePlaced}
        />
      )}

      {/* ヘッダー */}
      <div className="bg-[#0A0F1E] px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-white font-black text-lg">UpBoard <span className="text-white/40 font-normal text-sm">管理</span></p>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-center">
            {[
              { label: '総登録数', value: stats.total, color: 'text-white' },
              { label: 'Sランク', value: stats.sRank, color: 'text-amber-400' },
              { label: '本日登録', value: stats.today, color: 'text-cyan-400' },
              { label: '今すぐ転職', value: stats.immediately, color: 'text-orange-400' },
            ].map(s => (
              <div key={s.label}>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-white/40 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* タブ */}
      <div className="bg-white border-b border-black/10 px-4">
        <div className="max-w-7xl mx-auto flex gap-0 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                tab === t.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-black/40 hover:text-black/60'
              }`}>
              {t.label}
              {t.badge !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-black ${
                  tab === t.key ? 'bg-blue-100 text-blue-600' : 'bg-black/8 text-black/40'
                }`}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {isLoading && (
          <div className="text-center py-20 text-black/40">
            <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
            読み込み中...
          </div>
        )}

        {/* ==================== ダッシュボード ==================== */}
        {!isLoading && tab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPIカード */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: '総登録者数', value: stats.total, unit: '名', color: '#0A0F1E' },
                { label: 'Sランク求職者', value: stats.sRank, unit: '名', color: '#F59E0B' },
                { label: '本日の新規登録', value: stats.today, unit: '名', color: '#2563EB' },
                { label: '今すぐ転職希望', value: stats.immediately, unit: '名', color: '#EF4444' },
              ].map(k => (
                <div key={k.label} className="bg-white rounded-2xl border border-black/8 p-5">
                  <p className="text-xs text-black/40 mb-1">{k.label}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black" style={{ color: k.color }}>{k.value}</span>
                    <span className="text-black/40 text-sm mb-1">{k.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Sランク要対応 */}
            {sRankNew.length > 0 && (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🏆</span>
                  <h3 className="font-black text-amber-900">Sランク — 未対応 {sRankNew.length}件</h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-xs font-black animate-pulse">要対応</span>
                </div>
                <div className="space-y-2">
                  {sRankNew.slice(0, 5).map(c => (
                    <div key={c.id} className="bg-white rounded-xl border border-amber-100 p-4 flex items-center justify-between cursor-pointer hover:border-amber-300"
                      onClick={() => setSelectedCandidate(c)}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white font-black text-sm">S</div>
                        <div>
                          <p className="font-bold text-[#0A0F1E] text-sm">{c.name}</p>
                          <p className="text-xs text-black/50">スコア {c.score}点｜{TIMING_LABEL[c.timing]}｜{c.skills.slice(0, 3).join('・')}</p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 rounded-full bg-amber-500 text-white text-xs font-bold">
                        詳細→
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 最近の登録者 */}
            <div className="bg-white rounded-2xl border border-black/8 p-5">
              <h3 className="font-bold text-[#0A0F1E] mb-4">最新登録者（直近10名）</h3>
              <div className="space-y-2">
                {candidates.slice(0, 10).map(c => {
                  const rc = RANK_CONFIG[c.rank as keyof typeof RANK_CONFIG] ?? RANK_CONFIG.B;
                  return (
                    <div key={c.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F8F9FF] cursor-pointer transition-colors"
                      onClick={() => setSelectedCandidate(c)}>
                      <div className={`w-8 h-8 rounded-lg ${rc.color} flex items-center justify-center text-xs font-black text-white shrink-0`}>
                        {c.rank}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-[#0A0F1E] truncate">{c.name}</p>
                        <p className="text-xs text-black/40 truncate">{c.skills.slice(0, 4).join('・')}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold text-[#0A0F1E]">{c.score}点</p>
                        <p className="text-xs text-black/40">{TIMING_LABEL[c.timing]}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================== リード一覧 ==================== */}
        {!isLoading && tab === 'leads' && (
          <div>
            {/* フィルター */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="名前・スキル・学歴で検索..."
                className="flex-1 min-w-48 px-4 py-2.5 rounded-xl border border-black/15 text-sm outline-none focus:border-blue-400"
              />
              <select value={rankFilter} onChange={e => setRankFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-black/15 text-sm bg-white">
                <option value="">全ランク</option>
                <option value="S">Sランク</option>
                <option value="A">Aランク</option>
                <option value="B">Bランク</option>
              </select>
              <select value={timingFilter} onChange={e => setTimingFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-black/15 text-sm bg-white">
                <option value="">全転職時期</option>
                <option value="immediately">今すぐ</option>
                <option value="2-3months">2〜3ヶ月</option>
                <option value="6months">半年以内</option>
              </select>
              <button
                onClick={() => downloadCSV(filtered)}
                className="px-4 py-2.5 rounded-xl bg-[#0A0F1E] text-white text-sm font-bold hover:bg-black/80 whitespace-nowrap">
                📥 CSV出力 ({filtered.length}件)
              </button>
              <a href="/upboard/register" target="_blank"
                className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 whitespace-nowrap">
                + 登録フォーム
              </a>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-black/8">
                <p className="text-4xl mb-3">👤</p>
                <p className="text-black/40 text-sm">条件に合う求職者が見つかりません</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-black/8 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#F8F9FF] border-b border-black/8">
                      <tr>
                        {['ランク', '氏名', '学歴', '転職時期', 'スキル（主要）', '希望年収', 'スコア', 'ステータス', ''].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-bold text-black/50 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {filtered.map(c => {
                        const rc = RANK_CONFIG[c.rank as keyof typeof RANK_CONFIG] ?? RANK_CONFIG.B;
                        const status = STATUS_OPTIONS.find(s => s.value === c.status);
                        return (
                          <tr key={c.id} className="hover:bg-[#F8F9FF] cursor-pointer transition-colors"
                            onClick={() => setSelectedCandidate(c)}>
                            <td className="px-4 py-3">
                              <div className={`w-8 h-8 rounded-lg ${rc.color} flex items-center justify-center text-xs font-black text-white`}>
                                {c.rank}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-bold text-[#0A0F1E]">{c.name}</p>
                              <p className="text-xs text-black/40">{c.email}</p>
                            </td>
                            <td className="px-4 py-3 text-black/60 whitespace-nowrap">
                              {EDU_LABEL[c.education] ?? c.education ?? '—'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={c.timing === 'immediately' ? 'font-bold text-orange-500' : 'text-black/60'}>
                                {TIMING_LABEL[c.timing] ?? c.timing ?? '—'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1 max-w-48">
                                {c.skills.slice(0, 3).map(s => (
                                  <span key={s} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{s}</span>
                                ))}
                                {c.skills.length > 3 && (
                                  <span className="text-xs text-black/40">+{c.skills.length - 3}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap font-bold text-[#0A0F1E]">
                              {c.want_income ? `${c.want_income}万円〜` : '—'}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5">
                                <span className="font-black text-[#0A0F1E]">{c.score}</span>
                                <div className="w-16 h-1.5 bg-black/8 rounded-full overflow-hidden">
                                  <div className={`h-1.5 rounded-full ${rc.color.replace('bg-', 'bg-')}`}
                                    style={{ width: `${Math.min(100, Math.round((c.score / 123) * 100))}%` }} />
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 rounded-full text-xs font-bold text-white"
                                style={{ backgroundColor: status?.color ?? '#6B7280' }}>
                                {status?.label ?? c.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <button className="px-3 py-1 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors">
                                詳細
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== パイプライン ==================== */}
        {!isLoading && tab === 'pipeline' && (
          <div>
            <h2 className="font-black text-[#0A0F1E] mb-5">採用パイプライン</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
              {STATUS_OPTIONS.map(s => {
                const count = candidates.filter(c => c.status === s.value).length;
                return (
                  <div key={s.value}
                    className="bg-white rounded-2xl border border-black/8 p-4 text-center cursor-pointer hover:border-blue-200 transition-colors"
                    onClick={() => setStatusFilter(statusFilter === s.value ? '' : s.value)}>
                    <p className="text-3xl font-black text-[#0A0F1E]">{count}</p>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white mt-1 inline-block"
                      style={{ backgroundColor: s.color }}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2">
              {candidates
                .filter(c => !statusFilter || c.status === statusFilter)
                .sort((a, b) => b.score - a.score)
                .map(c => {
                  const rc = RANK_CONFIG[c.rank as keyof typeof RANK_CONFIG] ?? RANK_CONFIG.B;
                  const status = STATUS_OPTIONS.find(s => s.value === c.status);
                  return (
                    <div key={c.id} className="bg-white rounded-xl border border-black/8 p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl ${rc.color} flex items-center justify-center text-xs font-black text-white shrink-0`}>
                          {c.rank}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-[#0A0F1E]">{c.name}</p>
                          <p className="text-xs text-black/40">{c.skills.slice(0, 4).join('・')}</p>
                        </div>
                        <span className="text-xs font-bold text-white px-2 py-1 rounded-full shrink-0"
                          style={{ backgroundColor: status?.color ?? '#6B7280' }}>
                          {status?.label}
                        </span>
                        <select value={c.status}
                          onChange={async e => {
                            await updateCandidateStatus(c.id, { status: e.target.value });
                            load();
                          }}
                          onClick={e => e.stopPropagation()}
                          className="text-xs border border-black/15 rounded-lg px-2 py-1.5 bg-white shrink-0">
                          {STATUS_OPTIONS.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                        <button onClick={() => setSelectedCandidate(c)}
                          className="text-xs text-blue-600 font-bold hover:underline shrink-0">
                          詳細
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ==================== スカウト管理 ==================== */}
        {!isLoading && tab === 'scout' && (
          <div className="space-y-5">
            <h2 className="font-black text-[#0A0F1E]">スカウト管理</h2>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <h3 className="font-bold text-blue-900 mb-2 text-sm">スカウト文一括生成の流れ</h3>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. リード一覧から候補者を選択（Sランク推奨）</li>
                <li>2. 詳細モーダルで「スカウト文を生成する」をクリック</li>
                <li>3. 生成されたスカウト文をコピーして、Gmailなどから送信</li>
                <li>4. ステータスを「連絡済」に更新する</li>
              </ol>
            </div>

            {/* Sランク未対応リスト */}
            <div className="bg-white rounded-2xl border border-black/8 p-5">
              <h3 className="font-bold text-[#0A0F1E] mb-4">Sランク — 未スカウト ({sRankNew.length}名)</h3>
              {sRankNew.length === 0 ? (
                <p className="text-black/40 text-sm text-center py-8">未スカウトのSランク候補者はいません</p>
              ) : (
                <div className="space-y-2">
                  {sRankNew.map(c => (
                    <div key={c.id}
                      className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100 cursor-pointer hover:border-amber-300"
                      onClick={() => setSelectedCandidate(c)}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white font-black text-sm">S</div>
                        <div>
                          <p className="font-bold text-sm text-[#0A0F1E]">{c.name}</p>
                          <p className="text-xs text-black/50">{c.skills.slice(0, 4).join('・')}</p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 rounded-full bg-amber-500 text-white text-xs font-bold">
                        スカウト文を生成 →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== 収益管理 ==================== */}
        {!isLoading && tab === 'revenue' && (
          <div className="space-y-6">
            <h2 className="font-black text-[#0A0F1E]">収益管理</h2>

            {/* KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: '総成約件数', value: `${placed.length}件`, color: '#0A0F1E' },
                { label: '今月の成約件数', value: `${placed.filter(c => {
                  const m = new Date(); const r = new Date(c.registered_at);
                  return r.getMonth() === m.getMonth() && r.getFullYear() === m.getFullYear();
                }).length}件`, color: '#2563EB' },
                { label: '累計売上（目安）', value: `${totalRevenue > 0 ? (totalRevenue / 10000).toFixed(0) + '万円' : '成約登録で自動集計'}`, color: '#059669' },
              ].map(k => (
                <div key={k.label} className="bg-white rounded-2xl border border-black/8 p-5">
                  <p className="text-xs text-black/40 mb-1">{k.label}</p>
                  <p className="text-3xl font-black" style={{ color: k.color }}>{k.value}</p>
                </div>
              ))}
            </div>

            {/* 収益モデル説明 */}
            <div className="bg-white rounded-2xl border border-black/8 p-5">
              <h3 className="font-bold text-[#0A0F1E] mb-4">収益モデル（別途契約書締結）</h3>
              <div className="space-y-3">
                {[
                  { label: '成功報酬率（標準）', value: '年収の20%', note: '採用成功時のみ。事前に企業と契約書締結。' },
                  { label: '成功報酬率（高単価）', value: '年収の15〜30%', note: '企業との交渉による。特殊スキルは30%も可能。' },
                  { label: '年収500万円の採用例', value: '100万円/件', note: '= 500万 × 20%' },
                  { label: '月間目標（3件成約時）', value: '月収300万円', note: 'Phase1ゴール（Month 1〜2）' },
                ].map(r => (
                  <div key={r.label} className="flex items-start justify-between py-3 border-b border-black/5 last:border-0">
                    <div>
                      <p className="text-sm font-bold text-[#0A0F1E]">{r.label}</p>
                      <p className="text-xs text-black/40">{r.note}</p>
                    </div>
                    <span className="font-black text-[#0A0F1E] text-right shrink-0 ml-4">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 成約一覧 */}
            {placed.length > 0 && (
              <div className="bg-white rounded-2xl border border-black/8 p-5">
                <h3 className="font-bold text-[#0A0F1E] mb-4">成約済み（{placed.length}件）</h3>
                <div className="space-y-2">
                  {placed.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <div>
                        <p className="font-bold text-sm text-[#0A0F1E]">{c.name}</p>
                        <p className="text-xs text-black/50">成約日: {new Date(c.updated_at).toLocaleDateString('ja-JP')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-700">成約済み</p>
                        <p className="text-xs text-black/40">紹介料は別途契約書で管理</p>
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

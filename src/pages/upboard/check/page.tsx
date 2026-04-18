import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../../../components/SEO';
import { calcCandidateScore } from '../../../lib/upboardScoring';
import { saveDiagnosisLead } from '../../../lib/upboardApi';

// =====================
// 定数
// =====================

const SKILL_OPTIONS = [
  // 言語
  { label: 'JavaScript', cat: '言語' },
  { label: 'TypeScript', cat: '言語' },
  { label: 'Python', cat: '言語' },
  { label: 'Go', cat: '言語' },
  { label: 'Java', cat: '言語' },
  { label: 'Ruby', cat: '言語' },
  { label: 'PHP', cat: '言語' },
  { label: 'Swift', cat: '言語' },
  { label: 'Kotlin', cat: '言語' },
  { label: 'Rust', cat: '言語' },
  { label: 'C#', cat: '言語' },
  // フレームワーク
  { label: 'React', cat: 'FW/ライブラリ' },
  { label: 'Vue', cat: 'FW/ライブラリ' },
  { label: 'Next.js', cat: 'FW/ライブラリ' },
  { label: 'Node.js', cat: 'FW/ライブラリ' },
  { label: 'Django', cat: 'FW/ライブラリ' },
  { label: 'Rails', cat: 'FW/ライブラリ' },
  { label: 'FastAPI', cat: 'FW/ライブラリ' },
  // インフラ・クラウド
  { label: 'AWS', cat: 'インフラ' },
  { label: 'GCP', cat: 'インフラ' },
  { label: 'Azure', cat: 'インフラ' },
  { label: 'Docker', cat: 'インフラ' },
  { label: 'Kubernetes', cat: 'インフラ' },
  { label: 'Linux', cat: 'インフラ' },
  { label: 'Terraform', cat: 'インフラ' },
  { label: 'CI/CD', cat: 'インフラ' },
  // DB・その他
  { label: 'SQL', cat: 'DB・その他' },
  { label: 'PostgreSQL', cat: 'DB・その他' },
  { label: 'MySQL', cat: 'DB・その他' },
  { label: 'MongoDB', cat: 'DB・その他' },
  { label: 'Redis', cat: 'DB・その他' },
  { label: 'Git', cat: 'DB・その他' },
  { label: 'セキュリティ', cat: 'DB・その他' },
  { label: 'ネットワーク', cat: 'DB・その他' },
];

const JOB_TYPE_OPTIONS = [
  { value: 'engineer_backend', label: 'バックエンドエンジニア' },
  { value: 'engineer_frontend', label: 'フロントエンドエンジニア' },
  { value: 'engineer_infra', label: 'インフラ・クラウドエンジニア' },
  { value: 'engineer_fullstack', label: 'フルスタックエンジニア' },
  { value: 'pm', label: 'プロジェクトマネージャー（PM）' },
  { value: 'general', label: '総合職（営業・企画など）' },
  { value: 'other', label: 'その他' },
];

const TIMING_OPTIONS = [
  { value: 'immediately', label: '今すぐ（内定が出れば即入社）', score: '🔥 最高評価' },
  { value: '2-3months', label: '2〜3ヶ月以内', score: '⬆ 高評価' },
  { value: '6months', label: '半年以内', score: '' },
  { value: 'not_urgent', label: 'まずは情報収集', score: '' },
];

const EXP_OPTIONS = [
  { value: 0, label: '未経験（0年）', points: '0pt' },
  { value: 0.5, label: '1年未満（独学・副業含む）', points: '+5pt' },
  { value: 1, label: '1〜3年', points: '+12pt' },
  { value: 3, label: '3〜5年', points: '+20pt' },
  { value: 5, label: '5年以上', points: '+25pt' },
];

const RANK_CONFIG = {
  S: {
    color: 'from-amber-400 to-orange-500',
    textColor: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-500 text-white',
    label: 'Sランク｜即戦力評価',
    emoji: '🏆',
  },
  A: {
    color: 'from-blue-500 to-indigo-600',
    textColor: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-600 text-white',
    label: 'Aランク｜高ポテンシャル',
    emoji: '⭐',
  },
  B: {
    color: 'from-emerald-500 to-teal-600',
    textColor: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    badge: 'bg-emerald-600 text-white',
    label: 'Bランク｜成長枠',
    emoji: '🌱',
  },
};

type Step = 1 | 2 | 3 | 4 | 'analyzing' | 'result';

interface DiagnosisForm {
  // step1
  name: string;
  email: string;
  age: string;
  // step2
  job_type: string;
  timing: string;
  want_income: string;
  // step3
  skills: string[];
  exp_years: number;
  portfolio_url: string;
  // step4
  reason: string;
  message: string;
  privacy_agreed: boolean;
  scout_agreed: boolean;
}

const INIT: DiagnosisForm = {
  name: '', email: '', age: '',
  job_type: '', timing: '', want_income: '',
  skills: [], exp_years: 0, portfolio_url: '',
  reason: '', message: '',
  privacy_agreed: false, scout_agreed: false,
};

const SKILL_CATS = ['言語', 'FW/ライブラリ', 'インフラ', 'DB・その他'] as const;

// =====================
// サブコンポーネント
// =====================

function ProgressBar({ step }: { step: number }) {
  const steps = ['基本情報', '現状', 'スキル', '志望'];
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i + 1 < step ? 'bg-blue-600 text-white' :
              i + 1 === step ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
              'bg-black/10 text-black/30'
            }`}>
              {i + 1 < step ? '✓' : i + 1}
            </div>
            <span className={`text-[10px] mt-1 font-bold ${i + 1 <= step ? 'text-blue-600' : 'text-black/25'}`}>
              {s}
            </span>
          </div>
        ))}
      </div>
      <div className="h-1.5 bg-black/10 rounded-full relative">
        <div
          className="h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
          style={{ width: `${((step - 1) / 3) * 100}%` }}
        />
      </div>
    </div>
  );
}

// =====================
// メインコンポーネント
// =====================

export default function UpBoardCheckPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<DiagnosisForm>(INIT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ReturnType<typeof calcCandidateScore> | null>(null);
  const [activeCat, setActiveCat] = useState<string>('言語');

  const update = <K extends keyof DiagnosisForm>(k: K, v: DiagnosisForm[K]) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: '' }));
  };

  const toggleSkill = (s: string) => {
    setForm(p => ({
      ...p,
      skills: p.skills.includes(s) ? p.skills.filter(x => x !== s) : [...p.skills, s],
    }));
  };

  const validate = (s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!form.name.trim()) e.name = '氏名を入力してください';
      if (!form.email.trim()) e.email = 'メールアドレスを入力してください';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = '正しいメールアドレスを入力してください';
    }
    if (s === 2) {
      if (!form.job_type) e.job_type = '希望職種を選択してください';
      if (!form.timing) e.timing = '転職時期を選択してください';
    }
    if (s === 3) {
      if (form.skills.length === 0) e.skills = '1つ以上スキルを選択してください';
    }
    if (s === 4) {
      if (!form.privacy_agreed) e.privacy_agreed = 'プライバシーポリシーへの同意が必要です';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate(step as number)) {
      if (step === 4) submitDiagnosis();
      else setStep(s => (Number(s) + 1) as Step);
    }
  };

  const prev = () => setStep(s => Math.max(1, Number(s) - 1) as Step);

  const submitDiagnosis = async () => {
    setStep('analyzing');

    const scoreResult = calcCandidateScore({
      skills: form.skills,
      exp_years: form.exp_years,
      timing: form.timing,
      portfolio_url: form.portfolio_url,
    }, form.job_type);

    // Supabaseへ診断リードを保存（失敗しても診断は続行）
    await saveDiagnosisLead({
      email: form.email,
      name: form.name,
      score: scoreResult.total,
      rank: scoreResult.rank,
      skills: form.skills,
      exp_years: form.exp_years,
      timing: form.timing,
      job_type: form.job_type,
      portfolio_url: form.portfolio_url,
    }).catch(console.error);

    await new Promise(r => setTimeout(r, 2200));
    setResult(scoreResult);
    setStep('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // =====================
  // AI分析中画面
  // =====================
  if (step === 'analyzing') {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/30 border-t-blue-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-3xl">🤖</div>
          </div>
          <h2 className="text-2xl font-black text-white mb-4">AIがあなたを分析中...</h2>
          <div className="space-y-2 text-sm text-white/50 max-w-xs mx-auto">
            <p className="animate-pulse">✦ スキルセットをスコアリング中</p>
            <p className="animate-pulse delay-500">✦ 市場価値を算出中</p>
            <p className="animate-pulse delay-1000">✦ マッチング企業をスキャン中</p>
          </div>
        </div>
      </div>
    );
  }

  // =====================
  // 診断結果画面
  // =====================
  if (step === 'result' && result) {
    const rc = RANK_CONFIG[result.rank];
    const scorePercent = Math.min(100, Math.round((result.total / 123) * 100));

    return (
      <div className="min-h-screen bg-[#F8F9FF]">
        <SEO title="AI診断結果 | UpBoard" description="あなたの市場価値スコアと上場企業マッチング結果。" />

        {/* ヘッダー */}
        <div className="bg-[#0A0F1E] py-6 px-4 text-center">
          <p className="text-white/50 text-xs mb-1">診断完了</p>
          <h1 className="text-white font-black text-2xl">あなたのAI診断結果</h1>
        </div>

        <div className="max-w-xl mx-auto px-4 py-8 space-y-5">

          {/* スコアカード */}
          <div className={`${rc.bg} ${rc.border} border-2 rounded-3xl p-6 text-center`}>
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-black text-white bg-gradient-to-r ${rc.color} mb-4`}>
              {rc.emoji} {rc.label}
            </div>

            {/* スコア円グラフ風 */}
            <div className="relative w-36 h-36 mx-auto mb-4">
              <svg className="w-36 h-36 -rotate-90" viewBox="0 0 144 144">
                <circle cx="72" cy="72" r="60" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="12" />
                <circle
                  cx="72" cy="72" r="60" fill="none"
                  className={`${result.rank === 'S' ? 'stroke-amber-500' : result.rank === 'A' ? 'stroke-blue-500' : 'stroke-emerald-500'}`}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 60}`}
                  strokeDashoffset={`${2 * Math.PI * 60 * (1 - scorePercent / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-black ${rc.textColor}`}>{result.total}</span>
                <span className="text-black/40 text-xs">点</span>
              </div>
            </div>

            <p className={`font-bold text-sm ${rc.textColor} mb-2`}>{result.message}</p>
          </div>

          {/* 推定年収 */}
          <div className="bg-white rounded-2xl border border-black/10 p-5">
            <p className="text-xs text-black/50 mb-1">AI推定年収レンジ</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-3xl font-black text-[#0A0F1E]">{result.estimated_salary_min}</span>
              <span className="text-black/40 text-sm mb-1">〜</span>
              <span className="text-3xl font-black text-[#0A0F1E]">{result.estimated_salary_max}</span>
              <span className="text-black/50 text-sm mb-1">万円</span>
            </div>
            <p className="text-xs text-black/40">※スキル・経験・市場動向をもとにAIが算出した参考値</p>
          </div>

          {/* スコア内訳 */}
          <div className="bg-white rounded-2xl border border-black/10 p-5">
            <p className="font-bold text-sm text-[#0A0F1E] mb-4">スコア内訳</p>
            <div className="space-y-3">
              {[
                { label: 'スキルセット一致度', score: result.breakdown.skill, max: 40 },
                { label: 'スキルの幅', score: result.breakdown.breadth, max: 10 },
                { label: 'エンジニア経験年数', score: result.breakdown.exp, max: 25 },
                { label: '転職緊急度', score: result.breakdown.urgency, max: 10 },
                { label: 'ポートフォリオ', score: result.breakdown.portfolio, max: 8 },
                { label: '基礎点', score: result.breakdown.base, max: 30 },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-xs text-black/60 w-32 shrink-0">{item.label}</span>
                  <div className="flex-1 h-2 bg-black/8 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${rc.color} transition-all duration-700`}
                      style={{ width: `${(item.score / item.max) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-[#0A0F1E] w-12 text-right">{item.score}/{item.max}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 強み */}
          {result.strengths.length > 0 && (
            <div className="bg-white rounded-2xl border border-black/10 p-5">
              <p className="font-bold text-sm text-[#0A0F1E] mb-3">あなたの強み（AI分析）</p>
              <ul className="space-y-2">
                {result.strengths.map(s => (
                  <li key={s} className="flex items-start gap-2 text-sm text-black/70">
                    <span className="text-blue-500 shrink-0 mt-0.5">✦</span>{s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* マッチ企業（ティーザー） */}
          <div className="bg-[#0A0F1E] rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-sm">マッチした上場企業</p>
              <span className="text-xs text-white/40">詳細は登録後に解放</span>
            </div>
            {[
              'IT・SaaS系 東証プライム上場',
              '不動産テック 東証グロース上場',
              'Webサービス 東証スタンダード上場',
            ].map((co, i) => (
              <div key={co} className="flex items-center gap-3 py-3 border-b border-white/10 last:border-0">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-xs font-black text-blue-400">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{i === 0 ? co : '●●●●●●●●●●'}</p>
                  <p className="text-xs text-white/40">年収 {(result.estimated_salary_min + i * 30)}〜{(result.estimated_salary_max + i * 30)}万円</p>
                </div>
                <div className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${
                  i === 0 ? 'bg-blue-500' : 'bg-white/20 text-white/50'
                }`}>
                  {i === 0 ? 'マッチ度高' : '🔒 登録後公開'}
                </div>
              </div>
            ))}
          </div>

          {/* 次のアクション提案 */}
          {result.next_actions.length > 0 && (
            <div className="bg-white rounded-2xl border border-black/10 p-5">
              <p className="font-bold text-sm text-[#0A0F1E] mb-3">スコアを上げるには</p>
              <ul className="space-y-2">
                {result.next_actions.map(a => (
                  <li key={a} className="flex items-start gap-2 text-sm text-black/60">
                    <span className="text-emerald-500 shrink-0 mt-0.5">→</span>{a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* メインCTA */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white text-center">
            <p className="text-white/80 text-sm mb-2">上場企業からスカウトを受け取る</p>
            <h3 className="font-black text-xl mb-1">プロフィールを登録して<br />全ての企業情報を確認する</h3>
            <p className="text-white/60 text-xs mb-5">マッチ企業2社・エージェントサポート・スカウト受信 — 全て無料</p>
            <Link
              to={`/upboard/register?email=${encodeURIComponent(form.email)}&name=${encodeURIComponent(form.name)}&rank=${result.rank}&score=${result.total}`}
              className="block w-full py-4 rounded-full bg-white text-blue-700 font-black text-lg hover:bg-blue-50 transition-colors"
            >
              今すぐ無料で本登録する →
            </Link>
            <p className="text-white/40 text-xs mt-3">登録所要時間5分・強引な営業は一切ありません</p>
          </div>

          <p className="text-center">
            <Link to="/upboard" className="text-xs text-black/40 hover:text-black/60">← UpBoardトップへ戻る</Link>
          </p>
        </div>
      </div>
    );
  }

  // =====================
  // 4ステップ診断フォーム
  // =====================
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="無料AI適性診断 | UpBoard — 学歴不問で上場企業エンジニアへ"
        description="3〜5分でAIがあなたの市場価値をスコアリング。Sランク評価を受けた方は上場企業からスカウトを受け取れます。"
        canonical="https://azabuplus.jp/upboard/check"
      />

      {/* ヘッダー */}
      <div className="bg-[#0A0F1E] py-5 px-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link to="/upboard" className="text-white/60 text-sm hover:text-white">← UpBoard</Link>
          <span className="text-white font-black text-sm">🤖 無料AI診断</span>
          <span className="text-white/40 text-xs">約3〜5分</span>
        </div>
      </div>

      <section className="max-w-xl mx-auto px-4 py-8">
        <ProgressBar step={step as number} />

        {/* ==================== STEP 1 ==================== */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black text-[#0A0F1E] mb-1">まず基本情報を教えてください</h2>
              <p className="text-sm text-black/50">診断結果はメールでもお送りします</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0A0F1E] mb-1.5">
                お名前 <span className="text-blue-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => update('name', e.target.value)}
                placeholder="山田 太郎"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                  errors.name ? 'border-red-400' : 'border-black/15 focus:border-blue-400'
                }`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0A0F1E] mb-1.5">
                メールアドレス <span className="text-blue-500">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                placeholder="your@email.com"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                  errors.email ? 'border-red-400' : 'border-black/15 focus:border-blue-400'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              <p className="text-xs text-black/40 mt-1">診断結果をメールでもお送りします</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0A0F1E] mb-1.5">年齢</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={form.age}
                  onChange={e => update('age', e.target.value)}
                  placeholder="25"
                  min={15}
                  max={60}
                  className="w-24 px-4 py-3 rounded-xl border border-black/15 focus:border-blue-400 text-sm outline-none"
                />
                <span className="text-sm text-black/50">歳</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== STEP 2 ==================== */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-[#0A0F1E] mb-1">現状を教えてください</h2>
              <p className="text-sm text-black/50">正直に入力するほど診断精度が上がります</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0A0F1E] mb-2">
                希望職種 <span className="text-blue-500">*</span>
              </label>
              <div className="grid grid-cols-1 gap-2">
                {JOB_TYPE_OPTIONS.map(opt => (
                  <label key={opt.value}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                      form.job_type === opt.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-black/12 hover:border-blue-200'
                    }`}>
                    <input type="radio" name="job_type" value={opt.value}
                      checked={form.job_type === opt.value}
                      onChange={() => update('job_type', opt.value)}
                      className="accent-blue-600" />
                    <span className="text-sm font-medium text-[#0A0F1E]">{opt.label}</span>
                  </label>
                ))}
              </div>
              {errors.job_type && <p className="text-red-500 text-xs mt-1">{errors.job_type}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0A0F1E] mb-2">
                転職を考える時期 <span className="text-blue-500">*</span>
              </label>
              <div className="space-y-2">
                {TIMING_OPTIONS.map(opt => (
                  <label key={opt.value}
                    className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                      form.timing === opt.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-black/12 hover:border-blue-200'
                    }`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="timing" value={opt.value}
                        checked={form.timing === opt.value}
                        onChange={() => update('timing', opt.value)}
                        className="accent-blue-600" />
                      <span className="text-sm font-medium text-[#0A0F1E]">{opt.label}</span>
                    </div>
                    {opt.score && (
                      <span className="text-xs font-bold text-orange-500 shrink-0">{opt.score}</span>
                    )}
                  </label>
                ))}
              </div>
              {errors.timing && <p className="text-red-500 text-xs mt-1">{errors.timing}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0A0F1E] mb-1.5">希望年収（目安）</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={form.want_income}
                  onChange={e => update('want_income', e.target.value)}
                  placeholder="400"
                  className="w-28 px-4 py-3 rounded-xl border border-black/15 focus:border-blue-400 text-sm outline-none"
                />
                <span className="text-sm text-black/50">万円〜</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== STEP 3 ==================== */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-[#0A0F1E] mb-1">スキル・経験を教えてください</h2>
              <p className="text-sm text-black/50">スキルは多く選ぶほどスコアが上がります（最大+40点）</p>
            </div>

            {/* スキルタグ選択 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-[#0A0F1E]">
                  保有スキル・技術 <span className="text-blue-500">*</span>
                </label>
                {form.skills.length > 0 && (
                  <span className="text-xs text-blue-600 font-bold">{form.skills.length}個選択中</span>
                )}
              </div>

              {/* カテゴリタブ */}
              <div className="flex gap-1 mb-3 overflow-x-auto">
                {SKILL_CATS.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCat(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                      activeCat === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-black/8 text-black/50 hover:bg-black/12'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.filter(s => s.cat === activeCat).map(s => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => toggleSkill(s.label)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                      form.skills.includes(s.label)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-black/70 border-black/15 hover:border-blue-300'
                    }`}
                  >
                    {form.skills.includes(s.label) && '✓ '}{s.label}
                  </button>
                ))}
              </div>
              {errors.skills && <p className="text-red-500 text-xs mt-2">{errors.skills}</p>}
            </div>

            {/* 経験年数 */}
            <div>
              <label className="block text-sm font-bold text-[#0A0F1E] mb-2">エンジニアとしての実務経験</label>
              <div className="space-y-2">
                {EXP_OPTIONS.map(opt => (
                  <label key={opt.value}
                    className={`flex items-center justify-between gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      form.exp_years === opt.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-black/12 hover:border-blue-200'
                    }`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="exp_years" value={opt.value}
                        checked={form.exp_years === opt.value}
                        onChange={() => update('exp_years', opt.value)}
                        className="accent-blue-600" />
                      <span className="text-sm font-medium text-[#0A0F1E]">{opt.label}</span>
                    </div>
                    <span className="text-xs text-blue-600 font-bold shrink-0">{opt.points}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* ポートフォリオ */}
            <div>
              <label className="block text-sm font-bold text-[#0A0F1E] mb-1">
                ポートフォリオ・GitHub URL
                <span className="ml-2 text-xs font-normal text-orange-500">入力で+8点！</span>
              </label>
              <input
                type="url"
                value={form.portfolio_url}
                onChange={e => update('portfolio_url', e.target.value)}
                placeholder="https://github.com/username"
                className="w-full px-4 py-3 rounded-xl border border-black/15 focus:border-blue-400 text-sm outline-none"
              />
              <p className="text-xs text-black/40 mt-1">GitHub / ポートフォリオサイト / Qiitaなど何でもOK</p>
            </div>
          </div>
        )}

        {/* ==================== STEP 4 ==================== */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black text-[#0A0F1E] mb-1">志望・一言メッセージ</h2>
              <p className="text-sm text-black/50">任意項目です。入力するほど診断精度が向上します</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0A0F1E] mb-1.5">転職を考えている理由（任意）</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {['年収アップ', 'スキルアップ', '学歴の壁を超えたい', '今の環境を変えたい', '上場企業で働きたい', '安定したい'].map(r => (
                  <button key={r} type="button"
                    onClick={() => update('reason', form.reason === r ? '' : r)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      form.reason === r
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-black/15 text-black/60 hover:border-blue-300'
                    }`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0A0F1E] mb-1.5">担当エージェントへのひとこと（任意）</label>
              <textarea
                value={form.message}
                onChange={e => update('message', e.target.value)}
                rows={3}
                placeholder="例：高卒ですが独学でPythonを3年間学んできました。学歴関係なく実力を見てほしいです。"
                className="w-full px-4 py-3 rounded-xl border border-black/15 focus:border-blue-400 text-sm outline-none resize-none"
              />
            </div>

            {/* 同意 */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox"
                  checked={form.privacy_agreed}
                  onChange={e => update('privacy_agreed', e.target.checked)}
                  className="mt-1 accent-blue-600 w-4 h-4 shrink-0" />
                <span className="text-sm text-black/70">
                  <a href="/privacy" className="text-blue-600 underline" target="_blank">プライバシーポリシー</a>に同意の上、診断結果を受け取ります。入力情報は転職支援サービスの提供にのみ利用します。
                </span>
              </label>
              {errors.privacy_agreed && <p className="text-red-500 text-xs">{errors.privacy_agreed}</p>}

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox"
                  checked={form.scout_agreed}
                  onChange={e => update('scout_agreed', e.target.checked)}
                  className="mt-1 accent-blue-600 w-4 h-4 shrink-0" />
                <span className="text-sm text-black/70">
                  スカウトメールの受信に同意します（任意）。同意しなくても診断を受けられます。
                </span>
              </label>
            </div>
          </div>
        )}

        {/* ナビゲーション */}
        <div className="flex gap-3 mt-8">
          {typeof step === 'number' && step > 1 && (
            <button type="button" onClick={prev}
              className="flex-1 py-3.5 rounded-full border border-black/20 text-black/70 font-medium text-sm hover:border-black/40 transition-colors">
              ← 戻る
            </button>
          )}
          <button
            type="button"
            onClick={next}
            className="flex-1 py-3.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-black text-sm hover:opacity-90 transition-opacity shadow-lg shadow-blue-200"
          >
            {step === 4 ? '🤖 AI診断を実行する →' : '次へ →'}
          </button>
        </div>

        {typeof step === 'number' && step === 1 && (
          <p className="text-center text-xs text-black/30 mt-4">
            ✓ 無料 ✓ 3〜5分 ✓ 強引な勧誘なし
          </p>
        )}
      </section>
    </div>
  );
}

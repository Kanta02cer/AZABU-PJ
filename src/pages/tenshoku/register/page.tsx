import { useState, useEffect } from 'react';
import { SEO } from '../../../components/SEO';
import { registerJobSeeker, type JobSeekerInput } from '../../../lib/recruitmentApi';
import { calcMarketValueScore } from '../../../lib/matchingEngine';

// =====================
// 定数
// =====================

const SKILL_OPTIONS = [
  // インフラ・クラウド
  'AWS', 'Azure', 'GCP', 'Linux', 'Docker', 'Kubernetes',
  'ネットワーク', 'セキュリティ', 'サーバー管理',
  // 開発
  'Python', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Node.js',
  'Java', 'Go', 'PHP', 'Ruby',
  // データ・AI
  'SQL', 'データ分析', '機械学習', 'BigQuery', 'Tableau',
  // 業務・マネジメント
  'PM', 'プロジェクト管理', '要件定義', '営業', '不動産', '建設',
  // 資格
  '宅建', '基本情報', '応用情報', 'AWS認定',
];

const INDUSTRY_OPTIONS = [
  'IT・Web・テクノロジー',
  '不動産・建設',
  '金融・保険・FinTech',
  'コンサルティング',
  '製造・メーカー',
  '小売・流通・EC',
  '医療・ヘルスケア',
  'その他',
];

const JOB_TYPE_OPTIONS = [
  'エンジニア（インフラ・クラウド）',
  'エンジニア（バックエンド）',
  'エンジニア（フロントエンド）',
  'エンジニア（フルスタック）',
  'データサイエンティスト・アナリスト',
  'プロジェクトマネージャー',
  'ITコンサルタント',
  '営業・ビジネス開発',
  '不動産テック系',
  'その他',
];

const TIMING_OPTIONS = [
  { value: 'immediately', label: 'すぐにでも転職したい' },
  { value: 'within_3months', label: '3ヶ月以内' },
  { value: 'within_6months', label: '6ヶ月以内' },
  { value: 'over_6months', label: '6ヶ月以上先' },
  { value: 'browsing', label: 'まずは情報収集' },
];

const WORK_STYLE_OPTIONS = [
  { value: 'remote', label: 'フルリモート希望' },
  { value: 'hybrid', label: 'ハイブリッド（週2〜3出社）' },
  { value: 'office', label: '出社メイン' },
  { value: 'any', label: 'こだわらない' },
];

// =====================
// ステップ定義
// =====================

type Step = 1 | 2 | 3 | 4;

interface FormData extends JobSeekerInput {
  privacyAgreed: boolean;
}

const INITIAL_FORM: FormData = {
  name: '',
  email: '',
  phone: '',
  current_job: '',
  current_company: '',
  skills: [],
  experience_years: 0,
  current_salary: 0,
  industry: '',
  desired_salary_min: 0,
  desired_salary_max: 0,
  desired_industry: '',
  desired_job_type: '',
  switch_timing: '',
  work_style: '',
  message: '',
  source: 'web_form',
  referrer_name: '',
  privacyAgreed: false,
};

// =====================
// コンポーネント
// =====================

function ProgressBar({ step }: { step: Step }) {
  const steps = ['基本情報', 'スキル・経験', '希望条件', '確認'];
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-2">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              i + 1 < step ? 'bg-[#FF6B00] text-white' :
              i + 1 === step ? 'bg-[#FF6B00] text-white ring-4 ring-[#FF6B00]/20' :
              'bg-black/10 text-black/40'
            }`}>
              {i + 1 < step ? '✓' : i + 1}
            </div>
            <span className={`text-xs mt-1 font-medium ${i + 1 <= step ? 'text-[#FF6B00]' : 'text-black/30'}`}>
              {s}
            </span>
          </div>
        ))}
      </div>
      <div className="relative h-1 bg-black/10 rounded-full">
        <div
          className="absolute h-1 bg-[#FF6B00] rounded-full transition-all duration-500"
          style={{ width: `${((step - 1) / 3) * 100}%` }}
        />
      </div>
    </div>
  );
}

function SkillTag({ skill, selected, onToggle }: { skill: string; selected: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
        selected
          ? 'bg-[#FF6B00] text-white border-[#FF6B00]'
          : 'bg-white text-black/70 border-black/15 hover:border-[#FF6B00]/50'
      }`}
    >
      {selected && <span className="mr-1">✓</span>}{skill}
    </button>
  );
}

function InputField({ label, required, children, hint }: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-[#111111] mb-1.5">
        {label}
        {required && <span className="text-[#FF6B00] ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-black/50 mt-1">{hint}</p>}
    </div>
  );
}

// =====================
// メインコンポーネント
// =====================

export default function TenshokuRegisterPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    seekerId?: number;
    marketValue?: ReturnType<typeof calcMarketValueScore>;
  } | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const update = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const toggleSkill = (skill: string) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  // バリデーション
  const validateStep = (s: Step): boolean => {
    const errs: Record<string, string> = {};
    if (s === 1) {
      if (!form.name.trim()) errs.name = '氏名を入力してください';
      if (!form.email.trim()) errs.email = 'メールアドレスを入力してください';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = '正しいメールアドレスを入力してください';
    }
    if (s === 2) {
      if (form.skills.length === 0) errs.skills = '少なくとも1つスキルを選択してください';
      if (!form.industry) errs.industry = '現在の業界を選択してください';
    }
    if (s === 3) {
      if (!form.switch_timing) errs.switch_timing = '転職時期を選択してください';
      if (form.desired_salary_min <= 0) errs.desired_salary_min = '希望年収（下限）を入力してください';
    }
    if (s === 4) {
      if (!form.privacyAgreed) errs.privacyAgreed = 'プライバシーポリシーに同意してください';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep(s => Math.min(4, s + 1) as Step);
  };

  const prevStep = () => setStep(s => Math.max(1, s - 1) as Step);

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setIsSubmitting(true);

    try {
      // Supabaseへ登録
      const { data, error } = await registerJobSeeker({
        name: form.name,
        email: form.email,
        phone: form.phone,
        current_job: form.current_job,
        current_company: form.current_company,
        skills: form.skills,
        experience_years: form.experience_years,
        current_salary: form.current_salary,
        industry: form.industry,
        desired_salary_min: form.desired_salary_min,
        desired_salary_max: form.desired_salary_max,
        desired_industry: form.desired_industry,
        desired_job_type: form.desired_job_type,
        switch_timing: form.switch_timing,
        work_style: form.work_style,
        message: form.message,
        source: 'web_form',
        referrer_name: form.referrer_name,
      });

      if (error) throw error;

      setIsSubmitting(false);
      setIsAnalyzing(true);

      // AI分析シミュレーション（本番はEdge Functionで実行）
      await new Promise(r => setTimeout(r, 2500));

      const marketValue = calcMarketValueScore({
        skills: form.skills,
        current_salary: form.current_salary,
        desired_salary_min: form.desired_salary_min,
        desired_salary_max: form.desired_salary_max,
        industry: form.industry,
        desired_industry: form.desired_industry,
        switch_timing: form.switch_timing,
        work_style: form.work_style,
        experience_years: form.experience_years,
        desired_job_type: form.desired_job_type,
      });

      setIsAnalyzing(false);
      setSubmitResult({ success: true, seekerId: data?.id, marketValue });

    } catch (err) {
      console.error('Registration error:', err);
      setIsSubmitting(false);
      setIsAnalyzing(false);
      setErrors({ submit: '登録に失敗しました。時間をおいて再度お試しください。' });
    }
  };

  // =====================
  // 分析中画面
  // =====================
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="w-20 h-20 border-4 border-[#FF6B00]/20 border-t-[#FF6B00] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-2xl">🤖</div>
          </div>
          <h2 className="text-2xl font-bold text-[#111111] mb-3">AIがあなたを分析中...</h2>
          <div className="space-y-2 text-sm text-black/60 max-w-sm mx-auto">
            <p className="animate-pulse">✦ スキルセットを構造化しています</p>
            <p className="animate-pulse delay-500">✦ 市場価値を算出しています</p>
            <p className="animate-pulse delay-1000">✦ 最適なポジションをスキャン中</p>
          </div>
        </div>
      </div>
    );
  }

  // =====================
  // 完了・市場価値レポート画面
  // =====================
  if (submitResult?.success && submitResult.marketValue) {
    const mv = submitResult.marketValue;
    const rankColor = mv.score >= 80 ? '#FF6B00' : mv.score >= 60 ? '#2563EB' : mv.score >= 40 ? '#059669' : '#6B7280';
    const rankLabel = mv.score >= 80 ? 'Sランク（即戦力）' : mv.score >= 60 ? 'Aランク（高需要）' : mv.score >= 40 ? 'Bランク（成長枠）' : 'Cランク（育成枠）';

    return (
      <div className="min-h-screen bg-[#FFFBF7] pb-20">
        <SEO
          title="登録完了 | あなたの市場価値レポート | AZABU+転職"
          description="AZABU+転職への登録ありがとうございます。AIが算出したあなたの市場価値レポートをご確認ください。"
        />

        <div className="max-w-2xl mx-auto px-4 pt-12">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🎉</div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] mb-2">登録完了！</h1>
            <p className="text-black/60">AIがあなたの市場価値を分析しました</p>
          </div>

          {/* 市場価値カード */}
          <div className="bg-white rounded-2xl border border-black/10 p-6 sm:p-8 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-black/50 mb-1">あなたの市場価値スコア</p>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black" style={{ color: rankColor }}>{mv.score}</span>
                  <span className="text-black/40 mb-1">/100</span>
                </div>
              </div>
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
                style={{ backgroundColor: rankColor }}
              >
                {mv.score >= 80 ? 'S' : mv.score >= 60 ? 'A' : mv.score >= 40 ? 'B' : 'C'}
              </div>
            </div>

            <div
              className="inline-block px-3 py-1 rounded-full text-sm font-bold text-white mb-5"
              style={{ backgroundColor: rankColor }}
            >
              {rankLabel}
            </div>

            {/* 推定年収 */}
            <div className="bg-[#FFF7F0] rounded-xl p-4 mb-5">
              <p className="text-sm text-black/60 mb-1">AI推定年収レンジ</p>
              <p className="text-2xl font-bold text-[#111111]">
                {mv.estimatedMin}<span className="text-sm font-normal text-black/50">万円</span>
                {' '}〜{' '}
                {mv.estimatedMax}<span className="text-sm font-normal text-black/50">万円</span>
              </p>
              <p className="text-xs text-black/40 mt-1">※ スキル・経験・市場動向をもとにAIが算出</p>
            </div>

            {/* 強み */}
            {mv.strengths.length > 0 && (
              <div>
                <p className="text-sm font-bold text-[#111111] mb-2">あなたの強み（AI分析）</p>
                <ul className="space-y-1.5">
                  {mv.strengths.map(s => (
                    <li key={s} className="flex items-start gap-2 text-sm text-black/70">
                      <span className="text-[#FF6B00] mt-0.5 shrink-0">✦</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 次のステップ */}
          <div className="bg-white rounded-2xl border border-black/10 p-6 mb-6">
            <h2 className="font-bold text-[#111111] mb-4">次のステップ</h2>
            <div className="space-y-3">
              {[
                { num: '01', title: '担当者からご連絡', desc: '登録内容を確認後、1〜2営業日以内にご連絡します' },
                { num: '02', title: '無料キャリア面談', desc: 'オンライン30分。希望条件と強みをさらに深掘りします' },
                { num: '03', title: 'マッチした求人をご提案', desc: 'AIが選んだSランクの非公開求人を優先的にご紹介します' },
              ].map(step => (
                <div key={step.num} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#FF6B00]/10 flex items-center justify-center text-xs font-black text-[#FF6B00] shrink-0">
                    {step.num}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#111111]">{step.title}</p>
                    <p className="text-xs text-black/60">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendlyへのリンク */}
          <a
            href="https://calendar.app.google/8cVcUkLokHP1w48Y6"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 rounded-full bg-[#FF6B00] text-white font-bold text-center text-lg hover:bg-[#FF8C00] transition-colors mb-4"
          >
            今すぐ無料面談を予約する →
          </a>
          <p className="text-center text-xs text-black/40">面談は無料・任意です。しつこい営業はありません。</p>
        </div>
      </div>
    );
  }

  // =====================
  // フォーム画面
  // =====================
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="求職者登録 | AZABU+転職 — 不動産・IT業界特化の転職支援"
        description="AZABU+転職に登録して、AIによる無料の市場価値診断を受けましょう。不動産・IT・建設テック業界に特化した非公開求人をご紹介します。"
        keywords="転職登録,求職者登録,不動産転職,IT転職,エンジニア転職,AZABU+転職"
        canonical="https://azabuplus.jp/tenshoku/register"
      />

      {/* Hero */}
      <section className="pt-28 pb-10 px-4 bg-gradient-to-b from-[#FFF7F0] to-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[#FF6B00] text-xs font-bold tracking-widest uppercase mb-3">無料・3分で完了</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] mb-3">
            求職者登録 →<br className="sm:hidden" /> AIが市場価値を即診断
          </h1>
          <p className="text-sm text-black/60 max-w-sm mx-auto">
            登録完了後すぐに、あなたの市場価値スコアと推定年収レンジをAIがお知らせします。
          </p>
        </div>
      </section>

      {/* フォーム本体 */}
      <section className="pb-20 px-4">
        <div className="max-w-xl mx-auto">
          <ProgressBar step={step} />

          {/* ===================== STEP 1: 基本情報 ===================== */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-[#111111]">基本情報を入力</h2>

              <InputField label="お名前" required hint="姓名（例: 山田 太郎）">
                <input
                  type="text"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="山田 太郎"
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                    errors.name ? 'border-red-400 focus:border-red-400' : 'border-black/15 focus:border-[#FF6B00]'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </InputField>

              <InputField label="メールアドレス" required hint="今後のご連絡に使用します">
                <input
                  type="email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                    errors.email ? 'border-red-400 focus:border-red-400' : 'border-black/15 focus:border-[#FF6B00]'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </InputField>

              <InputField label="電話番号" hint="任意 — 面談調整に利用します">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => update('phone', e.target.value)}
                  placeholder="080-xxxx-xxxx"
                  className="w-full px-4 py-3 rounded-xl border border-black/15 focus:border-[#FF6B00] text-sm outline-none transition-colors"
                />
              </InputField>

              <InputField label="現在の職種">
                <input
                  type="text"
                  value={form.current_job}
                  onChange={e => update('current_job', e.target.value)}
                  placeholder="例: インフラエンジニア、不動産営業"
                  className="w-full px-4 py-3 rounded-xl border border-black/15 focus:border-[#FF6B00] text-sm outline-none transition-colors"
                />
              </InputField>

              <InputField label="現在の会社名" hint="任意 — 秘密厳守です">
                <input
                  type="text"
                  value={form.current_company}
                  onChange={e => update('current_company', e.target.value)}
                  placeholder="例: 株式会社〇〇"
                  className="w-full px-4 py-3 rounded-xl border border-black/15 focus:border-[#FF6B00] text-sm outline-none transition-colors"
                />
              </InputField>
            </div>
          )}

          {/* ===================== STEP 2: スキル・経験 ===================== */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-[#111111]">スキル・経験を教えてください</h2>

              <InputField label="保有スキル・得意分野" required hint="複数選択可 — 多く選ぶほどAI診断の精度が上がります">
                <div className="flex flex-wrap gap-2 mt-2">
                  {SKILL_OPTIONS.map(skill => (
                    <SkillTag
                      key={skill}
                      skill={skill}
                      selected={form.skills.includes(skill)}
                      onToggle={() => toggleSkill(skill)}
                    />
                  ))}
                </div>
                {form.skills.length > 0 && (
                  <p className="text-xs text-[#FF6B00] mt-2 font-medium">✓ {form.skills.length}個選択中</p>
                )}
                {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills}</p>}
              </InputField>

              <InputField label="実務経験年数" required>
                <select
                  value={form.experience_years}
                  onChange={e => update('experience_years', Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-black/15 focus:border-[#FF6B00] text-sm outline-none bg-white"
                >
                  <option value={0}>選択してください</option>
                  <option value={1}>1年未満（未経験含む）</option>
                  <option value={1}>1〜2年</option>
                  <option value={3}>3〜4年</option>
                  <option value={5}>5〜9年</option>
                  <option value={10}>10年以上</option>
                </select>
              </InputField>

              <InputField label="現在の業界" required>
                <select
                  value={form.industry}
                  onChange={e => update('industry', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none bg-white ${
                    errors.industry ? 'border-red-400' : 'border-black/15 focus:border-[#FF6B00]'
                  }`}
                >
                  <option value="">選択してください</option>
                  {INDUSTRY_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry}</p>}
              </InputField>

              <InputField label="現在の年収" hint="任意 — 市場価値算出に使用します">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={form.current_salary || ''}
                    onChange={e => update('current_salary', Number(e.target.value))}
                    placeholder="例: 450"
                    min={0}
                    max={5000}
                    className="flex-1 px-4 py-3 rounded-xl border border-black/15 focus:border-[#FF6B00] text-sm outline-none"
                  />
                  <span className="text-sm text-black/60 shrink-0">万円</span>
                </div>
              </InputField>
            </div>
          )}

          {/* ===================== STEP 3: 希望条件 ===================== */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-[#111111]">希望条件を教えてください</h2>

              <InputField label="希望年収レンジ" required>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={form.desired_salary_min || ''}
                    onChange={e => update('desired_salary_min', Number(e.target.value))}
                    placeholder="例: 500"
                    min={0}
                    max={5000}
                    className={`flex-1 px-4 py-3 rounded-xl border text-sm outline-none ${
                      errors.desired_salary_min ? 'border-red-400' : 'border-black/15 focus:border-[#FF6B00]'
                    }`}
                  />
                  <span className="text-sm text-black/60 shrink-0">〜</span>
                  <input
                    type="number"
                    value={form.desired_salary_max || ''}
                    onChange={e => update('desired_salary_max', Number(e.target.value))}
                    placeholder="例: 700"
                    min={0}
                    max={5000}
                    className="flex-1 px-4 py-3 rounded-xl border border-black/15 focus:border-[#FF6B00] text-sm outline-none"
                  />
                  <span className="text-sm text-black/60 shrink-0">万円</span>
                </div>
                {errors.desired_salary_min && <p className="text-red-500 text-xs mt-1">{errors.desired_salary_min}</p>}
              </InputField>

              <InputField label="希望業界">
                <select
                  value={form.desired_industry}
                  onChange={e => update('desired_industry', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/15 focus:border-[#FF6B00] text-sm outline-none bg-white"
                >
                  <option value="">選択してください</option>
                  {INDUSTRY_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </InputField>

              <InputField label="希望職種">
                <select
                  value={form.desired_job_type}
                  onChange={e => update('desired_job_type', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/15 focus:border-[#FF6B00] text-sm outline-none bg-white"
                >
                  <option value="">選択してください</option>
                  {JOB_TYPE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </InputField>

              <InputField label="転職希望時期" required>
                <div className="space-y-2">
                  {TIMING_OPTIONS.map(opt => (
                    <label key={opt.value} className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors hover:border-[#FF6B00]/30"
                      style={{ borderColor: form.switch_timing === opt.value ? '#FF6B00' : undefined }}>
                      <input
                        type="radio"
                        name="switch_timing"
                        value={opt.value}
                        checked={form.switch_timing === opt.value}
                        onChange={() => update('switch_timing', opt.value)}
                        className="accent-[#FF6B00]"
                      />
                      <span className="text-sm text-[#111111]">{opt.label}</span>
                    </label>
                  ))}
                </div>
                {errors.switch_timing && <p className="text-red-500 text-xs mt-1">{errors.switch_timing}</p>}
              </InputField>

              <InputField label="希望する働き方">
                <div className="grid grid-cols-2 gap-2">
                  {WORK_STYLE_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update('work_style', opt.value)}
                      className={`p-3 rounded-xl border text-sm font-medium transition-colors text-left ${
                        form.work_style === opt.value
                          ? 'border-[#FF6B00] bg-[#FFF7F0] text-[#FF6B00]'
                          : 'border-black/15 text-black/70 hover:border-black/30'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </InputField>

              <InputField label="一言メッセージ" hint="任意 — コンサルタントへの備考・転職の背景など">
                <textarea
                  value={form.message}
                  onChange={e => update('message', e.target.value)}
                  rows={4}
                  placeholder="例: 不動産業界でのDX経験を活かして、PropTech系スタートアップに転職を検討しています。"
                  className="w-full px-4 py-3 rounded-xl border border-black/15 focus:border-[#FF6B00] text-sm outline-none resize-none"
                />
              </InputField>
            </div>
          )}

          {/* ===================== STEP 4: 確認 ===================== */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-[#111111]">内容を確認して登録</h2>

              {/* 確認サマリー */}
              <div className="bg-[#FAFAFA] rounded-2xl p-5 border border-black/10 space-y-3">
                {[
                  { label: '氏名', value: form.name },
                  { label: 'メール', value: form.email },
                  { label: '電話', value: form.phone || '未入力' },
                  { label: '現在の職種', value: form.current_job || '未入力' },
                  { label: 'スキル', value: form.skills.join('、') || '未選択' },
                  { label: '経験年数', value: form.experience_years ? `${form.experience_years}年以上` : '未入力' },
                  { label: '現在の業界', value: form.industry || '未選択' },
                  { label: '現在の年収', value: form.current_salary ? `${form.current_salary}万円` : '未入力' },
                  { label: '希望年収', value: form.desired_salary_min ? `${form.desired_salary_min}〜${form.desired_salary_max || ''}万円` : '未入力' },
                  { label: '転職時期', value: TIMING_OPTIONS.find(t => t.value === form.switch_timing)?.label || '未選択' },
                ].map(row => (
                  <div key={row.label} className="flex gap-3 text-sm">
                    <span className="text-black/50 shrink-0 w-24">{row.label}</span>
                    <span className="text-[#111111] font-medium">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* プライバシーポリシー同意 */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.privacyAgreed}
                  onChange={e => update('privacyAgreed', e.target.checked)}
                  className="mt-0.5 accent-[#FF6B00] w-4 h-4 shrink-0"
                />
                <span className="text-sm text-black/70">
                  <a href="/privacy" className="text-[#FF6B00] underline" target="_blank">プライバシーポリシー</a>に同意の上、登録します。
                  入力情報は転職支援サービスの提供にのみ使用します。
                </span>
              </label>
              {errors.privacyAgreed && <p className="text-red-500 text-xs">{errors.privacyAgreed}</p>}

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
                  {errors.submit}
                </div>
              )}

              {/* 登録ボタン */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-[#FF6B00] text-white font-bold text-lg hover:bg-[#FF8C00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '送信中...' : '登録してAI診断を受ける →'}
              </button>

              <p className="text-center text-xs text-black/40">
                完全無料・登録後のしつこい営業はありません
              </p>
            </div>
          )}

          {/* ナビゲーションボタン */}
          {!submitResult && (
            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-3.5 rounded-full border border-black/20 text-black/70 font-medium text-sm hover:border-black/40 transition-colors"
                >
                  ← 戻る
                </button>
              )}
              {step < 4 && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 py-3.5 rounded-full bg-[#FF6B00] text-white font-bold text-sm hover:bg-[#FF8C00] transition-colors"
                >
                  次へ →
                </button>
              )}
            </div>
          )}

          {/* 信頼バッジ */}
          {step === 1 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-black/40">
              <span>🔒 SSL暗号化</span>
              <span>📋 有料職業紹介許可取得</span>
              <span>🤝 完全無料サービス</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SEO } from '../../../components/SEO';
import { insertCandidate } from '../../../lib/upboardApi';
import { calcCandidateScore } from '../../../lib/upboardScoring';

const EDU_OPTIONS = [
  { value: 'junior_high', label: '中学卒' },
  { value: 'high_school', label: '高校卒' },
  { value: 'vocational', label: '専門学校卒' },
  { value: 'junior_college', label: '短大卒' },
  { value: 'university_low', label: '大学卒（偏差値50未満）' },
  { value: 'university_mid', label: '大学卒（偏差値50以上）' },
  { value: 'graduate', label: '大学院卒' },
];

const AREA_OPTIONS = [
  '北海道', '青森', '岩手', '宮城', '秋田', '山形', '福島',
  '茨城', '栃木', '群馬', '埼玉', '千葉', '東京', '神奈川',
  '新潟', '富山', '石川', '福井', '山梨', '長野',
  '岐阜', '静岡', '愛知', '三重',
  '滋賀', '京都', '大阪', '兵庫', '奈良', '和歌山',
  '鳥取', '島根', '岡山', '広島', '山口',
  '徳島', '香川', '愛媛', '高知',
  '福岡', '佐賀', '長崎', '熊本', '大分', '宮崎', '鹿児島', '沖縄',
  '海外在住',
];

const EMPLOYMENT_OPTIONS = [
  { value: 'employed', label: '会社員・公務員（正社員）' },
  { value: 'freelance', label: 'フリーランス・業務委託' },
  { value: 'student', label: '学生' },
  { value: 'job_hunting', label: '就職活動中（新卒）' },
  { value: 'unemployed', label: '離職中' },
];

const SKILL_OPTIONS = [
  'JavaScript', 'TypeScript', 'Python', 'Go', 'Java', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Rust', 'C#',
  'React', 'Vue', 'Next.js', 'Node.js', 'Django', 'Rails', 'FastAPI',
  'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'Linux', 'Terraform', 'CI/CD',
  'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Git', 'セキュリティ', 'ネットワーク',
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
  { value: 'immediately', label: '今すぐ（内定が出れば即入社）' },
  { value: '2-3months', label: '2〜3ヶ月以内' },
  { value: '6months', label: '半年以内' },
  { value: 'not_urgent', label: 'まずは情報収集' },
];

const INDUSTRY_OPTIONS = [
  'IT・Web・SaaS', '不動産・PropTech', '建設・建設テック', '金融・FinTech',
  'コンサルティング', '製造・メーカー', '小売・EC', '医療・ヘルスケア', 'エンタメ・ゲーム', 'その他',
];

type Step = 1 | 2 | 3 | 4;

interface RegForm {
  name: string; age: string; gender: string; email: string; tel: string;
  education: string; area: string; employment_status: string;
  current_income: string; want_income: string; timing: string; job_type: string;
  skills: string[]; exp_years: number; portfolio_url: string;
  reason: string; industries: string[]; message: string;
  privacy_agreed: boolean; scout_agreed: boolean;
}

const INIT_FORM: RegForm = {
  name: '', age: '', gender: '', email: '', tel: '',
  education: '', area: '', employment_status: '',
  current_income: '', want_income: '', timing: '', job_type: '',
  skills: [], exp_years: 0, portfolio_url: '',
  reason: '', industries: [], message: '',
  privacy_agreed: false, scout_agreed: false,
};

function ProgressBar({ step }: { step: number }) {
  const steps = ['基本情報', '現状', 'スキル', '志望'];
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              i + 1 < step ? 'bg-blue-600 text-white' :
              i + 1 === step ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
              'bg-black/10 text-black/30'
            }`}>
              {i + 1 < step ? '✓' : i + 1}
            </div>
            <span className={`text-[10px] mt-1 font-bold ${i + 1 <= step ? 'text-blue-600' : 'text-black/25'}`}>{s}</span>
          </div>
        ))}
      </div>
      <div className="h-1.5 bg-black/8 rounded-full">
        <div className="h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
          style={{ width: `${((step - 1) / 3) * 100}%` }} />
      </div>
    </div>
  );
}

export default function UpBoardRegisterPage() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<RegForm>({
    ...INIT_FORM,
    email: searchParams.get('email') ?? '',
    name: searchParams.get('name') ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ rank: string; score: number } | null>(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  const update = <K extends keyof RegForm>(k: K, v: RegForm[K]) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: '' }));
  };

  const toggleSkill = (s: string) =>
    setForm(p => ({
      ...p,
      skills: p.skills.includes(s) ? p.skills.filter(x => x !== s) : [...p.skills, s],
    }));

  const toggleIndustry = (i: string) =>
    setForm(p => ({
      ...p,
      industries: p.industries.includes(i) ? p.industries.filter(x => x !== i) : [...p.industries, i],
    }));

  const validate = (s: Step): boolean => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!form.name.trim()) e.name = '氏名を入力してください';
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = '正しいメールアドレスを入力してください';
      if (!form.education) e.education = '最終学歴を選択してください';
      if (!form.area) e.area = '居住地を選択してください';
      if (!form.employment_status) e.employment_status = '現在の状況を選択してください';
    }
    if (s === 2) {
      if (!form.job_type) e.job_type = '希望職種を選択してください';
      if (!form.timing) e.timing = '転職時期を選択してください';
      if (!form.want_income) e.want_income = '希望年収を入力してください';
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
    if (validate(step)) {
      if (step === 4) handleSubmit();
      else setStep(s => (s + 1) as Step);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const scoreResult = calcCandidateScore({
      skills: form.skills,
      exp_years: form.exp_years,
      timing: form.timing,
      portfolio_url: form.portfolio_url,
    }, form.job_type);

    const { error } = await insertCandidate({
      name: form.name,
      age: Number(form.age) || undefined as unknown as number,
      gender: form.gender,
      email: form.email,
      tel: form.tel,
      education: form.education,
      area: form.area,
      employment_status: form.employment_status,
      current_income: Number(form.current_income) || 0,
      want_income: Number(form.want_income) || 0,
      timing: form.timing,
      job_type: form.job_type,
      skills: form.skills,
      exp_years: form.exp_years,
      portfolio_url: form.portfolio_url,
      reason: form.reason,
      industries: form.industries,
      message: form.message,
      score: scoreResult.total,
      rank: scoreResult.rank,
      score_skill: scoreResult.breakdown.skill,
      score_breadth: scoreResult.breakdown.breadth,
      score_exp: scoreResult.breakdown.exp,
      score_urgency: scoreResult.breakdown.urgency,
      score_portfolio: scoreResult.breakdown.portfolio,
      estimated_salary_min: scoreResult.estimated_salary_min,
      estimated_salary_max: scoreResult.estimated_salary_max,
      privacy_agreed: form.privacy_agreed,
      scout_agreed: form.scout_agreed,
      status: 'new',
      source: searchParams.get('email') ? 'diagnosis_only' : 'web',
    });

    setIsSubmitting(false);
    if (!error) {
      setSubmitted({ rank: scoreResult.rank, score: scoreResult.total });
    } else {
      // emailがユニーク制約で弾かれた場合も成功扱い
      if (error.code === '23505') {
        setSubmitted({ rank: scoreResult.rank, score: scoreResult.total });
      } else {
        setErrors({ submit: '登録に失敗しました。時間をおいて再度お試しください。' });
      }
    }
  };

  // =====================
  // 登録完了画面
  // =====================
  if (submitted) {
    const isS = submitted.rank === 'S';
    const isA = submitted.rank === 'A';
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">{isS ? '🏆' : isA ? '⭐' : '🌱'}</div>
            <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-black text-white mb-4 ${
              isS ? 'bg-amber-500' : isA ? 'bg-blue-600' : 'bg-emerald-600'
            }`}>
              {submitted.rank}ランク｜スコア {submitted.score}点
            </div>
            <h1 className="text-2xl font-black text-white mb-3">登録完了！</h1>
            <p className="text-white/60 text-sm">
              {isS
                ? '1〜2営業日以内に担当エージェントからご連絡します。Sランク枠は優先的にご対応します。'
                : '1〜3営業日以内に担当エージェントからご連絡します。'}
            </p>
          </div>

          <div className="space-y-3 mb-8">
            {[
              { num: '01', title: '担当エージェントからご連絡', desc: '登録内容を確認後、メール/電話でご連絡します' },
              { num: '02', title: '無料キャリア面談（30分）', desc: 'オンラインで現状と希望をお聞きします' },
              { num: '03', title: '上場企業へのスカウト', desc: 'マッチした企業から非公開求人を優先紹介' },
            ].map(s => (
              <div key={s.num} className="flex gap-4 bg-white/5 rounded-2xl p-4">
                <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-black text-blue-400 shrink-0">
                  {s.num}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{s.title}</p>
                  <p className="text-white/50 text-xs">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <a
            href="https://calendar.app.google/8cVcUkLokHP1w48Y6"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-black text-center text-lg hover:opacity-90 transition-opacity mb-4"
          >
            今すぐ面談を予約する →
          </a>
          <p className="text-center text-white/30 text-xs">面談は完全無料・任意です</p>

          <div className="mt-6 text-center">
            <Link to="/upboard" className="text-white/30 text-xs hover:text-white/50">← UpBoardトップへ</Link>
          </div>
        </div>
      </div>
    );
  }

  // =====================
  // 登録フォーム
  // =====================
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="求職者登録 | UpBoard — 学歴不問で上場企業エンジニアへ"
        description="UpBoardに求職者登録して、AIによる無料市場価値診断と上場企業からのスカウトを受け取りましょう。"
        canonical="https://azabuplus.jp/upboard/register"
      />

      <div className="bg-[#0A0F1E] py-5 px-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link to="/upboard" className="text-white/60 text-sm hover:text-white">← UpBoard</Link>
          <span className="text-white font-black text-sm">求職者登録</span>
          <span className="text-white/40 text-xs">約5分</span>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8">
        <ProgressBar step={step} />

        {/* ==================== STEP 1: 基本情報 ==================== */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-black text-[#0A0F1E] mb-1">基本情報</h2>

            {[
              { field: 'name' as const, label: '氏名', type: 'text', placeholder: '山田 太郎', required: true },
              { field: 'email' as const, label: 'メールアドレス', type: 'email', placeholder: 'your@email.com', required: true },
              { field: 'tel' as const, label: '電話番号', type: 'tel', placeholder: '080-xxxx-xxxx', required: false },
              { field: 'age' as const, label: '年齢', type: 'number', placeholder: '25', required: false },
            ].map(({ field, label, type, placeholder, required }) => (
              <div key={field}>
                <label className="block text-sm font-bold text-[#0A0F1E] mb-1.5">
                  {label}{required && <span className="text-blue-500 ml-1">*</span>}
                </label>
                <input
                  type={type}
                  value={String(form[field])}
                  onChange={e => update(field, e.target.value)}
                  placeholder={placeholder}
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                    errors[field] ? 'border-red-400' : 'border-black/15 focus:border-blue-400'
                  }`}
                />
                {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
              </div>
            ))}

            <div>
              <label className="block text-sm font-bold text-[#0A0F1E] mb-1.5">性別</label>
              <div className="flex gap-2">
                {[{ v: 'male', l: '男性' }, { v: 'female', l: '女性' }, { v: 'other', l: 'その他' }, { v: 'no_answer', l: '回答しない' }].map(o => (
                  <button key={o.v} type="button"
                    onClick={() => update('gender', o.v)}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                      form.gender === o.v ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-black/12 text-black/60'
                    }`}>{o.l}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0A0F1E] mb-1.5">
                最終学歴 <span className="text-blue-500">*</span>
              </label>
              <select value={form.education} onChange={e => update('education', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none bg-white ${
                  errors.education ? 'border-red-400' : 'border-black/15 focus:border-blue-400'
                }`}>
                <option value="">選択してください</option>
                {EDU_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {errors.education && <p className="text-red-500 text-xs mt-1">{errors.education}</p>}
              <p className="text-xs text-black/40 mt-1">✓ 学歴はスコアリングに影響しません</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0A0F1E] mb-1.5">
                居住地 <span className="text-blue-500">*</span>
              </label>
              <select value={form.area} onChange={e => update('area', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none bg-white ${
                  errors.area ? 'border-red-400' : 'border-black/15 focus:border-blue-400'
                }`}>
                <option value="">選択してください</option>
                {AREA_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0A0F1E] mb-2">
                現在の状況 <span className="text-blue-500">*</span>
              </label>
              <div className="space-y-2">
                {EMPLOYMENT_OPTIONS.map(o => (
                  <label key={o.value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    form.employment_status === o.value ? 'border-blue-500 bg-blue-50' : 'border-black/12 hover:border-blue-200'
                  }`}>
                    <input type="radio" name="employment_status" value={o.value}
                      checked={form.employment_status === o.value}
                      onChange={() => update('employment_status', o.value)}
                      className="accent-blue-600" />
                    <span className="text-sm font-medium text-[#0A0F1E]">{o.label}</span>
                  </label>
                ))}
              </div>
              {errors.employment_status && <p className="text-red-500 text-xs mt-1">{errors.employment_status}</p>}
            </div>
          </div>
        )}

        {/* ==================== STEP 2: 現状 ==================== */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-[#0A0F1E] mb-1">現状・希望条件</h2>

            <div>
              <label className="block text-sm font-bold text-[#0A0F1E] mb-2">
                希望職種 <span className="text-blue-500">*</span>
              </label>
              <div className="space-y-2">
                {JOB_TYPE_OPTIONS.map(o => (
                  <label key={o.value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    form.job_type === o.value ? 'border-blue-500 bg-blue-50' : 'border-black/12'
                  }`}>
                    <input type="radio" name="job_type" value={o.value}
                      checked={form.job_type === o.value}
                      onChange={() => update('job_type', o.value)}
                      className="accent-blue-600" />
                    <span className="text-sm font-medium">{o.label}</span>
                  </label>
                ))}
              </div>
              {errors.job_type && <p className="text-red-500 text-xs mt-1">{errors.job_type}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0A0F1E] mb-2">
                転職希望時期 <span className="text-blue-500">*</span>
              </label>
              <div className="space-y-2">
                {TIMING_OPTIONS.map(o => (
                  <label key={o.value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${
                    form.timing === o.value ? 'border-blue-500 bg-blue-50' : 'border-black/12'
                  }`}>
                    <input type="radio" name="timing" value={o.value}
                      checked={form.timing === o.value}
                      onChange={() => update('timing', o.value)}
                      className="accent-blue-600" />
                    <span className="text-sm font-medium">{o.label}</span>
                  </label>
                ))}
              </div>
              {errors.timing && <p className="text-red-500 text-xs mt-1">{errors.timing}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-[#0A0F1E] mb-1.5">現在の年収</label>
                <div className="flex items-center gap-1.5">
                  <input type="number" value={form.current_income}
                    onChange={e => update('current_income', e.target.value)}
                    placeholder="300" min={0}
                    className="flex-1 px-3 py-3 rounded-xl border border-black/15 focus:border-blue-400 text-sm outline-none" />
                  <span className="text-xs text-black/50 shrink-0">万円</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0A0F1E] mb-1.5">
                  希望年収 <span className="text-blue-500">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input type="number" value={form.want_income}
                    onChange={e => update('want_income', e.target.value)}
                    placeholder="450" min={0}
                    className={`flex-1 px-3 py-3 rounded-xl border text-sm outline-none ${
                      errors.want_income ? 'border-red-400' : 'border-black/15 focus:border-blue-400'
                    }`} />
                  <span className="text-xs text-black/50 shrink-0">万円</span>
                </div>
                {errors.want_income && <p className="text-red-500 text-xs mt-1">{errors.want_income}</p>}
              </div>
            </div>
          </div>
        )}

        {/* ==================== STEP 3: スキル ==================== */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-[#0A0F1E] mb-1">スキル・経験</h2>
              <p className="text-sm text-black/50">多く選ぶほどスコアが上がります</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-[#0A0F1E]">
                  保有スキル <span className="text-blue-500">*</span>
                </label>
                {form.skills.length > 0 && (
                  <span className="text-xs text-blue-600 font-bold">{form.skills.length}個選択中</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map(s => (
                  <button key={s} type="button" onClick={() => toggleSkill(s)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      form.skills.includes(s)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-black/60 border-black/15 hover:border-blue-300'
                    }`}>
                    {form.skills.includes(s) && '✓ '}{s}
                  </button>
                ))}
              </div>
              {errors.skills && <p className="text-red-500 text-xs mt-2">{errors.skills}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0A0F1E] mb-2">エンジニアとしての実務経験年数</label>
              <div className="space-y-2">
                {[
                  { v: 0, l: '未経験（0年）' },
                  { v: 0.5, l: '1年未満（独学・副業含む）' },
                  { v: 1, l: '1〜3年' },
                  { v: 3, l: '3〜5年' },
                  { v: 5, l: '5年以上' },
                ].map(o => (
                  <label key={o.v} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${
                    form.exp_years === o.v ? 'border-blue-500 bg-blue-50' : 'border-black/12'
                  }`}>
                    <input type="radio" name="exp_years" value={o.v}
                      checked={form.exp_years === o.v}
                      onChange={() => update('exp_years', o.v)}
                      className="accent-blue-600" />
                    <span className="text-sm font-medium">{o.l}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0A0F1E] mb-1">
                ポートフォリオ・GitHubのURL
                <span className="ml-2 text-xs font-normal text-orange-500">入力で+8点！</span>
              </label>
              <input type="url" value={form.portfolio_url}
                onChange={e => update('portfolio_url', e.target.value)}
                placeholder="https://github.com/username"
                className="w-full px-4 py-3 rounded-xl border border-black/15 focus:border-blue-400 text-sm outline-none" />
            </div>
          </div>
        )}

        {/* ==================== STEP 4: 志望 ==================== */}
        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-xl font-black text-[#0A0F1E] mb-1">志望・一言メッセージ</h2>

            <div>
              <label className="block text-sm font-bold text-[#0A0F1E] mb-2">転職理由（任意）</label>
              <div className="flex flex-wrap gap-2">
                {['年収アップ', 'スキルアップ', '上場企業で働きたい', '学歴の壁を超えたい', '今の環境を変えたい', '安定したい', 'キャリアチェンジ'].map(r => (
                  <button key={r} type="button"
                    onClick={() => update('reason', form.reason === r ? '' : r)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      form.reason === r ? 'bg-blue-600 text-white border-blue-600' : 'border-black/15 text-black/60'
                    }`}>{r}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0A0F1E] mb-2">希望業界（任意・複数選択可）</label>
              <div className="flex flex-wrap gap-2">
                {INDUSTRY_OPTIONS.map(i => (
                  <button key={i} type="button" onClick={() => toggleIndustry(i)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      form.industries.includes(i) ? 'bg-blue-600 text-white border-blue-600' : 'border-black/15 text-black/60'
                    }`}>{i}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0A0F1E] mb-1.5">担当エージェントへのひとこと（任意）</label>
              <textarea value={form.message} onChange={e => update('message', e.target.value)}
                rows={4}
                placeholder="例：高卒ですが独学でAWSとDockerを学び、個人でWebアプリを3本リリースしています。学歴関係なく実力を評価してほしいです。"
                className="w-full px-4 py-3 rounded-xl border border-black/15 focus:border-blue-400 text-sm outline-none resize-none" />
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.privacy_agreed}
                  onChange={e => update('privacy_agreed', e.target.checked)}
                  className="mt-1 accent-blue-600 w-4 h-4 shrink-0" />
                <span className="text-sm text-black/70">
                  <a href="/privacy" className="text-blue-600 underline" target="_blank">プライバシーポリシー</a>と
                  <a href="/terms" className="text-blue-600 underline ml-1" target="_blank">利用規約</a>に同意します。
                  入力情報は転職支援サービスの提供にのみ使用します。
                </span>
              </label>
              {errors.privacy_agreed && <p className="text-red-500 text-xs">{errors.privacy_agreed}</p>}

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.scout_agreed}
                  onChange={e => update('scout_agreed', e.target.checked)}
                  className="mt-1 accent-blue-600 w-4 h-4 shrink-0" />
                <span className="text-sm text-black/70">
                  上場企業からのスカウトメール受信に同意します（任意）
                </span>
              </label>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">{errors.submit}</div>
            )}
          </div>
        )}

        {/* ナビゲーション */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button type="button" onClick={() => setStep(s => (s - 1) as Step)}
              className="flex-1 py-3.5 rounded-full border border-black/20 text-black/60 font-medium text-sm hover:border-black/40">
              ← 戻る
            </button>
          )}
          <button type="button" onClick={next} disabled={isSubmitting}
            className="flex-1 py-3.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-black text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
            {isSubmitting ? '登録中...' : step === 4 ? '登録する →' : '次へ →'}
          </button>
        </div>

        {step === 1 && (
          <p className="text-center text-xs text-black/30 mt-4">✓ 完全無料 ✓ 強引な営業なし ✓ いつでも退会可</p>
        )}
      </div>
    </div>
  );
}

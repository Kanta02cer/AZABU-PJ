import { useState } from 'react';
import { SEO } from '../../../components/SEO';
import { registerCompany, createJobListing, type CompanyInput } from '../../../lib/recruitmentApi';

const INDUSTRY_OPTIONS = [
  'IT・Web・テクノロジー',
  '不動産・PropTech',
  '建設・建設テック',
  '金融・FinTech',
  'コンサルティング',
  '製造・メーカー',
  'その他',
];

const COMPANY_SIZE_OPTIONS = [
  { value: 'startup', label: 'スタートアップ（〜30名）' },
  { value: 'sme', label: '中小企業（31〜100名）' },
  { value: 'mid', label: '中堅企業（101〜500名）' },
  { value: 'large', label: '大企業（501名以上）' },
];

const WORK_STYLE_OPTIONS = [
  { value: 'remote', label: 'フルリモート' },
  { value: 'hybrid', label: 'ハイブリッド（週2〜3出社）' },
  { value: 'office', label: '出社メイン' },
];

const HIRING_TIMELINE_OPTIONS = [
  { value: 'immediate', label: 'すぐに採用したい' },
  { value: 'within_1month', label: '1ヶ月以内' },
  { value: 'within_3months', label: '3ヶ月以内' },
  { value: 'flexible', label: '良い人材がいれば' },
];

const SKILL_OPTIONS = [
  'AWS', 'Azure', 'GCP', 'Linux', 'Docker', 'Kubernetes',
  'ネットワーク', 'セキュリティ', 'Python', 'JavaScript',
  'TypeScript', 'React', 'Node.js', 'Go', 'Java', 'SQL',
  'データ分析', '機械学習', 'PM', '不動産知識', '営業',
];

type Step = 1 | 2 | 3;

interface CompanyForm extends CompanyInput {
  // 求人情報（ステップ2）
  job_title: string;
  job_description: string;
  required_skills: string[];
  preferred_skills: string[];
  job_type: string;
  salary_min: number;
  salary_max: number;
  hiring_timeline: string;
  headcount: number;
}

const INITIAL_FORM: CompanyForm = {
  name: '',
  contact_person: '',
  email: '',
  phone: '',
  industry: '',
  company_size: '',
  website: '',
  description: '',
  culture: '',
  work_style: '',
  job_title: '',
  job_description: '',
  required_skills: [],
  preferred_skills: [],
  job_type: '',
  salary_min: 0,
  salary_max: 0,
  hiring_timeline: '',
  headcount: 1,
};

function ProgressBar({ step }: { step: Step }) {
  const steps = ['会社情報', '採用要件', '確認・送信'];
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-2">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              i + 1 < step ? 'bg-[#111111] text-white' :
              i + 1 === step ? 'bg-[#111111] text-white ring-4 ring-black/10' :
              'bg-black/10 text-black/40'
            }`}>
              {i + 1 < step ? '✓' : i + 1}
            </div>
            <span className={`text-xs mt-1 font-medium ${i + 1 <= step ? 'text-[#111111]' : 'text-black/30'}`}>
              {s}
            </span>
          </div>
        ))}
      </div>
      <div className="relative h-1 bg-black/10 rounded-full">
        <div
          className="absolute h-1 bg-[#111111] rounded-full transition-all duration-500"
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        />
      </div>
    </div>
  );
}

function InputField({ label, required, children, hint }: {
  label: string; required?: boolean; children: React.ReactNode; hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-[#111111] mb-1.5">
        {label}{required && <span className="text-[#FF6B00] ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-black/50 mt-1">{hint}</p>}
    </div>
  );
}

export default function CompanyRegisterPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<CompanyForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof CompanyForm, value: CompanyForm[keyof CompanyForm]) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const toggleSkill = (skill: string, field: 'required_skills' | 'preferred_skills') => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(skill)
        ? prev[field].filter((s: string) => s !== skill)
        : [...prev[field], skill],
    }));
  };

  const validateStep = (s: Step): boolean => {
    const errs: Record<string, string> = {};
    if (s === 1) {
      if (!form.name.trim()) errs.name = '会社名を入力してください';
      if (!form.contact_person.trim()) errs.contact_person = '担当者名を入力してください';
      if (!form.email.trim()) errs.email = 'メールアドレスを入力してください';
      if (!form.industry) errs.industry = '業界を選択してください';
    }
    if (s === 2) {
      if (!form.job_title.trim()) errs.job_title = '募集職種を入力してください';
      if (form.required_skills.length === 0) errs.required_skills = '必須スキルを選択してください';
      if (form.salary_min <= 0) errs.salary_min = '年収下限を入力してください';
      if (!form.hiring_timeline) errs.hiring_timeline = '採用希望時期を選択してください';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep(s => Math.min(3, s + 1) as Step);
  };
  const prevStep = () => setStep(s => Math.max(1, s - 1) as Step);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // 企業登録
      const { data: company, error: companyError } = await registerCompany({
        name: form.name,
        contact_person: form.contact_person,
        email: form.email,
        phone: form.phone,
        industry: form.industry,
        company_size: form.company_size,
        website: form.website,
        description: form.description,
        culture: form.culture,
        work_style: form.work_style,
      });

      if (companyError) throw companyError;

      // 求人登録
      if (company) {
        await createJobListing({
          company_id: company.id as number,
          title: form.job_title,
          description: form.job_description,
          required_skills: form.required_skills,
          preferred_skills: form.preferred_skills,
          industry: form.industry,
          job_type: form.job_type,
          salary_min: form.salary_min,
          salary_max: form.salary_max,
          work_style: form.work_style,
          hiring_timeline: form.hiring_timeline,
          headcount: form.headcount,
        });
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setErrors({ submit: '送信に失敗しました。時間をおいて再度お試しください。' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-[#111111] mb-3">ご登録ありがとうございます</h1>
          <p className="text-black/60 mb-6 text-sm">
            1〜2営業日以内に担当者よりご連絡いたします。
            AIによるマッチング候補者リストを準備次第、お送りします。
          </p>
          <div className="bg-[#F8F8F8] rounded-2xl p-5 text-left space-y-2 text-sm text-black/60 mb-6">
            <p>✦ AIが求人要件を分析・構造化します</p>
            <p>✦ マッチング候補者（候補者サマリー）を自動生成します</p>
            <p>✦ ご承認後、候補者へのアプローチを開始します</p>
          </div>
          <a
            href="/"
            className="inline-block px-6 py-3 rounded-full bg-[#111111] text-white font-bold text-sm hover:bg-black/80 transition-colors"
          >
            トップへ戻る
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="企業・採用担当者登録 | AZABU+転職 — 不動産・IT特化型人材紹介"
        description="AZABU+転職の企業登録ページ。不動産・IT・建設テック領域に特化したAIマッチングで最適な人材をご紹介します。成功報酬型のため初期費用ゼロ。"
        canonical="https://azabuplus.jp/companies/register"
      />

      <section className="pt-28 pb-10 px-4 bg-gradient-to-b from-[#F8F8F8] to-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[#111111] text-xs font-bold tracking-widest uppercase mb-3">成功報酬型・初期費用ゼロ</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] mb-3">
            採用要件を登録して<br />AIが最適人材を提案
          </h1>
          <p className="text-sm text-black/60 max-w-sm mx-auto">
            登録後、AIが候補者リストを自動生成。採用成功時のみ成功報酬が発生します。
          </p>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="max-w-xl mx-auto">
          <ProgressBar step={step} />

          {/* STEP 1: 会社情報 */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-[#111111]">会社情報</h2>

              <InputField label="会社名" required>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="株式会社〇〇"
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${
                    errors.name ? 'border-red-400' : 'border-black/15 focus:border-[#111111]'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </InputField>

              <InputField label="採用担当者名" required>
                <input
                  type="text"
                  value={form.contact_person}
                  onChange={e => update('contact_person', e.target.value)}
                  placeholder="山田 花子"
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${
                    errors.contact_person ? 'border-red-400' : 'border-black/15 focus:border-[#111111]'
                  }`}
                />
                {errors.contact_person && <p className="text-red-500 text-xs mt-1">{errors.contact_person}</p>}
              </InputField>

              <InputField label="メールアドレス" required>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  placeholder="hr@company.co.jp"
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${
                    errors.email ? 'border-red-400' : 'border-black/15 focus:border-[#111111]'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </InputField>

              <InputField label="電話番号" hint="任意">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => update('phone', e.target.value)}
                  placeholder="03-xxxx-xxxx"
                  className="w-full px-4 py-3 rounded-xl border border-black/15 focus:border-[#111111] text-sm outline-none"
                />
              </InputField>

              <InputField label="業界" required>
                <select
                  value={form.industry}
                  onChange={e => update('industry', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none bg-white ${
                    errors.industry ? 'border-red-400' : 'border-black/15 focus:border-[#111111]'
                  }`}
                >
                  <option value="">選択してください</option>
                  {INDUSTRY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry}</p>}
              </InputField>

              <InputField label="従業員規模">
                <div className="grid grid-cols-2 gap-2">
                  {COMPANY_SIZE_OPTIONS.map(o => (
                    <button key={o.value} type="button"
                      onClick={() => update('company_size', o.value)}
                      className={`p-3 rounded-xl border text-sm text-left transition-colors ${
                        form.company_size === o.value
                          ? 'border-[#111111] bg-[#111111] text-white'
                          : 'border-black/15 text-black/70 hover:border-black/30'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </InputField>

              <InputField label="会社のWebサイト" hint="任意">
                <input
                  type="url"
                  value={form.website}
                  onChange={e => update('website', e.target.value)}
                  placeholder="https://company.co.jp"
                  className="w-full px-4 py-3 rounded-xl border border-black/15 focus:border-[#111111] text-sm outline-none"
                />
              </InputField>

              <InputField label="社風・カルチャー" hint="候補者へのPRポイントになります">
                <textarea
                  value={form.culture}
                  onChange={e => update('culture', e.target.value)}
                  rows={3}
                  placeholder="例: フラットな組織で若手にも裁量が大きい。週1回の全社共有など透明性を重視。"
                  className="w-full px-4 py-3 rounded-xl border border-black/15 focus:border-[#111111] text-sm outline-none resize-none"
                />
              </InputField>

              <InputField label="勤務スタイル">
                <div className="space-y-2">
                  {WORK_STYLE_OPTIONS.map(o => (
                    <label key={o.value} className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:border-black/30 transition-colors"
                      style={{ borderColor: form.work_style === o.value ? '#111111' : undefined }}>
                      <input type="radio" name="work_style" value={o.value}
                        checked={form.work_style === o.value}
                        onChange={() => update('work_style', o.value)}
                        className="accent-black"
                      />
                      <span className="text-sm">{o.label}</span>
                    </label>
                  ))}
                </div>
              </InputField>
            </div>
          )}

          {/* STEP 2: 採用要件 */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-[#111111]">採用要件</h2>

              <InputField label="募集職種・ポジション名" required>
                <input
                  type="text"
                  value={form.job_title}
                  onChange={e => update('job_title', e.target.value)}
                  placeholder="例: クラウドインフラエンジニア（AWS）"
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${
                    errors.job_title ? 'border-red-400' : 'border-black/15 focus:border-[#111111]'
                  }`}
                />
                {errors.job_title && <p className="text-red-500 text-xs mt-1">{errors.job_title}</p>}
              </InputField>

              <InputField label="募集背景・仕事内容" hint="具体的に書くほどマッチング精度が上がります">
                <textarea
                  value={form.job_description}
                  onChange={e => update('job_description', e.target.value)}
                  rows={4}
                  placeholder="例: 新規事業のインフラ設計・構築から運用まで担当。AWS上のマイクロサービス基盤をチームで開発。"
                  className="w-full px-4 py-3 rounded-xl border border-black/15 focus:border-[#111111] text-sm outline-none resize-none"
                />
              </InputField>

              <InputField label="必須スキル（MUST）" required hint="複数選択可">
                <div className="flex flex-wrap gap-2 mt-2">
                  {SKILL_OPTIONS.map(skill => (
                    <button key={skill} type="button"
                      onClick={() => toggleSkill(skill, 'required_skills')}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                        form.required_skills.includes(skill)
                          ? 'bg-[#111111] text-white border-[#111111]'
                          : 'bg-white text-black/70 border-black/15 hover:border-black/40'
                      }`}
                    >
                      {form.required_skills.includes(skill) && '✓ '}{skill}
                    </button>
                  ))}
                </div>
                {form.required_skills.length > 0 && (
                  <p className="text-xs text-[#111111] mt-2 font-medium">✓ {form.required_skills.length}個選択中</p>
                )}
                {errors.required_skills && <p className="text-red-500 text-xs mt-1">{errors.required_skills}</p>}
              </InputField>

              <InputField label="歓迎スキル（WANT）" hint="任意">
                <div className="flex flex-wrap gap-2 mt-2">
                  {SKILL_OPTIONS.filter(s => !form.required_skills.includes(s)).map(skill => (
                    <button key={skill} type="button"
                      onClick={() => toggleSkill(skill, 'preferred_skills')}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                        form.preferred_skills.includes(skill)
                          ? 'bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00]/50'
                          : 'bg-white text-black/60 border-black/15 hover:border-black/30'
                      }`}
                    >
                      {form.preferred_skills.includes(skill) && '✓ '}{skill}
                    </button>
                  ))}
                </div>
              </InputField>

              <InputField label="想定年収レンジ" required>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={form.salary_min || ''}
                    onChange={e => update('salary_min', Number(e.target.value))}
                    placeholder="500"
                    className={`flex-1 px-4 py-3 rounded-xl border text-sm outline-none ${
                      errors.salary_min ? 'border-red-400' : 'border-black/15 focus:border-[#111111]'
                    }`}
                  />
                  <span className="text-sm text-black/50 shrink-0">〜</span>
                  <input
                    type="number"
                    value={form.salary_max || ''}
                    onChange={e => update('salary_max', Number(e.target.value))}
                    placeholder="800"
                    className="flex-1 px-4 py-3 rounded-xl border border-black/15 focus:border-[#111111] text-sm outline-none"
                  />
                  <span className="text-sm text-black/50 shrink-0">万円</span>
                </div>
                {errors.salary_min && <p className="text-red-500 text-xs mt-1">{errors.salary_min}</p>}
              </InputField>

              <InputField label="採用希望時期" required>
                <div className="space-y-2">
                  {HIRING_TIMELINE_OPTIONS.map(o => (
                    <label key={o.value} className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:border-black/30 transition-colors"
                      style={{ borderColor: form.hiring_timeline === o.value ? '#111111' : undefined }}>
                      <input type="radio" name="hiring_timeline" value={o.value}
                        checked={form.hiring_timeline === o.value}
                        onChange={() => update('hiring_timeline', o.value)}
                        className="accent-black"
                      />
                      <span className="text-sm">{o.label}</span>
                    </label>
                  ))}
                </div>
                {errors.hiring_timeline && <p className="text-red-500 text-xs mt-1">{errors.hiring_timeline}</p>}
              </InputField>

              <InputField label="採用予定人数">
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={form.headcount}
                    onChange={e => update('headcount', Number(e.target.value))}
                    min={1}
                    max={50}
                    className="w-24 px-4 py-3 rounded-xl border border-black/15 focus:border-[#111111] text-sm outline-none"
                  />
                  <span className="text-sm text-black/60">名</span>
                </div>
              </InputField>
            </div>
          )}

          {/* STEP 3: 確認 */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-[#111111]">内容確認</h2>

              <div className="bg-[#FAFAFA] rounded-2xl p-5 border border-black/10 space-y-3">
                {[
                  { label: '会社名', value: form.name },
                  { label: '担当者', value: form.contact_person },
                  { label: 'メール', value: form.email },
                  { label: '業界', value: form.industry },
                  { label: '募集職種', value: form.job_title },
                  { label: '必須スキル', value: form.required_skills.join('、') || '未選択' },
                  { label: '想定年収', value: form.salary_min ? `${form.salary_min}〜${form.salary_max || ''}万円` : '未入力' },
                  { label: '採用時期', value: HIRING_TIMELINE_OPTIONS.find(o => o.value === form.hiring_timeline)?.label || '未選択' },
                  { label: '採用人数', value: `${form.headcount}名` },
                ].map(row => (
                  <div key={row.label} className="flex gap-3 text-sm">
                    <span className="text-black/50 shrink-0 w-24">{row.label}</span>
                    <span className="text-[#111111] font-medium">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* 成功報酬説明 */}
              <div className="bg-[#F0F9FF] border border-blue-200 rounded-2xl p-5">
                <h3 className="font-bold text-[#111111] mb-2 text-sm">💡 料金について（成功報酬型）</h3>
                <ul className="text-sm text-black/60 space-y-1">
                  <li>• 初期費用・掲載費：完全無料</li>
                  <li>• 採用成功時のみ：採用者年収の15〜20%</li>
                  <li>• 例：年収600万円で採用 → 90〜120万円</li>
                </ul>
              </div>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
                  {errors.submit}
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-[#111111] text-white font-bold text-lg hover:bg-black/80 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? '送信中...' : '登録してAIマッチングを開始する →'}
              </button>

              <p className="text-center text-xs text-black/40">
                採用成功まで費用は一切かかりません
              </p>
            </div>
          )}

          {/* ナビゲーション */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button type="button" onClick={prevStep}
                className="flex-1 py-3.5 rounded-full border border-black/20 text-black/70 font-medium text-sm hover:border-black/40 transition-colors">
                ← 戻る
              </button>
            )}
            {step < 3 && (
              <button type="button" onClick={nextStep}
                className="flex-1 py-3.5 rounded-full bg-[#111111] text-white font-bold text-sm hover:bg-black/80 transition-colors">
                次へ →
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

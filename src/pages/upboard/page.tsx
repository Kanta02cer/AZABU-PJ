import { Link } from 'react-router-dom';
import { SEO } from '../../components/SEO';

const STATS = [
  { num: '150社+', label: '上場企業パートナー' },
  { num: '学歴不問', label: '完全ポテンシャル採用' },
  { num: '0円', label: '求職者の費用一切なし' },
  { num: '15〜30%', label: '採用成功時のみ企業に請求' },
];

const PROBLEMS = [
  '「大卒以上必須」で書類選考すら通らない',
  '学歴欄だけで弾かれ、スキルを見てもらえない',
  '独学でコードを書けるのにエージェントに相手にされない',
  '高卒・専門卒・低偏差値大学というだけで上場企業への応募を諦めている',
];

const FEATURES = [
  {
    icon: '🎯',
    title: '学歴は一切見ない',
    desc: 'スキル・意欲・ポテンシャルだけを評価。高卒でも、Fラン大卒でも、あなたのコードと熱量だけを見ます。',
  },
  {
    icon: '🏢',
    title: '上場企業限定',
    desc: '東証プライム・スタンダード・グロース上場企業のみ掲載。怪しい会社は一切紹介しません。',
  },
  {
    icon: '🤖',
    title: 'AIが最適マッチング',
    desc: '独自AIがスキル・経験・志望をスコアリング。あなたと相性のいい企業だけを厳選してご紹介します。',
  },
  {
    icon: '💴',
    title: '求職者は完全無料',
    desc: '採用成功時に企業側からのみ紹介料をいただく仕組み。あなたへの費用は登録から内定まで0円。',
  },
];

const STEPS = [
  {
    num: '01',
    time: '3分',
    title: '無料AI診断',
    desc: 'スキル・経験を入力するだけ。AIが即座にあなたのスコアとランク（S/A/B）を判定します。',
    cta: '診断を始める',
    href: '/upboard/check',
  },
  {
    num: '02',
    time: '5分',
    title: 'プロフィール登録',
    desc: '希望条件・転職理由を登録。担当エージェントがあなた専用のスカウト文を作成します。',
    cta: null,
    href: null,
  },
  {
    num: '03',
    time: 'あとは待つだけ',
    title: '上場企業からスカウト',
    desc: 'マッチした企業から直接スカウトが届きます。面接調整・交渉・入社まで全てサポート。',
    cta: null,
    href: null,
  },
];

const TESTIMONIALS = [
  {
    bg: 'from-blue-600 to-indigo-700',
    tag: '高卒・25歳',
    result: '東証プライム上場 Webエンジニア採用',
    salary: '年収480万円',
    quote: '「大卒以上」の壁に何度も跳ね返されてきました。UpBoardは本当にスキルだけを見てくれた。',
  },
  {
    bg: 'from-emerald-600 to-teal-700',
    tag: '専門卒・22歳',
    result: '東証グロース上場 インフラエンジニア採用',
    salary: '年収420万円',
    quote: 'GitHubしか持ち物がなかった自分を、上場企業が面接してくれるとは思っていなかった。',
  },
  {
    bg: 'from-orange-500 to-red-600',
    tag: '高卒・28歳・転職2回目',
    result: '東証スタンダード上場 バックエンドエンジニア採用',
    salary: '年収550万円',
    quote: 'Python3年・AWSをいじってたら、まさか年収500万超えの上場企業から内定が来た。',
  },
];

const FAQS = [
  {
    q: 'なぜ求職者は無料なのですか？',
    a: '採用に成功した際に企業側から紹介料（採用者年収の15〜30%）をいただく「成功報酬型」のビジネスモデルのため、求職者への費用は一切発生しません。これは有料職業紹介の標準的な仕組みです。',
  },
  {
    q: '学歴は本当に関係ありませんか？',
    a: '完全に関係ありません。UpBoardのAIスコアリングは、スキル・経験年数・ポートフォリオ・転職緊急度のみで評価します。学歴欄のスコアは0点です。',
  },
  {
    q: 'どんな企業が掲載されていますか？',
    a: '東証プライム・スタンダード・グロース上場企業のうち、「学歴不問・ポテンシャル採用」を明示している企業のみが対象です。IT・Web・SaaS・不動産テック・建設テック等が中心です。',
  },
  {
    q: '未経験でも登録できますか？',
    a: 'はい。ただし、GitHubやポートフォリオがあるほどスコアが上がり、紹介できる企業の幅が広がります。まずは無料AI診断で現在地を確認してください。',
  },
  {
    q: '登録後に強引に勧誘されませんか？',
    a: 'ありません。スカウトを受け取るかどうかはあなた自身が決めます。エージェントから連絡が来るのは、あなたが同意したスカウトメールのみです。',
  },
];

export default function UpBoardPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <SEO
        title="UpBoard｜学歴不問 × 上場企業特化 AI人材紹介プラットフォーム"
        description="高卒・専門卒・低偏差値大卒でも、スキルと意欲だけで上場企業のエンジニア職へ。AIが最適マッチング。求職者への費用は完全無料。有料職業紹介許可取得済み。"
        keywords="学歴不問 エンジニア 転職,高卒 上場企業,UpBoard,AI人材紹介,ポテンシャル採用"
        canonical="https://azabuplus.jp/upboard"
      />

      {/* ============================================================
          HERO
      ============================================================ */}
      <section className="relative bg-[#0A0F1E] text-white overflow-hidden">
        {/* background grid */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        {/* blue glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 pt-28 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-400 text-xs font-bold tracking-widest mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block" />
            有料職業紹介許可取得済み｜求職者の費用 完全無料
          </div>

          <h1 className="text-4xl sm:text-6xl font-black leading-[1.1] mb-6 tracking-tight">
            学歴じゃない。<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              実力で、上場へ。
            </span>
          </h1>

          <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            UpBoardは、高卒・専門卒・低偏差値大卒の方が<br className="hidden sm:block" />
            東証上場企業のエンジニア職に就くための<br className="hidden sm:block" />
            AI人材紹介プラットフォームです。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/upboard/check"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-black text-lg hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/30"
            >
              🤖 3分で無料AI診断を受ける
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              to="/upboard/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white/80 font-bold hover:bg-white/5 transition-colors"
            >
              求職者登録をする
            </Link>
          </div>

          <p className="text-white/30 text-xs mt-5">
            登録後のしつこい営業一切なし｜いつでも退会可
          </p>
        </div>

        {/* Stats bar */}
        <div className="border-t border-white/10 py-6 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-black text-white mb-0.5">{s.num}</p>
                <p className="text-xs text-white/40">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          PROBLEM（共感フェーズ）
      ============================================================ */}
      <section className="py-20 px-4 bg-[#F8F9FF]">
        <div className="max-w-3xl mx-auto">
          <p className="text-blue-600 text-xs font-bold tracking-widest uppercase mb-3 text-center">こんな経験、ありませんか？</p>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0A0F1E] text-center mb-10">
            学歴フィルターで、<br />あなたの実力は届いていない
          </h2>

          <div className="space-y-3">
            {PROBLEMS.map(p => (
              <div key={p} className="flex items-start gap-4 bg-white border border-red-100 rounded-2xl p-5">
                <span className="text-red-500 text-xl shrink-0 mt-0.5">✗</span>
                <p className="text-[#0A0F1E] font-medium">{p}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-[#0A0F1E] rounded-2xl text-center">
            <p className="text-white text-lg font-black mb-2">
              UpBoardは、その壁を取り除きます。
            </p>
            <p className="text-white/60 text-sm">
              スキルと意欲だけを見る採用ルートが、今ここにあります。
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURES
      ============================================================ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-blue-600 text-xs font-bold tracking-widest uppercase mb-3 text-center">UpBoardの4つの約束</p>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0A0F1E] text-center mb-12">
            学歴不問で上場企業へ。<br className="sm:hidden" />それが私たちの使命です。
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="p-6 rounded-2xl border border-black/8 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 transition-all">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-black text-[#0A0F1E] text-lg mb-2">{f.title}</h3>
                <p className="text-black/60 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          HOW IT WORKS
      ============================================================ */}
      <section className="py-20 px-4 bg-[#F8F9FF]">
        <div className="max-w-3xl mx-auto">
          <p className="text-blue-600 text-xs font-bold tracking-widest uppercase mb-3 text-center">ご利用の流れ</p>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0A0F1E] text-center mb-12">
            3ステップで、上場企業へ
          </h2>

          <div className="space-y-4">
            {STEPS.map((s, i) => (
              <div key={s.num} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="absolute left-8 top-[76px] w-0.5 h-8 bg-blue-200" />
                )}
                <div className="flex gap-5 bg-white rounded-2xl p-6 border border-black/8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex flex-col items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">{s.num}</span>
                    <span className="text-white/80 text-[10px]">{s.time}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-[#0A0F1E] text-lg mb-1">{s.title}</h3>
                    <p className="text-black/60 text-sm leading-relaxed">{s.desc}</p>
                    {s.cta && s.href && (
                      <Link to={s.href}
                        className="inline-flex items-center gap-1 mt-3 text-blue-600 font-bold text-sm hover:underline">
                        {s.cta} →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          TESTIMONIALS
      ============================================================ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-blue-600 text-xs font-bold tracking-widest uppercase mb-3 text-center">SUCCESS STORIES</p>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0A0F1E] text-center mb-12">
            学歴不問で上場企業へ。<br />実際に変わった人たちがいます。
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map(t => (
              <div key={t.tag} className={`bg-gradient-to-br ${t.bg} rounded-2xl p-6 text-white`}>
                <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-4">
                  {t.tag}
                </div>
                <p className="font-black text-lg mb-1">{t.result}</p>
                <p className="text-white/80 text-sm font-bold mb-4">{t.salary}</p>
                <p className="text-white/80 text-sm leading-relaxed">
                  「{t.quote}」
                </p>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-black/30 mt-4">
            ※ 掲載は本人の承諾を得た匿名事例です
          </p>
        </div>
      </section>

      {/* ============================================================
          CTA（中間）
      ============================================================ */}
      <section className="py-16 px-4 bg-[#0A0F1E]">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-white/50 text-sm mb-4">今すぐ3分でAI診断</p>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-6">
            あなたの市場価値を<br />AIが即座にスコアリング
          </h2>
          <Link
            to="/upboard/check"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-black text-lg hover:opacity-90 transition-opacity shadow-xl shadow-blue-500/30"
          >
            無料AI診断を始める →
          </Link>
          <p className="text-white/30 text-xs mt-4">登録不要・3分で完了・完全無料</p>
        </div>
      </section>

      {/* ============================================================
          FAQ
      ============================================================ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-blue-600 text-xs font-bold tracking-widest uppercase mb-3 text-center">FAQ</p>
          <h2 className="text-2xl font-black text-[#0A0F1E] text-center mb-10">よくある質問</h2>

          <div className="space-y-4">
            {FAQS.map(faq => (
              <details key={faq.q} className="group border border-black/10 rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer font-bold text-[#0A0F1E] select-none">
                  <span>{faq.q}</span>
                  <svg className="w-5 h-5 text-blue-500 transition-transform group-open:rotate-180 shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-black/60 text-sm leading-relaxed border-t border-black/5 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA
      ============================================================ */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-white/60 text-sm mb-3">あなたの挑戦を、全力でサポートします</p>
          <h2 className="text-3xl sm:text-4xl font-black mb-6">
            学歴の壁を越えて、<br />上場企業へ踏み出そう。
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/upboard/check"
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-white text-blue-700 font-black text-lg hover:bg-blue-50 transition-colors shadow-xl"
            >
              🤖 無料AI診断を受ける
            </Link>
            <Link
              to="/upboard/register"
              className="w-full sm:w-auto px-10 py-4 rounded-full border border-white/40 text-white font-bold hover:bg-white/10 transition-colors"
            >
              今すぐ求職者登録
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-white/50 text-xs">
            <span>✓ 完全無料</span>
            <span>✓ 有料職業紹介許可取得済み</span>
            <span>✓ 学歴不問</span>
            <span>✓ 強引な営業なし</span>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
      ============================================================ */}
      <footer className="bg-[#0A0F1E] py-10 px-4 text-center text-white/30 text-xs">
        <div className="max-w-5xl mx-auto">
          <p className="text-white font-black text-lg mb-4">UpBoard</p>
          <div className="flex flex-wrap justify-center gap-4 mb-6 text-white/40">
            <a href="/privacy" className="hover:text-white/60">プライバシーポリシー</a>
            <a href="/terms" className="hover:text-white/60">利用規約</a>
            <a href="/tokusho" className="hover:text-white/60">特定商取引法</a>
          </div>
          <p>© 2025 UpBoard / AZABU+ Project. 有料職業紹介許可取得済み</p>
        </div>
      </footer>
    </div>
  );
}

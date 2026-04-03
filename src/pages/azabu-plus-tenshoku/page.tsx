import { Link } from 'react-router-dom';
import { SEO } from '../../components/SEO';
import { pushCvClick } from '../../utils/pushCvClick';

export default function AzabuPlusTenshokuPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'AZABU+転職（アザブ転職・麻布転職・麻布プラス）とは何ですか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '未経験からITインフラ領域へ挑戦したい方向けのキャリア支援プロジェクトです。年収・成長環境を重視しながら、役員クラスと直接話せる機会を提供しています。',
        },
      },
      {
        '@type': 'Question',
        name: '学歴や職歴に不安があっても応募できますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'はい。学歴・職歴だけでなく、学習意欲・継続性・入社後の成長可能性を重視しています。空白期間や未経験の方向け情報も多数用意しています。',
        },
      },
      {
        '@type': 'Question',
        name: '未経験でもエンジニア転職は可能ですか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '可能です。Linux・ネットワーク・クラウドの基礎を段階的に学び、応募時に説明できる学習ログを作ることで、未経験でも現実的に転職を目指せます。',
        },
      },
      {
        '@type': 'Question',
        name: 'どこから記事を読めばよいですか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'まずは空白期間、学歴コンプレックス、スキルゼロ向けの優先記事を読むのがおすすめです。その後、AZABU+PRESSの優先20記事で応募準備を進めてください。',
        },
      },
      {
        '@type': 'Question',
        name: '最終的なゴールは何ですか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ゴールは無料面談の予約です。面談で現在地を整理し、未経験から成長環境へ進むための具体的な応募戦略を決めます。',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="AZABU+転職（アザブ転職・麻布転職・麻布プラス）| 未経験からITキャリアへ"
        description="AZABU+転職は、未経験からエンジニアを目指し、成長環境と年収アップを狙うためのキャリアプロジェクトです。日本を代表するIT企業の役員と直接話せる機会も提供。"
        keywords="AZABU+転職,アザブ転職,麻布転職,麻布プラス,未経験 エンジニア 転職"
        canonical="https://azabuplus.jp/azabu-plus-tenshoku"
      />
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>

      <section className="pt-32 pb-16 px-4 sm:px-6 bg-gradient-to-b from-[#FFF7F0] to-white">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[#FF6B00] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-4">
            AZABU+ 転職 Hub
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#111111] leading-tight mb-6">
            AZABU+転職（アザブ転職・麻布転職・麻布プラス）とは？
          </h1>
          <p className="text-[#111111]/70 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
            学歴・職歴・ブランクに不安があっても、未経験からITインフラ領域に挑戦できる現実的な入口を提供。
            日本を代表するIT企業の役員と直接話せる機会を通じて、成長環境とキャリアの再起を支援します。
          </p>
          <a
            href="https://calendar.app.google/8cVcUkLokHP1w48Y6"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              pushCvClick('brand_hub_hero_cta', { page_path: '/azabu-plus-tenshoku' })
            }
            className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-full bg-[#FF6B00] text-white font-bold hover:bg-[#FF8C00] transition-colors"
          >
            無料で面談予約する
            <i className="ri-arrow-right-line" />
          </a>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/_post/career-restart-blank-period-infra-2026" className="p-6 border border-black/10 rounded-xl hover:border-[#FF6B00]/50 transition-colors">
            <h2 className="font-bold text-[#111111] mb-2">空白期間から再起したい方へ</h2>
            <p className="text-sm text-[#111111]/70">面接での伝え方と現実ラインを解説</p>
          </Link>
          <Link to="/_post/resume-low-education-it-infra-realistic-2026" className="p-6 border border-black/10 rounded-xl hover:border-[#FF6B00]/50 transition-colors">
            <h2 className="font-bold text-[#111111] mb-2">学歴コンプレックスがある方へ</h2>
            <p className="text-sm text-[#111111]/70">評価される代替指標と突破策を整理</p>
          </Link>
          <Link to="/_post/career-change-no-skill-no-cert-90days-plan-2026" className="p-6 border border-black/10 rounded-xl hover:border-[#FF6B00]/50 transition-colors">
            <h2 className="font-bold text-[#111111] mb-2">資格・スキルがない方へ</h2>
            <p className="text-sm text-[#111111]/70">90日で応募可能な状態を作る計画</p>
          </Link>
          <Link to="/azabu-press" className="p-6 border border-black/10 rounded-xl hover:border-[#FF6B00]/50 transition-colors">
            <h2 className="font-bold text-[#111111] mb-2">全記事を読みたい方へ</h2>
            <p className="text-sm text-[#111111]/70">AZABU+PRESSで最新の転職情報を確認</p>
          </Link>
        </div>
      </section>

      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto p-6 sm:p-8 rounded-2xl border border-black/10 bg-[#FAFAFA]">
          <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-4">
            表記ゆれキーワード（検索導線）
          </h2>
          <p className="text-[#111111]/70 leading-relaxed mb-4">
            このページは以下の検索語句に対応するブランドハブです。どの表記からでも同じ内容に到達できます。
          </p>
          <div className="flex flex-wrap gap-2">
            {['AZABU+転職', 'アザブ転職', '麻布転職', '麻布プラス'].map((k) => (
              <span
                key={k}
                className="px-3 py-1.5 rounded-full bg-white border border-[#FF6B00]/25 text-[#FF6B00] text-sm font-bold"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] mb-6">よくある質問</h2>
          <div className="space-y-4">
            <div className="p-5 rounded-xl border border-black/10">
              <h3 className="font-bold text-[#111111] mb-2">AZABU+転職とは？</h3>
              <p className="text-[#111111]/70">未経験からITインフラ領域に挑戦し、成長環境と年収アップを狙うための転職プロジェクトです。</p>
            </div>
            <div className="p-5 rounded-xl border border-black/10">
              <h3 className="font-bold text-[#111111] mb-2">最終的にどこに進めばいいですか？</h3>
              <p className="text-[#111111]/70">まずは無料面談予約に進み、現在地に合わせた応募戦略を整理するのが最短ルートです。</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


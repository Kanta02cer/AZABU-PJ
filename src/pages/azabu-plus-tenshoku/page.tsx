import { Link } from 'react-router-dom';
import { SEO } from '../../components/SEO';

export default function AzabuPlusTenshokuPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="AZABU+転職（アザブ転職・麻布転職・麻布プラス）| 未経験からITキャリアへ"
        description="AZABU+転職は、未経験からエンジニアを目指し、成長環境と年収アップを狙うためのキャリアプロジェクトです。日本を代表するIT企業の役員と直接話せる機会も提供。"
        keywords="AZABU+転職,アザブ転職,麻布転職,麻布プラス,未経験 エンジニア 転職"
        canonical="https://azabuplus.jp/azabu-plus-tenshoku"
      />

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
    </div>
  );
}


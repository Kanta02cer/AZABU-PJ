export const meta = {
  type: 'column' as const,
  thumbnail: __BASE_PATH__ + 'images/column/itinfra_cover.png',
  category: 'CAREER',
  date: '2026.03.12',
  title: '入社後90日で差がつく行動｜未経験インフラのオンボーディング戦略',
  excerpt: '内定後が本番。未経験入社後90日で信頼を作る具体行動（報連相、手順化、学習ログ）を時系列で解説します。',
  tags: ['入社後', '90日', 'オンボーディング', 'インフラエンジニア', '未経験'],
};

export default function CareerFirst90DaysOnboardingInfra2026() {
  return <><p>未経験採用は「入社後の伸び」が評価対象です。最初の90日で印象は大きく決まります。</p><h2>前半30日</h2><p>環境に慣れ、手順と連絡ルールを覚える。</p><h2>中盤60日</h2><p>小さな改善提案と学習ログの共有。</p><h2>後半90日</h2><p>任せられる範囲を増やし、再現性を示す。</p></>;
}

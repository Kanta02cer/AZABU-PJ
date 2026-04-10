export const meta = {
  type: 'column' as const,
  thumbnail: __BASE_PATH__ + 'images/column/20se_cover.png',
  category: 'CAREER',
  date: '2026.04.22',
  title: '経歴に自信がない人向け自己PR例文集｜未経験IT転職テンプレ',
  excerpt: '学歴・職歴に不安がある方向けに、自己PRの型と例文を紹介。書き方の順番を押さえて、面接でも使える内容に整えます。',
  tags: ['自己PR', '例文', '未経験', 'IT転職', '履歴書'],
};

export default function CareerSelfPrSampleUnderdog2026() {
  return <><p>自己PRは盛るものではなく、再現性を伝えるものです。</p><h2>型</h2><img src={__BASE_PATH__ + 'images/column/resume-document-check.png'} alt="面接官が履歴書（RESUME）を両手で確認しているシーン" style={{ width: '100%', borderRadius: '12px', margin: '1.5rem 0' }} /><p>強み→具体行動→結果→再現性。</p><h2>例</h2><p>手順遵守、改善提案、継続学習などを短く示す。</p><h2>まとめ</h2><p>1分で話せる長さに整えると面接で使いやすいです。</p></>;
}

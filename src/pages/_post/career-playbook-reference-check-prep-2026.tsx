export const meta = {
  type: 'column' as const,
  thumbnail: __BASE_PATH__ + 'images/column/itinfra_cover.png',
  category: 'CAREER',
  date: '2026.05.03',
  title: 'リファレンス・バックグラウンド確認に備える｜転職前の整理ポイント',
  excerpt: '企業の確認プロセスに備えて、経歴・在籍情報・説明の一貫性を整えるための実務チェックリストを紹介します。',
  tags: ['リファレンスチェック', 'バックグラウンド確認', '中途', 'IT転職', '準備'],
};

export default function CareerPlaybookReferenceCheckPrep2026() {
  return <><p>確認プロセスは特別なものではなく、経歴の整合性確認です。</p><h2>準備項目</h2><img src={__BASE_PATH__ + 'images/column/interview-explanation-tie.png'} alt="担当者がペンを持ちながら転職者に説明しているシーン" style={{ width: '100%', borderRadius: '12px', margin: '1.5rem 0' }} /><ul><li>在籍期間の一致</li><li>職務内容の一貫性</li><li>退職理由の簡潔化</li></ul><h2>結論</h2><p>事実を揃えておくと、無用な不安を減らせます。</p></>;
}

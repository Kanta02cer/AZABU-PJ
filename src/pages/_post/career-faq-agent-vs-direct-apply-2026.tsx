export const meta = {
  type: 'column' as const,
  thumbnail: __BASE_PATH__ + 'images/column/itinfra_cover.png',
  category: 'CAREER',
  date: '2026.05.15',
  title: 'エージェント応募と直接応募、どちらが有利？未経験ITの選び方',
  excerpt: '未経験IT転職で迷いやすい応募経路を比較。エージェントと直接応募の使い分けをQ&A形式で解説。',
  tags: ['エージェント', '直接応募', '未経験', 'IT転職', '応募戦略'],
};

export default function CareerFaqAgentVsDirectApply2026() {
  return <><p>どちらが絶対有利ではありません。目的別に使い分けるのが正解です。</p><h2>Q: エージェントの利点は？</h2><img src={__BASE_PATH__ + 'images/column/career-tablet-consultation.png'} alt="担当者がタブレットを使いながら転職相談をしているシーン" style={{ width: '100%', borderRadius: '12px', margin: '1.5rem 0' }} /><p>A: 添削・面接対策・非公開情報の取得です。</p><h2>Q: 直接応募の利点は？</h2><p>A: 企業理解の深さと意思表示の速さです。</p></>;
}

export const meta = {
  type: 'column' as const,
  thumbnail: __BASE_PATH__ + 'images/column/itinfra_cover.png',
  category: 'CAREER',
  date: '2026.03.04',
  title: '内定が出た後に後悔しない判断軸｜IT転職オファー比較チェックリスト',
  excerpt: '給与だけで決めると失敗しやすいIT転職。内定承諾前に確認すべき10項目を、未経験インフラ志望向けに整理しました。',
  tags: ['内定', 'オファー比較', 'IT転職', '未経験', 'インフラエンジニア'],
};

export default function CareerOfferEvaluationChecklistIt2026() {
  return <><p>内定が出ると安心して判断が甘くなります。重要なのは「入社後に伸びる環境か」です。</p><h2>必須チェック</h2><img src={__BASE_PATH__ + 'images/column/interview-female-document.png'} alt="女性が内定書類を受け取っているシーン" style={{ width: '100%', borderRadius: '12px', margin: '1.5rem 0' }} /><ul><li>配属先と業務範囲</li><li>研修内容と期間</li><li>残業・夜勤の実態</li><li>評価制度と昇給条件</li></ul><h2>結論</h2><img src={__BASE_PATH__ + 'images/column/hired-handshake-resume.png'} alt="履歴書を前に握手して採用が決まるシーン" style={{ width: '100%', borderRadius: '12px', margin: '1.5rem 0' }} /><p>年収だけでなく、1〜2年後の市場価値が上がるかで判断しましょう。</p></>;
}

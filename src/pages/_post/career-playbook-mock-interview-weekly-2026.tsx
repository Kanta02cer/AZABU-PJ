export const meta = {
  type: 'column' as const,
  thumbnail: __BASE_PATH__ + 'images/column/20se_cover.png',
  category: 'CAREER',
  date: '2026.02.22',
  title: '未経験IT転職の模擬面接は週何回が最適？短期で通過率を上げる設計',
  excerpt: '面接準備は量より設計。週次で模擬面接を回す回数、振り返りの型、改善優先順位を解説します。',
  tags: ['模擬面接', '面接対策', '未経験', 'IT転職', '中途'],
};

export default function CareerPlaybookMockInterviewWeekly2026() {
  return <><p>模擬面接は回数だけ増やしても効果が出ません。改善対象を絞る設計が必要です。</p><h2>結論</h2><img src={__BASE_PATH__ + 'images/column/interview-resume-laptop.png'} alt="面接官がPCと履歴書を前に応募者と向き合うシーン" style={{ width: '100%', borderRadius: '12px', margin: '1.5rem 0' }} /><p>週2回（本番想定1回＋改善確認1回）が最もバランスが良いです。</p><h2>改善の型</h2><ul><li>回答時間の最適化</li><li>結論先出し</li><li>逆質問の質</li></ul><h2>まとめ</h2><p>録音と要点メモを残すだけで通過率は上がります。</p></>;
}

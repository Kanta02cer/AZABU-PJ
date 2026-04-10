export const meta = {
  type: 'column' as const,
  thumbnail: __BASE_PATH__ + 'images/column/itinfra_cover.png',
  category: 'CAREER',
  date: '2026.04.05',
  title: '青春期の過去の経験がある場合の転職面接｜説明の境界線と前向きに締めるコツ',
  excerpt:
    '過去の行動・トラブル経験を抱え、応募や面接に不安がある方向け。職務に必要な範囲での説明、再発防止の見せ方、プライバシーと尊厳を守る配慮を整理しました。',
  tags: ['面接', 'キャリア', 'IT転職', '再挑戦', '中途', '転職'],
};

export default function CareerChangeYouthIncidentHistoryInterview2026() {
  return (
    <>
      <p>
        過去の経験について、転職活動でどこまで話すかは、本人の尊厳とプライバシーに関わる重要なテーマです。ここでお伝えするのは一般的な面接の考え方であり、<strong>個別の事情に応じた判断は専門家のサポートも検討してください</strong>。
      </p>

      <h2>原則：職務に必要な範囲に絞る</h2>
      <img src={__BASE_PATH__ + 'images/column/interview-young-sitting.png'} alt="若い男性が面接官と向き合い書類を確認しているシーン" style={{ width: '100%', borderRadius: '12px', margin: '1.5rem 0' }} />
      <p>
        採用面接は、性格の裁断の場ではなく、<strong>業務遂行と組織適合の確認</strong>が目的です。詳細は、聞かれた範囲で簡潔に答え、必要なら「職務に関係する範囲で」という前提を添えてください。
      </p>

      <h2>前向きに締めるための「3点セット」</h2>
      <ul>
        <li>
          <strong>いまの安定性</strong>：生活・健康・就労の前提が整っていること。
        </li>
        <li>
          <strong>学び・反省の言語化</strong>：抽象的な反省ではなく、行動に落ちる形。
        </li>
        <li>
          <strong>仕事への接続</strong>：ルール遵守、報連相、手順の重要性など、職種に結びつく価値観。
        </li>
      </ul>

      <h2>応募先の選び方：無理に説明負担を増やさない</h2>
      <p>
        企業によっては背景調査やセキュリティ要件が厳しい場合があります。応募先の要件を見ると、説明負担が過大にならない選び方ができます。
      </p>

      <h2>まとめ：再挑戦は「説明」より「設計」</h2>
      <p>
        過去の経験があるほど、応募は衝動ではなく設計が重要です。学習・面接の話し方・応募先の条件を整理し、まずは無料相談で「話す順番」を一緒に整えましょう。
      </p>

      <div style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '3rem' }}>
        <a
          href="https://calendar.app.google/8cVcUkLokHP1w48Y6"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #FF6B00, #FF8C00)',
            color: 'white',
            padding: '1.25rem 3rem',
            borderRadius: '9999px',
            fontWeight: 'bold',
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(255,107,0,0.3)',
          }}
        >
          面接の話し方を無料で相談する
        </a>
      </div>
    </>
  );
}

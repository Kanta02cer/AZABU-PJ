export const meta = {
  type: 'column' as const,
  thumbnail: __BASE_PATH__ + 'images/column/20se_cover.png',
  category: 'CAREER',
  date: '2026.04.08',
  title: 'AZABU+転職の書類突破法｜落ちる理由トップ5と修正チェックリスト',
  excerpt:
    'AZABU+転職・麻布プラスを検索する未経験層向け。書類が通る共通点、落ちやすいパターン、志望動機と職務経歴の直し方をチェックリストで整理しました。',
  tags: ['書類選考', '履歴書', '職務経歴書', '未経験', 'IT転職', 'インフラエンジニア'],
};

export default function CareerChangeResumeScreeningFailuresFix2026() {
  return (
    <>
      <p>
        未経験転職で書類が落ちる理由は、多くの場合「スキル不足」ではなく、<strong>採用側が次の面接に進める材料が文章にない</strong>ことです。本記事では、典型的な落ちパターンと、修正のチェックリストをまとめます。
      </p>

      <h2>落ちやすい理由トップ5（未経験寄り）</h2>
      <img src={__BASE_PATH__ + 'images/column/interview-young-resume.png'} alt="若い男性が履歴書を前に面接を受けているシーン" style={{ width: '100%', borderRadius: '12px', margin: '1.5rem 0' }} />
      <ol>
        <li>
          <strong>志望動機が業界一般論</strong>：DX、IT人材不足など、どの会社にも当てはまる文章。
        </li>
        <li>
          <strong>学習の事実がない</strong>：「勉強中」だけで、教材・時間・成果が不明。
        </li>
        <li>
          <strong>過去の職歴が翻訳されていない</strong>：箇条書きの羅列で、再現性が見えない。
        </li>
        <li>
          <strong>応募先の職種とズレている</strong>：インフラ希望なのに開発の話だけ、など。
        </li>
        <li>
          <strong>誤字・フォーマット・長さ</strong>：読み手の負荷が高い。
        </li>
      </ol>

      <h2>修正チェックリスト（そのまま使える）</h2>
      <ul>
        <li>志望動機に「その会社の事業・役割」を1文入れたか</li>
        <li>学習は「教材名・期間・時間・成果」を1セット書いたか</li>
        <li>強みエピソードはSTARで1つに絞り、結果まで書いたか</li>
        <li>未経験であることを隠さず、学習計画を書いたか</li>
        <li>職種名（インフラ／クラウド／運用など）を自分の言葉で定義したか</li>
      </ul>

      <h2>まとめ：書類は「面接の質問表」</h2>
      <p>
        よい書類は、面接官が「この人に何を聞けばいいか」が分かる書類です。未経験ほど、学習と意思の見える化が鍵になります。
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
          書類の添削を無料で相談する
        </a>
      </div>
    </>
  );
}

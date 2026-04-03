export const meta = {
  type: 'column' as const,
  thumbnail: __BASE_PATH__ + 'images/column/itinfra_cover.png',
  category: 'CAREER',
  date: '2026.04.15',
  title: '空白期間・長期離職からのITインフラ転職｜面接で伝える順番と現実ライン',
  excerpt:
    '長期のブランクや離職期間があり、履歴書が弱いと感じる方向け。ITインフラ未経験で再スタートする際の現実ライン、志望動機・経歴の語り方、企業が見るポイントを整理しました。',
  tags: ['空白期間', '長期離職', 'ブランク', 'IT転職', 'インフラエンジニア', '未経験', '中途'],
  isFeatured: true,
};

export default function CareerRestartBlankPeriodInfra2026() {
  return (
    <>
      <p>
        「履歴書に空白期間があって応募しても意味がないのでは」と感じる方は少なくありません。一方で、ITインフラ領域は<strong>慢性的な人手不足</strong>があり、企業側は「即戦力だけ」ではなく、<strong>学習習慣・再挑戦の意思・コミュニケーションの安定</strong>をセットで見る場面が増えています。本記事では、空白期間を前提にしたうえでの<strong>現実的な勝ち筋</strong>と、面接で話す<strong>順番</strong>をまとめます。
      </p>

      <h2>結論：空白期間「あり」でも、説明の型があれば選考は回せる</h2>
      <p>
        重要なのは「経歴が華やかか」ではなく、<strong>再就職後に安定して働けるか</strong>を採用側が推測できることです。そのために必要なのは、空白の事実だけでなく、<strong>その間に何をしていたか／今は何ができるか／入社後にどう学ぶか</strong>の3点セットです。
      </p>

      <h2>インフラ未経験で再スタートしやすい理由（中途・ブランク層向け）</h2>
      <ul>
        <li>
          <strong>需要の土台が太い</strong>：クラウド移行、セキュリティ、運用の高度化で、インフラ系の採用は継続的に出やすいです。
        </li>
        <li>
          <strong>学習の入口が明確</strong>：Linux・ネットワーク・クラウドの基礎は、独学でも「到達目標」が作りやすく、面接で説明しやすいです。
        </li>
        <li>
          <strong>資格は後追いでも評価されやすい</strong>：未経験でも、LinuCやAWSの入門資格は「学習能力」の証拠として使いやすいです。
        </li>
      </ul>

      <h2>面接・履歴書で「空白期間」を話す順番（おすすめ）</h2>
      <ol>
        <li>
          <strong>いまの志望動機（前向き）</strong>：なぜITインフラか、何をしたいか。
        </li>
        <li>
          <strong>空白の事実（簡潔に）</strong>：長さ・時期。詳細は必要な範囲だけ。
        </li>
        <li>
          <strong>その間の行動（学習・生活・整えたこと）</strong>：前向きな事実に寄せる。
        </li>
        <li>
          <strong>入社後の学習計画</strong>：最初の90日で何をするか、具体的に。
        </li>
      </ol>

      <h2>よくある誤解：「正直に全部話すほど良い」わけではない</h2>
      <p>
        誠実さは評価されますが、面接は<strong>職務適性の確認の場</strong>です。プライベートの詳細より、<strong>仕事に影響する範囲で、再就業に向けて何を整えたか</strong>を中心に話すと通りやすくなります。
      </p>

      <h2>まとめ：ブランクは「説明責任」が増えるだけで、入口は閉じていない</h2>
      <p>
        空白期間があるほど、応募先の選び方と学習の見える化が重要になります。まずは志望理由と学習ログを短くまとめ、無料相談で「話す順番」を一緒に整えるのも有効です。
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
          経歴の整理と応募戦略を無料で相談する
        </a>
      </div>
    </>
  );
}

export const meta = {
  type: 'column' as const,
  thumbnail: __BASE_PATH__ + 'images/column/20se_cover.png',
  category: 'CAREER',
  date: '2026.04.05',
  title: '休職・メンタル不調からのIT転職｜無理のないペース設計と職種選び',
  excerpt:
    '休職やメンタルヘルス上の事情を経験した方が、IT業界・インフラ職を選ぶ際の現実的な線、配慮が必要な点、面接での伝え方の考え方を整理しました。',
  tags: ['休職', 'メンタルヘルス', 'IT転職', 'インフラエンジニア', 'キャリア', '中途'],
};

export default function CareerChangeAfterLeaveMentalHealthIt2026() {
  return (
    <>
      <p>
        休職や通院を経て再就職を考える段階では、「また同じように崩れないか」「夜勤や突発対応が多い職場は避けたい」という不安が出やすいです。ITインフラは<strong>オンコールや障害対応</strong>のイメージが強い一方で、<strong>運用の分担・自動化・クラウド移行</strong>など、働き方の設計が進んでいる現場も増えています。本記事では、<strong>無理のないペース</strong>を前提にした職種選びの考え方をまとめます。
      </p>

      <h2>前提：医療的判断は医療の専門家へ、転職は「働き方の設計」へ</h2>
      <img src={__BASE_PATH__ + 'images/column/resignation-female-box.png'} alt="退職時に荷物を整理して職場を去る女性" style={{ width: '100%', borderRadius: '12px', margin: '1.5rem 0' }} />
      <p>
        キャリア記事でできるのは、一般的な業界情報と面接の準備の型です。体調面の可否は個別事情が大きいため、<strong>復職・就労のタイミング</strong>は医師・カウンセラー等のサポートを優先してください。
      </p>

      <h2>インフラ職を選ぶときに確認したい「負荷の種類」</h2>
      <ul>
        <li>
          <strong>オンコールの有無・頻度</strong>：担当交代か、常時連絡か。
        </li>
        <li>
          <strong>夜勤の固定度</strong>：一時的か、常態化しているか。
        </li>
        <li>
          <strong>顧客対応の強度</strong>：ヘルプデスク寄りか、構築寄りか。
        </li>
        <li>
          <strong>チームの人数と分担</strong>：一人持ちになりやすい体制か。
        </li>
      </ul>

      <h2>面接では「配慮」を求めるより「再発防止の働き方」を具体化する</h2>
      <p>
        採用側が知りたいのは、配慮そのものより、<strong>業務上の負荷をどうコントロールできるか</strong>です。例えば睡眠リズムの維持、タスク管理、相談の仕方、学習の継続など、<strong>仕事に接続できる行動</strong>を短く示すと会話が前に進みやすいです。
      </p>

      <h2>まとめ：「強い人」より「設計できる人」が残りやすい時代</h2>
      <p>
        インフラは属人的な対応より、手順化・監視・自動化が進むほど、チームで持つ文化が強い現場ほど長く働きやすい傾向があります。まずは希望の働き方を箇条書きにし、求人票の「曖昧な言葉」を面接で分解して確認していきましょう。
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
          働き方の前提を整理して相談する（無料）
        </a>
      </div>
    </>
  );
}

export const meta = {
  type: 'column' as const,
  thumbnail: __BASE_PATH__ + 'images/column/itinfra_cover.png',
  category: 'CAREER',
  date: '2026.04.09',
  title: '「自分は未経験のくせに…」詐欺感を払う｜インフラ学習の不安と面接の整え方',
  excerpt:
    'インフラ未経験で学習を進めると出やすい「詐欺みたい」という感覚。自信のなさを否定せず、応募・面接で破綻しない言い方のコツをまとめました。',
  tags: ['未経験', '自信', 'キャリア', 'インフラエンジニア', 'メンタル', '面接'],
};

export default function CareerChangeImposterSyndromeInfraBeginner2026() {
  return (
    <>
      <p>
        未経験でインフラを学び始めると、情報量に圧倒され、「自分はまだ何も言えない」という感覚が強くなります。それは学習の初期では自然です。問題は、感情のまま応募を止めることです。本記事では、<strong>自信がなくても前に進むための言語化</strong>をまとめます。
      </p>

      <h2>結論：未経験は「隠す」より「定義する」</h2>
      <img src={__BASE_PATH__ + 'images/column/stress-layoff-box.png'} alt="頭を抱えて悩む男性の傍らに段ボール箱がある退職シーン" style={{ width: '100%', borderRadius: '12px', margin: '1.5rem 0' }} />
      <p>
        面接で求められるのは、完璧なスキルではなく、<strong>学習の再現性と安全に仕事をする姿勢</strong>です。「未経験ですが、ここまで作業ログを残す習慣があります」と言えると、説得力が変わります。
      </p>

      <h2>不安をそのまま書くのではなく、行動に変換する</h2>
      <ul>
        <li>
          <strong>不安</strong>：分からないことが多い → <strong>行動</strong>：質問の仕方、調べる手順を記録。
        </li>
        <li>
          <strong>不安</strong>：ミスが怖い → <strong>行動</strong>：手順書、バックアップ、変更の範囲を小さくする。
        </li>
        <li>
          <strong>不安</strong>：遅いと思われそう → <strong>行動</strong>：期限と優先順位を先に合意する。
        </li>
      </ul>

      <h2>まとめ：自信は後からついてくる</h2>
      <p>
        インフラは「分からない」を前提に、手順とログで前に進む世界です。感情の波はありますが、応募の判断は「学習の見える化ができたか」で十分にできます。
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
          不安を整理して次の一歩を一緒に決める
        </a>
      </div>
    </>
  );
}

export const meta = {
  type: 'column' as const,
  thumbnail: __BASE_PATH__ + 'images/column/20se_cover.png',
  category: 'CAREER',
  date: '2026.04.10',
  title: '麻布転職の入口｜資格なし・スキルゼロからの90日プラン',
  excerpt:
    '麻布転職（AZABU+転職）で未経験からエンジニアを目指す方向け。資格なしの状態から応募で説明できる到達点を作る90日モデルを解説します。',
  tags: ['資格なし', '未経験', '独学', 'インフラエンジニア', 'ロードマップ', '90日'],
};

export default function CareerChangeNoSkillNoCert90DaysPlan2026() {
  return (
    <>
      <p>
        「何から始めればいいか分からない」は、未経験転職で最も損をする状態です。対策はシンプルで、<strong>90日で“言語化できる到達点”を1つ作る</strong>こと。資格がなくても、学習ログと検証環境があれば応募は動きます。
      </p>

      <h2>90日（12週）の目安モデル</h2>
      <h3>第1〜3週：ITの基礎とLinuxの入口</h3>
      <p>
        OSの役割、ファイル・権限、プロセス、ログの見方。ここは後のすべての土台です。
      </p>
      <h3>第4〜6週：ネットワーク基礎（IP、DNS、HTTP）を自分の言葉で説明</h3>
      <p>
        用語暗記ではなく、「なぜ通信が通る／止まる」まで説明できることを目標に。
      </p>
      <h3>第7〜9週：クラウドの入口（AWS/Azureいずれか1つ）</h3>
      <p>
        アカウント、VPC、EC2、セキュリティの最低限。無料枠で作業ログを残す。
      </p>
      <h3>第10〜12週：まとめと面接用の1枚資料</h3>
      <p>
        学習時間、使用教材、作った環境、詰まった点、解決手順を1枚にまとめる。
      </p>

      <h2>資格は「取りに行く」より「説明に使う」が先</h2>
      <p>
        資格は強いですが、取得に時間がかかる場合は、<strong>模擬試験レベルまで到達</strong>した事実を先に書類に載せる方法もあります。
      </p>

      <h2>まとめ：90日で「ゼロ」は終わらせる</h2>
      <p>
        完璧なポートフォリオより、<strong>再現性のある学習プロセス</strong>が未経験では刺さります。まずは1週目の目標だけ決めてください。
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
          90日プランを一緒に作る（無料）
        </a>
      </div>
    </>
  );
}

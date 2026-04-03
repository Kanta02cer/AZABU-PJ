export const meta = {
  type: 'column' as const,
  thumbnail: __BASE_PATH__ + 'images/column/20se_cover.png',
  category: 'CAREER',
  date: '2026.04.06',
  title: '小さな実績の積み上げで応募を通す｜未経験でも書ける「成果」の作り方',
  excerpt:
    'インフラ未経験で「成果がない」と止まる方へ。ポートフォリオがなくても作れる小さな実績の例と、履歴書・面接に載せる粒度を解説します。',
  tags: ['未経験', '実績', 'ポートフォリオ', 'IT転職', 'インフラエンジニア', '応募'],
};

export default function CareerChangeSmallWinsApplicationStrategy2026() {
  return (
    <>
      <p>
        未経験転職で「成果がない」と感じるのは、成果の定義が大きすぎることが多いです。インフラ学習では、<strong>小さな再現性</strong>がそのまま評価になります。例えば「自宅でVPCを作り、EC2に接続し、ログを確認できる」だけでも、説明できる成果です。
      </p>

      <h2>小さな実績の例（未経験でも作れる）</h2>
      <ul>
        <li>Linux：ユーザー権限の変更とログ確認までを手順化</li>
        <li>ネットワーク：ping/tracerouteで切り分けを説明できる</li>
        <li>クラウド：最小構成のサーバーを起動し、セキュリティグループを設定</li>
        <li>運用：障害の想定で「連絡・記録・復旧手順」を1枚にまとめる（訓練）</li>
      </ul>

      <h2>書類に書くときの粒度：「やったこと」より「再現手順」</h2>
      <p>
        「AWSを触った」より、「<strong>何を、どの順番で、どう確認したか</strong>」が短く書けている方が強いです。面接でも同じです。
      </p>

      <h2>まとめ：実績は“デカさ”より“説明可能性”</h2>
      <p>
        未経験の勝ち筋は、天才性ではなく、<strong>学習と作業の再現性</strong>です。小さく積み上げて、応募のたびに文章を更新していきましょう。
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
          実績の言語化を無料で相談
        </a>
      </div>
    </>
  );
}

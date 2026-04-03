export const meta = {
  type: 'column' as const,
  thumbnail: __BASE_PATH__ + 'images/column/itinfra_cover.png',
  category: 'CAREER',
  date: '2026.04.11',
  title: '社会経験が乏しいと感じる人の「強みの見つけ方」｜未経験IT向けフレーム',
  excerpt:
    'アルバイトや短い就業しかなく、履歴書に書けることがないと悩む方向け。インフラ・IT未経験採用で評価されやすい強みの言語化と、経歴の翻訳例を整理しました。',
  tags: ['社会経験', '未経験', '強み', 'IT転職', 'インフラエンジニア', '履歴書'],
};

export default function CareerChangeFewSocialExperienceStrengths2026() {
  return (
    <>
      <p>
        「社会経験が少ない」と感じるほど、履歴書の空白を埋めようとして疲れます。ただ、インフラの現場が求めるのは、華やかな職歴より<strong>再現性</strong>です。手順を守る、ログを残す、異常時に連絡する、改善を回す——これらは、接客・倉庫・物流・事務など、<strong>非ITの経験でも説明できます</strong>。
      </p>

      <h2>強みの型：STAR（状況・課題・行動・結果）を短く</h2>
      <p>
        長いエピソードは不要です。1エピソード1分で、<strong>何を改善し、どう再現したか</strong>が伝われば十分です。
      </p>

      <h2>職種別の「翻訳」例（イメージ）</h2>
      <ul>
        <li>
          <strong>接客</strong>：ヒアリング（要件整理）／クレーム対応（インシデント初動）／引き継ぎ（ドキュメント）
        </li>
        <li>
          <strong>事務</strong>：データ入力の正確性／チェックリスト運用／期限管理
        </li>
        <li>
          <strong>軽作業・物流</strong>：安全手順／在庫ミス防止／ピーク時の優先順位付け
        </li>
      </ul>

      <h2>まとめ：経験の「量」より「型」</h2>
      <p>
        未経験IT転職は、強みの数ではなく、<strong>一貫したストーリー</strong>が勝ちます。まずは強みを3つに絞り、面談で磨きましょう。
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
          強みの言語化を無料で相談
        </a>
      </div>
    </>
  );
}

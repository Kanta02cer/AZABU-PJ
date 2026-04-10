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
        未経験転職で書類が落ちる理由は、多くの場合「スキル不足」ではなく、<strong>採用側が次の面接に進める材料が文章にない</strong>ことです。本記事では、典型的な落ちパターンと修正のチェックリスト、そして未経験者が押さえるべき志望動機の書き方を詳しく解説します。
      </p>

      <h2>落ちやすい理由トップ5（未経験寄り）</h2>
      <img src={__BASE_PATH__ + 'images/column/interview-young-resume.png'} alt="若い男性が履歴書を前に面接を受けているシーン" style={{ width: '100%', borderRadius: '12px', margin: '1.5rem 0' }} />
      <ol style={{"listStyleType":"decimal","paddingLeft":"1.5rem","marginBottom":"2rem"}}>
        <li style={{"marginBottom":"0.75rem"}}>
          <strong>志望動機が業界一般論</strong>：「IT業界は成長しているから」「DX推進が重要だから」など、どの会社にも当てはまる文章。採用担当者は毎日何十枚もの書類を見ており、一般論は即座に見抜かれます。<br />
          <em>修正例：</em>「御社のクラウド移行支援事業に特に関心があり、AWSの学習を○ヶ月続けてきました。入社後はクラウドインフラ設計に携わりたいと考えています。」
        </li>
        <li style={{"marginBottom":"0.75rem"}}>
          <strong>学習の事実がない</strong>：「現在勉強中です」だけでは、どの教材を使って、何時間学習し、どこまで到達したのかが分かりません。採用側は「本当に本気なのか」を確認したいのです。<br />
          <em>修正例：</em>「Udemyの『Linux基礎コース』を3ヶ月で修了し、現在はLPIC Level1の取得に向けて模擬試験を週3回実施中。正答率は80%まで到達しています。」
        </li>
        <li style={{"marginBottom":"0.75rem"}}>
          <strong>過去の職歴が翻訳されていない</strong>：前職の業務を箇条書きで羅列しているだけでは、IT職に活かせる再現性が見えません。異業種でも「IT職に役立つ能力」として翻訳する作業が必要です。<br />
          <em>修正例：</em>「飲食店でのリーダー業務では、10名のシフト管理とクレーム対応を担当。トラブル対応時の優先順位判断力と、複数業務を並行する処理能力はインフラ運用でも活かせると考えています。」
        </li>
        <li style={{"marginBottom":"0.75rem"}}>
          <strong>応募先の職種とズレている</strong>：インフラエンジニア志望なのに、職務経歴に「Webアプリ開発」や「デザイン」の話だけが書かれていると、採用担当者は「なぜうちに？」と疑問を持ちます。<br />
          <em>修正例：</em>応募する職種ごとに書類を調整し、インフラ応募時はサーバー・ネットワーク・OSへの関心と学習実績を前面に出す。
        </li>
        <li style={{"marginBottom":"0.75rem"}}>
          <strong>誤字・フォーマット・長さ</strong>：誤字脱字は「注意力が低い」という印象を与えます。また、2ページを大きく超える職務経歴書や、余白が多すぎる書類は読み手の負荷が上がります。<br />
          <em>修正例：</em>提出前にスペルチェッカーと音読を組み合わせて確認する。職務経歴書はA4で1〜2枚に収める。
        </li>
      </ol>

      <h2>修正チェックリスト（そのまま使える）</h2>
      <ul style={{"listStyleType":"disc","paddingLeft":"1.5rem","marginBottom":"2rem"}}>
        <li style={{"marginBottom":"0.75rem"}}>志望動機に「その会社の事業・役割・プロダクト」を1文以上具体的に入れたか</li>
        <li style={{"marginBottom":"0.75rem"}}>学習は「教材名・学習期間・週あたりの時間・現在の到達レベル」を1セット書いたか</li>
        <li style={{"marginBottom":"0.75rem"}}>強みエピソードはSTAR法（状況・役割・行動・結果）で1つに絞り、数字・結果まで書いたか</li>
        <li style={{"marginBottom":"0.75rem"}}>未経験であることを隠さず、入社後の学習計画と成長イメージを書いたか</li>
        <li style={{"marginBottom":"0.75rem"}}>職種名（インフラ／クラウド／ネットワーク運用など）を自分の言葉で定義し、希望業務を明示したか</li>
        <li style={{"marginBottom":"0.75rem"}}>誤字・脱字を音読＋ツールの両方でチェックしたか</li>
        <li style={{"marginBottom":"0.75rem"}}>職務経歴書の分量はA4で1〜2枚に収まっているか</li>
        <li style={{"marginBottom":"0.75rem"}}>応募企業の求人票と自分の書類を並べて読み、キーワードが一致しているか確認したか</li>
      </ul>

      <h2>IT企業向け志望動機の書き方</h2>
      <p>
        未経験でIT企業の書類を通過するためには、志望動機に以下の3要素を盛り込む必要があります。
      </p>
      <ol style={{"listStyleType":"decimal","paddingLeft":"1.5rem","marginBottom":"2rem"}}>
        <li style={{"marginBottom":"0.75rem"}}>
          <strong>なぜIT・インフラなのか（動機の起点）</strong>：具体的なきっかけやエピソードを簡潔に述べる。「友人のサーバートラブルを解決した経験でインフラの面白さに気づいた」など、実体験が伴うと説得力が増す。
        </li>
        <li style={{"marginBottom":"0.75rem"}}>
          <strong>なぜその会社なのか（企業固有の理由）</strong>：企業のHPや採用ページを読み込み、事業内容・扱う技術・社風・成長戦略の中から1〜2点を引用する。「御社のクラウドマネージドサービスに注目しており」など具体性が必要。
        </li>
        <li style={{"marginBottom":"0.75rem"}}>
          <strong>入社後に何を実現したいか（貢献イメージ）</strong>：3〜5年後にどのようなエンジニアになり、企業にどう貢献したいかを述べる。「インフラ設計の上流から携わり、クラウド移行を主導できるエンジニアを目指します」など具体的に。
        </li>
      </ol>
      <p>
        志望動機は「なぜIT→なぜここ→何を実現したいか」の3段構造を意識するだけで、採用担当者の印象は大きく変わります。
      </p>

      <h2>最後に：書類は「面接の質問表」である</h2>
      <p>
        よい書類とは、面接官が「この人に何を聞けばいいか」が自然に分かる書類です。採用担当者は書類から面接の質問を設計します。学習実績・過去の強み・志望動機が明確に書かれていれば、面接でもその話を深掘りしてもらえるため、準備しやすくなります。未経験だからこそ、「伸びしろと学習意欲の見える化」が書類突破の最大の鍵です。諦めずに何度でも書き直してください。
      </p>

      <div style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '3rem' }}>
        <a href="https://calendar.app.google/8cVcUkLokHP1w48Y6" target="_blank"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #FF6B00, #FF8C00)', color: 'white',
            padding: '1.25rem 3rem', borderRadius: '9999px', fontWeight: 'bold',
            textDecoration: 'none', boxShadow: '0 4px 14px rgba(255,107,0,0.3)' }}>
          無料キャリア相談・1day就職オーディションはこちら
        </a>
      </div>
    </>
  );
}

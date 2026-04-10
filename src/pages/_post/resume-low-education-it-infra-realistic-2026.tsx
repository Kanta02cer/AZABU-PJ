export const meta = {
  type: 'column' as const,
  thumbnail: __BASE_PATH__ + 'images/column/itinfra_cover.png',
  category: 'CAREER',
  date: '2026.01.11',
  title: '麻布プラス転職で変わる？高卒・大学中退からITインフラを狙う突破策',
  excerpt:
    '麻布プラス（AZABU+転職）を探している方向け。学歴コンプレックスがある場合でも評価される要素、履歴書の埋め合わせ方、資格と学習の見せ方を解説します。',
  tags: ['高卒', '大学中退', '学歴', 'IT転職', 'インフラエンジニア', '未経験', '中途'],
};

export default function ResumeLowEducationItInfraRealistic2026() {
  return (
    <>
      <p>
        「学歴がないからITは無理では」という不安は、応募前に心が折れやすい最大の要因のひとつです。ただしITインフラは、<strong>再現性のあるスキル（Linux、ネットワーク、クラウド）</strong>と<strong>資格・実験環境での学習履歴</strong>が説明できると、選考が進むケースは十分にあります。本記事では、学歴フィルターの実態・書類での見せ方・採用につながる文章構成を整理します。
      </p>

      <h2>学歴フィルターの実態：IT業界での現実</h2>
      <p>
        大手メーカー・金融系・コンサルなどの新卒一括採用では、学歴フィルターが実際に機能しているケースがあります。一方、<strong>中途採用のITインフラ領域</strong>では事情が異なります。現場には人手不足の状況が続いており、採用担当が重視するのは「すぐに戦力になるか、あるいは短期間で育成できるか」という観点です。
      </p>
      <p>
        つまり学歴は「ゼロではない」が「すべてではない」のが実態です。特に以下のような企業・ポジションでは、学歴より実績・資格・学習履歴の方が採用判断に直結しやすいです。
      </p>
      <ul style={{"listStyleType":"disc","paddingLeft":"1.5rem","marginBottom":"2rem"}}>
        <li style={{"marginBottom":"0.75rem"}}><strong>未経験歓迎を明示している中小IT企業のインフラ運用ポジション</strong></li>
        <li style={{"marginBottom":"0.75rem"}}><strong>SES企業の技術職（特に監視・運用系）</strong></li>
        <li style={{"marginBottom":"0.75rem"}}><strong>地方のSIerや社内SEポジション</strong></li>
      </ul>

      <h2>職務経歴書で学歴より目立たせる要素</h2>
      <p>
        学歴を書く欄は変えられませんが、職務経歴書の本文で学歴より印象強く見せる要素を作ることは可能です。以下の要素を職務経歴書に盛り込みましょう。
      </p>
      <ul style={{"listStyleType":"disc","paddingLeft":"1.5rem","marginBottom":"2rem"}}>
        <li style={{"marginBottom":"0.75rem"}}><strong>学習ログ</strong>：何を、何時間、どの教材で、どこまで到達したか。「Linuxの基礎を3ヶ月で独学し、仮想環境で権限設定・ログ確認の手順書を作成」のように具体的に書く。</li>
        <li style={{"marginBottom":"0.75rem"}}><strong>検証環境での成果</strong>：自宅の仮想環境やクラウド無料枠での構築経験。「AWSの無料枠でEC2を起動し、セキュリティグループを設定・接続確認まで実施」という記述は即戦力の印象を与えます。</li>
        <li style={{"marginBottom":"0.75rem"}}><strong>非ITの実績の翻訳</strong>：手順を守る・記録する・改善するという再現性のある行動を、インフラの業務語に変換して記述する。</li>
      </ul>
      <p>
        採用担当が職務経歴書を読む時間は平均30秒〜1分と言われています。学歴欄は一目で終わりますが、<strong>「学習実績」「検証環境」「資格」のセクションが充実していると、学歴より先にそちらに目が引かれます</strong>。
      </p>

      <h2>資格・学習歴の書き方：採用につながる構成</h2>
      <p>
        資格欄には、取得済みのものだけでなく「学習中・受験予定」のものも記載できます。例えば「LinuC Level1（2026年6月受験予定）・現在模擬試験スコア75%」のような書き方で、到達点を可視化します。
      </p>
      <p>
        学習歴の書き方は、以下の構成が効果的です。
      </p>
      <ul style={{"listStyleType":"disc","paddingLeft":"1.5rem","marginBottom":"2rem"}}>
        <li style={{"marginBottom":"0.75rem"}}><strong>学習期間</strong>：いつからいつまで（例：2025年10月〜現在）</li>
        <li style={{"marginBottom":"0.75rem"}}><strong>使用教材・ツール</strong>：参考書名・Udemy・YouTube・仮想環境等</li>
        <li style={{"marginBottom":"0.75rem"}}><strong>到達点</strong>：どの水準まで操作・説明できるか</li>
        <li style={{"marginBottom":"0.75rem"}}><strong>証拠</strong>：資格・模擬試験スコア・学習ノート・GitHub等</li>
      </ul>

      <h2>面接で学習を説明するときのポイント</h2>
      <p>
        書類で伝えた学習内容を、面接でも一貫して話せることが重要です。「職務経歴書に書いてある学習を、口頭でも具体的に説明できるか」が採用担当のチェックポイントになります。学習内容を話すときは、以下の流れで話すと整理されて聞こえます。
      </p>
      <p>
        「いつから始めて（期間）→何を使って学んだか（教材・ツール）→どこまでできるようになったか（到達点）→それが業務でどう使えるか（接続）」という構成で話すと、未経験でも説得力のある自己PRになります。実際に操作した内容を「手を動かして確認した」という言葉で表現することで、座学だけでなく実践的な学習をしているという印象を与えられます。
      </p>

      <h2>志望動機での学歴への言及：コンプレックスより動機を前面に</h2>
      <p>
        志望動機で学歴コンプレックスに触れることは、読む側に「自信がない応募者」という印象を与えるリスクがあります。採用担当が欲しいのは「仕事への動機と入社後のビジョン」です。学歴の言及は必要最小限にして、<strong>なぜインフラか・何を学んだか・入社後に何をするか</strong>に紙面を使いましょう。学歴は過去のことですが、説明できる学習は現在進行形の強みです。
      </p>

      <div style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '3rem' }}>
        <a
          href="https://calendar.app.google/8cVcUkLokHP1w48Y6"
          target="_blank"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #FF6B00, #FF8C00)', color: 'white',
            padding: '1.25rem 3rem', borderRadius: '9999px', fontWeight: 'bold',
            textDecoration: 'none', boxShadow: '0 4px 14px rgba(255,107,0,0.3)',
          }}
        >
          無料キャリア相談・1day就職オーディションはこちら
        </a>
      </div>
    </>
  );
}

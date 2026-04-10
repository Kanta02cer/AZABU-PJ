export const meta = {
  type: 'column' as const,
  thumbnail: __BASE_PATH__ + 'images/column/itinfra_cover.png',
  category: 'CAREER',
  date: '2026.03.04',
  title: '内定が出た後に後悔しない判断軸｜IT転職オファー比較チェックリスト',
  excerpt: '給与だけで決めると失敗しやすいIT転職。内定承諾前に確認すべき10項目を、未経験インフラ志望向けに整理しました。',
  tags: ['内定', 'オファー比較', 'IT転職', '未経験', 'インフラエンジニア'],
};

export default function CareerOfferEvaluationChecklistIt2026() {
  return (
    <>
      <p>
        内定が出た瞬間、多くの人は安堵してしまいます。長かった転職活動が終わったという解放感から、判断が甘くなりやすい局面です。しかし、IT転職においては「入社後の環境」こそが1〜2年後の市場価値を大きく左右します。給与だけを見て承諾し、入社後に「こんなはずじゃなかった」と後悔する人は少なくありません。本記事では、内定承諾前に必ず確認しておきたい10項目をチェックリスト形式で整理します。
      </p>

      <h2>なぜ内定後の判断が難しいのか</h2>
      <p>
        内定が出ると、採用担当者から「できるだけ早めにご回答ください」と促されるケースがあります。焦りと安心が混在した状態では、冷静に比較検討することが難しくなります。また、未経験転職の場合は「受かっただけでありがたい」という心理も働き、自分に不利な条件を見落としがちです。だからこそ、チェックリストを事前に用意しておく必要があります。
      </p>

      <h2>内定承諾前に確認すべき10項目</h2>
      <img src={__BASE_PATH__ + 'images/column/interview-female-document.png'} alt="女性が内定書類を受け取っているシーン" style={{ width: '100%', borderRadius: '12px', margin: '1.5rem 0' }} />
      <ol style={{"listStyleType":"decimal","paddingLeft":"1.5rem","marginBottom":"2rem"}}>
        <li style={{"marginBottom":"0.75rem"}}><strong>配属先と業務範囲</strong>：入社後に担当する具体的な業務を確認する。「運用保守」なのか「構築・設計」なのかで成長速度が変わる。</li>
        <li style={{"marginBottom":"0.75rem"}}><strong>研修内容と期間</strong>：未経験向けの研修プログラムが整っているか。資格取得支援・OJT期間・メンター制度の有無を確認する。</li>
        <li style={{"marginBottom":"0.75rem"}}><strong>残業・夜勤の実態</strong>：求人票の「月20時間程度」が実態と合っているかを確認する。夜勤があるかどうかも、生活設計に直結する。</li>
        <li style={{"marginBottom":"0.75rem"}}><strong>評価制度と昇給条件</strong>：何をどう評価されるのかが明文化されているか。「頑張り次第」という曖昧な回答は注意信号。</li>
        <li style={{"marginBottom":"0.75rem"}}><strong>昇給条件と昇給額の実績</strong>：入社2〜3年後に年収はどの程度上がるか。モデルケースを聞けると判断しやすい。</li>
        <li style={{"marginBottom":"0.75rem"}}><strong>客先常駐の有無</strong>：SESや客先常駐の場合、自社研修・自社文化からは距離が生まれる。常駐先の変更頻度も確認する。</li>
        <li style={{"marginBottom":"0.75rem"}}><strong>チームの年齢層と雰囲気</strong>：20代が多い職場か、中堅が多い職場かで学べることが変わる。若手育成の文化があるかも確認する。</li>
        <li style={{"marginBottom":"0.75rem"}}><strong>離職率と定着率</strong>：直近1〜2年の離職率を確認する。開示を拒む企業には注意が必要。</li>
        <li style={{"marginBottom":"0.75rem"}}><strong>資格手当の制度</strong>：LPIC、AWS、CCNAなどの資格取得に対して手当が出るか。受験費用の補助があるかも重要。</li>
        <li style={{"marginBottom":"0.75rem"}}><strong>クラウド経験の機会</strong>：AWSやAzureに触れられる案件があるか。オンプレのみの環境では市場価値が上がりにくい。</li>
      </ol>

      <h2>複数のオファーを比較するときのコツ</h2>
      <img src={__BASE_PATH__ + 'images/column/hired-handshake-resume.png'} alt="履歴書を前に握手して採用が決まるシーン" style={{ width: '100%', borderRadius: '12px', margin: '1.5rem 0' }} />
      <p>
        複数の内定が出た場合は、上記10項目をスプレッドシートに並べて比較することをおすすめします。「年収」「研修制度」「クラウド経験の有無」「離職率」の4軸に絞って点数化するだけでも、判断が格段にしやすくなります。また、入社後1年・3年後の自分をイメージして「どちらの環境が市場価値を高めるか」という視点で考えると、短期の給与差よりも長期のキャリアを優先できます。
      </p>

      <h2>これが出たら注意：オファーのレッドフラグ</h2>
      <ul style={{"listStyleType":"disc","paddingLeft":"1.5rem","marginBottom":"2rem"}}>
        <li style={{"marginBottom":"0.75rem"}}>研修が「OJTのみ」で具体的なカリキュラムがない</li>
        <li style={{"marginBottom":"0.75rem"}}>離職率の質問に「お答えしかねます」と回答される</li>
        <li style={{"marginBottom":"0.75rem"}}>入社後の配属先が「未定」のまま承諾を求められる</li>
        <li style={{"marginBottom":"0.75rem"}}>評価基準が「上司の裁量」に依存していると感じる</li>
        <li style={{"marginBottom":"0.75rem"}}>求人票と口頭説明で条件が微妙に異なる</li>
      </ul>
      <p>
        これらの兆候が複数重なる場合は、承諾を急がず、エージェントや信頼できる第三者に相談することをおすすめします。
      </p>

      <h2>まとめ</h2>
      <p>
        内定承諾は転職活動のゴールではなく、キャリアの出発点です。年収だけで判断せず、「1〜2年後に市場価値が上がる環境か」「学習と成長を支援する文化があるか」という視点でオファーを評価しましょう。チェックリストを活用すれば、感情に流されずに冷静な判断ができます。不安な点はエージェントを通じて企業に確認することも有効です。
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

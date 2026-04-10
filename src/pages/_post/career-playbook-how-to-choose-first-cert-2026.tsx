export const meta = {
  type: 'column' as const,
  thumbnail: __BASE_PATH__ + 'images/column/20se_cover.png',
  category: 'CAREER',
  date: '2026.02.28',
  title: '最初の資格は何を取るべき？未経験IT転職の優先順位',
  excerpt: '資格選びで遠回りしないために、職種別の優先度と学習コストを比較。CCNA/LinuC/AWS入門の使い分けを解説。',
  tags: ['資格', 'CCNA', 'LinuC', 'AWS', '未経験', 'IT転職'],
};

export default function CareerPlaybookHowToChooseFirstCert2026() {
  return (
    <>
      <p>
        未経験からインフラ・ネットワーク系ITへの転職を目指すとき、最初に直面するのが「どの資格から取るべきか」という問題です。LinuC、CCNA、AWS CLF——選択肢は複数ありますが、<strong>順番を間違えると時間と費用を無駄にします</strong>。資格は目的ではなく、採用担当者への説得材料です。職種と学習コストを比較して、最短ルートを選びましょう。
      </p>

      <h2>資格選びの3つの判断軸</h2>
      <p>
        最初の資格を選ぶときは、次の3点を基準にしてください。
      </p>
      <ol>
        <li><strong>志望する職種に直結しているか：</strong>ネットワーク監視・運用ならLinuCまたはCCNA、クラウド運用・サポートならAWS CLFが最も採用担当者の評価につながりやすい。</li>
        <li><strong>3ヶ月以内に合格水準に到達できるか：</strong>転職活動は早期に動き始めることが重要。半年以上かかる資格はまず後回しにして、短期で取れるものを優先する。</li>
        <li><strong>面接で学習内容を自分の言葉で説明できるか：</strong>合格証書を提示するだけでは評価されない。「学習中に理解できたこと・詰まったこと」を語れる深さまで習得していることが前提。</li>
      </ol>
      <p>
        この3軸で候補を絞ると、ほとんどのケースで最初の資格は<strong>LinuC Level1</strong>か<strong>AWS CLF（クラウドプラクティショナー）</strong>のいずれかに絞られます。
      </p>

      <h2>LinuC Level1・CCNA・AWS CLFの比較</h2>
      <p>
        <strong>LinuC Level1</strong>は、Linuxの基本操作・ファイルシステム・シェルスクリプトの理解を問う資格です。インフラ運用・監視の求人では「Linux基礎知識」が必須要件に挙げられることが多く、取得しているだけで書類通過率が上がります。学習期間の目安は<strong>2〜3ヶ月（1日1〜2時間）</strong>。未経験者にとって最も汎用性が高い最初の一手です。
      </p>
      <p>
        <strong>CCNA</strong>は、Cisco認定のネットワーク基礎資格です。ルーティング・スイッチング・VLANなど、ネットワーク構築・運用の職種では高く評価されます。ただし難易度はLinuCより高く、学習期間は<strong>4〜6ヶ月</strong>が一般的です。ネットワークエンジニア志望であれば最終的に取るべき資格ですが、未経験者の「最初の1枚」としては重すぎる場合があります。
      </p>
      <p>
        <strong>AWS CLF（クラウドプラクティショナー）</strong>は、AWSの基本サービスと概念を問う入門資格です。クラウドインフラの運用補助・カスタマーサポート系の求人に強く、学習期間は<strong>1〜2ヶ月</strong>と最も短期間で取得できます。ただし「クラウドだけ」の知識では採用に直結しにくいケースもあり、LinuCとの併用が理想です。
      </p>

      <h2>職種別の推奨ルート</h2>
      <p>
        志望する職種に合わせた資格取得の優先順位を整理すると次のようになります。
      </p>
      <ul>
        <li><strong>サーバー・インフラ運用監視：</strong>LinuC Level1 → LinuC Level2 → AWS SAA の順で進む。</li>
        <li><strong>ネットワークエンジニア：</strong>LinuC Level1（Linuxの基礎として）→ CCNA → CCNP の順が王道。</li>
        <li><strong>クラウドエンジニア（AWS）：</strong>AWS CLF → AWS SAA → LinuC Level1 を並行して進める。</li>
        <li><strong>ITサポート・ヘルプデスク：</strong>CompTIA A+ またはITパスポート → AWS CLF の順でも対応できる。</li>
      </ul>
      <p>
        上記はあくまで目安です。応募したい企業の求人票に書かれている「歓迎スキル・必須スキル」を確認して、最も多く登場する資格名を優先するのが最も確実なアプローチです。
      </p>

      <h2>資格だけでは足りない：学習ログとセットで提示する</h2>
      <p>
        採用担当者が資格証書に期待するのは「学習を完走した継続力の証明」です。それ単体では実務能力の証明にはなりません。資格と同時に、<strong>学習記録（Notionやブログ）・手を動かした実績（Linuxコマンド練習、AWSハンズオン）</strong>をセットで提示することで、説得力が大幅に上がります。
      </p>
      <p>
        面接では「なぜその資格を選んだか」「学習中に詰まった点と解決方法」「資格取得後に実際に試したこと」を具体的に話せるよう準備しておくことが重要です。合格証書を見せるだけでなく、<strong>学習プロセスを語れる人材</strong>が採用担当者の記憶に残ります。最初の資格は1つに絞り、深く学んで語れる状態で転職活動に臨みましょう。
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

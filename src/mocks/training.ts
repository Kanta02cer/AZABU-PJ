export interface CertificationCategory {
  title: string;
  count: number;
  icon: string;
  delay: number;
}

export const certificationStats: CertificationCategory[] = [
  {
    title: 'AWS認定資格',
    count: 245,
    icon: 'ri-cloud-line',
    delay: 0,
  },
  {
    title: 'Cisco認定 (CCNA/CCNP)',
    count: 182,
    icon: 'ri-router-line',
    delay: 100,
  },
  {
    title: '情報処理技術者試験',
    count: 156,
    icon: 'ri-shield-check-line',
    delay: 200,
  },
  {
    title: 'Google Cloud認定',
    count: 89,
    icon: 'ri-google-line',
    delay: 300,
  },
];

export interface TrainingStep {
  id: number;
  title: string;
  period: string;
  description: string;
  skills: string[];
}

export const trainingSteps: TrainingStep[] = [
  {
    id: 1,
    title: '基礎・資格取得研修',
    period: '入社 〜 2ヶ月',
    description: 'ITの基礎からネットワーク、サーバーの実務までを網羅。CCNAなどの主要資格を研修期間中に取得することを目指します。',
    skills: ['ネットワーク基礎', 'Linux', 'CCNA対策'],
  },
  {
    id: 2,
    title: 'チーム配属・OJT',
    period: '3ヶ月 〜 1年',
    description: '実際のプロジェクトチームに配属され、先輩社員のサポートのもとで実務を経験。実戦的なスキルを磨きます。',
    skills: ['実務運用', 'トラブルシューティング', 'チーム連携'],
  },
  {
    id: 3,
    title: '設計・構築エンジニアへ',
    period: '2年 〜 3年',
    description: '要件定義や設計、構築といった上流工程へとステップアップ。より難易度の高いクラウド案件などにも挑戦します。',
    skills: ['設計構築', 'クラウド移行', 'リーダーシップ'],
  },
];

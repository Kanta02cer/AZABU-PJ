// ============================================================
// UpBoard — AIスコアリングエンジン
// 仕様書 §4.2 準拠
// ============================================================

export interface ScoringInput {
  skills: string[];
  exp_years: number;        // 0 = 未経験
  timing: string;           // 'immediately'|'2-3months'|'6months'|'not_urgent'
  portfolio_url: string;
}

export interface ScoreBreakdown {
  base: number;       // 基礎点 30
  skill: number;      // スキルセット一致度 max40
  breadth: number;    // スキル数・幅 max10
  exp: number;        // エンジニア経験年数 max25
  urgency: number;    // 転職緊急度 max10
  portfolio: number;  // ポートフォリオ有無 max8
  total: number;
}

export type Rank = 'S' | 'A' | 'B';

export interface ScoreResult {
  total: number;
  rank: Rank;
  breakdown: ScoreBreakdown;
  estimated_salary_min: number;
  estimated_salary_max: number;
  message: string;
  strengths: string[];
  next_actions: string[];
}

// 需要の高いエンジニアスキル一覧
const HIGH_DEMAND_SKILLS = new Set([
  'JavaScript', 'TypeScript', 'Python', 'Go', 'Java', 'Ruby', 'PHP',
  'Rust', 'Swift', 'Kotlin', 'C#', 'C++', 'Scala',
  'React', 'Vue', 'Angular', 'Next.js', 'Nuxt.js',
  'Node.js', 'FastAPI', 'Django', 'Rails', 'Spring',
  'AWS', 'GCP', 'Azure', 'Terraform', 'Ansible',
  'Docker', 'Kubernetes', 'Linux', 'Nginx',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch',
  'Git', 'GitHub', 'CI/CD', 'Jenkins', 'GitHub Actions',
  'セキュリティ', 'ネットワーク', 'インフラ', 'SRE',
  'ML', '機械学習', 'データ分析', 'SQL',
]);

// §4.2 スキルセット一致度（max 40点）
// 高需要スキル1つあたり8点 × 最大5スキル
function calcSkillScore(skills: string[]): number {
  const matched = skills.filter(s =>
    HIGH_DEMAND_SKILLS.has(s) ||
    [...HIGH_DEMAND_SKILLS].some(h => h.toLowerCase() === s.toLowerCase().trim())
  );
  return Math.min(40, matched.length * 8);
}

// §4.2 スキル数・幅（max 10点）
function calcBreadthScore(skills: string[]): number {
  if (skills.length >= 5) return 10;
  if (skills.length >= 3) return 6;
  if (skills.length >= 1) return 3;
  return 0;
}

// §4.2 エンジニア経験年数（max 25点）
function calcExpScore(years: number): number {
  if (years >= 5) return 25;
  if (years >= 3) return 20;
  if (years >= 1) return 12;
  if (years > 0) return 5;   // 1年未満（例: 0.5年）
  return 0;                   // 未経験
}

// §4.2 転職緊急度（max 10点）
function calcUrgencyScore(timing: string): number {
  switch (timing) {
    case 'immediately': return 10;
    case '2-3months':   return 6;
    case '6months':     return 3;
    default:            return 1;
  }
}

// §4.2 ポートフォリオ有無（max 8点）
function calcPortfolioScore(url: string): number {
  return url?.trim().length > 0 ? 8 : 0;
}

// 推定年収算出
function estimateSalary(total: number, exp_years: number, job_type: string): { min: number; max: number } {
  const base = exp_years >= 5 ? 500 :
               exp_years >= 3 ? 450 :
               exp_years >= 1 ? 380 :
               exp_years > 0  ? 320 : 280;

  const rankBonus = total >= 80 ? 120 :
                    total >= 60 ? 70 : 30;

  const jobBonus = job_type?.includes('infra') || job_type?.includes('backend') ? 30 :
                   job_type?.includes('frontend') ? 20 : 0;

  const min = Math.round((base + rankBonus + jobBonus) / 50) * 50;
  const max = Math.round(min * 1.3 / 50) * 50;
  return { min, max };
}

// メインスコアリング関数
export function calcCandidateScore(
  input: ScoringInput,
  job_type = ''
): ScoreResult {
  const base = 30;
  const skill = calcSkillScore(input.skills);
  const breadth = calcBreadthScore(input.skills);
  const exp = calcExpScore(input.exp_years);
  const urgency = calcUrgencyScore(input.timing);
  const portfolio = calcPortfolioScore(input.portfolio_url);
  const total = base + skill + breadth + exp + urgency + portfolio;

  const rank: Rank = total >= 80 ? 'S' : total >= 60 ? 'A' : 'B';

  const { min, max } = estimateSalary(total, input.exp_years, job_type);

  // ランク別メッセージ
  const message =
    rank === 'S'
      ? 'Sランク！即戦力評価。上場企業からのスカウトを優先的に受け取れます。'
      : rank === 'A'
      ? 'Aランク！高ポテンシャル評価。積極採用中の上場企業にマッチしています。'
      : 'Bランク。あと少しのスキル追加で一気にスコアアップできます。';

  // 強みの言語化
  const strengths: string[] = [];
  if (portfolio > 0) strengths.push('ポートフォリオ・GitHub保有（採用担当者への強いアピール）');
  if (skill >= 32) strengths.push('需要の高いスキルを複数保有（市場競争力が高い）');
  if (exp >= 20) strengths.push('実務経験が十分あり、即戦力として評価される');
  if (urgency === 10) strengths.push('転職時期が明確で企業側のニーズと合致している');
  if (breadth >= 10) strengths.push('スキルの幅が広く、フルスタック志向が評価される');
  if (strengths.length === 0) strengths.push('ポテンシャル採用枠として上場企業へのチャレンジが可能');

  // 次のアクション提案
  const next_actions: string[] = [];
  if (portfolio === 0) next_actions.push('GitHubかポートフォリオサイトを作成すると+8点でランクアップ');
  if (skill < 32) next_actions.push('JavaScriptやPythonなど市場需要の高いスキルを1つ追加する');
  if (exp < 12) next_actions.push('個人プロジェクトや副業で実務に近い経験を積む');

  return {
    total,
    rank,
    breakdown: { base, skill, breadth, exp, urgency, portfolio, total },
    estimated_salary_min: min,
    estimated_salary_max: max,
    message,
    strengths,
    next_actions,
  };
}

// スカウト文自動生成（テンプレートエンジン）
// ※ 本番はClaude APIで個別最適化
export function generateScoutMessage(candidate: {
  name: string;
  skills: string[];
  exp_years: number;
  job_type: string;
  rank: string;
  want_income: number;
}, company = '上場企業'): { subject: string; body: string } {
  const topSkills = candidate.skills.slice(0, 3).join('・');
  const expText = candidate.exp_years >= 5 ? `${candidate.exp_years}年以上の豊富な` :
                  candidate.exp_years >= 1 ? `${candidate.exp_years}年の実務` :
                  'ポテンシャルと学習意欲が高く評価された';

  const jobLabel = candidate.job_type.includes('backend') ? 'バックエンドエンジニア' :
                   candidate.job_type.includes('infra') ? 'インフラエンジニア' :
                   candidate.job_type.includes('frontend') ? 'フロントエンドエンジニア' :
                   candidate.job_type.includes('fullstack') ? 'フルスタックエンジニア' :
                   candidate.job_type.includes('pm') ? 'プロジェクトマネージャー' :
                   'エンジニア';

  const urgencyText = candidate.rank === 'S'
    ? 'ご経験とスキルがわたしたちのお付き合いしている上場企業様の採用要件に非常に合致しており、'
    : 'ご登録いただいた内容を拝見し、可能性を感じてご連絡いたしました。';

  const subject = `【UpBoard】${candidate.name}様への非公開求人のご紹介（${company}・${jobLabel}）`;

  const body = `${candidate.name} 様

突然のご連絡失礼いたします。
UpBoard キャリアアドバイザーの○○と申します。

${urgencyText}ぜひ一度お話しさせていただきたくご連絡いたしました。

▼ ${candidate.name}様のご経験・スキルについて
${expText}経験（${topSkills}）は、現在の採用市場において非常に高い評価を受けています。
UpBoardのAI評価では【${candidate.rank}ランク】と判定されており、上場企業からの内定実績のある方と同等の評価です。

▼ ご紹介できるポジションについて
・企業種別: 東証プライム/スタンダード/グロース上場企業
・職種: ${jobLabel}
・想定年収: ${candidate.want_income ? candidate.want_income + '万円以上（ご希望水準での交渉可能）' : '経験・スキルに応じて優遇'}
・学歴: 完全不問（スキルと意欲だけで評価されます）

▼ UpBoardについて（有料職業紹介）
・厚生労働大臣許可番号：○○-○○○○○○
・求職者への費用: 完全無料（企業側から成功報酬をいただく仕組みです）

まずは15〜30分のオンライン面談で、${candidate.name}様のご状況とご希望をお聞かせください。
面談は完全無料・任意ですので、お気軽にご参加いただけます。

▼ 日程調整はこちら（Calendly）
→ https://calendly.com/upboard/career-talk

ご不明な点がございましたら、このメールへご返信ください。
どうぞよろしくお願いいたします。

────────────────────────────
UpBoard｜キャリアアドバイザーチーム
有料職業紹介事業許可取得済み
Email: career@upboard.jp
Web: https://upboard.jp
メール配信停止はこちら → [配信停止リンク]
────────────────────────────
※本メールは${candidate.name}様がUpBoardにご登録いただいた際に「スカウトメール受信に同意する」にチェックいただいた方へ送信しています。`;

  return { subject, body };
}

// CSV出力用データ整形
export function formatCandidateForCSV(c: Record<string, unknown>): Record<string, string> {
  const TIMING_LABEL: Record<string, string> = {
    immediately: '今すぐ',
    '2-3months': '2〜3ヶ月以内',
    '6months': '半年以内',
    not_urgent: '急いでいない',
  };
  const STATUS_LABEL: Record<string, string> = {
    new: '未対応',
    contacted: '連絡済',
    interviewing: '面接中',
    offered: 'オファー',
    placed: '成約',
    rejected: '不採用',
    withdrawn: '辞退',
  };
  const EDU_LABEL: Record<string, string> = {
    junior_high: '中卒',
    high_school: '高卒',
    vocational: '専門卒',
    junior_college: '短大卒',
    university_low: '大卒（偏差値50未満）',
    university_mid: '大卒（偏差値50以上）',
    graduate: '大学院卒',
  };

  return {
    ID: String(c.id ?? ''),
    氏名: String(c.name ?? ''),
    年齢: String(c.age ?? ''),
    メール: String(c.email ?? ''),
    電話: String(c.tel ?? ''),
    学歴: EDU_LABEL[String(c.education)] ?? String(c.education ?? ''),
    居住地: String(c.area ?? ''),
    スコア: String(c.score ?? ''),
    ランク: String(c.rank ?? ''),
    転職時期: TIMING_LABEL[String(c.timing)] ?? String(c.timing ?? ''),
    希望年収万円: String(c.want_income ?? ''),
    現在年収万円: String(c.current_income ?? ''),
    経験年数: String(c.exp_years ?? ''),
    スキル: Array.isArray(c.skills) ? (c.skills as string[]).join('|') : '',
    ポートフォリオURL: String(c.portfolio_url ?? ''),
    希望職種: String(c.job_type ?? ''),
    ステータス: STATUS_LABEL[String(c.status)] ?? String(c.status ?? ''),
    登録日: c.registered_at ? new Date(c.registered_at as string).toLocaleDateString('ja-JP') : '',
  };
}

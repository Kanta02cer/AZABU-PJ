// =====================
// AIマッチングエンジン
// スコアリングロジック（クライアントサイド版）
// Claude API版はSupabase Edge Functionで実行
// =====================

export interface SeekerProfile {
  skills: string[];
  current_salary: number;
  desired_salary_min: number;
  desired_salary_max: number;
  industry: string;
  desired_industry: string;
  switch_timing: string;
  work_style: string;
  experience_years: number;
  desired_job_type: string;
}

export interface ListingProfile {
  required_skills: string[];
  preferred_skills: string[];
  salary_min: number;
  salary_max: number;
  industry: string;
  work_style: string;
  hiring_timeline: string;
  job_type: string;
}

export interface MatchScore {
  total: number;       // 0-100
  skill: number;       // 0-40
  salary: number;      // 0-20
  industry: number;    // 0-20
  urgency: number;     // 0-10
  culture: number;     // 0-10
  rank: 'S' | 'A' | 'B' | 'C';
}

// スキルの類似語マップ（表記ゆれ対応）
const SKILL_ALIASES: Record<string, string[]> = {
  'AWS': ['aws', 'Amazon Web Services', 'アマゾン'],
  'Azure': ['azure', 'Microsoft Azure'],
  'GCP': ['gcp', 'Google Cloud', 'Google Cloud Platform'],
  'Linux': ['linux', 'CentOS', 'Ubuntu', 'RHEL'],
  'Python': ['python', 'Python3'],
  'JavaScript': ['js', 'javascript', 'ES6'],
  'TypeScript': ['ts', 'typescript'],
  'React': ['react', 'React.js', 'ReactJS'],
  'Docker': ['docker', 'コンテナ'],
  'Kubernetes': ['k8s', 'kubernetes', 'クーバネティス'],
  '不動産': ['不動産', '宅建', 'PropTech', 'プロップテック'],
  'ネットワーク': ['network', 'ネットワーク', 'CCNA', 'CCNP'],
  'セキュリティ': ['security', 'セキュリティ', 'CISSP', '情報セキュリティ'],
  'PM': ['PM', 'プロジェクトマネージャー', 'PMP', 'プロジェクト管理'],
};

function normalizeSkill(skill: string): string {
  const lower = skill.toLowerCase().trim();
  for (const [canonical, aliases] of Object.entries(SKILL_ALIASES)) {
    if (canonical.toLowerCase() === lower) return canonical;
    if (aliases.some(a => a.toLowerCase() === lower)) return canonical;
  }
  return skill.trim();
}

function calcSkillScore(seekerSkills: string[], requiredSkills: string[], preferredSkills: string[]): number {
  if (requiredSkills.length === 0) return 30; // 要件未記入は中間スコア

  const normalizedSeeker = seekerSkills.map(normalizeSkill);
  const normalizedRequired = requiredSkills.map(normalizeSkill);
  const normalizedPreferred = preferredSkills.map(normalizeSkill);

  // 必須スキル一致率（最大30点）
  const requiredMatches = normalizedRequired.filter(rs =>
    normalizedSeeker.some(ss => ss.toLowerCase() === rs.toLowerCase())
  ).length;
  const requiredRate = requiredMatches / normalizedRequired.length;
  const requiredPoints = Math.round(requiredRate * 30);

  // 優先スキル一致数（最大10点）
  const preferredMatches = normalizedPreferred.filter(ps =>
    normalizedSeeker.some(ss => ss.toLowerCase() === ps.toLowerCase())
  ).length;
  const preferredPoints = Math.min(10, preferredMatches * 3);

  return Math.min(40, requiredPoints + preferredPoints);
}

function calcSalaryScore(seeker: SeekerProfile, listing: ListingProfile): number {
  if (listing.salary_min === 0 && listing.salary_max === 0) return 15;

  const seekerMin = seeker.desired_salary_min;
  const seekerMax = seeker.desired_salary_max || seekerMin * 1.2;
  const listMin = listing.salary_min;
  const listMax = listing.salary_max || listMin * 1.2;

  // 範囲が重なっているかチェック
  const overlapStart = Math.max(seekerMin, listMin);
  const overlapEnd = Math.min(seekerMax, listMax);

  if (overlapEnd >= overlapStart) {
    // 重複あり → オーバーラップ率で加点
    const overlapRange = overlapEnd - overlapStart;
    const seekerRange = seekerMax - seekerMin || 1;
    const overlapRate = Math.min(1, overlapRange / seekerRange);
    return Math.round(10 + overlapRate * 10);
  }

  // 重複なし
  if (seekerMin > listMax) {
    // 求職者の希望が高すぎる
    const gap = seekerMin - listMax;
    if (gap <= 50) return 8;
    if (gap <= 100) return 5;
    return 2;
  } else {
    // 求職者の希望が低い（企業側が払える）→ やや加点
    return 12;
  }
}

function calcIndustryScore(seeker: SeekerProfile, listing: ListingProfile): number {
  const industryMap: Record<string, string[]> = {
    'IT': ['IT', 'テクノロジー', 'SaaS', 'Web', 'システム開発', 'ソフトウェア'],
    '不動産': ['不動産', 'PropTech', '建設', 'ゼネコン', '建設テック'],
    '金融': ['金融', 'FinTech', '銀行', '保険', '証券'],
    '製造': ['製造', 'ものづくり', 'メーカー'],
    'コンサル': ['コンサル', 'コンサルティング', 'シンクタンク'],
  };

  const normalize = (ind: string) => {
    for (const [key, aliases] of Object.entries(industryMap)) {
      if (key === ind || aliases.includes(ind)) return key;
    }
    return ind;
  };

  const seekerCurrentNorm = normalize(seeker.industry);
  const seekerDesiredNorm = normalize(seeker.desired_industry);
  const listingNorm = normalize(listing.industry);

  if (seekerDesiredNorm === listingNorm) return 20;
  if (seekerCurrentNorm === listingNorm) return 15;

  // 関連業界チェック（IT × 不動産 = PropTech）
  const related = [
    ['IT', '不動産'],
    ['IT', '金融'],
    ['IT', '製造'],
  ];
  const isRelated = related.some(([a, b]) =>
    (seekerDesiredNorm === a && listingNorm === b) ||
    (seekerDesiredNorm === b && listingNorm === a) ||
    (seekerCurrentNorm === a && listingNorm === b) ||
    (seekerCurrentNorm === b && listingNorm === a)
  );

  return isRelated ? 12 : 5;
}

const URGENCY_MAP: Record<string, number> = {
  'immediately': 10,
  'within_1month': 10,
  'within_3months': 8,
  'within_6months': 5,
  'over_6months': 2,
  'immediate': 10,
  'within_3month': 8,
  'flexible': 5,
};

const TIMELINE_MAP: Record<string, number> = {
  'immediate': 10,
  'within_1month': 8,
  'within_3months': 6,
  'flexible': 5,
};

function calcUrgencyScore(seeker: SeekerProfile, listing: ListingProfile): number {
  const seekerScore = URGENCY_MAP[seeker.switch_timing] ?? 5;
  const listingScore = TIMELINE_MAP[listing.hiring_timeline] ?? 5;
  // 両者の緊急度が合致するほど高スコア
  return Math.round((seekerScore + listingScore) / 2);
}

function calcCultureScore(seeker: SeekerProfile, listing: ListingProfile): number {
  const workStyleMap: Record<string, number> = {
    'remote': 2,
    'hybrid': 1,
    'office': 0,
  };
  const seekerPref = workStyleMap[seeker.work_style] ?? 1;
  const listingStyle = workStyleMap[listing.work_style] ?? 1;
  const diff = Math.abs(seekerPref - listingStyle);

  if (diff === 0) return 10;
  if (diff === 1) return 6;
  return 3;
}

export function calcMatchScore(seeker: SeekerProfile, listing: ListingProfile): MatchScore {
  const skill = calcSkillScore(seeker.skills, listing.required_skills, listing.preferred_skills);
  const salary = calcSalaryScore(seeker, listing);
  const industry = calcIndustryScore(seeker, listing);
  const urgency = calcUrgencyScore(seeker, listing);
  const culture = calcCultureScore(seeker, listing);
  const total = skill + salary + industry + urgency + culture;

  const rank: 'S' | 'A' | 'B' | 'C' =
    total >= 80 ? 'S' :
    total >= 60 ? 'A' :
    total >= 40 ? 'B' : 'C';

  return { total, skill, salary, industry, urgency, culture, rank };
}

// =====================
// 市場価値スコア（求職者単体）
// =====================

export function calcMarketValueScore(seeker: SeekerProfile): {
  score: number;
  estimatedMin: number;
  estimatedMax: number;
  strengths: string[];
} {
  let score = 40; // ベーススコア
  const strengths: string[] = [];

  // 経験年数
  if (seeker.experience_years >= 10) { score += 20; strengths.push('10年以上の豊富な経験'); }
  else if (seeker.experience_years >= 5) { score += 14; strengths.push('5年以上の実務経験'); }
  else if (seeker.experience_years >= 3) { score += 8; strengths.push('3年以上の実務経験'); }
  else if (seeker.experience_years >= 1) { score += 4; }

  // 需要高スキル
  const highDemandSkills = ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Docker', 'Python', 'TypeScript', 'セキュリティ'];
  const matchedHigh = seeker.skills.filter(s =>
    highDemandSkills.some(h => h.toLowerCase() === s.toLowerCase())
  );
  if (matchedHigh.length >= 3) { score += 15; strengths.push('クラウド・インフラ系スキルが充実'); }
  else if (matchedHigh.length >= 2) { score += 10; strengths.push('需要の高いクラウドスキルあり'); }
  else if (matchedHigh.length >= 1) { score += 5; }

  // 業界経験（不動産×IT）
  if (seeker.industry === '不動産' && seeker.skills.some(s => ['AWS','Python','TypeScript','React'].includes(s))) {
    score += 10;
    strengths.push('不動産×ITの希少なクロス経験');
  }

  // スキル幅
  if (seeker.skills.length >= 8) { score += 5; strengths.push('幅広いスキルセット'); }
  else if (seeker.skills.length >= 5) { score += 3; }

  score = Math.min(100, score);

  // 推定年収
  const base = seeker.current_salary || 400;
  const multiplier = score >= 80 ? 1.4 : score >= 60 ? 1.25 : score >= 40 ? 1.1 : 1.0;
  const estimatedMin = Math.round(base * multiplier / 50) * 50;
  const estimatedMax = Math.round(estimatedMin * 1.25 / 50) * 50;

  return { score, estimatedMin, estimatedMax, strengths };
}

// =====================
// スカウト文自動生成（テンプレートベース）
// ※ 本番はClaude APIで個別生成
// =====================

export function generateScoutMessage(seeker: { name: string; skills: string[] }, company: { name: string }, listing: { title: string }): string {
  const topSkills = seeker.skills.slice(0, 3).join('・');
  return `${seeker.name} 様

突然のご連絡失礼いたします。
AZABU+ キャリアコンサルタントの○○と申します。

${seeker.name}様の${topSkills}のご経験に注目し、ぜひご紹介させていただきたいポジションがございご連絡いたしました。

【ご紹介企業】${company.name}
【ポジション】${listing.title}

${company.name}様は現在、${seeker.name}様のご経験・スキルと非常にマッチした環境を提供できると判断しており、ぜひ一度お話しの機会をいただければと存じます。

まずは15分ほどのカジュアルなオンライン面談にてご説明させていただけますでしょうか。

下記のリンクよりご都合の良いお時間をお選びください。
→ [日程を選ぶ]

どうぞよろしくお願いいたします。
AZABU+ キャリアチーム`;
}

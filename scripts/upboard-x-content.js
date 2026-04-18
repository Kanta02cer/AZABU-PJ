#!/usr/bin/env node
/**
 * UpBoard X（Twitter）コンテンツ自動生成
 * 使い方: node scripts/upboard-x-content.js [count]
 * 例: node scripts/upboard-x-content.js 7   <- 7日分生成
 */

import fs from "fs";
import path from "path";

const PROFILE_URL = 'https://azabuplus.jp/upboard';
const DIAGNOSIS_URL = 'https://azabuplus.jp/upboard/check';

// コンテンツテーマ定義
const MORNING_THEMES = [
  { type: 'success_story', vars: { edu: '高卒', age: 24, company: '東証プライム上場 ITサービス企業', job: 'クラウドエンジニア', salary: '年収480万円', skill: 'AWS・Python' } },
  { type: 'success_story', vars: { edu: '専門卒', age: 22, company: '東証グロース上場 不動産テック', job: 'バックエンドエンジニア', salary: '年収420万円', skill: 'TypeScript・Node.js' } },
  { type: 'success_story', vars: { edu: 'Fラン大卒', age: 26, company: '東証スタンダード上場 SaaS企業', job: 'インフラエンジニア', salary: '年収550万円', skill: 'Docker・Kubernetes' } },
  { type: 'success_story', vars: { edu: '高卒', age: 23, company: '東証プライム上場 Web企業', job: 'フロントエンドエンジニア', salary: '年収400万円', skill: 'React・TypeScript' } },
  { type: 'success_story', vars: { edu: '専門卒', age: 25, company: '東証グロース上場 HR Tech企業', job: 'フルスタックエンジニア', salary: '年収490万円', skill: 'Python・AWS・React' } },
];

const NOON_THEMES = [
  '「学歴より重要なもの」上場企業人事が本音で語った3選',
  '高卒エンジニアが最初に取るべきスキル・資格はこれ',
  '学歴フィルターが存在する会社・しない会社の見分け方',
  '未経験からエンジニアになった人が口を揃えて言うこと',
  '「ポテンシャル採用」と「未経験歓迎」の違いを解説',
  'GitHubだけで上場企業の面接に進んだ人の話',
  '専門卒から年収500万になるまでにやったこと全部',
  '学歴コンプレックスを武器に変えた先輩エンジニアの話',
];

const EVENING_THEMES = [
  '今月内定報告',
  '週間スカウト実績',
  'AI診断呼びかけ',
];

// テンプレート生成関数
function generateMorningPost(theme) {
  const { edu, age, company, job, salary, skill } = theme.vars;
  return `【実話】${edu}->上場企業エンジニア内定

Aさん（${age}歳）のケース：
${skill}の経験を武器に転職活動を開始。
学歴不問の採用ルートで${company}の${job}として内定。
${salary}からのスタート。

UpBoardは学歴フィルターなしで
上場企業に挑戦できる数少ない場所です。

無料AI診断 -> ${DIAGNOSIS_URL}

#高卒転職 #上場企業 #学歴不問 #エンジニア転職 #UpBoard`;
}

function generateNoonPost(topic) {
  return `${topic}

【高卒・専門卒の方へ】
学歴フィルターのない採用ルートで
東証上場企業への挑戦が現実的です。

まずは3分の無料AI診断から
${DIAGNOSIS_URL}

#エンジニア転職 #学歴不問 #上場企業 #UpBoard #転職`;
}

function generateEveningPost(type, idx) {
  const companies = [
    ['東証グロース IT企業', '高卒 24歳'],
    ['東証スタンダード 不動産テック', '専門卒 22歳'],
    ['東証プライム SaaS', '大卒偏差値45 26歳'],
    ['東証グロース Web企業', '高卒 25歳'],
    ['東証スタンダード HR Tech', '専門卒 23歳'],
  ];
  const picks = companies.slice(0, 3 + (idx % 2));

  if (type === '今月内定報告') {
    const entries = picks.map(([co, bg]) => `・${bg} -> ${co}`).join('\n');
    return `今月UpBoardから上場企業に内定した方々

${entries}

共通点はスキルと本気度。
学歴は一切関係なかった。

あなたも挑戦してみませんか？
${DIAGNOSIS_URL}

#内定報告 #学歴不問 #上場企業 #エンジニア転職`;
  }

  return `今週UpBoardに届いたスカウト状況

Sランク（スコア80点以上）: 上場企業から平均2.3社/人

あなたのスコアは何点？
-> 3分で分かる無料AI診断
${DIAGNOSIS_URL}

#UpBoard #転職 #エンジニア #上場企業`;
}

function generateWeeklyContent(days = 7) {
  const posts = [];

  for (let d = 0; d < days; d++) {
    const date = new Date();
    date.setDate(date.getDate() + d);
    const dateStr = date.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' });

    const morning = generateMorningPost(MORNING_THEMES[d % MORNING_THEMES.length]);
    const noon = generateNoonPost(NOON_THEMES[d % NOON_THEMES.length]);
    const evening = generateEveningPost(EVENING_THEMES[d % EVENING_THEMES.length], d);

    posts.push({
      date: dateStr,
      morning: { time: '07:00', content: morning, chars: morning.length },
      noon: { time: '12:00', content: noon, chars: noon.length },
      evening: { time: '20:00', content: evening, chars: evening.length },
    });
  }
  return posts;
}

function saveToMarkdown(posts) {
  const outDir = path.join(process.cwd(), 'scripts', 'x-content');
  fs.mkdirSync(outDir, { recursive: true });

  const date = new Date().toISOString().split('T')[0];
  const filename = `${date}-x-posts.md`;
  const filepath = path.join(outDir, filename);

  let md = `# UpBoard X投稿カレンダー\n生成日: ${new Date().toLocaleString('ja-JP')}\n\n`;
  md += `> **投稿先**: @upboard_jobs  \n`;
  md += `> **LP URL**: ${PROFILE_URL}  \n`;
  md += `> **診断URL**: ${DIAGNOSIS_URL}  \n\n---\n\n`;

  for (const day of posts) {
    md += `## ${day.date}\n\n`;

    for (const slot of [
      { label: '朝7時', data: day.morning },
      { label: '昼12時', data: day.noon },
      { label: '夜20時', data: day.evening },
    ]) {
      md += `### ${slot.label}（${slot.data.chars}文字）\n\n`;
      md += '```\n' + slot.data.content + '\n```\n\n';
    }
    md += '---\n\n';
  }

  // TikTokスクリプト追加
  md += `# TikTok / Instagram Reels スクリプト（週次）\n\n`;
  const tikTokScripts = [
    {
      title: '高卒から上場企業エンジニアになる3ステップ',
      hook: '高卒で上場企業のエンジニアになれるって知ってた？',
      body: `ステップ1: まず無料のAI診断を受ける（3分）\n-> スキルをスコアリングしてもらう\n\nステップ2: Sランク（80点以上）なら即スカウト\n-> 上場企業の非公開求人を紹介される\n\nステップ3: 学歴フィルターなしで面接へ\n-> スキルと熱量だけを見てもらえる`,
      cta: `-> azabuplus.jp/upboard/check で無料診断\n#高卒転職 #上場企業 #エンジニア転職 #学歴不問`,
    },
    {
      title: '学歴フィルターを突破する唯一の方法',
      hook: '学歴フィルターで何度も落とされてる人、これ見て',
      body: `フィルターのある会社を受け続けても消耗するだけ\n\n解決策はシンプル\n-> フィルターのない採用ルートを使う\n\nUpBoardは東証上場企業限定で\n学歴完全不問の採用ルートを持ってる\n\nしかも求職者は完全無料で使える`,
      cta: `-> azabuplus.jp/upboard で詳細確認\n#学歴フィルター #転職 #エンジニア`,
    },
    {
      title: '面接官が高卒候補者に聞くリアルな質問',
      hook: '高卒で上場企業の面接受けた話します',
      body: `実際に聞かれたこと:\n\n「なぜエンジニアを目指したのか」\n「どうやってスキルを身につけたか」\n「入社後どうなりたいか」\n\n学歴について聞かれたのは0回だった\n\nスキルと熱量が全てだった`,
      cta: `-> まず無料AI診断でスコア確認\nazabuplus.jp/upboard/check\n#エンジニア面接 #転職体験談`,
    },
  ];

  for (const script of tikTokScripts) {
    md += `### 「${script.title}」\n\n`;
    md += `**フック（最初の2秒）:**\n> ${script.hook}\n\n`;
    md += `**本文スクリプト:**\n\`\`\`\n${script.body}\n\`\`\`\n\n`;
    md += `**CTA・ハッシュタグ:**\n\`\`\`\n${script.cta}\n\`\`\`\n\n---\n\n`;
  }

  fs.writeFileSync(filepath, md, 'utf-8');
  console.log(`\nXコンテンツカレンダーを保存: ${filepath}`);
  return filepath;
}

function main() {
  const days = parseInt(process.argv[2] || '7', 10);
  console.log(`\n${days}日分のXコンテンツを生成します...\n`);

  const posts = generateWeeklyContent(days);
  const filepath = saveToMarkdown(posts);

  console.log(`\n生成完了:`);
  console.log(`  期間: ${days}日分`);
  console.log(`  投稿数: ${days * 3}件`);
  console.log(`  ファイル: ${filepath}`);
  console.log(`\n次のステップ:`);
  console.log(`  1. 生成されたコンテンツを確認・カスタマイズ`);
  console.log(`  2. Buffer / Hootsuite などのツールで予約投稿`);
  console.log(`  3. n8n でClaude API連携の完全自動投稿フローを構築`);
  console.log(`\nClaude API版の自動生成:`);
  console.log(`  ANTHROPIC_API_KEY=xxx node scripts/upboard-x-content.js 30`);
}

main();

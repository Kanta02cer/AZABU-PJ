#!/usr/bin/env node
/**
 * UpBoard SEO記事 自動生成スクリプト
 * 使い方: node scripts/generate-upboard-seo.js [keyword]
 * 例: node scripts/generate-upboard-seo.js "高卒 上場企業 エンジニア"
 */

// No external deps beyond what's in package.json (use native fetch)
// Claude API key from ANTHROPIC_API_KEY env var

import fs from "fs";
import path from "path";

// ターゲットキーワードリスト（引数なしの場合ランダム選択）
const KEYWORD_LIST = [
  '高卒 上場企業 エンジニア 就職',
  '専門卒 エンジニア 転職 上場企業',
  '学歴不問 上場企業 求人 東京',
  '低学歴 エンジニア 転職 成功',
  '第二新卒 上場企業 未経験 エンジニア',
  '高卒 エンジニア なれる 方法',
  '学歴フィルター 回避 転職 エンジニア',
  '上場企業 ポテンシャル採用 20代 エンジニア',
  'Fラン 上場企業 エンジニア 就職',
  '高卒 プログラミング 上場企業 内定',
  '専門卒 ITエンジニア 転職 東京',
  '大卒以上不要 エンジニア 求人',
  '未経験 エンジニア 上場企業 転職方法',
  '高卒 AWS エンジニア 転職',
  '第二新卒 IT企業 上場 求人 東京',
  '学歴不問 エンジニア エージェント おすすめ',
  '高卒 年収400万 エンジニア なれる',
  '低偏差値 大学 上場企業 エンジニア',
  '高校卒業 エンジニア 転職 体験談',
  '専門学校卒 プログラマー 上場企業',
];

async function generateArticle(keyword) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY が設定されていません');
    process.exit(1);
  }

  const prompt = `あなたはSEOに強い転職メディアの編集者です。
以下のキーワードをメインターゲットにした2,500字程度のSEO記事を書いてください。

【メインキーワード】${keyword}

【記事の設定】
- ターゲット読者: 20〜28歳・高卒/専門卒/低偏差値大卒・東京在住・エンジニア転職を目指している
- サービス名: UpBoard（学歴不問 × 上場企業特化 AI人材紹介）
- サービスURL: https://azabuplus.jp/upboard
- 無料AI診断URL: https://azabuplus.jp/upboard/check
- 有料職業紹介許可: 取得済み

【記事構成（必須）】
1. タイトル（h1）: キーワードを含む、クリックしたくなるタイトル
2. リード文（150字）: 読者の悩みに共感し、記事の価値を伝える
3. 目次（h2 × 5〜6個）
4. 本文各セクション（h2ごとに300〜500字）
   - 実体験形式（架空の体験談Aさん、Bさんを使用）
   - 具体的な数字を含む
   - 読者の不安を解消する構成
5. まとめ（200字）
6. CTA（記事末尾）:
   「→ 今すぐUpBoardの無料AI診断を受ける（3分・完全無料）
   https://azabuplus.jp/upboard/check」

【SEO要件】
- メインキーワードをタイトル・リード・h2に含める
- LSIキーワード（関連語）を自然に含める
- 内部リンク候補を本文中に2〜3箇所示す（[関連記事: ○○]形式）

【注意事項】
- 事実と異なる就職率・年収の保証は避ける
- 「確実に」「絶対に」などの断言は避ける
- 有料職業紹介許可取得済みの記載を含める

Markdownで出力してください。`;

  console.log(`\n記事生成中: "${keyword}"\n`);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API Error: ${response.status} ${err}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

function saveArticle(keyword, content) {
  const outDir = path.join(process.cwd(), 'scripts', 'generated-articles');
  fs.mkdirSync(outDir, { recursive: true });

  const slug = keyword
    .replace(/\s+/g, '-')
    .replace(/[^\w\-ぁ-んァ-ン一-龯]/g, '')
    .toLowerCase()
    .slice(0, 60);

  const date = new Date().toISOString().split('T')[0];
  const filename = `${date}-${slug}.md`;
  const filepath = path.join(outDir, filename);

  const frontmatter = `---
keyword: "${keyword}"
generated: "${new Date().toISOString()}"
target_url: "https://azabuplus.jp/upboard"
status: "draft"
---

`;

  fs.writeFileSync(filepath, frontmatter + content, 'utf-8');
  console.log(`\n記事を保存しました: ${filepath}`);
  return filepath;
}

async function main() {
  const keyword = process.argv[2] || KEYWORD_LIST[Math.floor(Math.random() * KEYWORD_LIST.length)];

  try {
    const content = await generateArticle(keyword);
    const filepath = saveArticle(keyword, content);

    console.log('\n記事情報:');
    console.log(`  キーワード: ${keyword}`);
    console.log(`  文字数: 約${content.length}字`);
    console.log(`  ファイル: ${filepath}`);
    console.log('\n次のステップ:');
    console.log('  1. 生成された記事を確認・編集');
    console.log('  2. WordPress REST API / wp-cli で投稿');
    console.log('  3. 記事末尾のCTAがhttps://azabuplus.jp/upboard/checkにリンクされているか確認');
  } catch (err) {
    console.error('エラー:', err.message);
    process.exit(1);
  }
}

main();

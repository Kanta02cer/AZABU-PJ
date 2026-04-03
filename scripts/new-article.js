#!/usr/bin/env node
/**
 * 新規記事ファイル生成スクリプト
 *
 * 使い方:
 *   node scripts/new-article.js \
 *     --slug "infrastructure-engineer-docker-guide" \
 *     --title "Dockerとは？インフラエンジニアが知るべき基礎知識" \
 *     --excerpt "未経験からインフラエンジニアを目指す方向けに、Dockerの基本概念と実務での使われ方を解説します。" \
 *     --type column \
 *     --category SKILL \
 *     --tags "Docker,コンテナ,インフラ" \
 *     --thumbnail "itinfra_cover.png"
 *
 * 引数:
 *   --slug        ファイル名兼URLスラッグ（英数字・ハイフン）
 *   --title       記事タイトル（日本語OK）
 *   --excerpt     記事概要（140文字程度）
 *   --type        "column" または "news"（デフォルト: column）
 *   --category    カテゴリ例: CAREER / SKILL / SALARY / COMPANY / COLUMN
 *   --tags        カンマ区切りのタグ
 *   --thumbnail   public/images/column/ 内のファイル名（省略時はプレースホルダー）
 */

import { writeFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';

// ─── 引数パース ────────────────────────────────────────────────────
const args = process.argv.slice(2);
const get = (key) => {
  const idx = args.indexOf(`--${key}`);
  return idx !== -1 ? args[idx + 1] : undefined;
};

const slug       = get('slug');
const title      = get('title')      ?? '記事タイトルをここに入力';
const excerpt    = get('excerpt')    ?? '記事の概要をここに入力してください（140文字程度）。';
const type       = get('type')       ?? 'column';
const category   = get('category')  ?? 'COLUMN';
const tagsRaw    = get('tags')       ?? '';
const thumbnail  = get('thumbnail') ?? null;

if (!slug) {
  console.error('❌ --slug が必要です。例: --slug "my-article-slug"');
  process.exit(1);
}

// ─── タグ配列 ─────────────────────────────────────────────────────
const tags = tagsRaw
  ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
  : [];

// ─── 日付（今日） ─────────────────────────────────────────────────
const today = new Date();
const date = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

// ─── サムネイルパス ───────────────────────────────────────────────
const thumbPath = thumbnail
  ? `__BASE_PATH__ + 'images/column/${thumbnail}'`
  : `__BASE_PATH__ + 'images/placeholder-press.svg'`;

// ─── 生成するファイルの内容 ────────────────────────────────────────
const tagsArrayStr = tags.length > 0
  ? `[${tags.map((t) => `'${t}'`).join(', ')}]`
  : `[]`;

const componentName = slug
  .split('-')
  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  .join('');

const content = `export const meta = {
  type: '${type}' as const,
  thumbnail: ${thumbPath},
  category: '${category}',
  date: '${date}',
  title: '${title.replace(/'/g, "\\'")}',
  excerpt:
    '${excerpt.replace(/'/g, "\\'")}',
  tags: ${tagsArrayStr},
};

export default function ${componentName}() {
  return (
    <>

<p>
  ここに記事の導入文を入力してください。検索意図（なぜこのキーワードで検索したか）に答える形で書くと、直帰率が下がりSEO評価も上がります。
</p>

<h2>見出し1：${title.slice(0, 20)}の基本</h2>
<p>
  本文を入力してください。1段落あたり200〜400文字程度が読みやすい目安です。
</p>

<h3>サブセクション1</h3>
<p>
  詳細内容をここに入力してください。
</p>

<h2>見出し2：具体的な方法・ステップ</h2>
<p>
  読者が知りたい「どうすればよいか」を具体的に解説してください。
</p>

<h3>ステップ1：〇〇する</h3>
<p>
  詳細内容をここに入力してください。
</p>

<h3>ステップ2：〇〇する</h3>
<p>
  詳細内容をここに入力してください。
</p>

<h2>見出し3：よくある疑問・Q&A</h2>
<p>
  読者が抱きやすい疑問に答える形で書くと、FAQリッチリザルトの対象になります。
</p>

<h2>まとめ：${title.slice(0, 15)}を活かしてキャリアアップを</h2>
<p>
  記事全体のまとめと、次のアクションへの誘導を書いてください。
</p>

<div style={{"textAlign":"center","marginTop":"3rem","marginBottom":"3rem"}}>
  <a href="https://calendar.app.google/8cVcUkLokHP1w48Y6" target="_blank" style={{"display":"inline-flex","alignItems":"center","justifyContent":"center","background":"linear-gradient(135deg, #FF6B00, #FF8C00)","color":"white","padding":"1.25rem 3rem","borderRadius":"9999px","fontWeight":"bold","textDecoration":"none","boxShadow":"0 4px 14px rgba(255,107,0,0.3)"}}>
    無料キャリア相談・1day就職オーディションはこちら
  </a>
</div>

    </>
  );
}
`;

// ─── ファイル出力 ─────────────────────────────────────────────────
const postsDir = resolve(process.cwd(), 'src/pages/_post');
const filePath = join(postsDir, `${slug}.tsx`);

if (existsSync(filePath)) {
  console.error(`❌ ファイルが既に存在します: ${filePath}`);
  process.exit(1);
}

writeFileSync(filePath, content, 'utf-8');

console.log(`✅ 記事ファイルを作成しました: ${filePath}`);
console.log(`   URL: https://azabuplus.jp/_post/${slug}`);
console.log(`   タイプ: ${type} / カテゴリ: ${category}`);
console.log(`   タグ: ${tags.join(', ') || '(なし)'}`);
console.log('');
console.log('📝 次のステップ:');
console.log('   1. 上記ファイルを開いて本文を編集してください');
console.log('   2. npm run build でビルドするとサイトマップが自動更新されます');

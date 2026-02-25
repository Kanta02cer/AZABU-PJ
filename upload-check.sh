#!/bin/bash

# ValueServerアップロード前チェックスクリプト

echo "🔍 アップロード前チェックを開始します..."
echo ""

# 1. index.htmlの存在確認
if [ ! -f "out/index.html" ]; then
    echo "❌ エラー: out/index.html が見つかりません"
    echo "   先に 'npm run build' を実行してください"
    exit 1
fi
echo "✅ out/index.html が存在します"

# 2. index.htmlが参照しているファイルを確認
echo ""
echo "📄 index.html が参照しているファイル:"
# CSSファイル（ローカルのもののみ、CDNは除外）
CSS_FILE=$(grep -o 'href="[^"]*\.css"' out/index.html | grep -v 'http' | sed 's/href="//;s/"//' | sed 's|^/||' | sed 's|^assets/||' | head -1)
# JSファイル
JS_FILE=$(grep -o 'src="[^"]*\.js"' out/index.html | sed 's/src="//;s/"//' | sed 's|^/||' | sed 's|^assets/||' | head -1)

if [ -n "$CSS_FILE" ]; then
    echo "  CSS: assets/$CSS_FILE"
else
    echo "  ⚠️  ローカルのCSSファイルが見つかりません（CDNのみの可能性）"
fi
if [ -n "$JS_FILE" ]; then
    echo "  JS:  assets/$JS_FILE"
fi

# 3. 参照されているファイルが実際に存在するか確認
echo ""
echo "📦 ファイルの存在確認:"

if [ -n "$CSS_FILE" ]; then
    if [ -f "out/assets/$CSS_FILE" ]; then
        echo "  ✅ CSSファイルが存在: out/assets/$CSS_FILE"
    else
        echo "  ❌ CSSファイルが見つかりません: out/assets/$CSS_FILE"
        exit 1
    fi
fi

if [ -n "$JS_FILE" ]; then
    if [ -f "out/assets/$JS_FILE" ]; then
        echo "  ✅ JSファイルが存在: out/assets/$JS_FILE"
    else
        echo "  ❌ JSファイルが見つかりません: out/assets/$JS_FILE"
        exit 1
    fi
fi

# 4. 必須フォルダの確認
echo ""
echo "📁 必須フォルダの確認:"
REQUIRED_DIRS=("out/assets" "out/images" "out/templates")
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        FILE_COUNT=$(find "$dir" -type f | wc -l | tr -d ' ')
        echo "  ✅ $dir ($FILE_COUNT ファイル)"
    else
        echo "  ❌ $dir が見つかりません"
        exit 1
    fi
done

# 5. アップロード対象ファイルの一覧
echo ""
echo "📋 アップロード対象ファイル数:"
TOTAL_FILES=$(find out -type f ! -name ".DS_Store" | wc -l | tr -d ' ')
TOTAL_SIZE=$(du -sh out | cut -f1)
echo "  合計: $TOTAL_FILES ファイル ($TOTAL_SIZE)"

echo ""
echo "✅ すべてのチェックが完了しました！"
echo ""
echo "📤 次のステップ:"
echo "   1. FileZillaでValueServerに接続"
echo "   2. 左側: $(pwd)/out を開く"
echo "   3. 右側: public_html/AZABU-PJ/ に移動"
echo "   4. out フォルダ内のすべてをアップロード"
echo ""

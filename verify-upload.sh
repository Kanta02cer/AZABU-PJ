#!/bin/bash

# ValueServerアップロード後の確認スクリプト

echo "🔍 アップロード後の確認を開始します..."
echo ""

# ベースURL（必要に応じて変更してください）
BASE_URL="${1:-https://azabuplus.jp/AZABU-PJ}"

echo "📡 確認対象URL: $BASE_URL"
echo ""

# 1. index.htmlの確認
echo "1️⃣  index.html の確認:"
INDEX_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/")
if [ "$INDEX_STATUS" = "200" ]; then
    echo "  ✅ メインページが正常に表示されます (HTTP $INDEX_STATUS)"
else
    echo "  ❌ メインページの取得に失敗しました (HTTP $INDEX_STATUS)"
fi

# 2. CSSファイルの確認
CSS_FILE=$(grep -o 'href="[^"]*\.css"' out/index.html | grep -v 'http' | sed 's/href="//;s/"//' | sed 's|^/||' | head -1)
if [ -n "$CSS_FILE" ]; then
    echo ""
    echo "2️⃣  CSSファイルの確認:"
    CSS_URL="$BASE_URL/$CSS_FILE"
    CSS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$CSS_URL")
    if [ "$CSS_STATUS" = "200" ]; then
        echo "  ✅ CSSファイルが正常に読み込めます: $CSS_FILE (HTTP $CSS_STATUS)"
    else
        echo "  ❌ CSSファイルが見つかりません: $CSS_FILE (HTTP $CSS_STATUS)"
        echo "     URL: $CSS_URL"
    fi
fi

# 3. JSファイルの確認
JS_FILE=$(grep -o 'src="[^"]*\.js"' out/index.html | sed 's/src="//;s/"//' | sed 's|^/||' | head -1)
if [ -n "$JS_FILE" ]; then
    echo ""
    echo "3️⃣  JSファイルの確認:"
    JS_URL="$BASE_URL/$JS_FILE"
    JS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$JS_URL")
    if [ "$JS_STATUS" = "200" ]; then
        echo "  ✅ JSファイルが正常に読み込めます: $JS_FILE (HTTP $JS_STATUS)"
    else
        echo "  ❌ JSファイルが見つかりません: $JS_FILE (HTTP $JS_STATUS)"
        echo "     URL: $JS_URL"
    fi
fi

# 4. 画像フォルダの確認
echo ""
echo "4️⃣  画像フォルダの確認:"
IMAGE_DIRS=("images/Challenge.png" "images/column" "images/interviews" "images/news")
for dir in "${IMAGE_DIRS[@]}"; do
    TEST_URL="$BASE_URL/$dir"
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$TEST_URL")
    if [ "$STATUS" = "200" ] || [ "$STATUS" = "301" ] || [ "$STATUS" = "403" ]; then
        echo "  ✅ $dir が存在します (HTTP $STATUS)"
    else
        echo "  ⚠️  $dir の確認に失敗 (HTTP $STATUS)"
    fi
done

echo ""
echo "✅ 確認が完了しました！"
echo ""
echo "💡 ブラウザで直接確認:"
echo "   $BASE_URL/"
echo ""

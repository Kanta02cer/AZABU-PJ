#!/bin/bash

# ValueServerへの自動アップロードスクリプト（SCP/SFTP使用）

echo "🚀 ValueServerへのアップロードを開始します..."
echo ""

# 設定ファイルがあれば読み込む
if [ -f "upload-config.sh" ]; then
    source upload-config.sh
fi

# 設定（ここをValueServerの情報に合わせて変更してください）
SERVER_HOST="${SERVER_HOST:-}"  # 例: ftp.azabuplus.jp または xxx.valueserver.jp
SERVER_USER="${SERVER_USER:-}"  # FTPユーザー名
REMOTE_PATH="${REMOTE_PATH:-public_html/AZABU-PJ}"  # アップロード先パス
LOCAL_PATH="out"  # ローカルのアップロード元パス
SSH_PORT="${SSH_PORT:-22}"  # SSHポート

# 設定が空の場合は対話形式で入力
if [ -z "$SERVER_HOST" ] || [ -z "$SERVER_USER" ]; then
    echo "📝 ValueServerの接続情報を入力してください:"
    echo ""
    read -p "FTPサーバー名 (例: ftp.azabuplus.jp): " SERVER_HOST
    read -p "FTPユーザー名: " SERVER_USER
    read -p "アップロード先パス [public_html/AZABU-PJ]: " REMOTE_PATH_INPUT
    if [ -n "$REMOTE_PATH_INPUT" ]; then
        REMOTE_PATH="$REMOTE_PATH_INPUT"
    fi
    echo ""
fi

# 接続情報の確認
echo "📋 接続情報:"
echo "  サーバー: $SERVER_USER@$SERVER_HOST"
echo "  アップロード先: $REMOTE_PATH"
echo "  アップロード元: $LOCAL_PATH"
echo ""

# ローカルパスの確認
if [ ! -d "$LOCAL_PATH" ]; then
    echo "❌ エラー: $LOCAL_PATH フォルダが見つかりません"
    echo "   先に 'npm run build' を実行してください"
    exit 1
fi

# アップロード前チェック
echo "🔍 アップロード前チェック..."
if [ ! -f "$LOCAL_PATH/index.html" ]; then
    echo "❌ エラー: $LOCAL_PATH/index.html が見つかりません"
    exit 1
fi
echo "✅ チェック完了"
echo ""

# アップロード方法の選択
echo "アップロード方法を選択してください:"
echo "  1) SCP (推奨・高速)"
echo "  2) SFTP (より安全)"
echo "  3) rsync (差分のみアップロード・高速)"
read -p "選択 [1-3]: " METHOD

case $METHOD in
    1)
        echo ""
        echo "📤 SCPでアップロード中..."
        echo "   (パスワードを求められたら入力してください)"
        echo ""
        scp -P "$SSH_PORT" -r "$LOCAL_PATH"/* "$SERVER_USER@$SERVER_HOST:$REMOTE_PATH/"
        ;;
    2)
        echo ""
        echo "📤 SFTPでアップロード中..."
        echo "   (パスワードを求められたら入力してください)"
        echo ""
        # SFTP用のバッチファイルを作成
        SFTP_SCRIPT=$(mktemp)
        cat > "$SFTP_SCRIPT" << EOF
cd $REMOTE_PATH
put -r $LOCAL_PATH/*
quit
EOF
        sftp -P "$SSH_PORT" -b "$SFTP_SCRIPT" "$SERVER_USER@$SERVER_HOST"
        rm "$SFTP_SCRIPT"
        ;;
    3)
        echo ""
        echo "📤 rsyncでアップロード中..."
        echo "   (パスワードを求められたら入力してください)"
        echo ""
        rsync -avz -e "ssh -p $SSH_PORT" --progress "$LOCAL_PATH/" "$SERVER_USER@$SERVER_HOST:$REMOTE_PATH/"
        ;;
    *)
        echo "❌ 無効な選択です"
        exit 1
        ;;
esac

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ アップロードが完了しました！"
    echo ""
    echo "🌐 確認: https://azabuplus.jp/AZABU-PJ/"
    echo ""
    echo "💡 アップロード後の確認:"
    echo "   ./verify-upload.sh"
else
    echo ""
    echo "❌ アップロードに失敗しました"
    echo ""
    echo "💡 トラブルシューティング:"
    echo "   - SSH/SFTPが有効になっているか確認"
    echo "   - サーバー名・ユーザー名・パスワードが正しいか確認"
    echo "   - ポート番号が正しいか確認（通常22）"
    exit 1
fi

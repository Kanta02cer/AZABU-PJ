#!/bin/bash

# ValueServer接続情報の設定ファイル（テンプレート）
# このファイルをコピーして upload-config.sh を作成し、実際の値を入力してください

# ValueServerのFTP/SSH情報
export SERVER_HOST="ftp.azabuplus.jp"  # または xxx.valueserver.jp
export SERVER_USER="your_username"     # FTPユーザー名
export SERVER_PASSWORD=""               # パスワード（オプション・セキュリティのため空推奨）
export REMOTE_PATH="public_html/AZABU-PJ"  # アップロード先パス
export SSH_PORT="22"                    # SSHポート（通常22）

# 使用方法:
# 1. このファイルをコピー: cp upload-config.sh.example upload-config.sh
# 2. 実際の値を入力
# 3. upload-to-server.sh が自動的にこのファイルを読み込みます

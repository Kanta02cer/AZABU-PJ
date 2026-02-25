# 🚀 コマンドラインでのアップロード手順（FileZilla不要）

## ✅ 前提条件

- ValueServerでSSH/SFTPが有効になっていること
- ターミナル（Mac標準搭載）を使用

---

## 📝 初回セットアップ

### 1. 接続情報を設定

```bash
cd /Users/wantan/AZABU+Project

# 設定ファイルのテンプレートをコピー
cp upload-config.sh.example upload-config.sh

# エディタで開く
nano upload-config.sh
```

### 2. ValueServerの情報を入力

`upload-config.sh` ファイルを編集して、以下を入力：

```bash
export SERVER_HOST="ftp.azabuplus.jp"  # ValueServerのFTPサーバー名
export SERVER_USER="your_username"     # あなたのFTPユーザー名
export REMOTE_PATH="public_html/AZABU-PJ"
export SSH_PORT="22"
```

**ValueServerの情報の確認方法:**
- ValueServerの管理画面（コントロールパネル）にログイン
- 「FTP情報」または「SSH情報」を確認
- サーバー名、ユーザー名、ポート番号を取得

---

## 🚀 アップロード実行

### 方法1: 設定ファイルを使用（推奨）

```bash
./upload-to-server.sh
```

スクリプトが自動的に設定ファイルを読み込み、アップロードを開始します。

### 方法2: 対話形式で入力

設定ファイルを作成していない場合、スクリプトが対話形式で情報を求めます：

```bash
./upload-to-server.sh
```

以下の情報を順番に入力：
1. FTPサーバー名
2. FTPユーザー名
3. アップロード先パス（デフォルト: `public_html/AZABU-PJ`）

---

## 📋 アップロード方法の選択

スクリプト実行時に、以下の3つから選択できます：

### 1. SCP（推奨・高速）
- 最もシンプルで高速
- ファイルを直接コピー

### 2. SFTP（より安全）
- 暗号化された接続
- セキュリティ重視の場合

### 3. rsync（差分のみアップロード・高速）
- 変更されたファイルのみアップロード
- 2回目以降のアップロードが高速
- 進捗表示あり

---

## ✅ アップロード後の確認

```bash
# アップロードが正常に完了したか確認
./verify-upload.sh
```

または、ブラウザで直接確認：
- `https://azabuplus.jp/AZABU-PJ/`

---

## 🔧 トラブルシューティング

### エラー: "Permission denied"

**原因**: SSH/SFTPが有効になっていない、または権限がない

**対処法**:
1. ValueServerの管理画面でSSH/SFTPが有効か確認
2. 必要に応じてValueServerサポートに問い合わせ

### エラー: "Connection refused"

**原因**: ポート番号が間違っている、またはファイアウォールでブロックされている

**対処法**:
1. `upload-config.sh` の `SSH_PORT` を確認（通常は22）
2. ValueServerの管理画面で正しいポート番号を確認

### エラー: "Host key verification failed"

**原因**: 初回接続時のホストキー確認

**対処法**:
```bash
# 初回接続時に "yes" と入力してホストキーを承認
```

### パスワードを毎回入力するのが面倒な場合

SSH鍵認証を設定すると、パスワード入力が不要になります：

```bash
# SSH鍵を生成（まだ持っていない場合）
ssh-keygen -t rsa -b 4096

# 公開鍵をサーバーにコピー
ssh-copy-id -p 22 $SERVER_USER@$SERVER_HOST
```

---

## 💡 便利な使い方

### アップロード前の自動チェック

```bash
# チェック → アップロード → 確認を一括実行
./upload-check.sh && ./upload-to-server.sh && ./verify-upload.sh
```

### 特定のファイルのみアップロード

```bash
# 例: index.htmlのみアップロード
scp -P 22 out/index.html $SERVER_USER@$SERVER_HOST:public_html/AZABU-PJ/
```

### アップロード前のバックアップ

```bash
# サーバー上の既存ファイルをバックアップ（初回のみ）
ssh $SERVER_USER@$SERVER_HOST "tar -czf ~/azabu-backup-$(date +%Y%m%d).tar.gz public_html/AZABU-PJ/"
```

---

## 📚 関連ファイル

- `upload-to-server.sh` - メインのアップロードスクリプト
- `upload-config.sh.example` - 設定ファイルのテンプレート
- `upload-check.sh` - アップロード前チェック
- `verify-upload.sh` - アップロード後確認

# 🚀 ValueServer アップロード手順（簡易版）

## ✅ 準備完了

最新のビルドが完了し、アップロード準備が整いました。

### 📦 アップロード対象
- **合計**: 69ファイル (約14MB)
- **場所**: `/Users/wantan/AZABU+Project/out/` フォルダ内のすべて

---

## 📤 アップロード手順

### 方法1: コマンドラインで自動アップロード（推奨）

#### Step 1: 接続情報を設定（初回のみ）

```bash
cd /Users/wantan/AZABU+Project

# 設定ファイルのテンプレートをコピー
cp upload-config.sh.example upload-config.sh

# エディタで開いて、ValueServerの情報を入力
nano upload-config.sh
# または
open -a TextEdit upload-config.sh
```

`upload-config.sh` に以下を入力：
```bash
export SERVER_HOST="ftp.azabuplus.jp"  # ValueServerのFTPサーバー名
export SERVER_USER="your_username"     # FTPユーザー名
export REMOTE_PATH="public_html/AZABU-PJ"
export SSH_PORT="22"
```

#### Step 2: アップロード実行

```bash
./upload-to-server.sh
```

スクリプトが対話形式で案内します：
1. アップロード方法を選択（SCP/SFTP/rsync）
2. パスワードを入力（求められた場合）
3. 自動的にアップロードが開始されます

---

### 方法2: FileZillaを使用（GUIが好みの場合）

#### Step 1: FileZillaを開く
1. FileZillaを起動
2. 上部の「クイック接続」に以下を入力：
   - **ホスト**: ValueServerから取得したFTPサーバー名
   - **ユーザー名**: FTPユーザー名
   - **パスワード**: FTPパスワード
   - **ポート**: `21`（通常）または `22`（SFTP）
3. 「クイック接続」をクリック

#### Step 2: ファイルをアップロード
1. **左側（ローカル）**: 
   - `/Users/wantan/AZABU+Project/out` フォルダを開く
   
2. **右側（リモート）**: 
   - `public_html/AZABU-PJ/` に移動
   - フォルダがなければ作成

3. **アップロード**:
   - 左側の `out` フォルダ内の**すべてのファイルとフォルダ**を選択
   - ドラッグ&ドロップで右側にアップロード
   - または、右クリック → 「アップロード」

### Step 3: アップロード確認
アップロードが完了したら、以下で確認：

```bash
# ターミナルで実行
cd /Users/wantan/AZABU+Project
./verify-upload.sh
```

または、ブラウザで直接確認：
- `https://azabuplus.jp/AZABU-PJ/`

---

## 🔍 アップロード前のチェック

アップロード前に、以下のコマンドで確認できます：

```bash
cd /Users/wantan/AZABU+Project
./upload-check.sh
```

このスクリプトは以下を確認します：
- ✅ `index.html` の存在
- ✅ 参照されているCSS/JSファイルの存在
- ✅ 必須フォルダ（assets, images, templates）の存在
- ✅ ファイル数の確認

---

## ⚠️ 重要な注意事項

1. **`out` フォルダ自体ではなく、`out` フォルダの中身をアップロード**
   - ❌ 間違い: `public_html/AZABU-PJ/out/...`
   - ✅ 正しい: `public_html/AZABU-PJ/index.html`, `public_html/AZABU-PJ/assets/...`

2. **すべてのファイルとフォルダをアップロード**
   - `index.html`
   - `assets/` フォルダ（中身すべて）
   - `images/` フォルダ（中身すべて）
   - `templates/` フォルダ（中身すべて）

3. **古いファイルは上書きでOK**
   - 同じファイル名の場合は自動的に上書きされます
   - 新しいファイル名（ハッシュが変わったJS/CSS）は追加されます

---

## 🐛 トラブルシューティング

### 404エラーが出る場合

1. **ファイルが正しくアップロードされているか確認**
   ```bash
   ./verify-upload.sh
   ```

2. **ブラウザのキャッシュをクリア**
   - Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)
   - またはシークレットウィンドウで確認

3. **FileZillaでサーバー上のファイルを確認**
   - 右側で `public_html/AZABU-PJ/assets/` を開く
   - `index-Cg1c_qaY.css` と `index-CkcB1Nfq.js` が存在するか確認

### ファイル名が違うエラーが出る場合

古い `index.html` がアップロードされている可能性があります。

1. **最新のビルドを再実行**
   ```bash
   npm run build
   ```

2. **`out/index.html` を再アップロード**

---

## 📋 アップロード対象ファイル一覧

詳細なファイルリストは `upload-file-list.txt` を参照してください。

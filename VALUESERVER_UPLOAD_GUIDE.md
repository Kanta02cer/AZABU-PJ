# ValueServer アップロードガイド

## 📋 事前準備

### 1. ValueServerのFTP情報を確認
ValueServerの管理画面（コントロールパネル）から以下を確認してください：
- **FTPサーバー名**（例：`ftp.azabuplus.jp` または `xxx.valueserver.jp`）
- **FTPユーザー名**
- **FTPパスワード**
- **ポート番号**（通常は21または22）

### 2. アップロード先ディレクトリの確認
- 通常、ValueServerでは **`public_html`** または **`www`** がドキュメントルートです
- `azabuplus.jp` のルートに配置する場合：`public_html/`
- `azabuplus.jp/AZABU-PJ/` に配置する場合：`public_html/AZABU-PJ/`

---

## 🚀 アップロード方法（3つの選択肢）

### 方法1: FTPクライアントソフトを使う（推奨）

#### 使用するソフト
- **FileZilla**（無料・Mac/Windows対応）
- **Cyberduck**（無料・Mac対応）
- **Transmit**（有料・Mac）

#### FileZillaでの手順

1. **FileZillaをダウンロード・インストール**
   - https://filezilla-project.org/ からダウンロード

2. **FTP接続設定**
   - ホスト：ValueServerから取得したFTPサーバー名
   - ユーザー名：FTPユーザー名
   - パスワード：FTPパスワード
   - ポート：21（通常）または22（SFTPの場合）

3. **接続**
   - 「クイック接続」で上記情報を入力して接続

4. **アップロード**
   - **左側（ローカル）**：`/Users/wantan/AZABU+Project/out` フォルダを開く
   - **右側（リモート）**：`public_html/AZABU-PJ/` に移動（なければ作成）
   - `out` フォルダ内の**すべてのファイルとフォルダ**を選択
   - ドラッグ&ドロップでアップロード
   - または、右クリック → 「アップロード」

5. **アップロードする内容**
   ```
   out/
   ├── index.html          → AZABU-PJ/index.html
   ├── assets/             → AZABU-PJ/assets/
   │   ├── index-Cg1c_qaY.css
   │   ├── index-CkcB1Nfq.js
   │   └── （その他のJS/CSSファイル）
   ├── images/             → AZABU-PJ/images/
   └── templates/          → AZABU-PJ/templates/
   ```

---

### 方法2: コマンドライン（SFTP/SCP）を使う

#### 前提条件
- ValueServerでSSH/SFTPが有効になっていること
- ターミナル（Mac標準搭載）

#### 手順

1. **ターミナルでプロジェクトフォルダに移動**
   ```bash
   cd /Users/wantan/AZABU+Project
   ```

2. **SFTPで接続**
   ```bash
   sftp ユーザー名@ftp.azabuplus.jp
   # または
   sftp ユーザー名@xxx.valueserver.jp
   ```
   - パスワードを求められたら入力

3. **リモート側でディレクトリを作成（初回のみ）**
   ```bash
   cd public_html
   mkdir -p AZABU-PJ
   cd AZABU-PJ
   ```

4. **ローカルからリモートへアップロード**
   ```bash
   # SFTPセッション内で
   put -r out/* .
   # または、SFTPを終了してから
   ```
   
   **別の方法（SFTPを終了してから）：**
   ```bash
   # ターミナルで直接実行
   scp -r out/* ユーザー名@ftp.azabuplus.jp:public_html/AZABU-PJ/
   ```

---

### 方法3: ValueServerのファイルマネージャー（WebFTP）を使う

1. **ValueServerの管理画面にログイン**
2. **「ファイルマネージャー」または「WebFTP」を開く**
3. **`public_html/AZABU-PJ/` に移動（なければ作成）**
4. **「アップロード」ボタンをクリック**
5. **ローカルの `out` フォルダ内のファイルを選択してアップロード**
   - 注意：フォルダごとアップロードできない場合があるので、`assets/`、`images/`、`templates/` は個別にアップロードが必要な場合があります

---

## ✅ アップロード後の確認

### 1. ファイルが正しくアップロードされているか確認
ブラウザで以下にアクセスして、ファイル一覧が表示されるか確認：
- `https://azabuplus.jp/AZABU-PJ/assets/`
- `https://azabuplus.jp/AZABU-PJ/images/`

### 2. サイトにアクセス
- `https://azabuplus.jp/AZABU-PJ/` にアクセス
- 開発者ツール（F12）の「Network」タブで、404エラーが出ていないか確認

### 3. パーミッションの確認（必要に応じて）
ValueServerのファイルマネージャーで、以下のパーミッションを設定：
- **ファイル**：644（`rw-r--r--`）
- **フォルダ**：755（`rwxr-xr-x`）

---

## 🔧 トラブルシューティング

### 404エラーが出る場合

1. **ファイル名の不一致を確認**
   - `index.html` 内で参照されているファイル名と、実際にアップロードされたファイル名が一致しているか確認
   - 最新の `out/index.html` がアップロードされているか確認

2. **パスの確認**
   - `index.html` の `<base href="/AZABU-PJ/">` が正しく設定されているか確認
   - サーバー上のディレクトリ構造が正しいか確認

3. **キャッシュのクリア**
   - ブラウザのキャッシュをクリア（Cmd+Shift+R / Ctrl+Shift+R）
   - シークレットウィンドウで確認

### ファイルが見つからない場合

1. **大文字小文字の確認**
   - Linuxサーバーでは大文字小文字を区別します
   - `assets` と `Assets` は別物として扱われます

2. **隠しファイルの確認**
   - `.DS_Store` などの隠しファイルは削除しても問題ありません

---

## 📝 今後の更新手順

1. **ローカルでビルド**
   ```bash
   cd /Users/wantan/AZABU+Project
   npm run build
   ```

2. **`out` フォルダの内容をアップロード**
   - 上記のいずれかの方法で、`out/` 内のファイルを `public_html/AZABU-PJ/` にアップロード

3. **古いファイルは上書きでOK**
   - 同じファイル名の場合は上書き
   - 新しいファイル名（ハッシュが変わったJS/CSS）は追加

---

## 💡 推奨事項

- **初回アップロード後は、必ずサイトにアクセスして動作確認**
- **定期的にバックアップを取る**（ValueServerの管理画面から可能な場合があります）
- **本番環境に反映する前に、ローカルで `npm run dev` で動作確認**

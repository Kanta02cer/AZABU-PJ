# 🚀 ValueServer クイックアップロードチェックリスト

## ✅ アップロード前の確認

### 1. 最新ビルドの確認
```bash
cd /Users/wantan/AZABU+Project
npm run build
```

### 2. アップロードするファイルの確認
以下のフォルダ構成で、`out/` フォルダ内の**すべて**をアップロードしてください：

```
out/
├── index.html                    ← 必須
├── assets/                       ← 必須（フォルダごと）
│   ├── index-Cg1c_qaY.css
│   ├── index-CkcB1Nfq.js
│   └── （その他のJS/CSSファイル）
├── images/                       ← 必須（フォルダごと）
│   ├── Challenge.png
│   ├── column/
│   ├── interviews/
│   └── news/
└── templates/                    ← 必須（フォルダごと）
    └── content-templates.html
```

---

## 📤 アップロード手順（FileZilla使用・推奨）

### Step 1: FileZillaをダウンロード
https://filezilla-project.org/download.php?type=client

### Step 2: FTP接続情報を入力
ValueServerの管理画面から取得した情報を入力：
- **ホスト**: `ftp.azabuplus.jp` または ValueServerから提供されたFTPサーバー名
- **ユーザー名**: FTPユーザー名
- **パスワード**: FTPパスワード
- **ポート**: `21`（通常）または `22`（SFTPの場合）

### Step 3: 接続してアップロード
1. FileZillaで接続
2. **左側（ローカル）**: `/Users/wantan/AZABU+Project/out` を開く
3. **右側（リモート）**: `public_html/AZABU-PJ/` に移動（なければ作成）
4. `out` フォルダ内の**すべてのファイルとフォルダ**を選択
5. ドラッグ&ドロップでアップロード

---

## 🎯 アップロード先のパス

### ValueServerの一般的な構成
```
public_html/
└── AZABU-PJ/          ← ここに out/ の中身をアップロード
    ├── index.html
    ├── assets/
    ├── images/
    └── templates/
```

**重要**: `out` フォルダ自体ではなく、`out` フォルダ**の中身**をアップロードしてください。

---

## ✅ アップロード後の確認

### 1. ファイルの存在確認
ブラウザで以下にアクセスして、ファイルが表示されるか確認：
- ✅ `https://azabuplus.jp/AZABU-PJ/assets/index-Cg1c_qaY.css`
- ✅ `https://azabuplus.jp/AZABU-PJ/assets/index-CkcB1Nfq.js`

### 2. サイトの動作確認
- ✅ `https://azabuplus.jp/AZABU-PJ/` にアクセス
- ✅ 開発者ツール（F12）→ Networkタブで404エラーがないか確認

### 3. キャッシュクリア
- ブラウザのキャッシュをクリア（Cmd+Shift+R / Ctrl+Shift+R）
- またはシークレットウィンドウで確認

---

## ⚠️ よくあるエラーと対処法

### エラー: `404 (Not Found)` が出る

**原因**: ファイルがアップロードされていない、またはパスが間違っている

**対処法**:
1. FileZillaで、サーバー上の `public_html/AZABU-PJ/assets/` にファイルが存在するか確認
2. `index.html` が最新のものか確認（古い `index.html` がアップロードされている可能性）
3. ファイル名が一致しているか確認（特にJSファイルのハッシュ部分）

### エラー: ファイル名が違う（例: `index-BWyPTH9O.js` が見つからない）

**原因**: 古い `index.html` がアップロードされている

**対処法**:
1. ローカルで最新ビルドを実行: `npm run build`
2. `out/index.html` を確認して、参照しているJS/CSSファイル名を確認
3. そのファイル名のファイルが `out/assets/` に存在するか確認
4. すべてを再アップロード

---

## 🔄 今後の更新フロー

1. **コードを変更**
2. **ビルド**: `npm run build`
3. **アップロード**: `out/` の中身を `public_html/AZABU-PJ/` にアップロード
4. **確認**: サイトにアクセスして動作確認

---

## 📞 サポートが必要な場合

ValueServerのサポートに以下を確認：
- FTP接続情報（サーバー名、ユーザー名、パスワード、ポート）
- ドキュメントルートのパス（通常は `public_html`）
- SSH/SFTPが有効かどうか

<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/brand/logo-mark-reverse.svg">
  <source media="(prefers-color-scheme: light)" srcset="./assets/brand/logo-mark.svg">
  <img alt="Video Shot Library logo" src="./assets/brand/logo-mark.svg" width="112" height="112">
</picture>

<h1>Video Shot Library</h1>

[![GitHub stars](https://img.shields.io/github/stars/Hi-Yxzz/Video-Shot-Library)](https://github.com/Hi-Yxzz/Video-Shot-Library/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Hi-Yxzz/Video-Shot-Library)](https://github.com/Hi-Yxzz/Video-Shot-Library/network/members)
[![Gallery](https://img.shields.io/badge/Gallery-live%20previews-d3923c)](https://video-shotcraft-local-2026.yxzzzzz.chatgpt.site/)

**再利用可能な Remotion ショットライブラリと `video-shotcraft` Agent Skill：276 個のショット ID · 174 個の実行可能ショット · 159 本のオンライン動画プレビュー**

[English](README.md) | [中文](README_CN.md) | [日本語](README_JA.md)

</div>

**Video Shot Library** は、このプロジェクトの正式なリポジトリ名および
プロダクト名です。`video-shotcraft` は互換性のために維持される AI Agent Skill 名です。
Claude Code や Codex をモーションデザインスタジオに変え、製品を指定するだけで、
ストーリーボード、アニメーション、
サウンドデザインを行い、[Remotion](https://www.remotion.dev/) を使って映画のようなプロモーション、
マーケティング、ローンチ、デモ動画を制作します。実際のページキャプチャ、2.5D カメラワーク、
ビートに同期したカット、映画品質の SFX も含まれます。

ソース、レシピ、設定、ローカル Remotion Player はオフラインで利用できます。
容量の大きい動画プレビューは Git に含まれないため、完全なモーションプレビューは
[オンライン Gallery](https://video-shotcraft-local-2026.yxzzzzz.chatgpt.site/) で確認できます。

## 🎬 ショーケース

以下の 38 秒間の Gallery 紹介動画も、このスキルで制作されました。
ストーリーボード、ショットの実装、サウンドデザインのすべてを、エージェントが
ツールキットの手法に沿って行っています。

https://github.com/user-attachments/assets/cba2df8a-4b2e-4247-bace-d0b1dea9c2bd

▶️ [YouTube で HD 版を見る](https://youtu.be/gcVvRM_P3SM)

> すべてのショットカードとモーションプレビューをオンラインで閲覧：**[Gallery](https://video-shotcraft-local-2026.yxzzzzz.chatgpt.site/)**
> — 検索、絞り込み、バリエーションの切り替え、選択したショットカード名のコピーが可能です。

## 🚀 クイックスタート

**最も簡単な方法は、リポジトリのリンクをエージェントに渡すことです。**
Claude Code、Codex、または同様のエージェントで、次のように伝えます。

```text
Install this skill for me: https://github.com/Hi-Yxzz/Video-Shot-Library
```

エージェントがリポジトリをクローンし、スキルディレクトリにリンクします。または、
[skills](https://skills.sh/) CLI を使うか、手動でインストールします。

```bash
npx skills add Hi-Yxzz/Video-Shot-Library
```

```bash
git clone https://github.com/Hi-Yxzz/Video-Shot-Library.git
cd Video-Shot-Library
ln -s "$(pwd)" ~/.claude/skills/video-shotcraft   # Claude Code
# or
ln -s "$(pwd)" ~/.codex/skills/video-shotcraft    # Codex
```

インストール後は、次のように依頼できます。

```text
Use video-shotcraft to create a promo for my desktop product.
Use the deck-deal-flyin and row-embed shot cards to present this feature.
Design a product close-up inspired by spotlight-hero-card.
```

ショットカードを指定しない場合、スキルは最初に内蔵の動画テンプレートを
紹介し、それを使うか確認します。作業を始める前に
[Gallery](https://video-shotcraft-local-2026.yxzzzzz.chatgpt.site/) でショットを選ぶこともできます。

## 📼 動画テンプレート：Ink Press

スキルには、検証済みの完全なプロモーションテンプレート **Ink Press** が付属します。
長さ 36.2 秒、1920×1080、30fps、紙・インク・アンバー調の 10 ショットで構成され、2.5D の
実ページカメラワーク、タイトルカード、トランジション、細部まで調整された映画品質の
SFX が含まれます。

https://github.com/user-attachments/assets/4cf5af51-98f3-4af2-8ab2-7267f470513d

▶️ [YouTube で HD 版を見る](https://youtu.be/iShab28B_ak)

使用するには、エージェントに次のように伝えるだけです。

```text
Use video-shotcraft to make a promo for my product with the Ink Press template.
```

エージェントが製品のスクリーンショット、コピー、ブランド要素に差し替えて
同じ品質を再現します。完成した動画を得るための、最も速く確実な方法です。

> 今後、さらに多くのテンプレートが追加される予定です。

### Headless / CI に関する注意事項

ヘッドレスの Linux サーバー（検証環境：2 コア、Node 22）でレンダリングする際、
次の 3 つの問題に遭遇します。いずれもフラグ 1 つで解決できます。

1. **並列数の上限** — 低コアのマシンでは `remotion still/render` が
   "Maximum for --concurrency is 2" というエラーで失敗します。対処:
   `--concurrency=1` を指定します。
2. **旧 Headless モードの廃止** — 最近の Chrome/Chromium は旧 headless モードを
   廃止したため、Remotion にシステムの chromium を指定すると起動に失敗します。
   対処: フル版 Chrome ではなく chrome-headless-shell バイナリを使用します。
3. **CDN への接続遮断** — remotion.media に到達できない環境では、
   headless-shell の自動ダウンロードが失敗します。対処:
   `--browser-executable=<ローカルの chrome-headless-shell のパス>` を指定します。

この 3 つのフラグを設定すれば、同梱テンプレートのレンダリングが動作します。

## 📦 収録内容

| 内容 | 説明 |
| --- | --- |
| 276 個の安定したショット ID | 174 個の実行可能な Remotion ショットと 102 個の参照ショット |
| 159 本のオンライン動画プレビュー | オンライン Gallery で閲覧可能。大容量動画は Git に含まれません |
| 104 種類の video-shotcraft レシピカード | 目的、エネルギー、推奨時間、パラメータ、実装上の注意点、既知の落とし穴 |
| Remotion 実装 | 調整済みの TSX デモとローカル Player |
| 完全な動画テンプレート | 検証済みの 36.2 秒、1920×1080、30fps、10 ショットの製品プロモーション |
| コンポーネントとアセット | 2.5D ページカメラ、キャプション、フラッシュカット、数字ロール、SFX、キャプチャスクリプト |
| 制作手法 | キャプチャ、ビジュアルディレクション、ストーリーボード、サウンドデザイン、ビート同期、最終 QA |

このツールキットは主に Web およびデスクトップ製品のプロモーションを対象としていますが、
各ショットカードは機能デモ、ブランド映像、ローンチ動画、
その他のモーション制作にも利用できます。

## 🗂 リポジトリ構成

```text
Video-Shot-Library/
├── SKILL.md                 # Agent entry point and core production rules
├── references/
│   ├── pipeline.md          # End-to-end production workflow
│   ├── shots/               # 104 shot recipe cards
│   ├── sequences/           # Reusable full-video structures and sequence patterns
│   ├── aesthetic-rules.md   # Visual QA criteria
│   ├── music-beat-sync.md   # BGM analysis and beat-sync methodology
│   └── sound-design.md      # Sound-design guidance and examples
├── demos/                   # Remotion reference implementations for shot cards
├── gallery/                 # Static motion-preview Gallery
├── template/                # Runnable complete video template
└── assets/
    ├── lib/                 # Reusable Remotion components
    ├── scripts/             # Page-asset capture scripts
    └── audio/               # SFX and attribution details
```

完全なワークフローと実装要件については、[SKILL.md](SKILL.md)、
[制作パイプライン](references/pipeline.md)、および
[ビジュアル QA 基準](references/aesthetic-rules.md)を参照してください。

## 🔊 音声とアセットに関する注意事項

`assets/audio/` にある音声ファイルは、それぞれのライセンス条件に従って使用できます。
出典とライセンスの詳細については、[ATTRIBUTION.md](assets/audio/ATTRIBUTION.md)を参照してください。
`pop.mp3`、`typewriter.mp3`、`bgm-tech-house.mp3` は出典が完全には確認されていません。
商用利用前に再確認するか、別の素材へ差し替えてください。

テンプレートに含まれる製品スクリーンショットはデモ用アセットです。公開前に
対象製品のスクリーンショットへ差し替え、製品、顧客、または個人に関するデータを
匿名化する必要があるか確認してください。

## 🙏 謝辞

このリポジトリは、Wei Yihao 氏が作成し Apache 2.0 で公開した
[Vincentwei1021/video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft)
を基盤としています。元の著作権表示とライセンスを維持しながら、Video Shot Library
では統合カタログ、ローカル Player、中国語メタデータ、ショット評価、
Shot Runtime インターフェースを追加しています。

このライブラリの多くのショットレシピは、優れた公式製品動画のモーション表現を
研究してまとめたものです。対象には **ClickUp、Perplexity、Slack、Notion、
Figma、Framer、Bear、Raycast、Pitch、Miro、Superhuman、Loom** のプロモーションが
含まれます。カードには、ゼロから再実装したモーション技法
（タイミング、イージング、振り付け）を記載しています。これらの動画の映像、アートワーク、
ブランドアセットはリポジトリに含まれません。すべての商標は各所有者に帰属し、
各社は本プロジェクトと提携しておらず、また本プロジェクトを推奨していません。

特に以下のプロジェクトとコミュニティに感謝します。

- **[Remotion](https://www.remotion.dev/)** — すべてのデモとテンプレートを支える
  React ベースの動画フレームワークです。Remotion には独自の
  [ライセンス](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)
  がある点に注意してください（個人と小規模チームは無料、企業は有料ライセンスが必要な場合があります）。
- **[Mixkit](https://mixkit.co/)** — 無料の商用ライセンスで収録されている
  SFX と音楽アセットの提供元です。
- 複数のカードに影響を与えた、ゲームフィールとアニメーションのコミュニティが公開する原則
  （Vlambeer のスクリーンシェイクに関する講演、古典的なアニメーションのタイミングなど）。
- **Claude Code** — このライブラリ自体も、スキルが教えるものと同じワークフローを使い、
  AI コーディングエージェントによって構築、反復改善、QA されました。

## ⭐ Star 履歴

[Star History で正式リポジトリを見る](https://www.star-history.com/?repos=Hi-Yxzz%2FVideo-Shot-Library&type=date&legend=top-left)。

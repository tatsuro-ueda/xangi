---
status: latest
dateCreated: 2026-09-22
dateModified: 2026-11-25
checklist_provenance: {"body_sha256": "67ad3a811e7a7232a7e56bf4e46d2eaf04086d265955a5cbc2f5fc0cd4601efc", "fingerprint": "2149ac4d485e0c3fd234fa1f26f905daece987a148f9cf97a52316139c3953d0", "provider": "exe-llm", "source_sha256": {"docs/design.md": "5e565de9a8306e7db2ff655dd5463b7e023f24ef0150815ab76cacf1b5524111"}, "version": 3}
---

# 開発チェックリスト

生成元docsから抽出した確認項目です。対象外の章は理由を付けて扱ってください。

## 生成時の注意

- docs/design.md にサイト共通の物差し（色・本文幅・行間・角丸・余白）の具体値またはトークンを定めた節がありません。この章は作れないので、先に /robin で作成を勧めます。

## A. アーキテクチャ

- [ ] 起動エントリーポイントは設定検証とサービス起動分岐だけを担い、各機能の実体を個別モジュールへ分離している（根拠：docs/design.md:50）
- [ ] Discord・Slackは一時的な起動障害だけを最大60秒の指数バックオフで再試行し、恒久障害では非0終了する（根拠：docs/design.md:54）
- [ ] 終了・再起動要求はSIGTERMへ統一し、子プロセス終了後にextensionとDATA_DIRのlockを解放する（根拠：docs/design.md:56）
- [ ] Discordの投稿先と実行管理キーを分離し、同一チャンネル内の各スレッドを別の実行単位として扱う（根拠：docs/design.md:73）
- [ ] Discordスレッドの設定は親チャンネルから継承し、autoreplyだけスレッド単位の上書きを許可する（根拠：docs/design.md:74）
- [ ] 既存Discordスレッドではstarter messageを取得し、スレッド元の話題としてプロンプトへ注入する（根拠：docs/design.md:75）
- [ ] Slackのbackend変更時は保存値と起動中resolverを同時更新し、同チャンネル配下の既存runnerを破棄する（根拠：docs/design.md:88）
- [ ] 同じSlack実行キーの二重起動とイベント重複配送を、実行ガードとmessage tsの重複排除で防ぐ（根拠：docs/design.md:89）
- [ ] Webのpermalink引用はsessionとmessageの存在を検証し、対象1件だけを未信頼な引用blockとして追加する（根拠：docs/design.md:98）
- [ ] workspaceとupload済みファイルのRange要求へ206で応答し、範囲外の要求には416を返す（根拠：docs/design.md:106）
- [ ] Web Project作成時にdirectory・Git repository・instruction fileを自動作成しない（根拠：docs/design.md:108）
- [ ] Workspaceの登録解除では実ファイルを変更せず、既定値や既存参照が残る場合は解除を拒否する（根拠：docs/design.md:109）
- [ ] 再起動前のProject state検証で非互換状態を検出した場合、再起動を中止しstateファイルも変更しない（根拠：docs/design.md:110）
- [ ] Web backendはsession上書き、Project既定、runtime既定の順で解決し、resetではsession上書きだけを削除する（根拠：docs/design.md:111）
- [ ] Session一覧とProject絞り込みはserver側で行い、通信切断時にもPOST要求を自動再送しない（根拠：docs/design.md:112）
- [ ] Workspace browserはroot外、symlink、非テキスト、1MiB超、hidden・state・依存物・成果物を拒否する（根拠：docs/design.md:115）
- [ ] Workspace保存時は読込時SHA-256との一致を確認し、同一directoryの一時ファイルからatomic renameする（根拠：docs/design.md:115）
- [ ] Web予定実行時にProjectの存在を再検証し、新規Web sessionへ通常のagent runner経路でturnを追加する（根拠：docs/design.md:116）
- [ ] Webフロントエンドは静的assetへbundleし、配布先へNode.js以外のフロントエンド実行依存を加えない（根拠：docs/design.md:118）
- [ ] 更新処理はEd25519・SHA-256・lock・staging・atomic current切替を使い、初回起動失敗時にrollbackする（根拠：docs/design.md:123）
- [ ] guided onboardingはlocal serviceの起動とdoctor成功まではTailscaleの設定や案内へ進まない（根拠：docs/design.md:126）
- [ ] LAN公開では0.0.0.0へbindする前に、認証なしで公開されることを利用者へ明示的に警告する（根拠：docs/design.md:126）
- [ ] secrets.jsonはmode 0600でatomic保存し、保存済み秘密値をbrowser・AI・workspaceへ返さない（根拠：docs/design.md:128）
- [ ] pipe経由のinstall.shではsetupとservice起動を延期し、通常Terminalでのsetup実行を案内する（根拠：docs/design.md:129）
- [ ] 配布bundleにはWeb Chat公式HTML 3ファイルだけをallowlistで含め、node_modulesやsecret候補を除外する（根拠：docs/design.md:130）
- [ ] workspace templateはcommitとarchive SHA-256を固定し、既存ファイルがあるworkspaceを変更しない（根拠：docs/design.md:132）
- [ ] uninstallは既定でconfig・stateを保持し、明示的なpurge指定でもworkspaceを削除対象にしない（根拠：docs/design.md:134）
- [ ] extension registryはDATA_DIR単位かつmode 0600で保存し、別instanceとentryを共有しない（根拠：docs/design.md:139）
- [ ] extension runtime登録前にreadiness JSONのschema・ID・workspace・loopback URLを検証する（根拠：docs/design.md:139）
- [ ] extension一覧は一部項目が不正でも正常項目をHTTP 200で返し、degradedとissuesで部分失敗を通知する（根拠：docs/design.md:140）
- [ ] 公開extension取得はGitHub repositoryのroot URLだけを許し、commit固定tarballを50MB以内で検証する（根拠：docs/design.md:140）
- [ ] extension追加時はarchiveを検証してatomic展開するだけに留め、この時点ではextension codeを実行しない（根拠：docs/design.md:140）
- [ ] extension削除は専用会話で差分承認後に親processの固定toolを呼び、sourceとdataを既定で保持する（根拠：docs/design.md:141）
- [ ] extension更新は親processの固定処理で行い、権限・capability等の重要変更は明示承認前に停止する（根拠：docs/design.md:142）
- [ ] extension更新失敗時は旧directoryとregistryを復元し、更新前に稼働中だった旧版だけを再起動する（根拠：docs/design.md:142）
- [ ] extension更新後のworkspace側スキルやAGENTS.md変更は、実質差分がある場合だけ別の明示承認後に行う（根拠：docs/design.md:142）
- [ ] extensionの推薦段階はread-onlyとし、設定変更・外部送信・自動化・定期実行を別の明示確認へ分離する（根拠：docs/design.md:143）
- [ ] notionSyncEnabledは既定OFFで、run --once以外は無効中にNotion APIへ接続しない（根拠：docs/design.md:148）
- [ ] LINE webhookではraw bodyとX-Line-Signatureを公式のHMAC-SHA256検証処理で照合する（根拠：docs/design.md:155）
- [ ] LINE許可ユーザーが空なら起動を拒否し、allowlist通過後だけ非同期の本処理を開始する（根拠：docs/design.md:158）
- [ ] LINE遅延応答は既定45000msで待機文にreply tokenを消費し、完了後の本回答をPush APIへ切り替える（根拠：docs/design.md:167）
- [ ] LINEのresetは前後空白と大小文字を正規化した完全一致で判定し、既定値をslash形式3種に限定する（根拠：docs/design.md:180）
- [ ] LINE sessionは最終更新から既定4時間以上経過した通常メッセージでarchiveし、新sessionへ切り替える（根拠：docs/design.md:181）
- [ ] Telegram受信媒体は認可後に保存し、サイズ・MIME・既知形式のファイルシグネチャを検証する（根拠：docs/design.md:198）
- [ ] Telegram媒体処理はチャット単位で直列化し、停止後の旧generationで取得済みとなったファイルを破棄する（根拠：docs/design.md:199）
- [ ] タイムアウト延長はリクエスト開始から1時間のmaxTimeoutAtを超える場合にmax_timeout_exceededで拒否する（根拠：docs/design.md:256）
- [ ] backendとeffortの組合せを保存前に一元検証し、非対応値を保存またはrunnerへ適用しない（根拠：docs/design.md:276）
- [ ] runtime contextは各runnerの実workdirとGit root・branchを全backendのrunとrunStream入口で注入する（根拠：docs/design.md:297）
- [ ] モデル一覧取得機能を持たないCLIを、推測や保守対象となる固定モデル一覧で補完しない（根拠：docs/design.md:328）
- [ ] チャットから変更可能なruntime設定は明示された7種類だけを許し、任意のslash commandを実行しない（根拠：docs/design.md:330）
- [ ] CLI resume失敗時の新規sessionによる再試行は1回だけとし、一次失敗時に誤ったエラー通知を出さない（根拠：docs/design.md:346）
- [ ] OpenAI互換streaming経路でも非streaming経路と同じtoolsとtool_choiceをpayloadへ含める（根拠：docs/design.md:387）
- [ ] toolループ後のOpenAI互換最終応答ではtoolChoiceをnoneにし、擬似tool_call文字列の漏出を防ぐ（根拠：docs/design.md:398）
- [ ] OllamaでtoolChoiceがnoneの場合はtools自体をrequest bodyへ送らず、テキスト応答を強制する（根拠：docs/design.md:404）
- [ ] Local LLMのcontext上限は明示値を最優先し、未指定時はNUM_CTXと各budgetから動的計算する（根拠：docs/design.md:430）
- [ ] Local LLMのper-call mode指定時は起動時の個別envを無視し、MODE_DEFAULTSを直接適用する（根拠：docs/design.md:485）
- [ ] Local LLMの常駐tool集合には環境変数の指定内容にかかわらずtool_searchを必ず含める（根拠：docs/design.md:501）
- [ ] 同一tool_callが3回連続した場合は実行を止め、別引数・別tool・通常応答を求めるfeedbackを返す（根拠：docs/design.md:548）
- [ ] 擬似tool_callの救済実行は明示的なread-only allowlistだけを許可し、denylist方式を使わない（根拠：docs/design.md:589）
- [ ] hookはshell:falseと安全な環境変数allowlistで起動し、ユーザー入力をcommandやargvへ展開しない（根拠：docs/design.md:615）
- [ ] hookのtimeoutは既定5秒・最大10秒、各入力最大5万文字・全体2万文字、capture 64KB以内にする（根拠：docs/design.md:617）
- [ ] hookのtimeout・不正出力・spawn失敗・設定破損は対象hookだけをfail-openで飛ばし、本体応答を止めない（根拠：docs/design.md:622）
- [ ] tool trajectoryはsecret類を伏字化し、Discord・LINEのIDをsalt付きSHA-256でhash化する（根拠：docs/design.md:636）
- [ ] スケジュールは前回実行中の再発火を抑止し、一時的なネットワーク障害だけを1回再試行する（根拠：docs/design.md:684）
- [ ] Tool Server接続先の環境変数が無い場合は接続先を推測せず、別instanceへの誤接続を防いで終了する（根拠：docs/design.md:704）
- [ ] 外部triggerは既定無効で、HTTP経由ではBearer tokenが未設定の場合もすべての要求を拒否する（根拠：docs/design.md:736）
- [ ] triggerはsource単位で既定10秒のrate limitと同時実行ガードを適用し、本文を4000文字以内にする（根拠：docs/design.md:739）
- [ ] GitHub AppのInstallation Token生成に失敗しても、長寿命PATへフォールバックせずエラーにする（根拠：docs/design.md:761）
- [ ] 履歴先読み結果は未信頼な引用データ境界へ置き、履歴内の命令文をsystem指示として扱わない（根拠：docs/design.md:808）
- [ ] Codex backend traceにはtool本文を保存せず、tool名・時刻・状態・exit code・出力byte数だけを記録する（根拠：docs/design.md:810）
- [ ] 添付候補はMEDIA等の明示マーカーだけから抽出し、マーカーのない裸のファイルパスを拾わない（根拠：docs/design.md:877）
- [ ] 添付候補はrealpath化後にallowlist root内か確認し、親参照やsymlinkによるsandbox脱出を拒否する（根拠：docs/design.md:883）
- [ ] allowlist外の添付候補は送信せず、絶対pathを含まない一般化した警告を利用者へ表示する（根拠：docs/design.md:884）
- [ ] 構造化添付とテキスト抽出添付は合算後にrealpath基準で重複排除し、二重送信を防ぐ（根拠：docs/design.md:895）
- [ ] DATA_DIR lockは外部接続やscheduler開始前に取得し、30秒heartbeatと60秒stale回収を使う（根拠：docs/design.md:907）
- [ ] Dockerで動的な.env書き戻しを有効にする場合だけ、volume mount先をXANGI_ENV_PATHで明示する（根拠：docs/design.md:933）

## B. 配置・責務分担

- [ ] index.tsは起動シーケンスだけを担当し、各platformやrunnerの機能実装を持ち込まない（根拠：docs/design.md:1001）
- [ ] Discord統合はui・message-utils・message-handler・slash-commands・scheduler-bridgeへ責務分割する（根拠：docs/design.md:1006）
- [ ] 各AI CLI adapterは個別ファイルへ置き、共通process・timeout・JSONL処理をcli-runner-coreへ集約する（根拠：docs/design.md:1020）
- [ ] backend解決・モデル取得・effort検証・models commandをそれぞれ独立した専用モジュールへ配置する（根拠：docs/design.md:1032）
- [ ] extensionのrepository取得とrollback可能なtransactional updateを別モジュールへ分離する（根拠：docs/design.md:1041）
- [ ] workspace閲覧境界、workspace hook、Tool Server、event triggerをそれぞれ専用モジュールへ配置する（根拠：docs/design.md:1044）
- [ ] Local LLMのrunner・client・context・tools・擬似tool_call救済をlocal-llm配下で分離する（根拠：docs/design.md:1074）
- [ ] プラットフォーム固有promptはprompts配下の個別ファイルへ分離し、共通promptと混在させない（根拠：docs/design.md:1084）
- [ ] 新しいチャットplatform追加時は、Platform型とChatPlatform型の双方へ同じ名称を追加する（根拠：docs/design.md:1154）
- [ ] 新しいAI CLI追加時はAgentRunner実装、config追加、index初期化の3箇所を更新する（根拠：docs/design.md:1159）

## C. 開発規約

- [ ] Web ChatサーバーはExpressへ依存せず、Node.js標準のhttp.createServerを使って実装する（根拠：docs/design.md:100）
- [ ] LINEサーバーもWeb Chatと同じくhttp.createServerを使用し、Express依存を追加しない（根拠：docs/design.md:154）
- [ ] ワンショットCLI adapterはCliRunnerBase上に実装し、引数構築とJSONL event解釈だけを個別実装する（根拠：docs/design.md:334）
- [ ] JSONL処理はchunk境界をまたぐ行を組み立て、process終了後に残ったbufferを必ずflushする（根拠：docs/design.md:341）
- [ ] CLI終了エラーの理由はevent本文、stderr、exit codeのみの順で採用し、本来の失敗理由を保持する（根拠：docs/design.md:343）
- [ ] tools注入とmessage変換を共通helperへ集約し、OpenAI・Ollamaのchatとstreamingの4経路で揃える（根拠：docs/design.md:408）
- [ ] Local LLMの明示context上限が未指定なら、計算結果として最低8000文字を確保する式を使う（根拠：docs/design.md:433）
- [ ] tool_search結果は既定8件とし、算出scoreの降順でsessionのactive setへ追加する（根拠：docs/design.md:515）
- [ ] 冪等tool結果cacheはFIFOで最大32件とし、副作用パターンを含むcommandをcache対象から除外する（根拠：docs/design.md:566）
- [ ] 類似tool loopは直近8件中2件以上が正規化trigram Jaccard 0.85以上の場合に検出する（根拠：docs/design.md:567）
- [ ] 古いtool結果の圧縮では直近10件を保持し、200文字未満や圧縮済みの結果を再圧縮しない（根拠：docs/design.md:569）
- [ ] 擬似tool_call救済のshell引数にpipe・連結・展開・redirect等のmetacharacterがあれば即時拒否する（根拠：docs/design.md:595）
- [ ] UserPromptSubmit hookは未展開userTextをstdin JSONで渡し、成功stdoutを未信頼contextとして追加する（根拠：docs/design.md:614）
- [ ] Stop hookがblockを返した場合はsystem feedbackを注入して継続ラウンドを1回だけ行い、再検査しない（根拠：docs/design.md:618）
- [ ] tool trajectoryは1行1eventのJSONLとしてsessionごとのlogs/tool-trajectoryファイルへ追記する（根拠：docs/design.md:630）
- [ ] tool trajectoryの書込み失敗はconsole.warnだけに留め、runnerや利用者への応答処理を止めない（根拠：docs/design.md:638）
- [ ] スケジュールのcron・once・startup時刻は、serverに設定されたTZ環境変数のtimezoneに従う（根拠：docs/design.md:677）
- [ ] trigger receiptはatomic保存し、状態と配信参照を含む直近1000件を再起動後も照会可能にする（根拠：docs/design.md:731）
- [ ] GitHub App秘密鍵は起動時にメモリへ読み込み、AI CLIなどの子processから直接参照不能にする（根拠：docs/design.md:759）
- [ ] session transcriptは1 sessionにつき1つのJSONLへ追記し、その保存directoryをGit管理対象から除外する（根拠：docs/design.md:985）
- [ ] session transcriptの書込み失敗を、本体の会話処理へ例外または失敗状態として伝播させない（根拠：docs/design.md:989）

## D. UX方針

- [ ] Webの主要操作は新規会話、最新100sessionの検索・選択、直近50message、SSE応答に絞る（根拠：docs/design.md:104）
- [ ] 添付upload中はPC・スマートフォンとも、ファイル名・複数選択順・転送率を入力欄直上へ表示する（根拠：docs/design.md:105）
- [ ] 一時的なsession読込エラーだけを正常読込後に消し、より新しい送信やuploadの操作エラーは保持する（根拠：docs/design.md:107）
- [ ] MonitorはSessionを実行中・入力待ち・完了の3列に分類し、内部状態のOpen・Closedを表示しない（根拠：docs/design.md:114）
- [ ] Monitorのstateless extension backendは実行中だけ表示し、応答完了後は待機・完了の両方から除外する（根拠：docs/design.md:114）
- [ ] Monitorの完了Sessionは既定で直近24時間に限定し、古い完了Sessionを常時並べない（根拠：docs/design.md:114）
- [ ] Monitorのエラーと中断は独立列にせず、入力待ちカードの状態ラベルと色付きドットで示す（根拠：docs/design.md:114）
- [ ] 共通navigationはdesktopで左rail、768px以下またはtouch端末の低い横画面で下部表示へ切り替える（根拠：docs/design.md:117）
- [ ] system・light・darkのtheme選択をlocalStorageへ保存し、data-themeとsemantic color tokenで切り替える（根拠：docs/design.md:117）
- [ ] LINEではallowlist通過直後かつRunner起動前にloading animationを開始し、失敗は非致命的に扱う（根拠：docs/design.md:165）
- [ ] LINEのloading秒数は5・10・15・20・25・30・40・50・60秒のいずれかへ丸める（根拠：docs/design.md:165）
- [ ] Telegramの処理中表示はStreamSessionを使い、1秒間隔で既存メッセージを更新する（根拠：docs/design.md:197）
- [ ] Telegramの最終回答が4096文字を超える場合はsplitMessageを使って分割送信する（根拠：docs/design.md:201）
- [ ] 実行中表示のStop・延長・残り時間ボタン行は、利用者が状態を追えるよう1秒粒度で更新する（根拠：docs/design.md:92）
- [ ] 完了後のHistoryは操作した本人だけへ表示し、process再起動後も永続ログとturn参照から復元する（根拠：docs/design.md:90）
- [ ] 返信候補は通常本文から除去し、Discord・Slackでは押した本人だけ、Webでは折りたたみUIで表示する（根拠：docs/design.md:302）
- [ ] allowlist外で添付できないファイルを黙殺せず、絶対pathを伏せた一般化警告で利用者へ知らせる（根拠：docs/design.md:884）

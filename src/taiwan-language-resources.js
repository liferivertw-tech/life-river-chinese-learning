export const taiwanLanguageVarieties=[
 {id:'mandarin-standard',label:'臺灣華語（通用）',language:'zh-TW',region:'全臺',focus:'標準發音、常用詞彙與日常會話',stage:'available'},
 {id:'mandarin-regional',label:'臺灣華語（地區語音差異）',language:'zh-TW',region:'北／中／南／東部',focus:'語音、語調、詞彙差異；需避免把地區差異簡化成刻板標籤',stage:'research'},
 {id:'taiwanese-hokkien',label:'臺灣台語',language:'nan-TW',region:'全臺及各腔口',focus:'臺羅、漢字、文白異讀、生活會話與語音',stage:'research'},
 {id:'hakka-sixian',label:'臺灣客語－四縣腔',language:'hak',region:'苗栗、桃園及各地四縣腔社群',focus:'客語漢字、拼音、聲調與生活會話',stage:'research'},
 {id:'hakka-hailu',label:'臺灣客語－海陸腔',language:'hak',region:'新竹及各地海陸腔社群',focus:'客語漢字、拼音、聲調與生活會話',stage:'research'},
 {id:'hakka-other',label:'臺灣客語－大埔／饒平／詔安等腔',language:'hak',region:'依腔口社群分布',focus:'逐腔口建立發音、詞彙與教材，不混為單一客語口音',stage:'planned'}
];
export const taiwanSpeechSources=[
 {id:'common-voice-zh-tw',name:'Mozilla Common Voice 27.0－Chinese (Taiwan)',variety:'mandarin-standard',type:'朗讀語音／ASR',license:'CC0-1.0',access:'公開下載；不可重新託管或分享整份資料集',commercial:'依 CC0 使用；禁止嘗試識別說話者',status:'usable-with-conditions',url:'https://mozilladatacollective.com/datasets/cmu5wkw5i00c6o107jnm3t51u',evidence:'Mozilla Data Collective dataset card',notes:'適合作為臺灣華語朗讀語音基準；不是完整自然對話或地區口音代表樣本。'},
 {id:'hakka-speech-db',name:'臺灣客語語音資料庫（客委會）',variety:'hakka-sixian',type:'朗讀／會話／ASR／TTS 語音',license:'個別申請授權協議',access:'須提出申請並簽署授權協議；非公開任意下載',commercial:'官方 FAQ 表示可申請商業用途；不得再轉授權、販售或轉讓資料庫，僅限核准用途',status:'application-required',url:'https://speech.hakka.gov.tw/Document/AboutDB',evidence:'客委會語料授權與 FAQ',notes:'四縣、海陸等腔口分別申請；API 第一階段另以非營利／公益用途為申請基準，API 與資料庫授權不可混為一談。'},
 {id:'naer-taiwanese-corpus',name:'臺灣台語語料庫應用檢索系統',variety:'taiwanese-hokkien',type:'詞彙／語法／語音檔／語料句',license:'下載語音與文字需依申請規範核對',access:'可線上查詢；語音與文字內容另有申請程序',commercial:'未確認；未取得個別資料授權前不下載重用',status:'application-required',url:'https://coct.naer.edu.tw/',evidence:'國家教育研究院語料庫與年度資料說明',notes:'包含語料檢索、教科書詞彙、語法點；可作臺語詞彙與用法的學習入口。'},
 {id:'sinica-taiwan-mandarin',name:'中研院台灣華語社會語音語料庫',variety:'mandarin-regional',type:'社會語音／訪談／口語轉寫',license:'依資料庫使用規範及個案授權',access:'研究語料檢索系統；批次取用與再利用權利另核',commercial:'未確認；不可因可檢索而推定可商用或可訓練模型',status:'rights-review-required',url:'https://tmc.ling.sinica.edu.tw/corpus_list_ch/',evidence:'中央研究院中文口語語料庫檢索系統',notes:'收錄北中南東多地口語，含受訪者背景資訊；須特別處理個資與去識別化。'},
 {id:'taiwan-tongues',name:'Taiwan Tongues 語料共享計畫',variety:'taiwanese-hokkien',type:'臺灣華語／台語／客語等語料倡議',license:'各子資料集分別確認',access:'依計畫與資料集發布條件',commercial:'未知；不可把計畫宗旨視為資料授權',status:'discovery-only',url:'https://tt.ima.org.tw/',evidence:'Taiwan Tongues 計畫介紹',notes:'作為後續合作與資料來源探索入口；每筆語料仍需獨立核對授權、錄音者同意及模型使用權。'}
];
export const speechRightsRules=[
 '資料可聽／可查詢，不等於可下載、重製、訓練或商業使用。',
 '錄音者同意、個人資料、聲音個人資料與資料集授權必須分別核對。',
 '模型權重授權不會自動清除訓練語料的權利限制。',
 '地方腔口須由社群與語言專家共同核校，不以地區刻板印象標註個人。'
];

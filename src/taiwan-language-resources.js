export const taiwanLanguageVarieties=[
 {id:'mandarin-standard',label:'臺灣華語（通用）',language:'zh-TW',region:'全臺',focus:'標準發音、注音符號、聲調、常用詞彙與自然會話',stage:'available'},
 {id:'mandarin-regional',label:'臺灣華語（地區語音差異）',language:'zh-TW',region:'北／中／南／東部',focus:'比較語音、語調與詞彙差異；以實際語料和語言研究為依據，不作刻板地域分類',stage:'research'}
];
export const taiwanSpeechSources=[
 {id:'common-voice-zh-tw',name:'Mozilla Common Voice 27.0－Chinese (Taiwan)',variety:'mandarin-standard',type:'朗讀語音／ASR',license:'CC0-1.0',access:'公開下載；不可重新託管或分享整份資料集',commercial:'依 CC0 使用；禁止嘗試識別說話者',status:'usable-with-conditions',url:'https://mozilladatacollective.com/datasets/cmu5wkw5i00c6o107jnm3t51u',evidence:'Mozilla Data Collective dataset card',notes:'適合作為臺灣華語朗讀語音基準；不是完整自然對話或地區口音代表樣本。'},
 {id:'sinica-taiwan-mandarin',name:'中研院台灣華語社會語音語料庫',variety:'mandarin-regional',type:'社會語音／訪談／口語轉寫',license:'依資料庫使用規範及個案授權',access:'研究語料檢索系統；批次取用與再利用權利另核',commercial:'未確認；不可因可檢索而推定可商用或可訓練模型',status:'rights-review-required',url:'https://tmc.ling.sinica.edu.tw/corpus_list_ch/',evidence:'中央研究院中文口語語料庫檢索系統',notes:'收錄北中南東多地口語；批次取用前須核對個資、去識別化及再利用權利。'}
];
export const speechRightsRules=[
 '資料可聽／可查詢，不等於可下載、重製、訓練或商業使用。',
 '錄音者同意、個人資料、聲音個人資料與資料集授權必須分別核對。',
 '模型權重授權不會自動清除訓練語料的權利限制。',
 '地區語音比較須以實際語料和研究為依據，不將個人聲音刻板化。'
];

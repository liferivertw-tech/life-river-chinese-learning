// First-party example display model. Never infer a third-party resource's script support.
export const LEARNING_SCRIPT='zh-Hant-TW';
export const CHINESE_NATIVE_LOCALES=['zh-TW','zh-CN'];

export function exampleDisplayMode(nativeLocale,preference){
  if(['both','traditional','simplified'].includes(preference))return preference;
  return nativeLocale==='zh-TW'?'traditional':'both';
}
export function presentExample(example,{nativeLocale='en',mode}={}){
  if(!example || typeof example.traditional!=='string' || typeof example.simplified!=='string')
    throw new TypeError('Both reviewed traditional and simplified example strings are required');
  const displayMode=exampleDisplayMode(nativeLocale,mode);
  return {
    target:LEARNING_SCRIPT,
    displayMode,
    traditional:displayMode==='simplified'?null:example.traditional,
    simplified:displayMode==='traditional'?null:example.simplified,
    pinyin:example.pinyin??null,
    translation:example.translations?.[nativeLocale]??null,
    translationAvailable:typeof example.translations?.[nativeLocale]==='string',
    differences:example.reviewedDifferences??[]
  };
}

export const examplePreview=[
 {id:'taiwan-mrt',traditional:'請問，捷運站在哪裡？',simplified:'请问，捷运站在哪里？',pinyin:'Qǐngwèn, jiéyùn zhàn zài nǎlǐ?',translations:{en:'Excuse me, where is the MRT station?',vi:'Xin hỏi, ga tàu điện ngầm ở đâu?',id:'Permisi, di mana stasiun MRT?'}},
 {id:'ticket',traditional:'我想買一張車票。',simplified:'我想买一张车票。',pinyin:'Wǒ xiǎng mǎi yì zhāng chēpiào.',translations:{en:'I would like to buy a ticket.'}}
];

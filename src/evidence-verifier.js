const RULES={
 'zh-TW':{scripts:[/[\u4e00-\u9fff]/g],terms:['中文','華語','拼音','漢字','學華語']},
 en:{scripts:[/[A-Za-z]/g],terms:['learn chinese','learn mandarin','mandarin','pinyin','tones']},
 vi:{scripts:[/[A-Za-zÀ-ỹ]/g],terms:['tiếng trung','tiếng hoa','học tiếng trung','phát âm','bài học']},
 id:{scripts:[/[A-Za-zÀ-ÿ]/g],terms:['bahasa mandarin','belajar mandarin','belajar bahasa cina','pelajaran','kosakata']},
 th:{scripts:[/[\u0E00-\u0E7F]/g],terms:['ภาษาจีน','เรียนภาษาจีน','ภาษาจีนกลาง','บทเรียน','พินอิน']},
 fil:{scripts:[/[A-Za-zÀ-ÿ]/g],terms:['mandarin','matuto','aralin','wikang tsino','pag-aaral']},
 ja:{scripts:[/[\u3040-\u30ff]/g],terms:['中国語','中国語を学ぶ','漢字','発音','ピンイン']},
 ko:{scripts:[/[\uac00-\ud7af]/g],terms:['중국어','중국어를 배우','병음','성조','한자']},
 my:{scripts:[/[\u1000-\u109f]/g],terms:['တရုတ်','တရုတ်ဘာသာ','တရုတ်စာ','သင်ခန်းစာ','အသံထွက်']},
 km:{scripts:[/[\u1780-\u17ff]/g],terms:['ភាសាចិន','រៀនភាសាចិន','មេរៀន','សំឡេង','អក្សរចិន']},
 ms:{scripts:[/[A-Za-zÀ-ÿ]/g],terms:['bahasa mandarin','belajar mandarin','bahasa cina','kursus mandarin','sebutan']},
 hi:{scripts:[/[\u0900-\u097f]/g],terms:['चीनी','मंदारिन','चीनी भाषा','सीखें','उच्चारण']},
 fr:{scripts:[/[A-Za-zÀ-ÿ]/g],terms:['apprendre le chinois','mandarin','cours de chinois','prononciation','pinyin']},
 es:{scripts:[/[A-Za-zÀ-ÿ]/g],terms:['aprender chino','mandarín','curso de chino','pronunciación','pinyin']},
 de:{scripts:[/[A-Za-zÀ-ÿ]/g],terms:['chinesisch lernen','mandarin','chinesischkurs','aussprache','pinyin']}
};

function stripMarkup(html=''){
 return html.replace(/<script[\\s\\S]*?<\\/script>/gi,' ')
  .replace(/<style[\\s\\S]*?<\\/style>/gi,' ')
  .replace(/<[^>]+>/g,' ')
  .replace(/&nbsp;/gi,' ')
  .replace(/&amp;/gi,'&')
  .replace(/\\s+/g,' ')
  .trim();
}

export function scoreLanguageEvidence(locale,text=''){
 const rule=RULES[locale];
 if(!rule)return {locale,score:0,verdict:'unknown',matchedTerms:[],scriptHits:0};
 const lower=text.toLocaleLowerCase();
 const matchedTerms=rule.terms.filter(term=>lower.includes(term.toLocaleLowerCase()));
 const scriptHits=rule.scripts.reduce((sum,re)=>sum+(text.match(re)?.length??0),0);
 const termScore=Math.min(70,matchedTerms.length*20);
 const scriptScore=scriptHits>=20?30:scriptHits>=5?20:scriptHits>0?10:0;
 const score=Math.min(100,termScore+scriptScore);
 const verdict=score>=70?'strong':score>=35?'possible':'none';
 return {locale,score,verdict,matchedTerms,scriptHits};
}

export function extractPageText(html=''){
 return stripMarkup(html).slice(0,500000);
}

export async function verifyCandidateUrl(candidate,options={}){
 const url=candidate?.languageEvidenceUrl??candidate?.url;
 if(!url)return {candidateId:candidate?.id??null,state:'error',error:'missing-url'};
 const fetchImpl=options.fetchImpl??fetch;
 try{
  const response=await fetchImpl(url,{headers:{'user-agent':'LIFE-RIVER-Chinese-Learning-Resource-Verifier/1.0'},redirect:'follow'});
  if(!response.ok)return {candidateId:candidate?.id??null,state:'error',error:`http-${response.status}`,url};
  const html=await response.text();
  const evidence=scoreLanguageEvidence(candidate.languageClaimed??candidate.languages?.[0],extractPageText(html));
  return {
   candidateId:candidate?.id??null,
   url,
   state:evidence.verdict==='strong'?'evidence-strong':evidence.verdict==='possible'?'evidence-possible':'evidence-not-found',
   evidence
  };
 }catch(error){
  return {candidateId:candidate?.id??null,state:'error',error:String(error),url};
 }
}

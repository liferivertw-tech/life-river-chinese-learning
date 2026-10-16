export function searchProviderFromEnv(env=process.env){
  if(env.SEARCH_PROVIDER)return env.SEARCH_PROVIDER.toLowerCase();
  if(env.BING_SEARCH_KEY)return 'bing';
  if(env.GOOGLE_CSE_KEY&&env.GOOGLE_CSE_CX)return 'google';
  return 'none';
}

export function buildProviderRequest(provider,query,env=process.env){
  const q=String(query??'').trim();
  if(!q)throw new Error('query-required');
  if(provider==='bing'){
    if(!env.BING_SEARCH_KEY)throw new Error('BING_SEARCH_KEY-required');
    const url=new URL('https://api.bing.microsoft.com/v7.0/search');
    url.searchParams.set('q',q);
    url.searchParams.set('count',String(env.SEARCH_RESULT_COUNT??5));
    url.searchParams.set('textDecorations','false');
    url.searchParams.set('textFormat','Raw');
    return {url:url.toString(),headers:{'Ocp-Apim-Subscription-Key':env.BING_SEARCH_KEY}};
  }
  if(provider==='google'){
    if(!env.GOOGLE_CSE_KEY||!env.GOOGLE_CSE_CX)throw new Error('GOOGLE_CSE_KEY-and-GOOGLE_CSE_CX-required');
    const url=new URL('https://www.googleapis.com/customsearch/v1');
    url.searchParams.set('key',env.GOOGLE_CSE_KEY);
    url.searchParams.set('cx',env.GOOGLE_CSE_CX);
    url.searchParams.set('q',q);
    url.searchParams.set('num',String(Math.min(Number(env.SEARCH_RESULT_COUNT??5),10)));
    return {url:url.toString(),headers:{}};
  }
  throw new Error('unsupported-search-provider');
}

function hostnameProvider(url){
  try{return new URL(url).hostname.replace(/^www\./,'');}catch{return 'unknown';}
}

export function mapProviderResults(provider,payload,task){
  const rows=provider==='bing'?(payload?.webPages?.value??[]):(payload?.items??[]);
  return rows.map((row,index)=>({
    id:`candidate-${task.locale}-${task.nodeId}-${index+1}`,
    title:row.name??row.title??'Untitled resource',
    url:row.url??row.link,
    provider:hostnameProvider(row.url??row.link),
    category:task.categories[0],
    level:task.level??'待核驗',
    languages:[task.locale],
    teachingLanguages:[],
    languageVerified:false,
    languageClaimed:task.locale,
    languageEvidenceUrl:null,
    checkedAt:null,
    format:'Web',
    cost:'待核驗',
    script:'待核驗',
    status:'candidate',
    license:'link-only',
    summary:row.snippet??row.htmlSnippet??'',
    discovery:{
      sourceProvider:provider,
      query:task.queries[0],
      taskId:task.id,
      rank:index+1
    }
  })).filter(row=>row.url);
}

export async function searchWeb(query,options={}){
  const env=options.env??process.env;
  const provider=options.provider??searchProviderFromEnv(env);
  if(provider==='none')return {provider,results:[],skipped:true,reason:'no-search-provider-configured'};
  const request=buildProviderRequest(provider,query,env);
  const response=await fetch(request.url,{headers:request.headers});
  if(!response.ok)throw new Error(`${provider}-http-${response.status}`);
  return {provider,results:await response.json(),skipped:false};
}

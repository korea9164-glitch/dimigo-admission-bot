'use strict';
// Static, zero-API-cost FAQ retrieval. It does NOT send questions to any AI provider.
const $ = (id) => document.getElementById(id);
const state = {config:null,entries:[],busy:false};
const stopWords = new Set(['어떻게','어디','언제','있나요','인가요','해주세요','알려주세요','궁금해요','궁금합니다','관련','대한','무엇','제가','우리','학생','학교','디미고','고등학교','입학','입학전형','안내','질문','좀','해요','하면','되나요','하려면','해줘','주세요','가능한가요','할수있나요','입니다','할까요']);
const synonyms = [
  ['원서','원서접수','지원서','접수'], ['업로드','올리기','첨부','제출'],
  ['증빙서류','제출서류','서류'], ['2차','이차','두번째','2단계','면접','소질적성'],
  ['출결','출석','결석','공결'], ['사진','증명사진','이미지'],
  ['합격','합격자','발표','결과조회'], ['학교번호','전화번호','연락처']
];
function canonical(s){
  let v=String(s||'').normalize('NFKC').toLowerCase().replace(/[\u200b-\u200d\ufeff]/g,'').replace(/[^가-힣a-z0-9]/g,'');
  for(const group of synonyms){ const key=group[0];for(const word of group){const w=word.replace(/[^가-힣a-z0-9]/g,''); if(w && v.includes(w)){v=v.split(w).join(key)}} }
  return v;
}
function terms(s){
  return [...new Set(String(s||'').normalize('NFKC').toLowerCase().split(/[^가-힣a-z0-9]+/).filter(v=>v.length>1&&!stopWords.has(v)).map(canonical).filter(v=>v.length>1))];
}
function retrieve(query){
  const q=canonical(query), tokens=terms(query);
  if(q.length<3) return null;
  const scored=[];
  for(const entry of state.entries){
    if(entry.status!=='published' || !entry.answer || entry.answer.includes('[검증된')) continue;
    const variants=[entry.question,...(entry.variants||[])];
    let score=0;
    const normalizedVariants=variants.map(canonical);
    if(normalizedVariants.includes(q)) score=100;
    else if(normalizedVariants.some(v=>v.length>=5 && (q.includes(v)||v.includes(q)) && Math.min(q.length,v.length)/Math.max(q.length,v.length)>.72))score=78;
    const keyTerms=[...(entry.keywords||[]),...variants.flatMap(terms)].map(canonical);
    const matches=tokens.filter(t=>keyTerms.some(k=>k===t || (t.length>=3&&k.includes(t)) || (k.length>=3&&t.includes(k))));
    const coverage=tokens.length?matches.length/tokens.length:0;
    const keywordHits=(entry.keywords||[]).filter(k=>q.includes(canonical(k))).length;
    score=Math.max(score,coverage*38 + Math.min(keywordHits,3)*9 + (matches.length>=2?15:0));
    if(score>=56 && (matches.length>=2 || score>=78))scored.push({entry,score});
  }
  scored.sort((a,b)=>b.score-a.score);
  // If two unrelated entries are similarly likely, abstain rather than guess.
  if(scored.length>1&&scored[0].score<95&&scored[0].score-scored[1].score<9)return null;
  return scored[0]||null;
}
function safeLink(url){
  try{const u=new URL(url);return (u.protocol==='https:'||u.protocol==='http:')?u.href:null}catch{return null}
}
function message(role,text,source=null,fallback=false){
  const template=$(role==='user'?'userMessage':'botMessage');
  const element=template.content.firstElementChild.cloneNode(true);
  element.querySelector('.bubble').textContent=text;
  if(role==='assistant'){
    if(source){
      const el=element.querySelector('.source');el.append(document.createTextNode('출처: '+(source.sourceTitle||'공식 안내 자료')));
      const href=safeLink(source.sourceUrl);if(href){el.append(' · ');const link=document.createElement('a');link.href=href;link.target='_blank';link.rel='noopener noreferrer';link.textContent='공지 원문 보기';el.append(link)}
    }
    if(fallback){
      const actions=element.querySelector('.actions');const url=safeLink(state.config.kakaoUrl);
      if(url){const a=document.createElement('a');a.className='action-link';a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=state.config.kakaoLabel||'카카오톡 상담 연결';actions.append(a)}
      else{const p=document.createElement('span');p.className='action-disabled';p.textContent='카카오톡 상담 링크 등록 전입니다';actions.append(p)}
    }
  }
  $('chat').append(element);$('chat').scrollTop=$('chat').scrollHeight;
}
function submitQuestion(raw){
  const question=String(raw||'').trim().slice(0,500);if(!question||state.busy)return;
  state.busy=true;$('sendBtn').disabled=true;
  $('emptyState')?.remove();message('user',question);
  const result=retrieve(question);
  if(result){message('assistant',result.entry.answer,result.entry,false)}
  else{message('assistant',state.config.fallbackMessage,null,true)}
  $('question').value='';resize();state.busy=false;$('sendBtn').disabled=false;$('question').focus({preventScroll:true});
}
function resize(){const input=$('question');input.style.height='auto';input.style.height=Math.min(input.scrollHeight,150)+'px'}
async function init(){
  try{
    const [cfg,knowledge]=await Promise.all([
      fetch('/data/config.json',{cache:'no-store'}),fetch('/data/knowledge.json',{cache:'no-store'})
    ]);
    if(!cfg.ok||!knowledge.ok)throw new Error('자료 파일을 읽지 못했습니다.');
    state.config=await cfg.json();const kb=await knowledge.json();state.entries=Array.isArray(kb.entries)?kb.entries:[];
    const suggestions=$('suggestions');for(const question of state.config.suggestedQuestions||[]){
      const button=document.createElement('button');button.type='button';button.className='suggestion';button.textContent=question;
      button.addEventListener('click',()=>submitQuestion(question));suggestions.append(button);
    }
    $('chatForm').addEventListener('submit',(event)=>{event.preventDefault();submitQuestion($('question').value)});
    $('question').addEventListener('input',resize);
    $('question').addEventListener('keydown',(event)=>{if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing){event.preventDefault();submitQuestion($('question').value)}});
    $('resetBtn').addEventListener('click',()=>location.reload());
  }catch(error){
    $('chatForm').addEventListener('submit',e=>e.preventDefault());$('sendBtn').disabled=true;
    const p=document.createElement('p');p.textContent='자료를 불러오지 못했습니다. 관리자에게 문의해 주세요. (파일을 직접 열지 말고 웹 서버에서 실행해야 합니다.)';p.className='load-error';p.style.color='#b33';$('emptyState').append(p);
    console.error('초기화 실패:',error);
  }
}
init();

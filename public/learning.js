export const dayKey=(time=Date.now())=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(time);
export const monthKey=(time=Date.now())=>dayKey(time).slice(0,7);
export const offsetDay=(day,n)=>dayKey(new Date(day+'T12:00:00+09:00').getTime()+n*86400000);
export function night(time=Date.now()){const h=Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Seoul',hour:'2-digit',hourCycle:'h23'}).format(time));return h>=21||h<6;}
const empty=()=>({correct:0,wrong:0,score:0,total:0});
export function dayUsage(day,previous=[]){const d=day||{},sessions=Object.values(d.sessions||{}),daily=d.total?.total||0;const hits=[daily>=500,[d,...previous].length>=3&&[d,...previous].slice(0,3).every(x=>(x?.total?.total||0)>=300),sessions.some(x=>x.count>=200),sessions.length>=7];return{daily,sessions,hits,locked:!!d.locked||hits.filter(Boolean).length>=2,stages:Object.fromEntries(Object.entries(d.stages||{}).map(([n,v])=>[n,v.questions||0]))};}
export function applyAttempt(old,event,previous=[]){
 const d=structuredClone(old||{total:empty(),stages:{},seen:{},sessions:{}});d.total??=empty();d.stages??={};d.seen??={};d.sessions??={};const seen=d.seen[event.qid]||{};
 if(seen.correct||(event.ok?seen.correct:seen.wrong))return d;
 if(dayUsage(d,previous).locked)throw Error('오늘은 충분히 탐험했어요. 내일 다시 만나요!');
 const s=d.stages[event.stage]||{...empty(),questions:0};if(!seen.counted&&s.questions>=100)throw Error('이 단계는 오늘 100문제를 풀었어요. 다른 단계를 골라 주세요.');
 if(!seen.counted){s.questions++;seen.counted=true;}for(const target of[d.total,s]){target.correct+=event.ok?1:0;target.wrong+=event.ok?0:1;target.total++;target.score+=event.points;}
 seen[event.ok?'correct':'wrong']=true;d.seen[event.qid]=seen;d.stages[event.stage]=s;
 const ss=Object.entries(d.sessions).sort((a,b)=>b[1].end-b[1].end),last=ss[0];const key=last&&event.at-last[1].end<1800000?last[0]:'s'+event.at;const session=d.sessions[key]||{start:event.at,end:event.at,count:0,correct:0,wrong:0};session.end=Math.max(session.end,event.at);session.count++;session.correct+=event.ok?1:0;session.wrong+=event.ok?0:1;d.sessions[key]=session;d.updatedAt=Math.max(d.updatedAt||0,event.at);if(dayUsage(d,previous).locked)d.locked=true;return d;
}
export function dayProjection(d){return d?{total:d.total,stages:d.stages,sessions:d.sessions,locked:!!d.locked,updatedAt:d.updatedAt||0}:null;}
export function updateMonthly(old,day,projection){const m=structuredClone(old||{days:{}});m.days??={};if((m.days[day]?.updatedAt||0)>(projection?.updatedAt||0))return m;m.days[day]=projection;const total=empty(),stages={};for(const d of Object.values(m.days)){for(const field of Object.keys(total))total[field]+=Number(d.total?.[field]||0);for(const [n,s]of Object.entries(d.stages||{})){stages[n]??=empty();for(const field of Object.keys(stages[n]))stages[n][field]+=Number(s[field]||0);}}return{...m,total,stages};}

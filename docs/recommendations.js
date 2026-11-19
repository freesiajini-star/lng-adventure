import {ACTIVE_TYPES,TYPE_NAMES} from './math.js?v=ea181ab26c73';
export const RECOMMENDATION_RULES={days:14,minQuestions:10,graduateAccuracy:.8,limit:5,bonusLimit:100};
export function weakTypes(days){
 const totals={};for(const d of days)for(const[key,t]of Object.entries(d?.types||{})){const match=/^s(\d+)t(\d+)$/.exec(key);if(!match)continue;const stage=+match[1],type=+match[2];if(!ACTIVE_TYPES[stage-1]?.includes(type))continue;const a=totals[key]??={key,stage,type,correct:0,wrong:0};a.correct+=Math.max(0,Number(t.correct)||0);a.wrong+=Math.max(0,Number(t.wrong)||0);}
 const eligible=Object.values(totals).map(t=>({...t,total:t.correct+t.wrong,accuracy:t.correct/(t.correct+t.wrong),name:TYPE_NAMES[t.stage-1][t.type]})).filter(t=>t.total>=RECOMMENDATION_RULES.minQuestions&&t.accuracy<RECOMMENDATION_RULES.graduateAccuracy).sort((a,b)=>a.accuracy-b.accuracy||b.wrong-a.wrong||a.stage-b.stage||a.type-b.type);
 return [eligible.filter(t=>t.stage<=10).slice(0,RECOMMENDATION_RULES.limit),eligible.filter(t=>t.stage>=11).slice(0,RECOMMENDATION_RULES.limit)];
}

// A reservation counts toward the cap until its score write is confirmed.
export function reserveBonus(old,event){const ledger=structuredClone(old||{awards:{},used:0});ledger.awards=Object.fromEntries(Object.entries(ledger.awards||{}).filter(([,a])=>a));if(Object.values(ledger.awards).some(a=>a?.qid===event.qid))return undefined;const used=Object.keys(ledger.awards).length;if(used>=RECOMMENDATION_RULES.bonusLimit)return undefined;const slot=Array.from({length:RECOMMENDATION_RULES.bonusLimit},(_,i)=>String(i)).find(i=>!ledger.awards[i]);ledger.awards[slot]={qid:event.qid,day:event.day,points:event.basePoints*2,state:'reserved'};ledger.used=used+1;return ledger;}
export function finishBonus(old,qid,credited){const slot=Object.keys(old?.awards||{}).find(i=>old.awards[i]?.qid===qid);if(slot===undefined||old.awards[slot].state==='credited')return undefined;const ledger=structuredClone(old);ledger.awards=Object.fromEntries(Object.entries(ledger.awards||{}).filter(([,a])=>a));if(credited)ledger.awards[slot].state='credited';else delete ledger.awards[slot];ledger.used=Object.keys(ledger.awards).length;return ledger;}

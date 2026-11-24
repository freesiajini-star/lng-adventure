import {ACTIVE_TYPES} from './math.js?v=f8c3837f1d13';
export const policyKey=(stage,type)=>'s'+stage+'t'+type;
export function scoringScope(policy,classNo){return policy?.classes?.['c'+classNo]?.configured?policy.classes['c'+classNo]:policy?.defaults||{};}
export function selectionCredit(policy,classNo,stage,type,mode){if(mode!=='selected')return true;const scope=scoringScope(policy,classNo),key=policyKey(stage,type);return !!scope.practice?.[key]||!scope.blocked?.[key];}
export function validPolicyKey(key){const m=/^s(\d+)t(\d+)$/.exec(key);return !!m&&ACTIVE_TYPES[Number(m[1])-1]?.includes(Number(m[2]));}
export function cleanPolicyFlags(flags){const result={};for(const[key,value]of Object.entries(flags||{})){if(!validPolicyKey(key)||typeof value!=='boolean')throw Error('점수 설정의 유형을 확인해 주세요.');if(value)result[key]=true;}return result;}
export function preferenceStats(data,students){
 const ids=new Set(students.map(s=>s.id)),totals={};
 for(const records of Object.values(data.histories||{}))for(const[id,day]of Object.entries(records||{})){if(!ids.has(id)||!day)continue;for(const[key,t]of Object.entries(day.types||{})){if(!t||!validPolicyKey(key))continue;const row=totals[key]??={total:0,mixed:0,selected:0,correct:0,wrong:0};for(const field of Object.keys(row))row[field]+=Number(t[field]||0);}}
 const selectedTotal=Object.values(totals).reduce((n,t)=>n+t.selected,0),stages={};for(const[key,t]of Object.entries(totals)){const stage=Number(/^s(\d+)t/.exec(key)[1]);stages[stage]=(stages[stage]||0)+t.selected;}
 for(const[key,t]of Object.entries(totals)){const stage=Number(/^s(\d+)t/.exec(key)[1]);t.share=stages[stage]?t.selected/stages[stage]:0;t.recommended=selectedTotal>=100&&t.selected>=10&&t.share>=2/ACTIVE_TYPES[stage-1].length;}
 return {types:totals,selectedTotal};
}

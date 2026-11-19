// Guarded records use a revision checked atomically by database.rules.json.
// Small legacy paths retain Firebase ETag compare-and-swap.
export const revisionPath=path=>/^(studentDays\/[^/]+\/[^/]+|dailySummaries\/[^/]+\/[^/]+\/[^/]+|monthlyRecords\/[^/]+\/[^/]+|recommendationBonuses\/[^/]+\/[^/]+)$/.test(path);
export function recordPatch(before,after,prefix='',patch={}){if(JSON.stringify(before)===JSON.stringify(after))return patch;if(after&&typeof after==='object'&&before&&typeof before==='object'){for(const key of new Set([...Object.keys(before),...Object.keys(after)]))recordPatch(before[key],after[key],prefix?prefix+'/'+key:key,patch);}else patch[prefix]=after===undefined?null:after;return patch;}
export function createConditionalTransactions({request,onCommit=()=>{},limit=128,load,prepare,restore,persist}){
 const snapshots=new Map(),queues=new Map();
 const remember=(path,value,etag,source={})=>{snapshots.delete(path);if(revisionPath(path)||etag){const snapshot={...source,value:structuredClone(value),etag};snapshots.set(path,snapshot);persist?.(path,snapshot);if(snapshots.size>limit)snapshots.delete(snapshots.keys().next().value);}};
 async function run(path,transform,context){let before=snapshots.get(path),cached=!!before;if(!before&&restore){before=await restore(path);cached=false;}const guarded=revisionPath(path);
  for(let retry=0;retry<8;retry++){
   if(!before){before=load?await load(path,context):await request(path,'GET',undefined,{etag:true});cached=false;}if(prepare)before=await prepare(path,before,context);
   if(!guarded&&!before.etag)throw Object.assign(Error('저장 버전을 확인하지 못했어요. 잠시 뒤 다시 시도해 주세요.'),{status:503});
   let after;try{after=transform(structuredClone(before.value),before);}catch(error){if(cached){before=null;cached=false;continue;}throw error;}
   if(after===undefined){if(cached){before=null;cached=false;continue;}if(guarded&&(before.partial||before.partialBonus)&&await request(path+'/revision','GET')!==before.value.revision){before=null;continue;}remember(path,before.value,before.etag,before);return before.value;}
   if(guarded)after={...after,revision:(before.value?.revision||0)+1};
   let result;try{result=await request(path,guarded?'PATCH':'PUT',guarded?recordPatch(before.value||{},after):after,guarded?{}:{match:before.etag,etag:true});}catch(error){snapshots.delete(path);if(guarded&&(error.status===401||error.status===403)){const fresh=load?await load(path,context):await request(path,'GET',undefined,{etag:true});if((fresh.value?.revision||0)!==(before.value?.revision||0)){before=fresh;cached=false;continue;}}throw error;}
   if(result?.conflict){snapshots.delete(path);before=null;cached=false;continue;}
   remember(path,after,result?.etag,before);onCommit(path,after);return after;
  }
  throw Object.assign(Error('같은 기록을 저장 중이에요. 잠시 뒤 다시 눌러 주세요.'),{status:409});
 }
 return{transaction(path,transform,context){const previous=queues.get(path)||Promise.resolve(),pending=previous.catch(()=>{}).then(()=>run(path,transform,context));queues.set(path,pending);return pending.finally(()=>{if(queues.get(path)===pending)queues.delete(path);});},clear(){snapshots.clear();}};
}

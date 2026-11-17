import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {makeQuestion,grade,publicQuestion,ACTIVE_TYPES,TYPE_NAMES} from '../math.js';
import {TYPE_GROUPS} from '../type-groups.js';
import {columnSteps,columnTasks} from '../column-calculation.js';
import {renderLimit} from '../public/limit-illustrations.js';
test('20 scenes × 6 structures × 20 variants: independent sums and exact-set grading',()=>{
 const forms=Array(6).fill(0),distinct=Array.from({length:20},()=>new Set());let equal=0,baseCount=0;
 for(let n=0;n<20;n++)for(let form=0;form<6;form++)for(let scene=0;scene<20;scene++){
  const seed=n*120+form*20+scene,q=makeQuestion(9,7,seed),v=q.visual,weights=new Map(v.items.map(x=>[x.id,x.weight]));
  assert.equal(v.scene,scene);assert.equal(v.form,form);forms[form]++;assert.ok(v.items.length>=4&&v.items.length<=6);assert.equal(weights.size,v.items.length);assert.ok(v.items.every(x=>x.weight>0&&x.weight%50===0));assert.ok(v.limit>=500&&v.limit<=5000);baseCount+=v.base>0;
  const sum=ids=>v.base+ids.reduce((total,id)=>total+weights.get(id),0),totals=v.candidates.map(sum);assert.deepEqual(totals,v.candidateTotals);
  if([0,1,3,4].includes(form)){
   assert.ok(totals.some(x=>x<=v.limit)&&totals.some(x=>x>v.limit));assert.ok(totals.length>=4&&totals.length<=6);equal+=totals.includes(v.limit);
   const valid=totals.map((x,i)=>x<=v.limit?i:-1).filter(x=>x>=0);
   if(form===0)assert.deepEqual(q.fields.map(f=>f.answer),totals.map(x=>x<=v.limit?'가능':'불가능'));
   if(form===1||form===3){assert.ok(valid.length>=1&&valid.length<=3);assert.deepEqual(q.fields[0].answer,valid.map(i=>q.fields[0].options[i]));if(form===3)assert.ok(v.candidates.every(g=>g.length===3&&g.includes(v.required)));}
   if(form===4){const best=Math.max(...valid.map(i=>totals[i]));assert.equal(totals.filter(x=>x===best).length,1);assert.equal(q.fields[0].answer,q.fields[0].options[totals.indexOf(best)]);}
  }
  if(form===2){assert.equal(v.loaded.length,1);assert.deepEqual(q.fields[0].answer,v.items.filter(x=>!v.loaded.includes(x.id)&&sum(v.loaded)+x.weight<=v.limit).map(x=>x.name));assert.ok(q.fields[0].answer.length<q.fields[0].options.length);}
  if(form===5){const total=sum(v.loaded);assert.ok(total>v.limit);const eligible=v.items.filter(x=>v.loaded.includes(x.id)&&total-x.weight<=v.limit).sort((a,b)=>a.weight-b.weight);assert.equal(q.fields[0].answer,eligible[0].name);assert.equal(new Set(eligible.map(x=>x.weight)).size,eligible.length);}
  const answer=q.fields.map(f=>f.answer);assert.equal(grade(q,answer).ok,true);const bad=structuredClone(answer);if(q.fields[0].kind==='multi'){bad[0]=[];assert.equal(grade(q,bad).ok,false);bad[0]=[...answer[0],answer[0][0]];assert.equal(grade(q,bad).ok,false);assert.equal(grade(q,answer.map(a=>Array.isArray(a)?[...a].reverse():a)).ok,true);}else{bad[0]='잘못된 답';assert.deepEqual(grade(q,bad),{ok:false,wrong:[0]});}
  assert.ok(publicQuestion(q).fields.every(f=>!('answer'in f)));assert.ok(!/NaN|undefined|Infinity/.test(renderLimit(v)));distinct[scene].add(JSON.stringify([v.items,v.limit,v.candidates]));
 }
 assert.ok(forms.every(n=>n===400));assert.ok(equal>0&&baseCount>0);assert.ok(distinct.every(s=>s.size>50));for(let i=0;i<20;i++)assert.ok(existsSync(`public/assets/limit/items-${String(i).padStart(2,'0')}-v1.webp`));for(let i=0;i<5;i++)assert.ok(existsSync(`public/assets/limit/carriers-${i}-v1.webp`));
});
test('column actions require student carry, strike, borrow and result entries',()=>{
 for(const op of ['+','−'])for(let n=0;n<1000;n++){const a=10000+n*7,b=1+n*3,m=columnSteps(a,b,op),tasks=columnTasks(m),answer=Array(m.length).fill('');for(const t of tasks)if(t.kind==='result')answer[t.index]=t.answer;assert.equal(Number(answer.join('')),op==='+'?a+b:a-b);assert.equal(tasks.filter(t=>t.kind==='result').length,m.length-(op==='−'&&String(a-b).length<m.length?1:0));if(op==='−')for(const t of tasks.filter(t=>t.kind==='strike'))assert.ok(tasks.some(x=>x.kind==='note'&&x.index===t.index)||t.index===0&&String(a-b).length<m.length);}
 const source=readFileSync('public/column-work.js','utf8');assert.ok(!/setTimeout|setInterval|data-column="play"|data-column="step"/.test(source));assert.match(source,/practice-unit/);for(const stage of [4,9])for(const type of [0,2,5]){const q=makeQuestion(stage,type,1);assert.equal(q.column.large,stage===4?'L':'kg');assert.equal(q.column.small,stage===4?'mL':'g');}
});
test('all menus group overlapping methods while retaining historical type IDs and sources',()=>{
 assert.equal(TYPE_NAMES.flat().length,113);for(let s=1;s<=17;s++){assert.equal(ACTIVE_TYPES[s-1].length,Object.keys(TYPE_GROUPS[s]).length);for(const [canonical,raw]of Object.entries(TYPE_GROUPS[s])){const qids=new Set();for(let i=1;i<=raw.length;i++){const q=makeQuestion(s,Number(canonical),i);assert.equal(q.type,Number(canonical));assert.ok(q.source);assert.equal(grade(q,q.fields.map(f=>f.answer)).ok,true);qids.add(q.source);}assert.ok(qids.size>=1);}}
});

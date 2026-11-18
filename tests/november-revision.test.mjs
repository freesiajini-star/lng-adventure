import test from 'node:test';import assert from 'node:assert/strict';
import {makeQuestion,publicQuestion,validateQuestion} from '../math.js';
import {makeRelationQuestion,RELATION_OBJECTS,SUBSTITUTION_SCENES,TWO_EQUATION_SCENES} from '../advanced-problems.js';
import {makeScaleQuestion,SCALE_SCENES} from '../scale-problems.js';
import {renderVisual} from '../public/visuals.js';import {GUESS_VESSELS} from '../quality-revisions.js';
import {attendedOn,teacherOverview} from '../public/teacher-overview.js';
import {createAdvancedDeck} from '../public/advanced-deck.js';
import {vesselPhotoLayout,EMPTY_BOTTLE_AXES} from '../public/painted-pour.js';
import {VESSEL_PHOTO_BOUNDS} from '../public/vessel-photo-bounds.js';
import {ART_AXES} from '../public/art-vessel-profiles.js';
test('filled painted vessels align to the reference glass bounds without a clipped rim surface',()=>{
 for(const key of Object.keys(VESSEL_PHOTO_BOUNDS)){const[id,state]=key.split(':');if(state==='empty')continue;const e=VESSEL_PHOTO_BOUNDS[id+':empty'],f=VESSEL_PHOTO_BOUNDS[key],axis=EMPTY_BOTTLE_AXES[id]??ART_AXES[id]??500,p=vesselPhotoLayout(id,state);assert.ok(Math.abs(p.x+f[0]*p.w/1000-(e[0]-axis))<1e-8);assert.ok(Math.abs(p.x+f[2]*p.w/1000-(e[2]-axis))<1e-8);assert.ok(Math.abs(p.y+f[1]*p.h/1000-e[1])<1e-8);assert.ok(Math.abs(p.y+f[3]*p.h/1000-e[3])<1e-8);}
});
test('stage 3 closest estimate varies real capacities and retains a unique independently nearest answer',()=>{
 const contexts=new Set(),vessels=new Set();
 const amount=s=>{const l=String(s).match(/(\d+) L/),ml=String(s).match(/(\d+) mL/);return Number(l?.[1]||0)*1000+Number(ml?.[1]||0);};
 for(let seed=1;seed<=1000;seed++){const q=makeQuestion(3,4,seed),v=q.visual,rows=v.rows.map(([name,n])=>({name,value:amount(n)})),ranked=rows.map(r=>({...r,d:Math.abs(r.value-v.actualValue)})).sort((a,b)=>a.d-b.d);assert.ok(ranked[0].d<ranked[1].d);assert.equal(q.fields[0].answer,ranked[0].name);const spec=GUESS_VESSELS.find(x=>x[0]===v.reference.name);assert.ok(v.actualValue>=spec[2]&&v.actualValue<=spec[3]);contexts.add(q.lines.join(' ')+JSON.stringify(v.rows));vessels.add(v.reference.name);}
 assert.equal(vessels.size,10);assert.ok(contexts.size>500);
});
const amount=s=>Number(s.match(/(\d+)\s*L/)?.[1]||0)*1000+Number(s.match(/(\d+)\s*mL/)?.[1]||0);
const solve=rows=>{const coeff=r=>[r.a,r.op==='='?-1:r.op==='−'?-r.b:r.b,r.total];const [a,b]=rows.map(coeff),det=a[0]*b[1]-b[0]*a[1];assert.notEqual(det,0);return[(a[2]*b[1]-b[2]*a[1])/det,(a[0]*b[2]-b[0]*a[2])/det];};
test('stage 11 references and estimates vary names, matching artwork, capacities and independently solved answers',()=>{
 const seen=new Set(),est=new Set();for(let seed=1;seed<=2000;seed++){
  const q=makeQuestion(11,0,seed),v=q.visual;seen.add(v.reference.name);assert.equal(v.reference.name,v.rows[0][0]);assert.ok(renderVisual(v).includes(v.reference.art));const known=new Map([[v.rows[0][0],Number(v.rows[0][1].replace('컵',''))]]);
  for(const [name,relation]of v.rows.slice(1)){const m=relation.match(/^(.+)보다 (\d+)컵 (많음|적음)$/);assert.ok(m);known.set(name,known.get(m[1])+Number(m[2])*(m[3]==='많음'?1:-1));}
  const numbers=v.rows.slice(1).map(([name])=>String(known.get(name))),winner=[...known].sort((a,b)=>b[1]-a[1])[0][0];assert.deepEqual(q.fields.map(f=>f.answer),[winner]);
  for(const type of[2,3,4]){const e=makeQuestion(11,type,seed),ev=e.visual;if(!ev?.reference)continue;est.add(ev.reference.name);const range=GUESS_VESSELS.find(x=>x[0]===ev.reference.name);assert.ok(ev.actualValue>=range[2]&&ev.actualValue<=range[3]);const guesses=ev.rows.map(([name,value])=>({name,value:amount(value)}));assert.ok(guesses.every(g=>g.value>=range[2]&&g.value<=range[3]));assert.equal(new Set(guesses.map(g=>Math.abs(g.value-ev.actualValue))).size,guesses.length);assert.ok(renderVisual(ev).includes(ev.reference.art));}
 }assert.equal(seen.size,7);assert.equal(est.size,10);
});
test('all 30 substitution situations and 24 two-equation situations have integral unique realistic answers and exact picture counts',()=>{
 for(const two of[false,true])for(let index=0;index<(two?TWO_EQUATION_SCENES:SUBSTITUTION_SCENES).length;index++)for(let seed=1;seed<=120;seed++){
  const q=makeRelationQuestion({stage:16,type:two?2:6},seed,index),v=q.visual,audit=q.facts[0].audit;validateQuestion(q);const structure=audit.structure;let x,y;
  if(['difference','pairs'].includes(structure)){const sum=v.rows[0].total,diff=Number(q.lines[1].match(/보다 (\d+) g/)[1]),heavyA=q.lines[1].startsWith(v.labels[0]+'의');x=(sum+(heavyA?diff:-diff))/2;y=sum-x;}
  else if(structure==='extend'){x=v.rows[0].total/v.rows[0].a;y=x;}
  else [x,y]=solve(v.rows);
  for(const [i,n]of[x,y].entries()){assert.ok(Number.isInteger(n)&&n>0);const spec=RELATION_OBJECTS[audit.keys[i]];assert.ok(n>=spec[2]&&n<=spec[3],audit.title+': '+n);}
  const expected=structure==='pairs'?[2*x,2*y]:structure==='extend'?[x*(audit.count+audit.extra)]:structure==='known'?[x]:['package','capsule'].includes(structure)?[y]:[x,y];assert.deepEqual(q.fields.map(f=>Number(f.answer)),expected,audit.title);
  const html=renderVisual(v),count=v.rows.reduce((n,row)=>n+Math.max(0,row.a)+(row.op==='='?1:Math.max(0,row.b)),0);assert.equal((html.match(/<(?:img|image) /g)||[]).length,count,audit.title);assert.ok(!JSON.stringify(publicQuestion(q)).includes('weights'));assert.equal(q.column,undefined);
 }
});
test('30 scaling contexts always scale a larger target and preserve units, shortages, change and package comparisons',()=>{
 for(let index=0;index<SCALE_SCENES.length;index++)for(let seed=1;seed<=120;seed++){
  const q=makeScaleQuestion({stage:15,type:4},seed,index),a=q.facts[0].audit;validateQuestion(q);assert.equal(a.targetScale,a.baseScale*a.k);assert.ok(Number.isInteger(a.k)&&a.k>=2&&a.k<=10);assert.equal(Number(q.fields[0].answer),a.k);let expected=a.baseAmount*a.k;
  if(a.mode==='shortage')expected-=a.available;if(a.mode==='remain')expected=a.available-expected;if(a.mode==='change')expected=a.available-expected;if(a.mode==='twoPrices')expected=a.price1*a.k+a.price2*a.k2;if(a.mode==='comparePrice')expected=a.baseAmount*a.k-a.largePrice*a.k/3;if(a.mode==='juicePrices')expected=a.baseAmount*a.k+a.otherPrice*a.targetScale/a.otherBase;if(index===23)expected/=1000;
  assert.equal(a.answer,expected);const fields=q.fields.slice(1).filter(f=>f.kind==='number');const actual=fields.length===2&&['L','kg'].includes(fields[0].unit)?Number(fields[0].answer)*1000+Number(fields[1].answer):Number(fields.at(-1).answer);assert.equal(actual,expected);assert.ok(expected>0);assert.ok(!JSON.stringify(publicQuestion(q)).includes('baseAmount'));
 }
});
test('advanced deck avoids repeated contexts and consecutive identical equation structures',()=>{
 const deck=createAdvancedDeck(()=>.43);for(const [stage,type,count,divisor]of[[15,4,30,3],[16,2,24,4],[16,6,30,3]]){const indexes=[];for(let i=0;i<count*3;i++){const seed=deck.seed(stage,type,100000+i),index=Math.floor(seed/divisor)%count;assert.notEqual(index,indexes.at(-1));if(stage===16&&type===2&&indexes.length)assert.notEqual(index%3,indexes.at(-1)%3);indexes.push(index);}assert.equal(new Set(indexes.slice(0,count)).size,count);}
});
test('all balance objects of the same kind retain one size across different counts',()=>{
 for(const stage of[6,10,16])for(let type=0;type<7;type++)for(let seed=1;seed<=30;seed++){let q;try{q=makeQuestion(stage,type,seed);}catch{continue;}if(q.visual?.kind!=='balances')continue;const sizes=new Map();for(const m of renderVisual(q.visual).matchAll(/data-object="([^"]+)" data-object-size="([^"]+)"/g)){sizes.set(m[1],sizes.get(m[1])||new Set());sizes.get(m[1]).add(m[2]);}assert.ok([...sizes.values()].every(s=>s.size===1));}
});
test('calibrated tank and measuring vessel levels remain linear with every tick',()=>{
 for(const stage of[1,3,5])for(let seed=1;seed<=100;seed++){const q=makeQuestion(stage,stage===1?1:stage===3?5:0,seed),html=renderVisual(q.visual);for(const m of html.matchAll(/data-value="([\d.]+)" data-level="([\d.]+)" data-bottom="([\d.]+)" data-height="([\d.]+)" data-max="([\d.]+)"/g)){const [,value,level,bottom,height,max]=m.map(Number);assert.ok(Math.abs((bottom-level)/height-value/max)<1e-10);}}
});
test('teacher daily activity includes offline visitors and sparse stage records',()=>{
 const date='2026-11-15';assert.equal(attendedOn({visits:{[date]:1},visible:false},date,null),true);assert.equal(attendedOn({at:new Date(date+'T08:00:00+09:00').getTime(),visible:false},date,null),true);assert.equal(attendedOn({},date,{stages:[null],sessions:{s:{start:1,end:2}}}),true);assert.equal(attendedOn({},date,null),false);
 const students=[{id:'c1s01',class_no:1,student_no:1,visible:false,visits:{[date]:1}}],daily={c1s01:{stages:[null,{correct:1,total:1,score:1,questions:1}],sessions:{}}},data={daily,monthly:[],histories:{[date]:daily},points:{}};
 const html=teacherOverview({data,students,date,month:'2026-11',stages:['단계'],label:s=>s.id,status:()=>'',risk:()=>0,sessionsFor:()=>[]});assert.ok(html.includes('data-detail="c1s01"'));
});
import {selectionCredit,preferenceStats} from '../public/scoring-policy.js';
import {applyAttempt} from '../public/learning.js';
test('class scoring overrides and recommendations do not silently change teacher decisions',()=>{
 const policy={defaults:{configured:true,blocked:{s1t0:true}},classes:{c2:{configured:true,practice:{s1t0:true}}}};
 assert.equal(selectionCredit(policy,1,1,0,'selected'),false);assert.equal(selectionCredit(policy,1,1,0,'mixed'),true);assert.equal(selectionCredit(policy,2,1,0,'selected'),true);
 const data={histories:{'2026-11-15':{a:{types:{s1t0:{total:80,selected:80,correct:80},s1t1:{total:20,selected:20,wrong:20}}}}}};const stats=preferenceStats(data,[{id:'a'}]);assert.equal(stats.types.s1t0.recommended,true);assert.equal(stats.types.s1t1.recommended,false);assert.equal(policy.defaults.blocked.s1t1,undefined);
 const corrected={qid:'zero',stage:1,type:0,selectionMode:'selected',ok:true,correction:true,points:0,penalty:0,at:100,firstWrongAt:90};const day=applyAttempt(null,corrected);assert.equal(day.total.score,0);assert.equal(day.total.wrong,1);assert.equal(day.types.s1t0.total,1);
});

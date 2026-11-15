import {test} from 'node:test';import assert from 'node:assert/strict';
import {makeQuestion,grade,TYPE_NAMES,ACTIVE_TYPES} from '../math.js';import {columnSteps} from '../column-calculation.js';import {LIFE_SCENES} from '../life-problems.js';import {renderVisual} from '../public/visuals.js';
test('merged menus preserve old IDs and show two equalizing / four weight families',()=>{
 assert.deepEqual(ACTIVE_TYPES[4],[0,3]);assert.deepEqual(ACTIVE_TYPES[5],[0,4,6,5]);assert.equal(TYPE_NAMES[3][6],'그림표와 액체의 들이');
 for(let stage of [5,6])for(let type=0;type<TYPE_NAMES[stage-1].length;type++){const q=makeQuestion(stage,type,31);assert.equal(q.type,type);assert.equal(q.stage,stage);}
});
test('reference estimates combine full, half, third and mixed receivers',()=>{
 const patterns=new Set();for(let seed=0;seed<1000;seed++){const q=makeQuestion(3,0,seed),v=q.visual;assert.equal(v.kind,'referenceEstimate');assert.ok(v.fills.every(f=>[1,.5,1/3].includes(f)));assert.equal(Number(q.fields[0].answer),Math.round(v.fills.reduce((n,f)=>n+f*1000,0)));patterns.add(v.fills.join(','));assert.ok(!/NaN|undefined/.test(renderVisual(v)));}assert.ok(patterns.size>=8);
});
test('equalizing two families conserve water and infer original amounts',()=>{
 for(let seed=0;seed<1000;seed++){
  const q=makeQuestion(5,0,seed),v=q.visual,[a,b]=v.values,moved=Number(q.fields[0].answer);assert.equal(Math.abs(a-b),2*moved);assert.equal(Math.max(a,b)-moved,Math.min(a,b)+moved);assert.ok(v.max>=Math.max(a,b));
  const inverse=makeQuestion(5,3,seed),before=inverse.fields.map(f=>Number(f.answer)),equal=inverse.visual.values[0],move=Number(inverse.lines[0].match(/물 (\d+) mL/)[1]);assert.equal(before[0]-move,equal);assert.equal(before[1]+move,equal);assert.equal(before[0]+before[1],2*equal);
 }
});
test('four weight families derive answers from rendered pan counts and masses',()=>{
 const variety=new Set();for(let seed=0;seed<1000;seed++)for(const t of ACTIVE_TYPES[5]){
  const q=makeQuestion(6,t,seed),items=q.visual.items,unit=new Map();for(const b of items){const l=b.leftMass/b.leftCount,r=b.rightMass/b.rightCount;if(unit.has(b.left))assert.equal(unit.get(b.left),l);if(unit.has(b.right))assert.equal(unit.get(b.right),r);unit.set(b.left,l);unit.set(b.right,r);}
  const fields=q.fields;if(t===0){const b=items[0],heavy=q.lines.join('').includes('무거운'),answer=b.leftMass>b.rightMass?(heavy?b.left:b.right):(heavy?b.right:b.left);assert.equal(fields[0].answer,answer);}
  if(t===4){assert.equal(fields[0].answer,[...fields[0].options].sort((a,b)=>unit.get(b)-unit.get(a))[0]);assert.ok(items.every(b=>b.leftMass===b.rightMass));}
  if(t===6){const match=q.lines[0].match(/([가-힣]+) 한 개는 ([가-힣]+) 한 개/);assert.equal(Number(fields[0].answer),unit.get(match[1])/unit.get(match[2]));}
  if(t===5){const order=[...unit].sort((a,b)=>a[1]-b[1]);assert.equal(fields[0].answer,order[0][0]);assert.equal(fields[1].answer,order.at(-1)[0]);}
  variety.add(JSON.stringify([t,items]));assert.equal(grade(q,fields.map(f=>f.answer)).ok,true);
 }assert.ok(variety.size>1000);
});
test('20 life contexts each have 100 valid table-based variants and unique answers',()=>{
 assert.equal(LIFE_SCENES.length,20);for(let scene=0;scene<20;scene++){
  const variants=new Set();for(let n=0;n<100;n++){const seed=n*20+scene,q=makeQuestion(4,6,seed),v=q.visual;assert.equal(v.scene,scene);assert.equal(v.rows.length,4);assert.equal(new Set(v.rows.map(x=>x.label)).size,4);const a=v.rows.find(x=>x.label===v.selected[0]),b=v.rows.find(x=>x.label===v.selected[1]),pa=a.value*v.quantities[0],pb=b.value*v.quantities[1];assert.equal(v.total,pa+pb);assert.ok(v.total>=100&&v.total<=5000,'total '+scene+':'+v.total);const target=v.initial===null?v.total:v.initial-v.total;assert.ok(target>0);const f=q.fields;
   if(scene===19){assert.equal(Number(f[0].answer),pa);assert.equal(Number(f[1].answer),pb);}
   const last=f.slice(scene===19?2:0);const actual=last.length===2?Number(last[0].answer)*1000+Number(last[1].answer):Number(last[0].answer);assert.equal(actual,target);if(last.length===2)assert.ok(Number(last[1].answer)<1000);
   if(scene===8)assert.equal(v.quantities[1],1);
   if(scene===7){const capacity=Number(q.lines[0].match(/들이 (\d+) mL/)[1]);assert.ok(capacity>=target);}
   if(scene===0)assert.match(q.lines[0],/오늘 정한/);if(scene===16)assert.match(q.lines[0],/공간을 남기고/);if(scene===18)assert.match(q.lines[0],/처음/);
   const drawing=renderVisual(v);for(const row of v.rows){assert.ok(drawing.includes(row.label));assert.ok(drawing.includes(row.value+' mL'));}assert.ok(!/NaN|undefined|Infinity/.test(drawing));variants.add(JSON.stringify([v.rows,v.quantities]));assert.equal(grade(q,f.map(x=>x.answer)).ok,true);
  }assert.ok(variants.size>=10,'not diverse '+scene);
 }
});
test('column steps carry and borrow across zeros in correct place order',()=>{
 for(const[a,b,op]of[[4700,3600,'+'],[4800,3100,'+'],[10200,3600,'−'],[10000,1,'−'],[2000,1999,'−'],[13200,2800,'−']]){const m=columnSteps(a,b,op);assert.equal(m.result,op==='+'?a+b:a-b);assert.equal(Number(m.steps.at(-1).result.join('')),m.result);assert.ok(m.steps.every(s=>s.notes.every(n=>n===null||n>=0&&n<=19)));}
 const chain=columnSteps(10000,1,'−');assert.equal(chain.steps.filter(s=>s.message.includes('10으로')).length,4);assert.ok(chain.steps.some(s=>s.notes.includes(9)));assert.ok(chain.steps.at(-1).changed.every(Boolean));
 for(let n=0;n<1000;n++){const a=2000+n*7,b=1000+n*3;assert.equal(columnSteps(a,b,'+').result,a+b);assert.equal(columnSteps(a,b,'−').result,a-b);}
});

import test from 'node:test';import assert from 'node:assert/strict';
import {makeCargoQuestion,CARGO_SCENES} from '../cargo-problems.js';
import {makeQuestion} from '../math.js';
import {renderVisual} from '../public/visuals.js';
test('20 cargo contexts × 5 structures × 100 variants have feasible, maximal/minimal independent answers',()=>{
 const seen=Array.from({length:20},()=>new Set()),forms=Array(5).fill(0);
 for(let seed=0;seed<10000;seed++){const q=makeCargoQuestion({stage:14,type:4},seed),v=q.visual,answer=+q.fields[0].answer;seen[v.scene].add(q.lines.join(' '));forms[v.form]++;assert.equal(v.allocations.length,v.form===0?answer:v.form===4?v.bins:1);assert.ok(v.allocations.every(a=>a.weight<=v.capacity&&a.weight>=0&&Number.isInteger(a.a)&&Number.isInteger(a.b)));
  if(v.form===0){assert.equal(v.allocations.reduce((n,a)=>n+a.a,0),v.count);if(v.first){assert.equal(v.allocations.reduce((n,a)=>n+a.b,0),v.first);assert.equal(answer,Math.ceil((v.count*v.one+v.first*v.two)/v.capacity));}else assert.equal(answer,Math.ceil(v.count/Math.floor(v.capacity/v.one)));}
  if(v.form===1){assert.equal(answer,Math.floor((v.capacity-v.loaded)/v.one));assert.ok(v.loaded+(answer+1)*v.one>v.capacity);}
  if(v.form===2){assert.equal(answer,v.capacity-v.loads.reduce((n,a)=>n+a,0));assert.equal(q.fields[0].unit,'kg');assert.equal(v.loads[0]%v.one,0);assert.equal(v.loads[1]%v.two,0);}
  if(v.form===3){assert.equal(answer,Math.floor((v.capacity-v.first*v.one)/v.two));assert.ok(v.first*v.one+(answer+1)*v.two>v.capacity);}
  if(v.form===4){assert.equal(answer,v.bins*Math.floor((v.capacity-v.first*v.one)/v.two));assert.equal(v.allocations.reduce((n,a)=>n+a.b,0),answer);assert.ok(v.allocations.every(a=>a.weight+v.two>v.capacity));}
  assert.ok(renderVisual(v).includes('cargo-visual'));assert.ok(!q.lines.join(' ').includes(' 달걀'));assert.ok(q.explanation.includes(String(answer)));
 }assert.deepEqual(forms,[2000,2000,2000,2000,2000]);assert.ok(seen.every(s=>s.size>=20));assert.equal(CARGO_SCENES.length,20);
});
test('an indivisible 35 kg item in a 200 kg cart needs separate per-cart floor division',()=>{
 const per=Math.floor(200/35);assert.equal(per,5);assert.equal(Math.ceil(11/per),3);assert.equal(Math.ceil(11*35/200),2); // The total-only shortcut is invalid.
});
test('old stage/type identifiers remain, eggs are replaced by weight-based minimum transport',()=>{
 for(let seed=1;seed<=40;seed++){const q=makeQuestion(14,6,seed);assert.equal(q.visual.kind,'cargoSituation');assert.equal(q.visual.form,0);assert.ok(!q.lines.join(' ').includes('달걀'));}
 for(let seed=1;seed<=100;seed++)assert.equal(makeQuestion(14,4,seed).type,4);
});

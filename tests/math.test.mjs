import {test} from 'node:test';import assert from 'node:assert/strict';
import {makeQuestion,publicQuestion,grade,STAGES,TYPE_NAMES} from '../math.js';
test('17 stages × all types × 1000 seeds: integer answers, invariant checks, public answers hidden',()=>{
 let count=0;for(let stage=1;stage<=17;stage++)for(let type=0;type<TYPE_NAMES[stage-1].length;type++)for(let seed=0;seed<1000;seed++){
  const q=makeQuestion(stage,type,seed);assert.equal(q.stage,stage);assert.equal(q.type,type);assert.ok(q.lines.every(s=>s.length>0&&!/[水克数字]/.test(s)));assert.ok(q.fields.length>0);assert.equal(grade(q,q.fields.map(f=>f.answer)).ok,true);assert.equal(grade(q,q.fields.map(()=>'' )).ok,false);assert.ok(publicQuestion(q).fields.every(f=>!('answer'in f)));assert.equal('facts'in publicQuestion(q),false);count++;
 }assert.equal(count,TYPE_NAMES.flat().length*1000);assert.equal(STAGES.length,17);
});
test('container capacity and linear scale positions are within mathematical bounds',()=>{for(const stage of [1,3,5,8])for(let type=0;type<TYPE_NAMES[stage-1].length;type++)for(let seed=0;seed<100;seed++){const q=makeQuestion(stage,type,seed),v=q.visual;if(v?.kind==='vessels')for(const amount of v.values){assert.ok(amount>=0&&amount<=v.max);const fraction=amount/v.max;assert.ok(fraction>=0&&fraction<=1);}if(v?.kind==='dial'){assert.equal(v.value%v.step,0);assert.ok(v.max/v.step<=100);}}});
test('indivisible loads use packing counts rather than only total weight',()=>{for(let seed=0;seed<1000;seed++){const q=makeQuestion(14,1,seed),numbers=q.lines[0].match(/\d+/g).map(Number),[weight,count]=numbers,answer=Number(q.fields[0].answer),perTruck=Math.floor(1000/weight);assert.ok(answer*perTruck>=count);assert.ok((answer-1)*perTruck<count);}});
test('sum-and-difference, balances and rate examples have independent reference results',()=>{
 assert.equal(makeQuestion(16,4,1).fields[0].answer,'2100');assert.deepEqual(makeQuestion(17,0,1).fields.map(x=>x.answer),['400','5']);assert.deepEqual(makeQuestion(17,2,1).fields.map(x=>x.answer),['750','15']);
 for(let seed=0;seed<100;seed++){const q=makeQuestion(13,0,seed),[low,high]=q.fields.slice(-2).map(f=>Number(f.answer)),total=q.facts.find(f=>f.label==='두 양의 합').right,diff=q.facts.find(f=>f.label==='두 양의 차').right;assert.equal(low,(total-diff)/2);assert.equal(high,(total+diff)/2);}
});

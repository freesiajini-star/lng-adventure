import {test} from 'node:test';
import assert from 'node:assert/strict';
import {makeQuestion,TYPE_NAMES,grade,publicQuestion} from '../math.js';
import {renderVisual} from '../public/visuals.js';

test('source picture groups remain illustrated, including newly restored families',()=>{
 const cases=[[1,0,'bottleOverflow'],[1,1,'sourceVessels'],[1,2,'bottleCups'],[1,4,'cupTable'],[3,0,'kettleEstimate'],[5,3,'zoomTanks'],[6,0,'balances'],[6,6,'balances'],[8,0,'objectCards'],[8,6,'pairedDials'],[9,6,'pairedDials'],[9,7,'objectCards'],[4,6,'objectCards'],[11,0,'cupTable'],[11,2,'labeledBottle'],[15,4,'recipe'],[15,5,'cacao'],[6,4,'balances'],[6,5,'balances'],[16,1,'balances']];
 assert.equal(cases.length,20);
 for(const[s,t,kind]of cases){const q=makeQuestion(s,t,37);assert.equal(q.visual.kind,kind,`${s}/${t}`);assert.match(renderVisual(q.visual),/<svg/);assert.ok(q.source);}
 assert.equal(TYPE_NAMES.flat().length,113);
});
test('inverse filling counts and identical receiver heights determine independent orders',()=>{
 const cups=makeQuestion(1,4),counts=cups.visual.counts;
 const ascending=[...counts.keys()].sort((a,b)=>counts[b]-counts[a]);
 assert.equal(cups.fields[0].answer,cups.visual.labels[ascending.at(-1)]);
 assert.equal(cups.fields[1].answer,cups.visual.labels[ascending[1]]);
 assert.equal(Number(makeQuestion(1,5).fields[0].answer),counts[0]/counts[1]);
 for(let seed=0;seed<100;seed++){const q=makeQuestion(1,3,seed);const actual=q.visual.values.map((value,i)=>({value,label:q.visual.labels[i]})).sort((a,b)=>b.value-a.value).map(x=>x.label);assert.deepEqual(q.fields.map(f=>f.answer),actual);}
 assert.deepEqual(makeQuestion(11,0).fields.map(f=>f.answer),['다','가','나']);
});
test('dial, transfer, scale-pan counts and capacities satisfy independent numeric references',()=>{
 const transfer=makeQuestion(5,3),[a,b]=transfer.visual.values,moved=Number(transfer.fields[2].answer);assert.equal(a-moved,b+moved);assert.equal(a+b,2200);assert.equal(moved,600);
 for(const[s,t]of[[8,6],[9,6]])for(const v of makeQuestion(s,t).visual.items){assert.ok(v.value<=v.max);assert.equal(v.value%v.step,0);assert.ok(renderVisual({kind:'illustratedDial',...v}).includes('확대'));}
 const sum=makeQuestion(9,6);assert.equal(sum.visual.items.reduce((n,v)=>n+v.value,0),Number(sum.fields[0].answer)*1000+Number(sum.fields[1].answer));
 const stones=makeQuestion(6,6).visual.items;assert.equal(stones[0].rightCount/stones[1].rightCount,Number(makeQuestion(6,6).fields[0].answer));
 const paper=makeQuestion(6,3);assert.equal(paper.visual.items[0].rightCount-paper.visual.items[1].rightCount,Number(paper.fields[0].answer));
});
test('all valid 2 kg combinations are accepted; all fields still form one outcome',()=>{
 const q=makeQuestion(9,7),weights=[1200,250,1050,450],sets=[[0,1,2],[0,1,3],[0,2,3],[1,2,3]];
 const expected=sets.map(ids=>ids.reduce((sum,i)=>sum+weights[i],0)<=2000?'가능':'불가능');
 assert.deepEqual(q.fields.map(f=>f.answer),expected);assert.equal(expected.filter(x=>x==='가능').length,2);
 assert.equal(grade(q,expected).ok,true);const bad=[...expected];bad[2]='가능';assert.deepEqual(grade(q,bad),{ok:false,wrong:[2]});
 assert.ok(publicQuestion(q).fields.every(f=>!('answer'in f)));
});
test('recipe, cacao, clean-water table, half box and connected balance keep original arithmetic',()=>{
 assert.deepEqual(makeQuestion(15,4).fields.map(f=>Number(f.answer)),[10/2,2*(10/2),200*2*(10/2),200*2*(10/2)/1000]);
 assert.deepEqual(makeQuestion(15,5).fields.map(f=>Number(f.answer)),[500*30,500*30/1000]);
 assert.deepEqual(makeQuestion(4,6).fields.map(f=>Number(f.answer)),[50*(50/10),150*(30/10),50*5+150*3]);
 const box=makeQuestion(12,6);assert.equal(box.visual.totals[0]-box.visual.totals[1],4900);assert.equal(5700-4900,Number(box.fields.at(-1).answer));
 const balance=makeQuestion(16,1).visual.items;assert.equal(balance[0].rightMass/8,balance[1].leftMass/4);assert.equal(balance[0].leftMass/7,200);assert.equal(balance[1].rightMass*2,1400);
});

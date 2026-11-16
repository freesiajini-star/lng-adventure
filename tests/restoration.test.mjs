import {test} from 'node:test';
import assert from 'node:assert/strict';
import {makeQuestion,TYPE_NAMES,grade,publicQuestion} from '../math.js';
import {renderVisual} from '../public/visuals.js';

test('source picture groups remain illustrated, including newly restored families',()=>{
 const cases=[[1,0,'pourCompare'],[1,1,'sourceVessels'],[1,2,'bottleCups'],[1,4,'fillTable'],[3,0,'referenceEstimate'],[5,3,'equalizeTanks'],[6,0,'balances'],[6,6,'balances'],[8,0,'objectCards'],[8,6,'pairedDials'],[9,6,'pairedDials'],[9,7,'limitPacking'],[4,6,'lifeTable'],[11,0,'guessDistance'],[11,2,'labeledBottle'],[15,4,'recipe'],[15,5,'cacao'],[6,4,'balances'],[6,5,'balances'],[16,1,'balances']];
 assert.equal(cases.length,20);
 for(const[s,t,kind]of cases){const q=makeQuestion(s,t,37);assert.equal(q.visual.kind,kind,`${s}/${t}`);assert.match(renderVisual(q.visual),kind==='limitPacking'?/limit-item-art/:kind==='guessDistance'?/<img/:/<svg/);assert.ok(q.source);}
 assert.equal(TYPE_NAMES.flat().length,113);
});
test('stage 11 excludes duplicated tank filling while retaining cup-count comparison',()=>{
 for(let seed=1;seed<=200;seed++){
  const q=makeQuestion(11,0,seed),values=q.fields.map(f=>f.answer);
  assert.ok(!q.lines.join(' ').includes('어항'));
  assert.ok(!['cupTable','fillTable'].includes(q.visual.kind));
  const kettle=Number(q.visual.rows[0][1].replace('컵',''));
  assert.deepEqual(values,[String(kettle-2),String(kettle+1),'냄비']);
 }
});

test('dial, transfer, scale-pan counts and capacities satisfy independent numeric references',()=>{
 for(const[s,t]of[[8,6],[9,6]])for(const v of makeQuestion(s,t).visual.items){assert.ok(v.value<=v.max);assert.equal(v.value%v.step,0);assert.ok(renderVisual({kind:'illustratedDial',...v}).includes('확대'));}
 const sum=makeQuestion(9,6);assert.equal(sum.visual.items.reduce((n,v)=>n+v.value,0),Number(sum.fields[0].answer)*1000+Number(sum.fields[1].answer));
});
test('all valid 2 kg combinations are accepted; all fields still form one outcome',()=>{
 const q=makeQuestion(9,7),weights=new Map(q.visual.items.map(x=>[x.id,x.weight])),sets=q.visual.candidates;
 const expected=sets.map(ids=>ids.reduce((sum,i)=>sum+weights.get(i),q.visual.base)<=q.visual.limit?'가능':'불가능');
 assert.deepEqual(q.fields.map(f=>f.answer),expected);assert.ok(expected.includes('가능')&&expected.includes('불가능'));
 assert.equal(grade(q,expected).ok,true);const bad=[...expected];bad[2]=bad[2]==='가능'?'불가능':'가능';assert.deepEqual(grade(q,bad),{ok:false,wrong:[2]});
 assert.ok(publicQuestion(q).fields.every(f=>!('answer'in f)));
});
test('recipe, cacao, clean-water table, half box and connected balance keep original arithmetic',()=>{
 const recipe=makeQuestion(15,4),v=recipe.visual;const people=Number(recipe.lines[0].match(/(\d+)인분을 만들/)[1]);assert.equal(Number(recipe.fields[0].answer),v.cups*v.cup*people/v.servings);
 assert.deepEqual(makeQuestion(15,5).fields.map(f=>Number(f.answer)),[500*30,500*30/1000]);
 const box=makeQuestion(12,6);assert.equal(box.visual.totals[0]-box.visual.totals[1],4900);assert.equal(5700-4900,Number(box.fields.at(-1).answer));
 const balance=makeQuestion(16,1).visual.items;assert.equal(balance[0].rightMass/8,balance[1].leftMass/4);assert.equal(balance[0].leftMass/7,200);assert.equal(balance[1].rightMass*2,1400);
});

test('same-container variants change objects, levels, winners and all ranking permutations',()=>{
 const objects=new Set(),winners=new Set(),orders=new Set(),pictures=new Set();
 for(let seed=0;seed<1000;seed++)for(const type of [1]){
  const q=makeQuestion(1,type,seed),v=q.visual;
  assert.equal(new Set(v.sources).size,3);assert.equal(new Set(v.values).size,3);
  v.sources.forEach(x=>objects.add(x));v.values.forEach((x,i)=>{assert.ok(x>0&&x<v.max);v.values.forEach((y,j)=>{if(i!==j)assert.ok(Math.abs(x-y)>=100);});});
  const expected=v.values.map((x,i)=>[x,v.labels[i]]).sort((a,b)=>b[0]-a[0]).map(x=>x[1]);
  assert.deepEqual(q.fields.map(f=>f.answer),type===1?expected.slice(0,1):expected);
  winners.add(expected[0]);orders.add(expected.join(''));pictures.add(JSON.stringify([v.sources,v.values]));
  assert.ok(renderVisual(v).includes('<svg'));
 }
 assert.equal(objects.size,7);assert.equal(winners.size,3);assert.equal(orders.size,6);assert.ok(pictures.size>500);
});

test('cup groups vary vessels, counts and comparison questions with consistent answers',()=>{
 const objects=new Set(),modes=new Set(),winners=new Set(),variants=new Set();
 for(let seed=0;seed<1000;seed++){
  const q=makeQuestion(1,2,seed),g=q.visual.groups;
  assert.notEqual(g[0].source,g[1].source);assert.notEqual(g[0].count,g[1].count);
  g.forEach(x=>{objects.add(x.source);assert.ok(x.count>=2&&x.count<=8);});
  const field=q.fields[0];modes.add(field.label);variants.add(JSON.stringify(g));
  if(field.kind==='number')assert.equal(Number(field.answer),Math.abs(g[0].count-g[1].count));
  else{const larger=g[0].count>g[1].count?0:1,index=field.label==='더 큰 용기'?larger:1-larger;assert.equal(field.answer,g[index].label);winners.add(index);}
  assert.match(renderVisual(q.visual),/<svg/);assert.ok(!q.lines.join(' ').includes('두 병'));
 }
 assert.equal(objects.size,6);assert.equal(modes.size,3);assert.equal(winners.size,2);assert.ok(variants.size>100);
});

test('tank tables conserve volume and vary all three tasks independently',()=>{
 const ranges={'주전자':[600,1500],'작은 컵':[100,250],'머그잔':[200,500],'물병':[300,1200],'유리그릇':[250,800],'계량컵':[250,1000],'텀블러':[250,700]};
 const seen=new Map([3,4,5].map(t=>[t,{objects:new Set(),data:new Set(),answers:new Set()}]));
 for(let seed=0;seed<2000;seed++){
  const fixtures=[];
  for(const type of [3,4,5]){
   const q=makeQuestion(1,type,seed),v=q.visual,record=seen.get(type);
   assert.equal(v.kind,'fillTable');assert.equal(v.labels.length,4);assert.equal(new Set(v.sources).size,4);assert.equal(new Set(v.counts).size,4);
   v.capacities.forEach((capacity,i)=>{assert.equal(capacity*v.counts[i],v.tank);const[lo,hi]=ranges[v.sources[i]];assert.ok(capacity>=lo&&capacity<=hi);record.objects.add(v.sources[i]);});
   const order=v.capacities.map((amount,i)=>({amount,label:v.labels[i]})).sort((a,b)=>b.amount-a.amount).map(x=>x.label);
   if(type===3&&q.fields.length===4)assert.deepEqual(q.fields.map(f=>f.answer),q.lines.at(-1).includes('큰')?order:[...order].reverse());
   if(type===4||type===3&&q.fields.length!==4)for(const f of q.fields){const index={'가장 큰 용기':0,'둘째로 큰 용기':1,'둘째로 작은 용기':2,'가장 작은 용기':3}[f.label];assert.equal(f.answer,order[index]);}
   if(type===5){const match=q.lines.at(-1).match(/^([가나다라]) 용기의 들이는 ([가나다라])/);const a=v.labels.indexOf(match[1]),b=v.labels.indexOf(match[2]);assert.equal(Number(q.fields[0].answer),v.capacities[a]/v.capacities[b]);assert.ok(Number(q.fields[0].answer)>=2&&Number(q.fields[0].answer)<=4);}
   const svg=renderVisual(v);assert.ok(svg.includes('부은 횟수(번)'));for(const count of v.counts)assert.ok(svg.includes('>'+count+'</text>'));
   const data=JSON.stringify([v.sources,v.counts,v.tank]);fixtures.push(data);record.data.add(data);record.answers.add(q.fields.map(f=>f.answer).join(','));
   assert.equal(grade(q,q.fields.map(f=>f.answer)).ok,true);
  }
  assert.ok(new Set(fixtures).size>=2);
 }
 for(const[type,v]of seen){assert.equal(v.objects.size,7);assert.ok(v.data.size>500);assert.ok(v.answers.size>=(type===5?3:8));}
});

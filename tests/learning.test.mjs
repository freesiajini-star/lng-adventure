import {test} from 'node:test';import assert from 'node:assert/strict';import {applyAttempt,dayUsage,updateMonthly,dayProjection,night} from '../public/learning.js';
const event=(n,stage=1,ok=true)=>({qid:'q'+n,stage,ok,points:ok?1:-1,at:n*1000,day:'2026-11-15'});
test('all fields share one outcome, retries deduplicate and wrong-then-correct retains only the first wrong penalty',()=>{let d=applyAttempt(null,event(1,1,false));d=applyAttempt(d,event(1,1,false));assert.equal(d.total.wrong,1);d=applyAttempt(d,event(1));d=applyAttempt(d,event(1));d=applyAttempt(d,event(1,1,false));assert.deepEqual(d.total,{correct:0,wrong:1,score:-1,total:1});assert.equal(d.stages[1].questions,1);assert.equal(d.seen.q1.corrected,true);});
test('stage cap and sessions preserve existing 100-question and 30-minute boundaries',()=>{let d;for(let i=1;i<=100;i++)d=applyAttempt(d,event(i));assert.throws(()=>applyAttempt(d,event(101)),/100문제/);assert.equal(dayUsage(d).stages[1],100);const two=applyAttempt(applyAttempt(null,event(1)),{...event(2),at:1801000});assert.equal(Object.keys(two.sessions).length,2);});
test('daily snapshot retry cannot double monthly totals or replace newer snapshots',()=>{const d=applyAttempt(null,event(1)),p=dayProjection(d);let m=updateMonthly(null,'2026-11-15',p);m=updateMonthly(m,'2026-11-15',p);assert.equal(m.total.correct,1);const later=applyAttempt(d,event(2));m=updateMonthly(m,'2026-11-15',dayProjection(later));m=updateMonthly(m,'2026-11-15',p);assert.equal(m.total.correct,2);});
test('Korea night boundary',()=>{assert.equal(night(new Date('2026-11-15T21:00:00+09:00').getTime()),true);assert.equal(night(new Date('2026-11-15T06:00:00+09:00').getTime()),false);});
test('missing previous-day records are treated as zero usage',()=>{
 assert.equal(dayUsage({total:{total:300}},[null,null]).locked,false);
});

test('Firebase numeric stage arrays skip null slots without losing counts or monthly totals',()=>{
 const stats={correct:2,wrong:1,score:1,total:3,questions:3};
 for(const stages of [[null,stats,null,stats],{'1':stats,'2':null,'3':stats}]){
  const old=JSON.parse(JSON.stringify({total:{correct:4,wrong:2,score:2,total:6},stages,seen:{},sessions:{missing:null}}));
  assert.deepEqual(dayUsage(old).stages,{'1':3,'3':3});
  const next=applyAttempt(old,event(90));
  assert.equal(next.stages[1].questions,4);
  assert.equal(next.total.total,7);
  const monthly=updateMonthly({days:{missing:null}},'2026-11-15',dayProjection(next));
  assert.equal(monthly.total.total,7);
  assert.equal(monthly.stages[1].total,4);
  assert.equal(monthly.stages[3].total,3);
  assert.equal(monthly.stages[0],undefined);
  assert.equal(monthly.stages[2],undefined);
 }
});

test('corrections never earn points even with adjusted points, retries, or reordered offline events',()=>{
 for(const stage of [1,13])for(const reward of [1,7,10,100]){
  const wrong={...event(30,stage,false),points:-1};const right={...event(30,stage,true),points:reward,correction:true,firstWrongAt:wrong.at,at:wrong.at+1000};
  for(const order of [[wrong,right,right,wrong],[right,wrong,right,wrong]]){
   let d;for(const e of order)d=applyAttempt(d,e);
   assert.deepEqual(d.total,{correct:0,wrong:1,score:-1,total:1});assert.equal(d.stages[stage].questions,1);assert.equal(d.seen.q30.corrected,true);assert.equal(d.seen.q30.correct,undefined);assert.equal(Object.values(d.sessions)[0].count,1);
   assert.equal(updateMonthly(null,'2026-11-15',dayProjection(d)).total.score,-1);
  }
  const first=applyAttempt(null,{...event(31,stage,true),points:reward});assert.equal(first.total.score,reward);assert.equal(first.total.correct,1);
 }
});

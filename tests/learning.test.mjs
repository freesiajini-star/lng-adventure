import {test} from 'node:test';import assert from 'node:assert/strict';import {applyAttempt,dayUsage,updateMonthly,dayProjection,night} from '../public/learning.js';
const event=(n,stage=1,ok=true)=>({qid:'q'+n,stage,ok,points:ok?1:-1,at:n*1000,day:'2026-11-15'});
test('all fields share one outcome, retries deduplicate and wrong-then-correct scores once each',()=>{let d=applyAttempt(null,event(1,1,false));d=applyAttempt(d,event(1,1,false));assert.equal(d.total.wrong,1);d=applyAttempt(d,event(1));d=applyAttempt(d,event(1));d=applyAttempt(d,event(1,1,false));assert.deepEqual(d.total,{correct:1,wrong:1,score:0,total:2});assert.equal(d.stages[1].questions,1);});
test('stage cap and sessions preserve existing 100-question and 30-minute boundaries',()=>{let d;for(let i=1;i<=100;i++)d=applyAttempt(d,event(i));assert.throws(()=>applyAttempt(d,event(101)),/100문제/);assert.equal(dayUsage(d).stages[1],100);const two=applyAttempt(applyAttempt(null,event(1)),{...event(2),at:1801000});assert.equal(Object.keys(two.sessions).length,2);});
test('daily snapshot retry cannot double monthly totals or replace newer snapshots',()=>{const d=applyAttempt(null,event(1)),p=dayProjection(d);let m=updateMonthly(null,'2026-11-15',p);m=updateMonthly(m,'2026-11-15',p);assert.equal(m.total.correct,1);const later=applyAttempt(d,event(2));m=updateMonthly(m,'2026-11-15',dayProjection(later));m=updateMonthly(m,'2026-11-15',p);assert.equal(m.total.correct,2);});
test('Korea night boundary',()=>{assert.equal(night(new Date('2026-11-15T21:00:00+09:00').getTime()),true);assert.equal(night(new Date('2026-11-15T06:00:00+09:00').getTime()),false);});
test('missing previous-day records are treated as zero usage',()=>{
 assert.equal(dayUsage({total:{total:300}},[null,null]).locked,false);
});

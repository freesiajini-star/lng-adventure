import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {makeQuestion,grade} from '../math.js';import {WEIGHING_OBJECTS} from '../container-weight-problems.js';import {renderVisual} from '../public/visuals.js';import {artPath} from '../public/art-catalog.js';
test('12 objects × 4 weighing structures stay realistic, uniquely solvable and consistent with pictured counts',()=>{
 const seen=new Map([4,5,6,7].map(t=>[t,new Set()]));
 for(let seed=1;seed<=12000;seed++){
  const q=makeQuestion(12,4,seed),v=q.visual,entry=WEIGHING_OBJECTS.find(o=>o.art===v.objectArt);assert.ok(entry);seen.get(v.mode).add(v.label);
  const delta=v.counts[1]-v.counts[0],one=(v.totals[1]-v.totals[0])/delta,empty=v.totals[0]-v.counts[0]*one;
  assert.ok(Number.isInteger(one)&&one>=entry.min&&one<=entry.max);assert.ok(empty>=60&&empty<=250);
  assert.ok(v.totals.every(n=>n>0&&n<=5000));assert.equal(one,v.one);assert.equal(empty,v.empty);
  const answers=v.mode===4?[one]:q.lines.join(' ').includes('각각')?[one,empty]:[empty];assert.equal(grade(q,answers.map(String)).ok,true);
  if(seed<=1000){const html=renderVisual(v),asset=artPath(v.objectArt);assert.equal(html.split('href="'+asset+'"').length-1,v.counts[0]+v.counts[1]);assert.ok(fs.existsSync('public/'+asset.slice(2)));}
 }
 for(const objects of seen.values())assert.equal(objects.size,12);
});

import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {makeQuestion} from '../math.js';import {paintedGeometry} from '../public/painted-pour.js';import {renderReference,referenceLayout,renderLifeTable} from '../public/life-illustrations.js';import {teacherOverview} from '../public/teacher-overview.js';
import {paintedVessel} from '../public/painted-pour.js';import {renderVisual} from '../public/visuals.js';
test('overflow uses one full vessel and the same liquid palette, without an empty outline underneath',()=>{
 for(const liquid of ['물','우유','주스'])for(const id of ['waterBottle','juiceBottle','mug','measureJug','tumbler']){
  const html=paintedVessel(id,1000,1000,liquid,0,240,1,'test',true).markup;
  assert.equal((html.match(/<image /g)||[]).length,1);assert.ok(!html.includes('-empty.webp'));assert.ok(html.includes('data-liquid="'+liquid+'"'));
  const effect=html.split('class="wall-overflow"')[1];assert.ok(effect.includes(liquid==='우유'?'#f8edda':liquid==='주스'?'#f4b54f':'#8edce6'));assert.ok(effect.includes('C'));
 }
});
test('melon plate problem uses familiar produce, realistic masses and independently correct differences',()=>{
 const questions=Array.from({length:16},(_,i)=>makeQuestion(12,4,i+1)),q=questions.find(q=>q.visual.kind==='plateWeighings');assert.ok(q);assert.match(q.lines.join(' '),/참외/);assert.ok(!q.lines.join(' ').includes('열매'));const v=q.visual,one=(v.totals[1]-v.totals[0])/(v.counts[1]-v.counts[0]);assert.equal(one,300);assert.equal(v.totals[0]-one*v.counts[0],150);assert.match(renderVisual(v),/koreanMelon-v1.webp/);
});
test('flow scenes preserve tap counts, named containers and the original rates',()=>{
 for(let seed=1;seed<=80;seed++)for(const type of [0,4]){const q=makeQuestion(17,type,seed),v=q.visual,html=renderVisual(v);assert.equal((html.match(/tap-v[12]\.webp/g)||[]).length,(v.inlets||[v.inflow]).length);assert.ok(!html.includes('bathtub'));assert.match(q.lines.join(' '),new RegExp(v.container));assert.ok(!html.includes('undefined'));}
});
const scales=html=>[...html.matchAll(/class="painted-vessel"[^>]*?scale\(([\d.e+-]+)\)/g)].map(m=>+m[1]);
test('reference illustrations use a shared physical scale and conserve the depicted total water',()=>{
 for(let seed=1;seed<=100;seed++){const v=makeQuestion(3,0,seed).visual,layout=referenceLayout(v),shown=scales(renderReference(v)),source=paintedGeometry(layout.id,layout.total,layout.total),glass=paintedGeometry('glass',1000,1000);assert.equal(shown.length,v.fills.length+1);for(const scale of shown.slice(1))assert.ok(Math.abs(shown[0]/source.scale-scale/glass.scale)<1e-9);const before=source.volume*shown[0]**3,after=v.fills.reduce((sum,f,i)=>sum+glass.volume*shown[i+1]**3*f,0);assert.ok(Math.abs(before-after)<1e-6*Math.max(1,before));}
});
test('drink cups are 80 percent full and apparent capacities change with the stated quantity',()=>{
 for(const seed of[11,19,31,39]){const v=makeQuestion(4,6,seed).visual,html=renderLifeTable(v),levels=[...html.matchAll(/class="painted-vessel" data-fill="([\d.]+)"/g)].map(m=>+m[1]);assert.equal(levels.length,4);assert.ok(levels.every(n=>Math.abs(n-.8)<1e-9));const shown=scales(html);for(let i=1;i<4;i++)assert.ok(Math.abs((shown[i]/shown[0])**3-v.rows[i].value/v.rows[0].value)<1e-9);}
});
test('separate milk and juice quantities use matching liquids in the first two table pictures',()=>{const v=makeQuestion(4,6,19).visual,colors=[...renderLifeTable(v).matchAll(/glass-(milk|juice|water)-full/g)].map(m=>m[1]);assert.deepEqual(colors.slice(0,2),['milk','juice']);});
test('teacher overview computes real summary counts and retains reference dashboard sections',()=>{
 const students=[{id:'a',class_no:1,student_no:1,visible:true,at:Date.now()},{id:'b',class_no:2,student_no:2}],stages=['첫 단계','둘째 단계'],data={students,monthly:[{student_id:'a',stage:1,correct:3,total:4,points:2}],daily:{a:{stages:{1:{correct:2,total:3,score:1}}}},histories:{'2026-11-16':{a:{stages:{1:{total:3}}}}},points:{}};
 const html=teacherOverview({data,students,stages,label:s=>s.id,status:()=>'',risk:()=>0,sessionsFor:()=>[],date:'2026-11-16',month:'2026-11'});for(const section of['현재 접속자 수','학생별 활동','전체·단계별·학급별 순위표','최근 14일','학급별 · 단계별 정답률','단계별 정답 점수 설정'])assert.ok(html.includes(section));assert.ok(html.includes('3문제'));assert.ok(html.includes('75%'));
});
test('student page has no teacher link and teacher page has no password entry form',()=>{
 const page=fs.readFileSync('public/index.html','utf8'),code=fs.readFileSync('public/teacher.js','utf8');assert.ok(!page.includes('teacher.html'));assert.ok(!code.includes('type="password"'));assert.ok(code.includes("params.get('access')"));assert.ok(code.includes('history.replaceState'));
});

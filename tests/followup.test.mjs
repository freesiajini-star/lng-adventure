import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {makeQuestion} from '../math.js';import {paintedGeometry} from '../public/painted-pour.js';import {renderReference,referenceLayout,renderLifeTable} from '../public/life-illustrations.js';import {teacherOverview} from '../public/teacher-overview.js';
import {paintedVessel} from '../public/painted-pour.js';import {renderVisual} from '../public/visuals.js';
import {POUR_SCENARIOS,makePourQuestion} from '../pour-problems.js';
import {volumeBelow} from '../public/pour-geometry.js';
test('every pouring scene depicts the actual filled quantity using one consistent empty silhouette',()=>{
 for(let seed=0;seed<POUR_SCENARIOS.length;seed++){
  const v=makePourQuestion({},seed).visual,g=paintedGeometry(v.to.id,v.target,v.filled),html=renderVisual(v);
  assert.ok(Math.abs(volumeBelow(g.profile,g.level)/g.volume-v.filled/v.target)<1e-10);
  assert.equal((html.match(/class="painted-vessel"/g)||[]).length,2);
  assert.equal(html.includes('class="ground-pool"'),v.source>v.target);
  assert.ok(html.includes('data-level="'+g.level+'"'));
  if(v.outcome==='space')assert.ok(g.level>g.profile[0][0]);
  else assert.equal(g.level,g.profile[0][0]);
 }
});
test('overflow uses one fixed vessel silhouette and calculated liquid up to the rim',()=>{
 for(const liquid of ['물','우유','주스'])for(const id of ['waterBottle','juiceBottle','mug','measureJug','tumbler']){
  const html=paintedVessel(id,1000,1000,liquid,0,240,1,'test',true).markup;
  assert.ok(html.includes('clip-path="url(#test-interior)"'));assert.match(html,/-empty-v(?:1\.webp|3\.png)/);assert.ok(html.includes('class="calculated-liquid"'));assert.ok(html.includes('data-liquid="'+liquid+'"'));
  assert.ok(!html.includes('class="wall-overflow"'));assert.ok(html.includes('class="ground-pool"'));assert.ok(html.includes('class="pool-depth"'));
 }
});
test('container weighing pictures retain the selected produce and independently correct mass differences',()=>{
 for(let seed=1;seed<=160;seed++){const q=makeQuestion(12,4,seed),v=q.visual,one=(v.totals[1]-v.totals[0])/(v.counts[1]-v.counts[0]);assert.equal(one,v.one);if(v.mode!==4)assert.equal(v.totals[0]-one*v.counts[0],Number(q.fields.at(-1).answer));if(v.mode===4)assert.equal(one,Number(q.fields[0].answer));assert.ok(renderVisual(v).includes(v.objectArt+'-v'));}
});
test('flow scenes preserve tap counts, named containers and the original rates',()=>{
 for(let seed=1;seed<=80;seed++)for(const type of [0,4]){const q=makeQuestion(17,type,seed),v=q.visual,html=renderVisual(v);assert.equal((html.match(/tap-v[12]\.webp/g)||[]).length,(v.inlets||[v.inflow]).length);assert.ok(!html.includes('bathtub'));assert.match(q.lines.join(' '),new RegExp(v.container));assert.ok(!html.includes('undefined'));const streams=[...html.matchAll(/class="falling-water" data-x="([\d.]+)" d="M([\d.]+) 105V([\d.]+)"/g)];assert.equal(streams.length,(v.inlets||[v.inflow]).length);for(const stream of streams){assert.equal(stream[1],stream[2]);assert.ok(+stream[1]>=285&&+stream[1]<=335);assert.ok(+stream[3]>105);}}
});
const scales=html=>[...html.matchAll(/class="painted-vessel"[^>]*?scale\(([\d.e+-]+)\)/g)].map(m=>+m[1]);
test('reference illustrations use a shared physical scale and conserve the depicted total water',()=>{
 for(let seed=1;seed<=100;seed++){const v=makeQuestion(3,0,seed).visual,layout=referenceLayout(v),shown=scales(renderReference(v)),source=paintedGeometry(layout.id,layout.total,layout.total),glass=paintedGeometry('glass',1000,1000);assert.equal(shown.length,v.fills.length+1);for(const scale of shown.slice(1))assert.ok(Math.abs(shown[0]/source.scale-scale/glass.scale)<1e-9);const before=source.volume*shown[0]**3,after=v.fills.reduce((sum,f,i)=>sum+glass.volume*shown[i+1]**3*f,0);assert.ok(Math.abs(before-after)<1e-6*Math.max(1,before));}
});
test('drink cups are 80 percent full and apparent capacities change with the stated quantity',()=>{
 for(const seed of[11,19,31,39]){const v=makeQuestion(4,6,seed).visual,html=renderLifeTable(v),levels=[...html.matchAll(/class="painted-vessel" data-fill="([\d.]+)"/g)].map(m=>+m[1]);assert.equal(levels.length,4);assert.ok(levels.every(n=>Math.abs(n-.8)<1e-9));const shown=scales(html);for(let i=1;i<4;i++)assert.ok(Math.abs((shown[i]/shown[0])**3-v.rows[i].value/v.rows[0].value)<1e-9);}
});
test('separate milk and juice quantities use matching liquids in the first two table pictures',()=>{const v=makeQuestion(4,6,19).visual,colors=[...renderLifeTable(v).matchAll(/class="calculated-liquid" data-liquid="([^"]+)"/g)].map(m=>m[1]);assert.deepEqual(colors.slice(0,2),['우유','주스']);});
test('teacher overview computes real summary counts and retains reference dashboard sections',()=>{
 const students=[{id:'a',class_no:1,student_no:1,visible:true,at:Date.now()},{id:'b',class_no:2,student_no:2}],stages=['첫 단계','둘째 단계'],data={students,monthly:[{student_id:'a',stage:1,correct:3,total:4,points:2}],daily:{a:{stages:{1:{correct:2,total:3,score:1}}}},histories:{'2026-11-16':{a:{stages:{1:{total:3}}}}},points:{}};
 const html=teacherOverview({data,students,stages,label:s=>s.id,status:()=>'',risk:()=>0,sessionsFor:()=>[],date:'2026-11-16',month:'2026-11'});for(const section of['현재 접속자 수','학생별 활동','전체·단계별·학급별 순위표','최근 14일','학급별 · 단계별 정답률','단계별 정답 점수 설정'])assert.ok(html.includes(section));assert.ok(html.includes('3문제'));assert.ok(html.includes('75%'));
});
test('student page has no teacher link and teacher page has no password entry form',()=>{
 const page=fs.readFileSync('public/index.html','utf8'),code=fs.readFileSync('public/teacher.js','utf8');assert.ok(!page.includes('teacher.html'));assert.ok(!code.includes('type="password"'));assert.ok(code.includes("params.get('access')"));assert.ok(code.includes('history.replaceState'));
});

 test('falling water reaches collected water without changing the initial amount',()=>{
 for(let type of[0,4])for(let seed=1;seed<=12;seed++){
  const v=makeQuestion(17,type,seed).visual,html=renderVisual(v),surface=Number(html.match(/class="collected-water" data-surface="(\d+)"/)[1]);
  for(const end of html.matchAll(/class="falling-water"[^>]*d="M[\d.]+ 105V([\d.]+)"/g))assert.equal(Number(end[1]),surface);
  assert.ok(!html.includes('처음 빈 '));assert.ok(!html.includes('물 받는 중'));assert.ok(html.includes('mask="url(#stream-fade-'));
 }
 });

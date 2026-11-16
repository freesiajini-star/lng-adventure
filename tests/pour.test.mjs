import {test} from 'node:test';import assert from 'node:assert/strict';
import {makeQuestion,grade,POUR_VARIANT_COUNT} from '../math.js';
import {POUR_CONTAINERS,POUR_SCENARIOS} from '../pour-problems.js';
import {vesselGeometry,volumeBelow,fillLevel,vesselProfile} from '../public/pour-geometry.js';
import {renderVisual} from '../public/visuals.js';
test('every pouring variant conserves volume and chooses the correct comparison',()=>{
 const variants=new Set(),outcomes=new Set(),pairs=new Set();
 for(let seed=0;seed<POUR_VARIANT_COUNT;seed++){
  const q=makeQuestion(1,0,seed),v=q.visual;
  assert.equal(v.filled,Math.min(v.source,v.target));assert.equal(v.remainder,Math.max(0,v.source-v.target));assert.equal(v.space,Math.max(0,v.target-v.source));
  assert.equal(v.source,v.filled+v.remainder);assert.equal(v.target,v.filled+v.space);
  const expected=v.source>v.target?v.from.name:v.source<v.target?v.to.name:'같아요';assert.equal(q.fields[0].answer,expected);assert.equal(grade(q,[expected]).ok,true);
  assert.ok(v.from.capacities.includes(v.source));assert.ok(v.to.capacities.includes(v.target));assert.ok(v.to.target);assert.notEqual(v.from.id,v.to.id);
  assert.ok(!q.lines.join(' ').includes('물가'));assert.ok(!/술|주류|소주|맥주|약병/.test(q.lines.join(' ')));
  const drawing=renderVisual(v);assert.ok(!/NaN|undefined|Infinity/.test(drawing));
  variants.add(v.variant);outcomes.add(v.outcome);pairs.add(v.from.id+'/'+v.to.id);
 }
 assert.equal(variants.size,POUR_VARIANT_COUNT);assert.deepEqual([...outcomes].sort(),['equal','overflow','space']);assert.ok(pairs.size>=60);assert.ok(POUR_VARIANT_COUNT>=500);
});
test('200 mL milk in a 2 L bottle cannot overflow',()=>{
 const index=POUR_SCENARIOS.findIndex(v=>v.from.id==='milkCarton'&&v.source===200&&v.to.id==='waterBottle'&&v.target===2000);
 assert.ok(index>=0);const q=makeQuestion(1,0,index),v=q.visual;assert.equal(v.remainder,0);assert.equal(v.space,1800);assert.equal(v.outcome,'space');assert.equal(q.fields[0].answer,'물병');assert.match(q.lines[1],/공간이 남/);
});
test('curved liquid levels independently match capacity fractions, including handles excluded',()=>{
 for(const c of POUR_CONTAINERS){const p=vesselProfile(c.id);
  for(const capacity of c.capacities)for(const fraction of [0,.1,.2,.5,.8,1]){
   const g=vesselGeometry(c.id,capacity,capacity*fraction);assert.ok(Math.abs(g.volume*g.scale**3/1000-capacity)<1e-8);
   assert.ok(Math.abs(volumeBelow(p,g.level)/g.volume-fraction)<1e-10);
   // Independent small-slice midpoint integration of the actual polygon radius.
   let approx=0;const step=(p.at(-1)[0]-g.level)/4000;
   for(let i=0;i<4000;i++){const y=g.level+(i+.5)*step;let k=1;while(k<p.length-1&&p[k][0]<y)k++;const a=p[k-1],b=p[k];const r=a[1]+(b[1]-a[1])*(y-a[0])/(b[0]-a[0]);approx+=(c.id.endsWith('Carton')?2*r*68:Math.PI*r*r)*step;}
   assert.ok(Math.abs(approx/g.volume-fraction)<.00001);
  }
 }
 const vase=vesselProfile('vase'),top=vase[0][0],bottom=vase.at(-1)[0];assert.ok(Math.abs(fillLevel(vase,.5)-(top+bottom)/2)>1,'a curved vase must not use half height for half volume');
});

test('the session deck changes container pairs and does not repeat variants before exhaustion',async()=>{
 const {createPourDeck}=await import('../pour-problems.js');const {rng}=await import('../math.js');const deck=createPourDeck(rng(721)),seen=new Set();let previous='';
 const firstPairs=new Set(),pairCount=new Set(POUR_SCENARIOS.map(v=>v.from.id+'/'+v.to.id)).size;
 for(let i=0;i<POUR_VARIANT_COUNT;i++){const id=deck.next(),v=POUR_SCENARIOS[id],pair=v.from.id+'/'+v.to.id;assert.ok(!seen.has(id));seen.add(id);if(i<100)assert.notEqual(pair,previous);if(i<pairCount)firstPairs.add(pair);previous=pair;}
 assert.equal(firstPairs.size,pairCount);assert.equal(seen.size,POUR_VARIANT_COUNT);assert.ok(deck.next()>=0);
});

test('cartons use rectangular cross sections rather than a circular bottle volume',()=>{
 const p=vesselProfile('milkCarton');const expected=68*68*(170-34)+68*(1+34)*(34-10);
 assert.ok(Math.abs(volumeBelow(p,10)-expected)<1e-6);assert.equal(p.depth,68);
});

test('similar vessel silhouettes are not paired for comparison',()=>{
 const cupShapes=new Set(['glass','mug','tumbler','measureJug']);
 for(const v of POUR_SCENARIOS){assert.ok(!(cupShapes.has(v.from.id)&&cupShapes.has(v.to.id)));assert.ok(!(['waterBottle','juiceBottle'].includes(v.from.id)&&['waterBottle','juiceBottle'].includes(v.to.id)));assert.notEqual(v.from.family,v.to.family);}
});
test('overflow touches and follows the vessel wall and ends in an attached puddle',async()=>{
 const {wallOverflow}=await import('../public/pour-geometry.js');
 for(const vessel of POUR_CONTAINERS.filter(x=>x.target)){
  const g=vesselGeometry(vessel.id,vessel.capacities[0],vessel.capacities[0]),scale=g.scale,flow=wallOverflow(g.profile,scale,570,20);
  for(let i=0;i<flow.points.length;i++){const[x,y]=flow.points[i],[py,r]=g.profile[i];assert.ok(Math.abs(x-(570-r*scale))+1e-8>=scale);assert.ok(Math.abs(x-(570-r*scale))<=scale+1e-8);assert.equal(y,20+py*scale);if(i)assert.ok(y>flow.points[i-1][1]);}
  const end=flow.points.at(-1),p=flow.pool;assert.ok(Math.abs(end[0]-p.cx)<p.rx);assert.ok(Math.abs(end[1]-p.cy)<p.ry);
 }
 for(const seed of [0,50,500]){const v=makeQuestion(1,0,seed).visual;assert.equal(renderVisual(v).includes('class="ground-pool"'),v.remainder>0);}
});

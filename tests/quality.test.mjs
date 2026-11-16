import test from 'node:test';
import assert from 'node:assert/strict';
import {makeQuestion,publicQuestion} from '../math.js';
import {reviseQuality,subject,WEIGHT_OBJECTS} from '../quality-revisions.js';
import {renderVisual} from '../public/visuals.js';
test('boxes ask only total grams, vary produce and counts, never print the converted empty weight',()=>{
 const labels=new Set(),counts=new Set();for(let seed=1;seed<=300;seed++){const q=reviseQuality({stage:7,type:3},seed),v=q.visual;labels.add(v.label);counts.add(v.items);assert.equal(q.fields.length,1);assert.equal(+q.fields[0].answer,v.box+v.one*v.items);assert.equal(v.total,null);const svg=renderVisual(publicQuestion(q).visual);assert.ok(svg.includes('carrier-11-v2.webp'));assert.ok(!svg.includes('빈 상자 '+v.box+' g'));}
 assert.ok(labels.size>=7);assert.deepEqual([...counts].sort(),[1,2,3]);
});
test('weight families have dozens of distinct pictured questions and independently correct quantities',()=>{
 for(const type of [0,1,2,3,4,5,6]){const variants=new Set();for(let seed=1;seed<=300;seed++){
  const q=reviseQuality({stage:8,type},seed),v=q.visual;variants.add(JSON.stringify([q.lines,q.visual]));assert.ok(renderVisual(v).includes('painted-art'));
  if(type===0||type===2)q.fields.forEach((f,i)=>{const object=WEIGHT_OBJECTS.find(x=>x[0]===v.cards[i][0]);assert.equal(f.answer,object[1]>=1000000?'t':object[1]>=1000?'kg':'g');});
  if(type===1||type===3){const line=q.lines[0],m=line.match(/무게가 ([\d.]+) (kg|g)보다/),limit=+m[1]*(m[2]==='kg'?1000:1),greater=line.includes('무거운');const valid=v.cards.filter(x=>{const item=WEIGHT_OBJECTS.find(o=>o[0]===x[0]);return greater?item[1]>limit:item[2]<limit;});assert.equal(valid.length,1);assert.equal(valid[0][0],q.fields[0].answer);assert.ok(v.cards.every(c=>c[1]===''));}
  if(type===4||type===5)assert.equal(+q.fields[0].answer,type===4?v.step:v.value);
  if(type===6)assert.equal(q.fields[0].answer,v.items[v.items[0].value>v.items[1].value?0:1].label);
 }assert.ok(variants.size>=30,type+': insufficient variants');}
});
test('before and after water levels differ and agree with the cup arithmetic',()=>{
 for(let seed=1;seed<=300;seed++){const q=reviseQuality({stage:12,type:2},seed),v=q.visual;assert.equal(v.after-v.before,v.one*v.count);assert.ok(v.after<=v.capacity);assert.ok(v.before<v.after);assert.equal(+q.fields[1].answer,v.one);const svg=renderVisual(v);assert.ok(svg.includes('data-fill="'+v.before/v.capacity+'"'));assert.ok(svg.includes('data-fill="'+v.after/v.capacity+'"'));}
});
test('scaling contexts vary and recipes preserve the specified serving ratio',()=>{
 const contexts=new Set();for(let seed=1;seed<=300;seed++){const q=reviseQuality({stage:15,type:4},seed),v=q.visual,a=q.facts[0].audit;contexts.add(v.title);assert.equal(Number(q.fields[0].answer),a.targetScale/a.baseScale);if(a.index===0){const m=q.lines[0].match(/(\d+)인분.*?소스 (\d+)컵.*?(\d+) mL/),target=Number(q.lines[1].match(/(\d+)인분/)[1]),answer=Number(q.fields[1].answer)*1000+Number(q.fields[2].answer);assert.equal(answer,Number(m[2])*Number(m[3])*target/Number(m[1]));}}assert.equal(contexts.size,30);
});
test('Korean subjects choose 이/가 from the final syllable',()=>{
 for(const [word,expected]of[['책','책이'],['묶음','묶음이'],['상자','상자가'],['배','배가'],['빈 플라스틱병 묶음','빈 플라스틱병 묶음이']])assert.equal(subject(word),expected);
});

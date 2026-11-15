import{test}from'node:test';import assert from'node:assert/strict';import{columnSteps,columnTasks}from'../column-calculation.js';import{makeQuestion}from'../math.js';import{readFileSync}from'node:fs';
test('borrowing 10 leaves the original receiving digit intact and only strikes the donor',()=>{
 const tasks=columnTasks(columnSteps(8300,3500,'−'));
 assert.deepEqual(tasks.filter(t=>t.kind==='strike'),[{kind:'strike',index:0,target:'original'}]);
 assert.ok(tasks.some(t=>t.kind==='note'&&t.index===0&&t.answer==='7'&&t.role==='decreased'));
 assert.ok(tasks.some(t=>t.kind==='note'&&t.index===1&&t.answer==='10'&&t.role==='borrow'));
 assert.ok(!tasks.some(t=>t.kind==='note'&&t.answer==='13'));
 const digits=Array(4).fill('');tasks.filter(t=>t.kind==='result').forEach(t=>digits[t.index]=t.answer);assert.equal(digits.join(''),'4800');
});
test('across zeros, an intermediate borrowed 10 is struck when it donates onward; original zero remains',()=>{
 const tasks=columnTasks(columnSteps(10000,1,'−')),strikes=tasks.filter(t=>t.kind==='strike');
 assert.deepEqual(strikes,[{kind:'strike',index:0,target:'original'},{kind:'strike',index:1,target:'note'},{kind:'strike',index:2,target:'note'},{kind:'strike',index:3,target:'note'}]);
 for(const t of strikes.filter(t=>t.target==='note')){const at=tasks.indexOf(t);assert.equal(tasks[at-1].answer,'10');assert.equal(tasks[at+1].answer,'9');}
 const digits=Array(5).fill('');tasks.filter(t=>t.kind==='result').forEach(t=>digits[t.index]=t.answer);assert.equal(Number(digits.join('')),9999);
});
test('missing-value questions offer optional column help in both units while other arithmetic remains direct',()=>{
 for(const stage of[4,9])for(let seed=1;seed<=100;seed++){assert.equal(makeQuestion(stage,5,seed).column.optional,true);assert.equal(makeQuestion(stage,2,seed).column.optional,false);}
 const app=readFileSync('public/app.js','utf8'),column=readFileSync('public/column-work.js','utf8');assert.match(app,/if\(q.column.optional\)return/);assert.match(app,/!q.column\?\.optional&&!columnController.complete/);assert.match(column,/<details class="column-help"><summary>세로셈으로 풀어보기/);assert.match(app,/missingEquation\(q\)/);
});

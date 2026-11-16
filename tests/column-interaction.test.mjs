import{test}from'node:test';import assert from'node:assert/strict';import{columnSteps,columnTasks}from'../column-calculation.js';import{makeQuestion}from'../math.js';import{readFileSync}from'node:fs';
test('borrowing 10 leaves the original receiving digit intact and only strikes the donor',()=>{
 const tasks=columnTasks(columnSteps(8300,3500,'−'));
 assert.deepEqual(tasks.filter(t=>t.kind==='strike'),[{kind:'strike',index:0,target:'original'}]);
 assert.ok(tasks.some(t=>t.kind==='note'&&t.index===0&&t.answer==='7'&&t.role==='decreased'));
 assert.ok(tasks.some(t=>t.kind==='note'&&t.index===1&&t.answer==='10'&&t.role==='borrow'));
 assert.ok(!tasks.some(t=>t.kind==='note'&&t.answer==='13'));
 const digits=Array(4).fill('');tasks.filter(t=>t.kind==='result').forEach(t=>digits[t.index]=t.answer);assert.equal(digits.join(''),'4800');
});
test('across zeros, write 9 directly and pass 10 to the receiving digit',()=>{
 const tasks=columnTasks(columnSteps(10000,1,'−')),strikes=tasks.filter(t=>t.kind==='strike');
 assert.deepEqual(strikes,[{kind:'strike',index:0,target:'original'}]);
 assert.deepEqual(tasks.filter(t=>t.kind==='note').map(t=>[t.index,t.answer]),[[0,'0'],[1,'9'],[2,'9'],[3,'9'],[4,'10']]);
 const digits=Array(5).fill('');tasks.filter(t=>t.kind==='result').forEach(t=>digits[t.index]=t.answer);assert.equal(Number(digits.join('')),9999);
});

test('10 L 200 mL minus 3 L 600 mL skips the intermediate 10 and retains 6 L 600 mL',()=>{
 const model=columnSteps(10200,3600,'−'),tasks=columnTasks(model);
 assert.deepEqual(tasks.filter(t=>t.kind==='note').map(t=>[t.index,t.answer]),[[0,'0'],[1,'9'],[2,'10']]);
 assert.equal(tasks.some(t=>t.kind==='strike'&&t.target==='note'),false);
 assert.equal(model.steps.some(s=>s.focus===1&&s.notes[1]===10),false);
 assert.equal(model.result,6600);
});

test('a previously decreased note receives a leading 1 instead of a separate 10',()=>{
 const model=columnSteps(13200,4800,'−'),tasks=columnTasks(model);
 assert.deepEqual(tasks.filter(t=>t.kind==='note').map(t=>[t.index,t.answer,t.role]),[[1,'2','decreased'],[2,'10','borrow'],[0,'0','decreased'],[1,'1','prefix']]);
 const digits=Array(model.length).fill('');tasks.filter(t=>t.kind==='result').forEach(t=>digits[t.index]=t.answer);
 assert.equal(Number(digits.join('')),8400);
 assert.equal(model.result,8400);
});
test('missing-value questions offer optional column help in both units while other arithmetic remains direct',()=>{
 for(const stage of[4,9])for(let seed=1;seed<=100;seed++){assert.equal(makeQuestion(stage,5,seed).column.optional,true);assert.equal(makeQuestion(stage,2,seed).column.optional,false);}
 const app=readFileSync('public/app.js','utf8'),column=readFileSync('public/column-work.js','utf8');assert.match(app,/if\(q.column.optional\)return/);assert.match(app,/!q.column\?\.optional&&!columnController.complete/);assert.match(column,/<details class="column-help"><summary>세로셈으로 풀어보기/);assert.match(app,/missingEquation\(q\)/);
});

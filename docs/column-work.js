import {columnSteps,columnTasks} from './column-calculation.js?v=b4485d52e7f2';
export function columnMarkup(){return '<section class="column-work" aria-label="직접 푸는 격자 세로셈"><h2>세로셈</h2><div class="column-grid-host"></div><p class="column-message" aria-live="polite"></p><div class="column-controls"><button data-column="check" type="button">이 칸 확인</button><button data-column="reset" type="button">처음부터</button></div></section>';}
export function mountColumn(root,data,{onComplete=()=>{},onWrong=()=>{}}={}){
 if(!root)return null;const model=columnSteps(data.a,data.b,data.operation),tasks=columnTasks(model),large=data.large||'L',small=data.small||'mL';
 const noteHistory=Array.from({length:model.length},()=>[]),results=Array(model.length).fill(''),struck=new Set();let step=0,value='',active=false,locked=false;
 const digitColumn=i=>i+2+(i>=model.length-3?1:0),columns=model.length+3,largeColumn=model.length-1,smallColumn=columns;
 const cell=(column,row,html,cls='')=>`<div class="practice-cell ${cls}" style="grid-column:${column};grid-row:${row}">${html}</div>`;
 const leading=(digits,i)=>i<model.length-4&&digits.slice(0,i+1).every(n=>n===0);
 const guide=task=>task.kind==='strike'?'바꿀 윗줄 숫자를 누르세요.':task.kind==='note'?(model.operation==='+'?'올림 칸에 수를 쓰세요.':'작은 칸에 바뀐 수를 쓰세요.'):'계산한 수를 아래 칸에 쓰세요.';
 function draw(){const task=tasks[step];let html='';
  for(let i=0;i<model.length;i++){
   const c=digitColumn(i),noteActive=task?.kind==='note'&&task.index===i,resultActive=task?.kind==='result'&&task.index===i,history=noteHistory[i];
   html+=cell(c,1,history.map((v,j)=>`<span class="practice-note ${j<history.length-1||noteActive?'old-note':''}">${v}</span>`).join('')+(noteActive?`<input class="column-step-input note-input" inputmode="none" autocomplete="off" maxlength="2" aria-label="${large} ${small} 올림 또는 내림 칸" value="${value}">`:''),'practice-notes');
   html+=cell(c,2,`<button type="button" class="given-digit ${struck.has(i)?'student-struck':''}" data-strike="${i}" aria-label="윗줄 숫자 ${model.top[i]}" ${locked?'disabled':''}>${leading(model.top,i)?'':model.top[i]}</button>`);
   html+=cell(c,3,leading(model.bottom,i)?'':model.bottom[i]);
   html+=cell(c,4,resultActive?`<input class="column-step-input result-input" inputmode="none" autocomplete="off" maxlength="1" aria-label="계산 결과의 숫자" value="${value}">`:results[i],'practice-result');
  }
  for(const row of [2,3,4])html+=cell(largeColumn,row,large,'practice-unit')+cell(smallColumn,row,small,'practice-unit');
  html+=cell(1,3,model.operation)+`<div class="practice-rule" style="grid-column:1/${columns+1};grid-row:4"></div>`;
  root.querySelector('.column-grid-host').innerHTML=`<div class="practice-grid" style="--practice-columns:${columns}">${html}</div>`;
  root.querySelector('.column-message').textContent=task?(task.kind==='strike'?'바꿀 윗줄 숫자를 눌러 빗금을 그으세요.':guide(task)):'세로셈을 완성했어요. 정답 확인을 누르세요.';
  root.querySelector('[data-column="check"]').disabled=locked||!task||task.kind==='strike';root.querySelector('[data-column="reset"]').disabled=locked;
  root.querySelectorAll('[data-strike]').forEach(el=>el.onclick=()=>{if(locked||!task)return;active=true;if(task.kind!=='strike'){root.querySelector('.column-step-input')?.focus({preventScroll:true});return;}if(task.kind==='strike'&&Number(el.dataset.strike)===task.index){struck.add(task.index);advance();}else{el.classList.add('column-error');onWrong();}});
  const input=root.querySelector('.column-step-input');if(input){active=true;input.onfocus=()=>{active=true;};input.oninput=()=>{value=input.value.replace(/\D/g,'').slice(0,task.kind==='note'?2:1);input.value=value;input.classList.remove('column-error');};input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();check();}if(e.key==='Tab'){e.preventDefault();check();}};}
 }
 function advance(){value='';step++;draw();if(step>=tasks.length){active=false;const amount=Number(results.join(''));onComplete({large:Math.floor(amount/1000),small:amount%1000});}else{active=true;root.querySelector('.column-step-input')?.focus({preventScroll:true});}}
 function check(){if(locked)return;const task=tasks[step];if(!task||task.kind==='strike')return;if(!value)return;if(value!==task.answer){root.querySelector('.column-step-input')?.classList.add('column-error');root.querySelector('.column-message').textContent='이 칸을 다시 생각해 보세요.';onWrong();return;}
  if(task.kind==='note')noteHistory[task.index].push(value);else results[task.index]=value;advance();
 }
 const controller={isActive:()=>active&&step<tasks.length&&!locked,deactivate:()=>{active=false;},complete:()=>step>=tasks.length,disable:()=>{locked=true;active=false;draw();},key:k=>{if(locked)return;const task=tasks[step];if(!task||task.kind==='strike')return;if(k==='tab'){check();return;}if(k==='clear')value='';else if(k==='back')value=value.slice(0,-1);else if(/^\d$/.test(k))value=(value+k).slice(-(task.kind==='note'?2:1));const input=root.querySelector('.column-step-input');if(input){input.value=value;input.classList.remove('column-error');}},reset:()=>{if(locked)return;step=0;value='';active=false;struck.clear();noteHistory.forEach(x=>x.splice(0));results.fill('');draw();onComplete(null);}};
 root.querySelector('[data-column="check"]').onclick=check;root.querySelector('[data-column="reset"]').onclick=()=>controller.reset();draw();return controller;
}

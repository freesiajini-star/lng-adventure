import {columnSteps,columnTasks} from './column-calculation.js?v=5e5dab72b33e';
export function columnMarkup({optional=false}={}){const content='<section class="column-work" aria-label="직접 푸는 격자 세로셈"><h2>세로셈</h2><div class="column-grid-host"></div><p class="column-message" aria-live="polite"></p><div class="column-controls"><button data-column="check" type="button">이 칸 확인</button><button data-column="reset" type="button">처음부터</button></div></section>';return optional?'<details class="column-help"><summary>세로셈으로 풀어보기</summary>'+content+'</details>':content;}
export function mountColumn(root,data,{onComplete=()=>{},onWrong=()=>{}}={}){
 if(!root)return null;const model=columnSteps(data.a,data.b,data.operation),tasks=columnTasks(model),large=data.large||'L',small=data.small||'mL';
 const noteHistory=Array.from({length:model.length},()=>[]),results=Array(model.length).fill(''),struck=new Set();let step=0,value='',active=false,locked=false,needsCorrection=false;
 const digitColumn=i=>i+2+(i>=model.length-3?1:0),columns=model.length+3,largeColumn=model.length-1,smallColumn=columns;
 const cell=(column,row,html,cls='')=>`<div class="practice-cell ${cls}" style="grid-column:${column};grid-row:${row}">${html}</div>`;
 const leading=(digits,i)=>i<model.length-4&&digits.slice(0,i+1).every(n=>n===0);
 const guide=task=>task.kind==='strike'?(task.target==='note'?'빌려주는 작은 수를 눌러 빗금을 그으세요.':'빌려주는 윗줄 숫자를 눌러 빗금을 그으세요.'):task.kind==='note'?(task.role==='carry'?'올림 칸에 수를 쓰세요.':task.role==='borrow'?'빌려온 10을 작은 칸에 쓰세요.':'줄어든 수를 작은 칸에 쓰세요.'):'계산한 수를 아래 칸에 쓰세요.';
 function draw(){const task=tasks[step];let html='';
  for(let i=0;i<model.length;i++){
   const c=digitColumn(i),noteActive=task?.kind==='note'&&task.index===i,resultActive=task?.kind==='result'&&task.index===i,history=noteHistory[i];
   html+=cell(c,1,history.map((v,j)=>task?.kind==='strike'&&task.target==='note'&&task.index===i&&j===history.length-1?`<button type="button" class="note-digit column-target" data-strike-note="${i}" aria-label="빌려주는 작은 수 ${v.value}">${v.value}</button>`:`<span class="practice-note ${v.struck?'old-note':''}">${v.value}</span>`).join('')+(noteActive?`<input class="column-step-input note-input column-target" inputmode="none" autocomplete="off" maxlength="2" aria-label="${large} ${small} 올림 또는 내림 칸" value="${value}">`:''),'practice-notes');
   html+=cell(c,2,`<button type="button" class="given-digit ${struck.has(i)?'student-struck':''} ${task?.kind==='strike'&&task.target==='original'&&task.index===i?'column-target':''}" data-strike="${i}" aria-label="윗줄 숫자 ${model.top[i]}" ${locked?'disabled':''}>${leading(model.top,i)?'':model.top[i]}</button>`);
   html+=cell(c,3,leading(model.bottom,i)?'':model.bottom[i]);
   html+=cell(c,4,resultActive?`<input class="column-step-input result-input column-target" inputmode="none" autocomplete="off" maxlength="1" aria-label="계산 결과의 숫자" value="${value}">`:results[i],'practice-result');
  }
  for(const row of [2,3,4])html+=cell(largeColumn,row,large,'practice-unit')+cell(smallColumn,row,small,'practice-unit');
  html+=cell(1,3,model.operation)+`<div class="practice-rule" style="grid-column:1/${columns+1};grid-row:4"></div>`;
  root.querySelector('.column-grid-host').innerHTML=`<div class="practice-grid" style="--practice-columns:${columns}">${html}</div>`;
  root.querySelector('.column-message').textContent=task?guide(task):data.optional?'세로셈을 완성했어요. 문제의 빈칸에 답을 써 주세요.':'세로셈을 완성했어요. 정답 확인을 누르세요.';
  root.querySelector('[data-column="check"]').disabled=locked||!task||task.kind==='strike';root.querySelector('[data-column="reset"]').disabled=locked;
  root.querySelectorAll('[data-strike],[data-strike-note]').forEach(el=>el.onclick=()=>{if(locked||!task)return;active=true;if(task.kind!=='strike'){root.querySelector('.column-step-input')?.focus({preventScroll:true});return;}const note=el.hasAttribute('data-strike-note'),index=Number(note?el.dataset.strikeNote:el.dataset.strike);if(index===task.index&&note===(task.target==='note')){if(note)noteHistory[index].at(-1).struck=true;else struck.add(index);advance();}else{el.classList.add('column-error');onWrong();}});
  const input=root.querySelector('.column-step-input');if(input){active=true;input.onfocus=()=>{active=true;};input.oninput=()=>{value=input.value.replace(/\D/g,'').slice(0,task.kind==='note'?2:1);input.value=value;input.classList.remove('column-error');needsCorrection=false;cue();};input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();check();}if(e.key==='Tab'){e.preventDefault();check();}};}cue();
 }
 function cue(){const input=root.querySelector('.column-step-input'),button=root.querySelector('[data-column="check"]'),task=tasks[step],ready=!!value&&!needsCorrection&&!locked;input?.classList.toggle('column-target',!ready&&!locked);button.classList.toggle('column-target',!!task&&task.kind!=='strike'&&ready);}
 function advance(){value='';needsCorrection=false;step++;draw();if(step>=tasks.length){active=false;const amount=Number(results.join(''));onComplete({large:Math.floor(amount/1000),small:amount%1000});}else{active=true;root.querySelector('.column-step-input')?.focus({preventScroll:true});}}
 function check(){if(locked)return;const task=tasks[step];if(!task||task.kind==='strike')return;if(!value)return;if(value!==task.answer){root.querySelector('.column-step-input')?.classList.add('column-error');root.querySelector('.column-message').textContent='이 칸을 다시 생각해 보세요.';needsCorrection=true;cue();onWrong();return;}
  if(task.kind==='note')noteHistory[task.index].push({value,struck:false});else results[task.index]=value;advance();
 }
 const controller={isActive:()=>active&&step<tasks.length&&!locked&&(!data.optional||root.closest('details')?.open),activate:()=>{active=true;},deactivate:()=>{active=false;},complete:()=>step>=tasks.length,disable:()=>{locked=true;active=false;draw();},key:k=>{if(locked)return;const task=tasks[step];if(!task||task.kind==='strike')return;if(k==='tab'){check();return;}if(k==='clear')value='';else if(k==='back')value=value.slice(0,-1);else if(/^\d$/.test(k))value=(value+k).slice(-(task.kind==='note'?2:1));const input=root.querySelector('.column-step-input');if(input){input.value=value;input.classList.remove('column-error');needsCorrection=false;cue();}},reset:()=>{if(locked)return;step=0;value='';active=false;needsCorrection=false;struck.clear();noteHistory.forEach(x=>x.splice(0));results.fill('');draw();onComplete(null);}};
 root.querySelector('[data-column="check"]').onclick=check;root.querySelector('[data-column="reset"]').onclick=()=>controller.reset();draw();return controller;
}

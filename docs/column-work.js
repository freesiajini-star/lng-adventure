import {columnSteps} from './column-calculation.js?v=217cb952ba44';
export function columnMarkup(){return '<section class="column-work" aria-label="격자 세로셈 풀이"><h2>세로셈으로 풀어보기</h2><div class="column-grid-host"></div><p class="column-message" aria-live="polite"></p><div class="column-controls"><button data-column="play" type="button">풀이 시작</button><button data-column="step" type="button">한 단계씩</button><button data-column="reset" type="button">처음부터</button></div></section>';}
export function mountColumn(root,data){
 if(!root)return;const model=columnSteps(data.a,data.b,data.operation);let index=-1,timer=null;
 const stop=()=>{clearTimeout(timer);timer=null;root.querySelector('[data-column="play"]').textContent='풀이 시작';};
 const cell=(c,r,html,cls='')=>`<div class="column-cell ${cls}" style="grid-column:${c};grid-row:${r}">${html}</div>`;
 function draw(){const step=model.steps[index],length=model.length,top=model.top,bottom=model.bottom,notes=step?.notes||Array(length).fill(null),changed=step?.changed||Array(length).fill(false),result=step?.result||Array(length).fill(null);let html='';
  html+=`<div class="column-unit" style="grid-column:2/${length-1};grid-row:1">L</div><div class="column-unit" style="grid-column:${length-1}/${length+2};grid-row:1">mL</div>`;
  for(let i=0;i<length;i++){
   const c=i+2,edge=i===length-3?'unit-edge':'';
   html+=cell(c,2,notes[i]===null?'':`<span class="column-note">${notes[i]}</span>`,edge);
   html+=cell(c,3,`<span class="${changed[i]?'borrowed-digit':''}">${top[i]}</span>`,edge+(step?.focus===i?' current-digit':''));
   html+=cell(c,4,bottom[i],edge);
   html+=cell(c,5,result[i]===null?'':result[i],edge+' result-digit');
  }
  html+=cell(1,4,model.operation)+`<div class="column-rule" style="grid-column:1/${length+2};grid-row:5"></div>`;
  root.querySelector('.column-grid-host').innerHTML=`<div class="column-grid" style="--columns:${length+1}">${html}</div>`;
  root.querySelector('.column-message').textContent=step?.message||'오른쪽 mL 자리부터 차례로 계산해요.';
  root.querySelector('[data-column="step"]').disabled=index>=model.steps.length-1;
 }
 const advance=()=>{if(!root.isConnected){stop();return;}if(index<model.steps.length-1){index++;draw();}else stop();};
 root.querySelector('[data-column="step"]').onclick=()=>{stop();advance();};root.querySelector('[data-column="reset"]').onclick=()=>{stop();index=-1;draw();};root.querySelector('[data-column="play"]').onclick=()=>{if(timer){stop();return;}if(index>=model.steps.length-1)index=-1;const tick=()=>{advance();if(index<model.steps.length-1&&root.isConnected){timer=setTimeout(tick,1100);root.querySelector('[data-column="play"]').textContent='잠깐 멈춤';}else stop();};tick();};draw();
}

import {artImage,objectArtwork} from './art-catalog.js?v=fc046b738e6e';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tx=(x,y,s,size=16)=>`<text x="${x}" y="${y}" text-anchor="middle" font-family="Malgun Gothic,sans-serif" font-size="${size}" fill="var(--stage-ink,#304f4b)">${esc(s)}</text>`;
const svg=(w,h,c,label)=>`<svg class="refined-scene" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">${c}</svg>`;
export function renderPlateDial(v){
 const illustrated=!!v.label,cx=145.5,cy=253.5,r=62,point=(n,rad)=>{const a=(-135+n/v.max*270)*Math.PI/180;return [cx+rad*Math.sin(a),cy-rad*Math.cos(a)];};
 let c=artImage('dialScaleBody',0,74,300,300);
 const major=v.step*Math.max(1,Math.round(v.max/v.step/6));
 for(let n=0;n<=v.max;n+=v.step){const big=n%major===0||n===v.max,p=point(n,big?r-12:r-6),q=point(n,r);c+=`<path d="M${p}L${q}" stroke="#314f46" stroke-width="${big?1.6:.8}"/>`;if(big){const a=point(n,r-22);c+=tx(a[0],a[1]+3,n,9);}}
 const p=point(v.value,r-13);c+=tx(cx,cy+34,'g',13)+`<path d="M${cx} ${cy}L${p}" stroke="#bf4037" stroke-width="2.8" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="4" fill="#b98444"/>`;
 if(illustrated){c+=(v.label==='감 바구니'?artImage('persimmon',91,3,114,105):objectArtwork(v.label,91,3,105)||'')+tx(149,395,v.label,17);
  const lo=Math.max(0,v.value-2*v.step),hi=Math.min(v.max,v.value+2*v.step),yy=n=>314-(n-lo)/(hi-lo)*125;
  c+='<rect x="302" y="167" width="111" height="175" rx="16" fill="var(--stage-panel,#fffdf6)" stroke="var(--stage-edge,#a3b9ac)"/>';
  for(let n=lo;n<=hi;n+=v.step)c+=`<path d="M310 ${yy(n)}h20" stroke="#41695d" stroke-width="${n%(v.step*2)===0?2:1}"/>`+(n%(v.step*2)===0?tx(371,yy(n)+5,n,15):'');
  c+=`<path d="M298 ${yy(v.value)}h36" stroke="#bf4037" stroke-width="2.5"/>`+tx(357,365,'확대 눈금 · g',14);
 }
 return svg(illustrated?425:300,illustrated?410:380,c,'물건을 올리는 금속 접시가 연결된 눈금저울'+(illustrated?' · '+v.label:''));
}
export function renderSumDifference(v){
 const unit=v.unit||'mL',start=155,full=385,b=full*v.values[0]/v.values[1],d=full-b;
 const gel=(x,y,width,fill)=>`<g class="jelly-bar"><rect x="${x}" y="${y+4}" width="${width}" height="44" rx="15" fill="#344b6720"/><rect x="${x}" y="${y}" width="${width}" height="44" rx="15" fill="url(#${fill})" stroke="var(--stage-ink,#549d9e)" stroke-width="1.5"/><rect x="${x+8}" y="${y+4}" width="${Math.max(2,width-16)}" height="13" rx="7" fill="url(#bar-gloss)"/><path d="M${x+10} ${y+31}Q${x+width/2} ${y+43} ${x+width-10} ${y+31}" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="2"/></g>`;
 return svg(660,235,`<defs><linearGradient id="bar-equal" x2="0" y2="1"><stop stop-color="var(--diagram-main-top,#c4ffff)"/><stop offset=".45" stop-color="var(--diagram-main-mid,#6ed4d0)"/><stop offset="1" stop-color="var(--diagram-main-bottom,#62b4bc)"/></linearGradient><linearGradient id="bar-difference" x2="0" y2="1"><stop stop-color="var(--diagram-extra-top,#fff0bb)"/><stop offset=".45" stop-color="var(--diagram-extra-mid,#ffd27a)"/><stop offset="1" stop-color="var(--diagram-extra-bottom,#e9af60)"/></linearGradient><linearGradient id="bar-gloss" x2="0" y2="1"><stop stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>`+
 tx(80,69,v.labels[0],18)+tx(80,140,v.labels[1],18)+gel(start,39,b,'bar-equal')+gel(start,110,full,'bar-difference')+gel(start,110,b,'bar-equal')+
 tx(start+b/2,68,'?',23)+tx(start+b/2,139,'?',23)+`<path d="M${start+b} 164v9h${d}v-9" fill="none" stroke="var(--stage-ink,#9d7d49)" stroke-width="1.6"/>`+tx(start+b+d/2,197,'차이 '+v.diff+' '+unit,16)+tx(330,225,'전체 '+v.total+' '+unit,18),'두 양의 전체와 차이를 나타낸 모형. 같은 색 부분의 양은 같습니다.');
}
export function renderFlowScene(v){
 const entries=v.inlets||[v.inflow],tank=v.container==='수조',rate=n=>typeof n==='number'||n==='?'?n+' mL / 초':n;
 let c=artImage(tank?'emptyAquarium':'pitcher-empty',tank?115:165,115,tank?375:275,220);
 c+='<defs><linearGradient id="falling-water" x1="0" x2="1"><stop stop-color="#399eb6"/><stop offset=".4" stop-color="#c4f1f6"/><stop offset="1" stop-color="#58b8cd"/></linearGradient><linearGradient id="flow-direction" x1="0" y1="0" x2="0" y2="1"><stop stop-color="var(--diagram-main-top,#a7dcd9)"/><stop offset="1" stop-color="var(--diagram-main-bottom,#4f9296)"/></linearGradient></defs>';
 // Show water partway through filling, without changing the initial condition.
 const surface=tank?260:271;
 c+=tank?'<g class="collected-water" data-surface="260"><path d="M220 260L367 271L397 247V280L367 298L220 286Z" fill="#80d4e5" fill-opacity=".6"/><path d="M220 260L252 239L397 247L367 271Z" fill="#b2ebf2" fill-opacity=".85" stroke="#5fb8cd"/></g>':'<g class="collected-water" data-surface="271"><path d="M255 271H369L364 294Q312 325 260 296Z" fill="#80d4e5" fill-opacity=".6"/><ellipse cx="312" cy="271" rx="57" ry="8" fill="#b2ebf2" fill-opacity=".85" stroke="#5fb8cd"/></g>';
 // Face the two spouts inward, directly above the neck. Water falls vertically;
 // its path must never be bent to compensate for a misplaced faucet.
 entries.forEach((n,i)=>{const pair=entries.length===2,left=pair&&i===0,x=pair?(left?204:304):299,spout=left?293:315,end=surface,faucet=artImage('tap',x,30,100,85);
  c+=(left?`<g transform="translate(${2*x+100} 0) scale(-1 1)">${faucet}</g>`:faucet)+`<path class="falling-water" data-x="${pair?spout:310}" d="M${pair?spout:310} 105V${end}" fill="none" stroke="#52b5cc" stroke-width="7" stroke-linecap="round"/><path d="M${(pair?spout:310)-1} 108V${end-3}" stroke="#e6fcff" stroke-opacity=".75" stroke-width="1.2"/>`+tx(pair?(i?430:190):310,22,(pair?(i?'나':'가')+' 수도 · ':'수도 · ')+rate(n),17);
 });
 if(v.outflow)c+=`<g class="flow-direction-arrow" transform="translate(425 270)"><path d="M0-5H61V-13L82 0L61 13V5H0Z" fill="url(#flow-direction)" stroke="var(--stage-ink,#54888c)" stroke-width="1" stroke-linejoin="round"/><path d="M4-3H59" stroke="#e2f6f0" stroke-width="1.4" stroke-linecap="round"/></g>`+tx(540,319,'나가는 양',15)+tx(540,342,rate(v.outflow),16);
 const capacity=v.capacity?Math.floor(v.capacity/1000)+' L'+(v.capacity%1000?' '+v.capacity%1000+' mL':''):'';
 c+=tx(310,367,'물 받는 중 · '+(v.initial?'처음 물 '+v.initial+' mL · ':'처음 빈 ')+v.container+(capacity?' · 들이 '+capacity:''),17);
 return svg(660,385,c,entries.length+'개의 수도와 '+v.container+'에 들어오고 나가는 물의 양');
}

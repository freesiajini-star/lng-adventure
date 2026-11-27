import {renderCalibratedTanks} from './calibrated-tanks.js?v=5bbe875fd0e2';
import {artImage,objectArtwork} from './art-catalog.js?v=5bbe875fd0e2';
import {sourceDefs} from './source-vessels.js?v=5bbe875fd0e2';
const tx=(x,y,s,size=16)=>`<text x="${x}" y="${y}" text-anchor="middle" font-family="Malgun Gothic,sans-serif" font-size="${size}" fill="var(--stage-ink,#304f4b)">${s}</text>`;
function produce(label){const painted=objectArtwork(label,0,0);if(painted)return painted;
 if(label==='볼펜')return '<path d="M5 23 22 3" stroke="#698da6" stroke-width="6" stroke-linecap="round"/><path d="M5 23 1 28 8 25" fill="#7b858d"/><path d="M15 3 24 10" stroke="#b3cbd5" stroke-width="6"/><path d="M10 15 18 6" stroke="#e7f3f7" stroke-width="1.5"/><path d="M19 1 25 6" stroke="#52778d" stroke-width="3"/>';
 if(label==='필통')return '<rect x="-2" y="3" width="32" height="24" rx="7" fill="#9ab8d0" stroke="#6f92ad" stroke-width="1.3"/><path d="M1 9H27" stroke="#dcebf0" stroke-width="2"/><path d="M5 9V14" stroke="#708da3" stroke-width="2"/><circle cx="5" cy="15" r="2" fill="#dcebf0"/><path d="M2 19h25" stroke="#8cacc2"/>';
 if(label==='지우개')return '<path d="M0 6 8 0H29V20L21 27H0Z" fill="#e7a9b8" stroke="#ae8091"/><path d="M0 6H21L29 0M21 6V27" fill="none" stroke="#f9d7dd"/><path d="M0 13H21V25H0Z" fill="#f5e9dc"/><path d="M4 18H15" stroke="#d6c4b8"/>';

 const color={'사과':'#df8a83','배':'#d9c58b','감자':'#cbb184','고구마':'#b47c94','당근':'#e7a05b','귤':'#ecb660','방울토마토':'#df8a83'}[label];if(!color)return null;
 const shape=label==='당근'?'<path d="M4 3Q13-5 22 3L9 25Q3 23 4 3Z"/>':label==='고구마'?'<path d="M2 15Q5-1 18 1Q30 4 20 20Q5 31 2 15Z"/>':label==='배'?'<path d="M9 1H16Q16 7 21 12Q31 29 12 29T3 12Q9 7 9 1Z"/>':label==='감자'?'<path d="M1 13Q-1 1 13 0Q28-1 26 15Q26 27 12 26Q0 27 1 13Z"/>':'<path d="M13 4Q0-3 0 12Q0 28 13 27Q28 27 27 12Q27-3 13 4Z"/>';
 return `<g fill="${color}" stroke="#8e8e70" stroke-width="1">${shape}</g><path d="M7 8Q3 13 7 19" fill="none" stroke="#fff9" stroke-width="2.5" stroke-linecap="round"/>${label==='감자'?'<g fill="#a58d68"><circle cx="17" cy="8" r="1.2"/><circle cx="10" cy="19" r="1"/><circle cx="22" cy="17" r="1"/></g>':'<path d="M13 4V-3Q22-10 23-3Q20 2 13-1" fill="#92b578" stroke="#6e965e"/>'}`;
}
export function balanceObjectScale(v){
 const counts={};for(const item of v.items)for(const [name,count]of [[item.left,item.leftCount],[item.right,item.rightCount]])counts[name]=Math.max(counts[name]||0,count);
 return Object.fromEntries(Object.entries(counts).map(([name,count])=>[name,Math.max(1.15,Math.min(2.4,3.3/Math.sqrt(count)))]));
}
export function renderBalances(v,object){
 const sizes=v.objectSizes||balanceObjectScale(v);
 if(v.items.length>1)return '<div class="balance-pair">'+v.items.map(item=>renderBalances({...v,items:[item],objectSizes:sizes},object)).join('')+'</div>';
 let out=sourceDefs()+`<defs><linearGradient id="balance-arm" x2="0" y2="1"><stop stop-color="#fff4c6"/><stop offset=".35" stop-color="#d3b274"/><stop offset=".7" stop-color="#a17b40"/><stop offset="1" stop-color="#f4dba0"/></linearGradient><radialGradient id="balance-shadow"><stop stop-color="#463322" stop-opacity=".32"/><stop offset=".55" stop-color="#5b4732" stop-opacity=".14"/><stop offset="1" stop-color="#5b4732" stop-opacity="0"/></radialGradient></defs>`;
 v.items.forEach((item,index)=>{
  const x=index*360,delta=Math.sign(item.rightMass-item.leftMass)*15,left=70-delta,right=70+delta;
  out+=`<g transform="translate(${x} 0)"><ellipse cx="180" cy="232" rx="66" ry="10" fill="url(#balance-shadow)"/>${artImage('balanceBase',105,38,150,216).replace('xMidYMid meet','none')}<path d="M65 ${left}L295 ${right}" stroke="#9b7941" stroke-width="10" stroke-linecap="round"/><path d="M65 ${left-1}L295 ${right-1}" stroke="url(#balance-arm)" stroke-width="7" stroke-linecap="round"/><path d="M65 ${left-3}L295 ${right-3}" stroke="#fff3cd" stroke-width="1.5" stroke-linecap="round"/><circle cx="180" cy="70" r="10" fill="url(#balance-arm)" stroke="#997942"/><circle cx="180" cy="70" r="4" fill="#8b6a35"/>`;
  for(const[cx,cy,label,count]of[[65,left,item.left,item.leftCount],[295,right,item.right,item.rightCount]]){
   out+=`<g class="balance-suspension"><path d="M${cx} ${cy+5}L${cx-47} ${cy+96}M${cx} ${cy+5}L${cx+47} ${cy+96}" stroke="#9b885f" stroke-width="2.6" fill="none"/><path d="M${cx} ${cy+5}L${cx-46} ${cy+95}M${cx} ${cy+5}L${cx+46} ${cy+95}" stroke="#fff0c7" stroke-width=".8" fill="none"/><circle cx="${cx}" cy="${cy}" r="4" fill="url(#balance-arm)" stroke="#977441"/></g>`;
   // Paint the bowl before the objects; the rim never covers their silhouettes.
   out+=artImage('balancePan',cx-56,cy+52,112,83).replace('xMidYMid meet','none');
   const cols=Math.min(count,3),scale=sizes[label],spacing=Math.max(14,Math.min(31,(104-36*scale)/Math.max(1,cols-1)));
   for(let n=count-1;n>=0;n--){const row=Math.floor(n/cols),length=Math.min(cols,count-row*cols),ox=cx+(n%cols-(length-1)/2)*spacing-14*scale,oy=cy+92-31*scale-row*25*scale;out+=`<g data-object="${label}" data-object-size="${scale}" transform="translate(${ox} ${oy}) scale(${scale})">${produce(label)||object(0,0,label)}</g>`;}
   out+=tx(cx,cy+130,label+' '+count+'개',16);
  }
  out+='</g>';
 });return `<svg viewBox="0 0 ${v.items.length*360} 270" role="img" aria-label="양팔저울의 내려간 쪽이 더 무겁고, 수평인 양쪽은 무게가 같습니다">${out}</svg>`;
}
export function renderEqualTanks(v){return renderCalibratedTanks(v);}

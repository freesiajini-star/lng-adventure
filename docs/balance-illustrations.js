import {artImage,objectArtwork} from './art-catalog.js?v=144680e2030b';
import {sourceDefs} from './source-vessels.js?v=144680e2030b';
const tx=(x,y,s,size=16)=>`<text x="${x}" y="${y}" text-anchor="middle" font-family="Malgun Gothic,sans-serif" font-size="${size}" fill="var(--stage-ink,#304f4b)">${s}</text>`;
function produce(label){const painted=objectArtwork(label,0,0);if(painted)return painted;
 if(label==='볼펜')return '<path d="M5 23 22 3" stroke="#698da6" stroke-width="6" stroke-linecap="round"/><path d="M5 23 1 28 8 25" fill="#7b858d"/><path d="M15 3 24 10" stroke="#b3cbd5" stroke-width="6"/><path d="M10 15 18 6" stroke="#e7f3f7" stroke-width="1.5"/><path d="M19 1 25 6" stroke="#52778d" stroke-width="3"/>';
 if(label==='필통')return '<rect x="-2" y="3" width="32" height="24" rx="7" fill="#9ab8d0" stroke="#6f92ad" stroke-width="1.3"/><path d="M1 9H27" stroke="#dcebf0" stroke-width="2"/><path d="M5 9V14" stroke="#708da3" stroke-width="2"/><circle cx="5" cy="15" r="2" fill="#dcebf0"/><path d="M2 19h25" stroke="#8cacc2"/>';
 if(label==='지우개')return '<path d="M0 6 8 0H29V20L21 27H0Z" fill="#e7a9b8" stroke="#ae8091"/><path d="M0 6H21L29 0M21 6V27" fill="none" stroke="#f9d7dd"/><path d="M0 13H21V25H0Z" fill="#f5e9dc"/><path d="M4 18H15" stroke="#d6c4b8"/>';

 const color={'사과':'#df8a83','배':'#d9c58b','감자':'#cbb184','고구마':'#b47c94','당근':'#e7a05b','귤':'#ecb660','방울토마토':'#df8a83'}[label];if(!color)return null;
 const shape=label==='당근'?'<path d="M4 3Q13-5 22 3L9 25Q3 23 4 3Z"/>':label==='고구마'?'<path d="M2 15Q5-1 18 1Q30 4 20 20Q5 31 2 15Z"/>':label==='배'?'<path d="M9 1H16Q16 7 21 12Q31 29 12 29T3 12Q9 7 9 1Z"/>':label==='감자'?'<path d="M1 13Q-1 1 13 0Q28-1 26 15Q26 27 12 26Q0 27 1 13Z"/>':'<path d="M13 4Q0-3 0 12Q0 28 13 27Q28 27 27 12Q27-3 13 4Z"/>';
 return `<g fill="${color}" stroke="#8e8e70" stroke-width="1">${shape}</g><path d="M7 8Q3 13 7 19" fill="none" stroke="#fff9" stroke-width="2.5" stroke-linecap="round"/>${label==='감자'?'<g fill="#a58d68"><circle cx="17" cy="8" r="1.2"/><circle cx="10" cy="19" r="1"/><circle cx="22" cy="17" r="1"/></g>':'<path d="M13 4V-3Q22-10 23-3Q20 2 13-1" fill="#92b578" stroke="#6e965e"/>'}`;
}
export function renderBalances(v,object){
 let out=sourceDefs();v.items.forEach((item,index)=>{
  const x=index*360,delta=Math.sign(item.rightMass-item.leftMass)*15,left=70-delta,right=70+delta;
  out+=`<g transform="translate(${x} 0)"><ellipse cx="180" cy="230" rx="75" ry="8" fill="#758f8c" opacity=".13"/>${artImage('balanceBase',105,38,150,216).replace('xMidYMid meet','none')}<path d="M65 ${left}L295 ${right}" stroke="#91a9ad" stroke-width="10" stroke-linecap="round"/><path d="M65 ${left-2}L295 ${right-2}" stroke="#dce8e9" stroke-width="2"/><circle cx="180" cy="70" r="9" fill="#b8c8cb" stroke="#7b949a"/><circle cx="180" cy="70" r="3" fill="#738e96"/>`;
  for(const[cx,cy,label,count]of[[65,left,item.left,item.leftCount],[295,right,item.right,item.rightCount]]){
   out+=`<path d="M${cx} ${cy}L${cx-47} ${cy+83}M${cx} ${cy}L${cx+47} ${cy+83}" stroke="#8da5a7" stroke-width="2" fill="none"/><path d="M${cx-50} ${cy+83}Q${cx} ${cy+108} ${cx+50} ${cy+83}Z" fill="#dac9a1" stroke="#a49778" stroke-width="2"/><path d="M${cx-47} ${cy+84}Q${cx} ${cy+91} ${cx+47} ${cy+84}" fill="none" stroke="#fff9" stroke-width="2"/>`;
   const cols=Math.min(count,4),spacing=count===1?0:count===2?44:count===3?32:24,scale=Math.max(v.objectScale===2?1.24:0,count===1?2.5:count===2?1.6:count===3?1.18:.95);
   for(let n=0;n<count;n++){const row=Math.floor(n/cols),length=Math.min(cols,count-row*cols),ox=cx-(length-1)*spacing/2+(n%cols)*spacing-13*scale,oy=cy+81-28*scale-row*23*scale;out+=`<g transform="translate(${ox} ${oy}) scale(${scale})">${produce(label)||object(0,0,label)}</g>`;}
   out+=tx(cx,cy+130,label+' '+count+'개',16);
  }
  out+='</g>';
 });return `<svg viewBox="0 0 ${v.items.length*360} 270" role="img" aria-label="양팔저울의 내려간 쪽이 더 무겁고, 수평인 양쪽은 무게가 같습니다">${out}</svg>`;
}
export function renderEqualTanks(v){let out=sourceDefs();v.values.forEach((value,i)=>{const x=110+i*330,top=45,bottom=235,h=190,y=bottom-h*value/v.max;out+=`<path d="M${x-65} ${top}l20-14h130v190l-20 14h-130Z" fill="url(#sv-glass)" stroke="#78aab9" stroke-width="2"/><path d="M${x-63} ${y}h126v${bottom-y-2}h-126Z" fill="url(#sv-water)" opacity=".8"/><path d="M${x-65} ${top}h130l20-14m-20 14v190m-110-204v190h130" fill="none" stroke="#8db2bc"/><path d="M${x-55} 55V223" stroke="white" stroke-width="4"/>`;for(let n=0;n<=v.max;n+=100){const yy=bottom-h*n/v.max;out+=`<path d="M${x+(n%500===0?24:45)} ${yy}H${x+63}" stroke="${n%500===0?'#315562':'#8faab2'}" stroke-width="${n%500===0?2.8:1}"/>`+(n%500===0?tx(x+102,yy+5,n,13):'');}out+=tx(x+102,24,'mL',14)+tx(x,267,v.labels[i]+' 수조',18);});return `<svg viewBox="0 0 620 288" role="img" aria-label="같은 눈금의 두 수조에 담긴 물의 양">${out}</svg>`;}

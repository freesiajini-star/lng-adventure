import {artImage} from './art-catalog.js?v=c3242010be6a';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderElectronicWeighing({label,art,count,total,container,containerArt,one=200}){
 const box=container==='상자',size=(box?50:Math.min(110,Math.max(46,85*Math.cbrt(one/200))))*(label==='딸기'?1.1:1),cols=Math.min(3,count),rows=Math.ceil(count/cols);
 let content=artImage('kitchenScale',95,65,370,175);
 if(container)content+=artImage(containerArt||(box?'carrier-11':'plate'),135,box?10:43,290,135);
 for(let row=rows-1;row>=0;row--){const length=Math.min(cols,count-row*cols),step=box?40:Math.min(75,size*.62);for(let j=0;j<length;j++){const x=280+(j-(length-1)/2)*step-size/2,y=box?(rows===1?35:75-row*Math.min(28,70/Math.max(1,rows-1))):Math.max(3,150-size-row*size*.36);content+=artImage(art,x,y,size,size);}}
 const description=label+' '+count+'개'+(container?'와 '+container:'');
 content+=`<text x="280" y="244" text-anchor="middle" font-size="17" fill="var(--stage-ink)">${total??'?'} g</text><text x="280" y="266" text-anchor="middle" font-size="13" fill="var(--stage-ink)">${esc(description)}</text>`;
 return `<svg class="electronic-weighing" viewBox="140 0 280 280" role="img" aria-label="${esc(description)}를 전자저울에 올린 모습">${content}</svg>`;
}

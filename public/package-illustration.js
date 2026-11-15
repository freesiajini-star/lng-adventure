import {artImage,objectArtwork} from './art-catalog.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderPackage(v){
 const width=560,boxed=Boolean(v.box||v.unknownBox),count=v.items||1,cols=Math.min(4,count),size=count<=3?85:65;
 let out=artImage('kitchenScale',95,70,370,175);
 if(boxed)out+=artImage('carrier-11',135,5,290,155);
 for(let i=0;i<count;i++){const row=Math.floor(i/cols),length=Math.min(cols,count-row*cols),x=280+(i%cols-(length-1)/2)*(count<=3?65:52)-size/2,y=(boxed?55:70)-row*40;out+=objectArtwork(v.label,x,y,size)||'';}
 out+=`<rect x="210" y="193" width="140" height="30" rx="5" fill="#edf3df" stroke="#657d69"/><text x="280" y="215" text-anchor="middle" font-size="21" fill="#304f4b">${v.total??'?'} g</text><text x="280" y="263" text-anchor="middle" font-size="15" fill="#304f4b">${esc(v.label)} ${count}개${boxed?'와 상자':''}</text>`;
 return `<svg viewBox="0 0 ${width} 280" role="img" aria-label="${esc(v.label)} ${count}개${boxed?'와 상자':''}를 디지털 저울에 올린 모습">${out}</svg>`;
}

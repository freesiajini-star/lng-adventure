import {CARGO_ART_BOUNDS} from './cargo-art-bounds.js?v=3ad8e58aefce';
const cache=new Map();
export function normalizeCarrierImages(root){
 const specs=Object.values(CARGO_ART_BOUNDS),wide=Math.max(...specs.map(s=>s[4]/Math.sqrt(s[6]))),tall=Math.max(...specs.map(s=>s[5]/Math.sqrt(s[6])));
 for(const svg of root.querySelectorAll('.cargo-hero')){const box=svg.viewBox.baseVal,spec=specs.find(s=>s[2]===box.x&&s[3]===box.y&&s[4]===box.width&&s[5]===box.height);if(!spec)continue;const room=Math.max(90,svg.parentElement.parentElement.clientWidth),unit=Math.min(Math.sqrt(24000),room/wide,(innerWidth<=700?210:260)/tall),scale=unit/Math.sqrt(spec[6]);svg.style.width=spec[4]*scale+'px';svg.style.height=spec[5]*scale+'px';svg.dataset.inkArea=unit*unit;}

 for(const img of root.querySelectorAll('img[data-normalize-area]')){
  const apply=async()=>{try{await img.decode();let fraction=cache.get(img.src);if(!fraction){const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const c=canvas.getContext('2d',{willReadFrequently:true});c.drawImage(img,0,0,128,128);const data=c.getImageData(0,0,128,128).data;let count=0;for(let i=0;i<data.length;i+=4)if(data[i+3]>32&&Math.min(data[i],data[i+1],data[i+2])<246)count++;fraction=Math.max(.06,count/(128*128));cache.set(img.src,fraction);}const box=img.closest('[data-worksheet-stage]'),extra=box?.dataset.worksheetStage==='14'&&box.dataset.type==='4'?(fraction<.32?2:1.5):1;img.dataset.sizeMultiplier=extra;img.style.setProperty('--ink-size',Math.min(260,Number(img.dataset.normalizeArea)/Math.sqrt(fraction))*extra+'px');}catch{}};apply();
 }
}

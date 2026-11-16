const cache=new Map();
export function normalizeCarrierImages(root){
 for(const img of root.querySelectorAll('img[data-normalize-area]')){
  const apply=async()=>{try{await img.decode();let fraction=cache.get(img.src);if(!fraction){const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const c=canvas.getContext('2d',{willReadFrequently:true});c.drawImage(img,0,0,128,128);const data=c.getImageData(0,0,128,128).data;let count=0;for(let i=0;i<data.length;i+=4)if(data[i+3]>32&&Math.min(data[i],data[i+1],data[i+2])<246)count++;fraction=Math.max(.06,count/(128*128));cache.set(img.src,fraction);}const box=img.closest('[data-worksheet-stage]'),extra=box?.dataset.worksheetStage==='14'&&box.dataset.type==='4'?(fraction<.32?2:1.5):1;img.dataset.sizeMultiplier=extra;img.style.setProperty('--ink-size',Math.min(260,Number(img.dataset.normalizeArea)/Math.sqrt(fraction))*extra+'px');}catch{}};apply();
 }
}

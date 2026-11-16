import {artImage} from './art-catalog.js?v=144680e2030b';
const tx=(x,y,s,size=17)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="var(--stage-ink,#304f4b)" font-family="Malgun Gothic,sans-serif">${s}</text>`;
const svg=(w,h,c,label)=>`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">${c}</svg>`;
export function paintedDetails(v){
 if(v.kind==='cacao')return svg(540,250,artImage('cacaoTree',5,0,270,215)+artImage('cacaoPod',310,30,180,145)+tx(140,237,'나무 한 그루에서 약 '+v.count+'개 수확')+tx(400,210,'카카오 열매 한 개 '+v.one+' g'),'카카오나무와 수확한 열매의 정보');
 if(v.kind==='rods')return svg(500,245,[{l:2,m:'4 kg'},{l:1,m:'? kg'},{l:3,m:'? kg'}].map((a,i)=>artImage('rod',55,5+i*75,a.l*100,70).replace('xMidYMid meet','none')+tx(75+a.l*48,65+i*75,a.l+' m · '+a.m)).join(''),'굵기와 재질이 같은 막대의 길이와 무게');
 if(v.kind==='substitution')return '<div class="substitution-equations" role="group" aria-label="우유를 빵과 100 g으로 바꿔 생각하는 두 식"><div>'+svg(95,105,artImage('milkCarton',0,0,95,105),'우유')+'<span>=</span>'+svg(100,100,artImage('breadRoll',0,0,100,100),'빵')+'<span>+ 100 g</span></div><div>'+svg(100,100,artImage('breadRoll',0,0,100,100),'빵')+'<span>+</span>'+svg(95,105,artImage('milkCarton',0,0,95,105),'우유')+'<span>= 200 g</span></div></div>';
 if(v.kind==='plateWeighings'||v.kind==='halfBox'){
  const label=v.label||'참외',art=v.objectArt||'koreanMelon',box=v.kind==='halfBox'||v.container==='상자',container=v.container||(box?'상자':'접시'),size=box?48:Math.min(105,Math.max(42,85*Math.cbrt((v.one||300)/200)));
  return '<div class="restored-pair">'+v.counts.map((count,i)=>{
   let content=artImage('kitchenScale',25,75,250,125)+artImage(v.containerArt||(box?'carrier-11':'plate'),45,box?50:70,210,110);
   const cols=box?4:Math.min(3,count),rows=Math.ceil(count/cols);
   for(let row=rows-1;row>=0;row--){const length=Math.min(cols,count-row*cols);for(let j=0;j<length;j++){const step=box?42:Math.min(66,170/Math.max(1,length)),x=150+(j-(length-1)/2)*step-size/2,y=box?48+row*30:Math.max(8,145-size-row*size*.36);content+=artImage(art,x,y,size,size);}}
   content+=tx(150,220,v.totals[i]+' g',21)+tx(150,245,label+' '+count+'개와 '+container,14);
   return svg(300,260,content,'같은 '+container+'와 '+label+' '+count+'개의 전체 무게');
  }).join('')+'</div>';
 }
 if(v.kind==='eggTrays'){let c='';for(let i=0;i<2;i++){const x=15+i*255;c+=artImage('eggTray',x,10,240,160);const count=i===0?4:v.count-4;for(let j=0;j<count;j++)c+=artImage('egg',x+57+j%2*69,34+Math.floor(j/2)*43,55,65);}return svg(540,205,c+tx(270,200,'달걀 '+v.count+'개를 한 판에 '+v.slots+'개씩 담기'),'한 판에 네 개씩 담은 달걀');}
 return null;
}

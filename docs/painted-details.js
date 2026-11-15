import {artImage} from './art-catalog.js?v=740d1adefa5f';
const tx=(x,y,s,size=17)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="#36585c" font-family="Malgun Gothic,sans-serif">${s}</text>`;
const svg=(w,h,c,label)=>`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">${c}</svg>`;
export function paintedDetails(v){
 if(v.kind==='cacao')return svg(540,250,artImage('cacaoTree',5,0,270,215)+artImage('cacaoPod',310,30,180,145)+tx(140,237,'나무 한 그루에서 약 '+v.count+'개 수확')+tx(400,210,'열매 한 개 '+v.one+' g'),'카카오나무와 수확한 열매의 정보');
 if(v.kind==='rods')return svg(500,245,[{l:2,m:'4 kg'},{l:1,m:'? kg'},{l:3,m:'? kg'}].map((a,i)=>artImage('rod',55,5+i*75,a.l*100,70).replace('xMidYMid meet','none')+tx(75+a.l*48,65+i*75,a.l+' m · '+a.m)).join(''),'굵기와 재질이 같은 막대의 길이와 무게');
 if(v.kind==='substitution')return svg(580,230,artImage('milkCarton',30,5,95,105)+tx(155,66,'=')+artImage('breadRoll',190,12,100,90)+tx(375,66,'+ 100 g',24)+artImage('breadRoll',65,120,100,85)+tx(210,175,'+')+artImage('milkCarton',245,111,100,105)+tx(430,175,'= 200 g',24),'우유를 빵과 100 g으로 바꿔 생각하는 두 식');
 if(v.kind==='plateWeighings')return '<div class="restored-pair">'+v.counts.map((count,i)=>svg(300,205,artImage('kitchenScale',25,65,250,125)+artImage('plate',45,42,210,75)+Array.from({length:count},(_,j)=>artImage('berry',108+(j-(count-1)/2)*37,30,44,50)).join('')+`<rect x="100" y="157" width="100" height="27" rx="4" fill="#eff2d9"/>`+tx(150,177,v.totals[i]+' g',21),'같은 접시와 열매 '+count+'개의 전체 무게')).join('')+'</div>';
 if(v.kind==='halfBox')return '<div class="restored-pair">'+v.totals.map((total,i)=>svg(310,210,artImage('carrier-11',35,10,240,140)+Array.from({length:v.counts[i]},(_,j)=>artImage('mandarin',62+j%4*43,30+Math.floor(j/4)*32,48,48)).join('')+tx(155,183,total+' g',23)+tx(155,206,i?'귤 절반이 남은 상자':'귤이 가득한 상자',15),'상자와 남은 귤의 전체 무게')).join('')+'</div>';
 if(v.kind==='eggTrays'){let c='';for(let i=0;i<2;i++){const x=15+i*255;c+=artImage('eggTray',x,10,240,160);const count=i===0?4:v.count-4;for(let j=0;j<count;j++)c+=artImage('egg',x+57+j%2*69,34+Math.floor(j/2)*43,55,65);}return svg(540,205,c+tx(270,200,'달걀 '+v.count+'개를 한 판에 '+v.slots+'개씩 담기'),'한 판에 네 개씩 담은 달걀');}
 return null;
}

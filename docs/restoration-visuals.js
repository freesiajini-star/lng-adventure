import {renderPlateDial,renderFlowScene} from './scene-refinements.js?v=8a281ca2f2b6';
import {renderGuess} from './guess-illustration.js?v=8a281ca2f2b6';
import {paintedVessel,paintedGeometry} from './painted-pour.js?v=8a281ca2f2b6';
import {paintedDetails} from './painted-details.js?v=8a281ca2f2b6';
import {artImage,objectArtwork,vesselArt,VESSEL_IDS} from './art-catalog.js?v=8a281ca2f2b6';
import {renderFillTable} from './fill-table-illustration.js?v=8a281ca2f2b6';
import {renderSourceVessels,renderCupGroups} from './source-vessels.js?v=8a281ca2f2b6';
const e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tx=(x,y,s,size=17)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="var(--stage-ink,#304f4b)" font-family="Malgun Gothic,sans-serif">${e(s)}</text>`;
const wrap=(w,h,c,label)=>`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${e(label)}">${c}</svg>`;
export function restoredObject(x,y,label){const painted=objectArtwork(label,x,y);if(painted)return painted;let c='';
 if(['고구마','감자','당근','무'].includes(label)){const color={고구마:'#af6881',감자:'#d6b77e',당근:'#eea256',무:'#eff0cf'}[label];c=`<ellipse cx="12" cy="13" rx="${label==='당근'||label==='무'?6:11}" ry="10" transform="rotate(35 12 13)" fill="${color}" stroke="#7b8061"/><path d="M16 5l4-6m-4 6 7-2" stroke="#73935d" stroke-width="3"/>`;}
 if(['호박','감','딸기','키위','배추','두부','열매'].includes(label)){c=label==='두부'?'<path d="M1 8l7-6h15v16l-7 6H1z" fill="#f6ecd9" stroke="#a29c8a"/><path d="M1 8h15l7-6M16 8v16" fill="none" stroke="#a29c8a"/>':`<ellipse cx="12" cy="13" rx="11" ry="10" fill="${{호박:'#e8ae57',감:'#edaa5a',딸기:'#df7d80',키위:'#a6bb6c',배추:'#b1ce85',열매:'#a6bb6c'}[label]}" stroke="#6d8b5e"/><path d="M12 3V0m-7 5 7-3 7 3M8 6q-5 9 0 16m8-16q5 9 0 16" fill="none" stroke="#6d8b5e"/>`;}
 if(label==='승용차')c='<path d="M1 12l4-8h13l5 8v9H1z" fill="#e3b95e" stroke="#81734d"/><path d="M7 6h9l3 6H4z" fill="#b5d6dc"/><circle cx="6" cy="21" r="4" fill="#64736e"/><circle cx="19" cy="21" r="4" fill="#64736e"/>';
 if(label==='책가방')c='<rect x="3" y="3" width="19" height="21" rx="6" fill="#e5c36e" stroke="#9a855e"/><path d="M8 3q0-7 9 0M6 13h13v8H6z" fill="none" stroke="#9a855e"/>';
 if(label==='신발')c='<path d="M3 3h7l2 12 10 3v6H2z" fill="#b6c6a0" stroke="#71856a"/><path d="M5 8h6m-5 4h6m-6 4h7" stroke="white"/>';
 if(label==='학용품')c='<rect x="1" y="10" width="23" height="14" rx="2" fill="#b3cbe1" stroke="#6b8799"/><path d="M5 14V1m5 13V2m5 12V0m5 14V3" stroke="#e2b96d" stroke-width="3"/>';
 if(label==='축구공')c='<circle cx="12" cy="12" r="12" fill="#f5f5e5" stroke="#71817f"/><path d="M8 8h8l3 7-7 5-7-5zM8 8 5 3m11 5 4-5m-1 12 5 2M5 15l-5 2m12 3v4" fill="#6d8188" stroke="#6d8188"/>';
 if(label==='공책')c='<rect x="1" y="2" width="23" height="20" rx="2" fill="#efd684" stroke="#9a875f"/><path d="M5 2v20m4-13h11m-11 5h11" stroke="#fff9dc"/>';
 if(label==='라면 국물')c='<ellipse cx="12" cy="10" rx="12" ry="5" fill="#d78d67"/><path d="M0 10q12 27 24 0" fill="#9ab4bc" stroke="#69878b"/><path d="M5 9q4-5 8 0t7 0" stroke="#f0ce85" fill="none"/>';
 if(label==='간장'||label==='식용유')c=`<path d="M8 1h8v5l6 5v13H2V11l6-5z" fill="${label==='간장'?'#947459':'#e4cd70'}" stroke="#8a805f"/><rect x="6" y="13" width="12" height="7" fill="#fff2ca"/>`;
 if(!c)return null;return `<g transform="translate(${x} ${y})">${c}</g>`;
}
function container(label){const id=label==='주전자'?'kettle':label==='작은 컵'?'smallCup':label==='병'?'waterBottle-water-full':label==='원통'?'glass-water-full':VESSEL_IDS[label]?vesselArt(label):null;if(id)return artImage(id,-70,-65,140,130);
 if(label==='주전자')return '<path d="M-31 45q-5-42 31-42t31 42zM22 10l28-18-17 36M-20 4q-6-42 38-18" fill="#bed5d4" stroke="#638a8c" stroke-width="3"/><path d="M-9 2V-6h18v8" fill="#ddac82" stroke="#638a8c"/>';
 if(label==='꽃병')return '<path d="M-17-24h34q-16 24 1 43q28 42-18 43t-18-43q17-19 1-43z" fill="#b2d8e0" stroke="#638a8c" stroke-width="3"/>';
 if(label==='작은 컵'||label==='대접')return '<path d="M-31 5h62l-10 40h-42z" fill="#e8cb80" stroke="#9b8a5b" stroke-width="3"/>';
 if(label==='머그잔')return '<path d="M-25-8h50v53h-50zM25 2q37 0 22 27q-10 12-22 0" fill="#d3b2b9" stroke="#8a737d" stroke-width="3"/>';
 if(label==='원통')return '<rect x="-22" y="-20" width="44" height="66" rx="4" fill="#c9e5e4" stroke="#638a8c" stroke-width="3"/>';
 return '<path d="M-11-28h22v30l16 17v33h-54V19l16-17z" fill="#b7d9e5" stroke="#638a8c" stroke-width="3"/>';
}
const cont=(x,y,label)=>`<g transform="translate(${x} ${y})">${container(label)}</g>`;
const arrow=(x,y)=>`<path d="M${x} ${y}h55m-12-9 12 9-12 9" fill="none" stroke="var(--accent,#8ba59a)" stroke-width="3"/>`;
export function restoredVisual(v,render,object){const painted=paintedDetails(v);if(painted!==null)return painted;
 if(v.kind==='bottleOverflow')return wrap(600,230,'<g transform="translate(95 60) scale(1.4)">'+container('병')+'</g>'+tx(95,155,'물병에 가득')+arrow(170,90)+cont(340,80,'꽃병')+tx(340,175,'꽃병은 가득')+'<path d="M358 60q45-8 45 77" fill="none" stroke="#5cbac8" stroke-width="5"/><ellipse cx="418" cy="151" rx="46" ry="10" fill="#9ad7df"/>'+tx(485,128,'넘친 물',16),'가득 찬 물병의 물을 모두 부어 꽃병이 가득 차고 물이 넘쳤습니다.');
 if(v.kind==='sourceVessels')return renderSourceVessels(v);
 if(v.kind==='bottleCups')return renderCupGroups(v);
 if(v.kind==='cupTable'||v.kind==='fillTable')return renderFillTable(v);
 if(v.kind==='kettleEstimate')return wrap(600,245,cont(75,95,'주전자')+tx(75,178,'가득')+arrow(150,108)+[300,465].map(x=>`<rect x="${x-40}" y="35" width="80" height="150" fill="#eff7f2" stroke="#638a8c"/><rect x="${x-38}" y="110" width="76" height="73" fill="#91d1db"/>${tx(x,25,'1 L 그릇',17)}${tx(x,215,'약 절반',16)}`).join(''),'가득 찬 주전자의 물을 1 L 그릇 두 개에 옮겼더니 각각 약 절반 찼습니다.');
 if(v.kind==='objectCards')return wrap(Math.max(460,v.cards.length*160),195,v.cards.map(([label,amount],i)=>(objectArtwork(label,20+i*160,0,120)||object(50+i*160,20,label))+tx(80+i*160,151,label,16)+tx(80+i*160,180,amount,14)).join(''),'그림의 물건과 주어진 양: '+v.cards.map(x=>x.join(' ')).join(', '));
 if(v.kind==='labeledBottle')return wrap(350,196,artImage(v.reference?.art||'waterBottle-water-full',105,17,140,130)+tx(175,174,v.amount,22),(v.reference?.name||'병')+'의 실제 들이 '+v.amount);
 if(v.kind==='zoomTanks'){const content=v.values.map((value,i)=>{const x=30+i*300,h=150,max=v.max,y=195-h*value/max;let c=`<rect x="${x}" y="45" width="90" height="150" fill="#eef8f3" stroke="#638a8c"/><rect x="${x+2}" y="${y}" width="86" height="${195-y-2}" fill="#91d1db"/>`;for(let n=0;n<=max;n+=v.ticks){const ty=195-h*n/max;c+=`<path d="M${x+70} ${ty}h20" stroke="#527b7c"/>`;if(n%500===0)c+=tx(x+115,ty+4,n,12);}c+=tx(x+45,224,v.labels[i],18)+tx(x+105,25,'mL',14);const lo=Math.max(0,value-200),hi=Math.min(max,value+200);c+=`<rect x="${x+163}" y="38" width="110" height="155" rx="25" fill="var(--stage-panel,#f9fdf9)" stroke="var(--accent,#c183a1)" stroke-width="2"/>`+tx(x+213,25,'확대',14);for(let n=lo;n<=hi;n+=100){const ty=175-(n-lo)/(hi-lo)*115;c+=`<path d="M${x+170} ${ty}h18" stroke="#527b7c"/>`+tx(x+227,ty+4,n,15);}const sy=175-(value-lo)/(hi-lo)*115;c+=`<path d="M${x+163} ${sy}h110" stroke="#4ba8b6" stroke-width="3"/><path d="M${x+90} ${y}L${x+163} ${sy}" stroke="var(--accent,#c183a1)" stroke-dasharray="4 4"/>`;return c;}).join('');return wrap(620,245,content,'수조와 확대 눈금입니다. 작은 한 칸은 100 mL입니다.');}
 if(v.kind==='pairedDials')return `<div class="restored-pair">${v.items.map(item=>render({kind:'illustratedDial',...item})).join('')}</div>`;
 if(v.kind==='illustratedDial')return renderPlateDial(v);
 if(v.kind==='halfBox')return '<div class="restored-pair">'+v.totals.map((total,i)=>wrap(310,190,'<path d="M45 35v65h220V35" fill="#eee1c7" stroke="#a78d68" stroke-width="3"/><rect x="48" y="'+(i?68:38)+'" width="214" height="'+(i?30:60)+'" fill="#e6b16a"/>'+tx(155,80,i?'귤의 절반':'귤 전체',19)+'<path d="M45 105h220l10 53H35z" fill="#c4d6cd" stroke="#719284"/>'+tx(155,139,total+' g',22),'같은 상자와 '+(i?'귤 절반':'귤 전체')+', 전체 '+total+' g')).join('')+'</div>';
 if(v.kind==='cupChange'){
 const max=v.capacity||6000,before=v.before||0,after=v.after||0,g=paintedGeometry('pitcher',max,max),camera=150/((g.profile.at(-1)[0]-g.profile[0][0])*g.scale);
 const vessel=(amount,x,uid)=>paintedVessel('pitcher',max,amount,'물',x,180,camera,uid).markup;
 return wrap(650,235,vessel(before,100,'cup-before')+tx(100,220,'처음 '+before+' mL',14)+tx(218,118,'+',22)+artImage(v.cup?.art||'smallCup',245,65,100,110)+tx(295,220,'가득 '+v.count+'번',14)+arrow(365,115)+vessel(after,540,'cup-after')+tx(540,220,'나중 '+after+' mL',14),'같은 수조에 물을 더 부어 높아진 수위');
 }
 if(v.kind==='eggTrays'){let out='';for(let tray=0;tray<2;tray++){const x=40+tray*250;out+=`<rect x="${x}" y="25" width="210" height="120" rx="12" fill="#e3ddba" stroke="#9b997a"/>`;for(let n=0;n<4;n++){const cx=x+55+(n%2)*100,cy=60+Math.floor(n/2)*55;out+=`<ellipse cx="${cx}" cy="${cy}" rx="27" ry="21" fill="#c9c4a7"/>`;if(tray*4+n<v.count)out+=`<ellipse cx="${cx}" cy="${cy-7}" rx="21" ry="28" fill="#e4b5a1" stroke="#aa8977"/>`;}}return wrap(550,180,out,'네 칸짜리 달걀판에 달걀 다섯 개를 담으면 두 판이 필요합니다.');}
 if(v.kind==='recipe')return '<div class="recipe-visual">'+wrap(240,230,artImage(v.art||'ratatouille',0,0,240,230),v.dish||'라따뚜이')+'<div class="recipe-copy"><p><b>'+e(v.dish||'라따뚜이')+' · '+(v.servings||2)+'인분</b></p><p>'+e(v.liquid||'토마토소스')+' '+(v.cups||2)+'컵</p><p>1컵 = '+(v.cup||200)+' mL</p></div></div>';
 if(v.kind==='cacao')return wrap(540,240,'<path d="M200 210l12-160h20l20 160" fill="#af8c63"/><path d="M222 75L125 45m99 40 100-45m-100 75-90-20m95 15 100-15" stroke="#a18b65" stroke-width="10"/>'+[115,170,255,315].map((x,i)=>`<ellipse cx="${x}" cy="${40+(i%2)*30}" rx="62" ry="26" fill="#a6c18a"/>`).join('')+[175,245,213].map((x,i)=>`<ellipse cx="${x}" cy="${113+i*25}" rx="15" ry="29" transform="rotate(18 ${x} 135)" fill="#bb9272" stroke="#8d715b"/><path d="M${x} ${90+i*25}v45" stroke="#8d715b"/>`).join('')+tx(403,110,'약'+' '+v.count+'개 수확',20)+tx(403,151,'한 개 '+v.one+' g',19)+tx(270,230,'카카오나무와 열매 · 나무 그림은 모형입니다.',15),'카카오나무와 열매입니다. 수확량 약 30개, 열매 한 개 500 g.');
 if(v.kind==='rods')return wrap(500,210,[{l:2,m:'4 kg'},{l:1,m:'? kg'},{l:3,m:'? kg'}].map((a,i)=>`<rect x="70" y="${25+i*60}" width="${a.l*90}" height="25" rx="12" fill="#d6bd9b" stroke="#9d8a6e"/>${tx(70+a.l*45,18+i*60,a.l+' m',15)}${tx(420,45+i*60,a.m,19)}`).join(''),'같은 굵기와 재질의 막대입니다. 길이가 두 배이면 무게도 두 배입니다.');
 if(v.kind==='substitution'){const bread=(x,y)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="28" ry="17" fill="#dbb678" stroke="#9b805c"/><path d="M'+(x-12)+' '+(y-12)+'v15m12-15v15m12-15v15" stroke="#aa8d65"/>';return wrap(600,210,object(90,5,'우유')+tx(160,27,'=',25)+bread(230,20)+tx(350,27,'+ 100 g',22)+bread(100,90)+tx(160,97,'+',25)+object(220,75,'우유')+tx(350,97,'= 200 g',22)+bread(100,165)+tx(160,172,'+',25)+bread(230,165)+tx(390,172,'+ 100 g = 200 g',22),'우유 그림을 빵과 100 g으로 바꾸면 빵 두 개와 100 g이 됩니다.');}
 if(v.kind==='plateWeighings')return '<div class="restored-pair">'+v.counts.map((count,i)=>wrap(300,190,'<ellipse cx="150" cy="80" rx="100" ry="20" fill="#fff6df" stroke="#85988a"/>'+Array.from({length:count},(_,n)=>object(115+n*25,48,'열매')).join('')+'<path d="M75 100h150l15 55H60z" fill="#c4d6cd" stroke="#719284"/>'+tx(150,135,v.totals[i]+' g',22),'같은 접시 위에 열매 '+count+'개, 전체 '+v.totals[i]+' g')).join('')+'</div>';
 if(v.kind==='guessDistance')return renderGuess(v);
 if(false&&v.kind==='guessDistance')return wrap(600,185,tx(300,35,v.actual,18)+v.rows.map(([name,amount],i)=>'<circle cx="'+(100+i*200)+'" cy="90" r="25" fill="#eadac0" stroke="#aa9f84"/>'+tx(100+i*200,96,name,20)+tx(100+i*200,150,amount,20)).join(''),'같은 실제 값에 대한 세 사람의 어림값입니다.');
 if(v.kind==='bathFlow')return renderFlowScene(v);
 return null;
}

import {makeLimitQuestion} from './limit-problems.js?v=30a61c3aa5ff';
import {makeLifeQuestion} from './life-problems.js?v=30a61c3aa5ff';
import {reviseCore} from './core-revisions.js?v=30a61c3aa5ff';
import {makeFillTableQuestion} from './fill-tables.js?v=30a61c3aa5ff';
import {makePourQuestion} from './pour-problems.js?v=30a61c3aa5ff';
// Restores the visual evidence and questions from the user-supplied pages.
export const EXTRA_TYPES={3:['우유갑으로 어림'],4:['그림표와 액체의 들이'],6:['무게는 몇 배'],8:['두 저울 비교'],9:['두 바구니의 무게','한도에 맞게 고르기'],12:['절반을 덜면','접시의 무게'],14:['달걀판은 몇 개'],15:['길이와 무게'],16:['같은 것으로 바꾸기']};
export function restoreQuestion(q,seed=1){
 const s=q.stage,t=q.type;
 const n=(label,answer,unit='')=>({label,answer:String(answer),unit,kind:'number'});
 const c=(label,options,answer)=>({label,options:[...options],answer,kind:'choice'});
 const set=(source,lines,fields,visual,explanation,work=[])=>Object.assign(q,{source,lines,fields,visual,explanation,work,facts:[]});
 const bal=(left,right,leftCount,rightCount,leftMass,rightMass=leftMass)=>({left,right,leftCount,rightCount,leftMass,rightMass});
 if(s===1&&t===0)makePourQuestion(q,seed);
 if(s===1&&t===1){
  let state=seed>>>0;const random=()=>{state+=0x6D2B79F5;let z=state;z=Math.imul(z^z>>>15,z|1);z^=z+Math.imul(z^z>>>7,z|61);return((z^z>>>14)>>>0)/4294967296;};
  const pool=[['주전자',650,950],['작은 컵',150,250],['머그잔',300,450],['물병',400,800],['유리그릇',350,650],['계량컵',450,850],['텀블러',300,600]];
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
  const chosen=pool.slice(0,3),values=[];
  for(const [,lo,hi]of chosen){const options=[];for(let n=lo;n<=hi;n+=50)if(values.every(x=>Math.abs(n-x)>=100))options.push(n);values.push(options[Math.floor(random()*options.length)]??lo);}
  // Retry any rare crowded range with distinct, plausible amounts.
  if(new Set(values).size<3||values.some((x,i)=>values.some((y,j)=>i!==j&&Math.abs(x-y)<100)))return restoreQuestion(q,(seed+1)>>>0);
  const labels=['가','나','다'],sources=chosen.map(x=>x[0]);q.visual={kind:'sourceVessels',sources,values,max:1000,labels,ticks:0};
  q.lines=[sources.join('·')+'에 가득 있던 물을 같은 모양과 크기의 그릇에 각각 옮겼습니다.','남거나 넘친 물은 없습니다.',t===1?'들이가 가장 큰 용기를 고르세요.':'들이가 큰 것부터 차례로 고르세요.'];
  const order=values.map((value,i)=>({value,label:labels[i]})).sort((a,b)=>b.value-a.value).map(x=>x.label);
  q.fields=t===1?[c('가장 큰 용기',labels,order[0])]:order.map((x,i)=>c((i+1)+'번째',labels,x));
  q.explanation='같은 그릇에서는 물높이가 높을수록 들이가 큽니다. 큰 순서는 '+order.join(', ')+'입니다.';
 }
 if(s===1&&t===2){
  let state=seed>>>0;const random=()=>{state+=0x6D2B79F5;let z=state;z=Math.imul(z^z>>>15,z|1);z^=z+Math.imul(z^z>>>7,z|61);return((z^z>>>14)>>>0)/4294967296;};
  const pool=[['주전자',5,8],['물병',3,8],['머그잔',2,4],['유리그릇',3,6],['계량컵',4,8],['텀블러',3,6]];
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
  const groups=pool.slice(0,2).map(([source,lo,hi],i)=>({source,label:['가','나'][i]+' '+source,count:lo+Math.floor(random()*(hi-lo+1))}));
  if(groups[0].count===groups[1].count)return restoreQuestion(q,(seed+1)>>>0);
  const mode=Math.floor(random()*3),larger=groups[0].count>groups[1].count?0:1;
  set('원리116:3',['두 용기에 가득 있던 물을 모양과 크기가 같은 컵에 각각 옮겼습니다.','컵은 모두 가득 찼고, 남거나 넘친 물은 없습니다.',mode===0?'들이가 더 큰 용기를 고르세요.':mode===1?'들이가 더 작은 용기를 고르세요.':'두 용기의 들이는 컵 몇 개만큼 차이 나나요?'],mode===2?[n('차이',Math.abs(groups[0].count-groups[1].count),'개')]:[c(mode===0?'더 큰 용기':'더 작은 용기',groups.map(g=>g.label),groups[mode===0?larger:1-larger].label)],{kind:'bottleCups',groups},'같은 컵을 더 많이 채우는 용기의 들이가 더 큽니다. '+groups.map(g=>g.label+'는 '+g.count+'컵').join(', ')+'입니다.');
 }

 if(s===1&&[3,4,5].includes(t))makeFillTableQuestion(q,seed);
 if(s===3&&t===6)set('원리117:원리3',['200 mL 우유갑의 우유를 꽃병에 한 번 옮겨 담았습니다.','꽃병을 처음부터 가득 채우려면 우유갑 몇 개쯤 필요할까요?'],[c('필요한 우유갑',['약 2개','약 3개','약 4개'],'약 2개'),n('꽃병의 들이는 약',400,'mL')],{kind:'estimate',base:200,value:400,count:2,unit:'mL',label:'꽃병'},'약 2개가 필요하므로 200 × 2 = 약 400 mL입니다.');
 if(s===3&&t===0)set('원리117:11',['물로 가득 찬 주전자를 같은 1 L 그릇 두 개에 남김없이 옮겼습니다.','주전자의 들이는 약 몇 L인가요?'],[c('주전자의 들이',['약 1 L','약 2 L','약 3 L'],'약 1 L')],{kind:'kettleEstimate'},'두 그릇 모두 약 절반씩 찼으므로 약 500 + 500 = 1000 mL, 약 1 L입니다.');
 if(s===5&&(t===1||t===3)){q.visual={kind:'zoomTanks',values:[1700,500],max:2000,ticks:100,labels:['가','나']};q.lines=['그림의 두 수조에 담긴 물의 양을 눈금으로 읽으세요.','가에서 나로 물을 옮겨 두 수조의 물의 양을 같게 하려 합니다.'];q.fields=[n('가 수조',1700,'mL'),n('나 수조',500,'mL'),n('옮길 양',600,'mL')];q.explanation='1700 − 500 = 1200 mL. 차이의 절반인 600 mL를 가에서 나로 옮기면 각각 1100 mL입니다.';q.work=['두 양의 차이를 구한 다음, 차이의 절반을 옮기세요.'];}
 if(s===6&&(t===0||t===1)){set('원리124:25',['같은 고구마를 두 저울에서 비교했습니다.','가장 가벼운 것'+(t===1?'부터 차례로 고르세요.':'을 고르세요.')],t===0?[c('가장 가벼운 것',['고구마','감자','당근'],'당근')]:['당근','고구마','감자'].map((x,i)=>c((i+1)+'번째',['고구마','감자','당근'],x)),{kind:'balances',items:[bal('고구마','감자',1,1,200,300),bal('고구마','당근',1,1,200,100)]},'내려간 쪽이 더 무겁습니다. 가벼운 순서는 당근, 고구마, 감자입니다.');q.lines.push('같은 종류의 물건은 한 개의 무게가 같습니다.');}
 if(s===6&&(t===2||t===3))set('원리124:원리6',['수평인 두 저울에서 공책과 수첩의 무게를 비교했습니다.','같은 공깃돌은 한 개의 무게가 같습니다.',t===2?'더 무거운 물건을 고르세요.':'공책은 수첩보다 공깃돌 몇 개만큼 더 무거운가요?'],t===2?[c('더 무거운 물건',['공책','수첩'],'공책')]:[n('무게의 차이',3,'개')],{kind:'balances',items:[bal('공책','공깃돌',1,14,140),bal('수첩','공깃돌',1,11,110)]},'공책은 공깃돌 14개, 수첩은 11개와 같습니다. 공책이 14 − 11 = 3개만큼 더 무겁습니다.');
 if(s===6&&t===6)set('원리124:27',['수평인 두 저울을 보세요. 같은 바둑돌은 한 개의 무게가 같습니다.','귤 한 개는 딸기 한 개 무게의 몇 배인가요?'],[n('몇 배',2,'배')],{kind:'balances',items:[bal('귤','바둑돌',1,10,100),bal('딸기','바둑돌',1,5,50)]},'귤은 바둑돌 10개, 딸기는 5개와 같습니다. 10 ÷ 5 = 2배입니다.');
 if(s===6&&t===5){q.fields.push(c('가장 무거운 물건',['볼펜','지우개','필통'],'필통'));q.lines[2]='한 개씩 비교할 때 가장 가벼운 것과 가장 무거운 것을 고르세요.';}
 if(s===8&&t===0)q.visual={kind:'objectCards',cards:[['배추','약 2 (g, kg, t)'],['두부','약 350 (g, kg, t)'],['승용차','약 1 (g, kg, t)']]};
 if(s===8&&(t===4||t===5))q.visual={...q.visual,kind:'illustratedDial',label:'호박',zoom:true};
 if(s===8&&t===6)set('원리125:30',['두 저울의 바늘을 읽으세요.','호박과 무 중 더 무거운 것을 고르세요.'],[c('더 무거운 것',['호박','무'],'호박')],{kind:'pairedDials',items:[{label:'호박',value:1750,max:2000,step:50},{label:'무',value:850,max:2000,step:50}]},'호박은 1750 g, 무는 850 g이므로 호박이 더 무겁습니다.');
 if(s===9&&t===6)set('원리127:44',['두 바구니의 감을 각각 저울에 올렸습니다. 바구니의 무게는 생각하지 않습니다.','감의 무게는 모두 몇 kg 몇 g인가요?'],[n('모두 kg',2,'kg'),n('모두 나머지 g',800,'g')],{kind:'pairedDials',items:[{label:'감 바구니',value:1670,max:2000,step:10},{label:'감 바구니',value:1130,max:2000,step:10}]},'1670 + 1130 = 2800 g = 2 kg 800 g입니다.');
 if(s===4&&t===6)set('원리119:22',['음식 10 mL를 정화하는 데 필요한 맑은 물의 양입니다.','라면 국물 50 mL와 우유 30 mL를 정화하려면 맑은 물이 모두 몇 L 필요한가요?'],[n('라면 국물에 필요한 물',250,'L'),n('우유에 필요한 물',450,'L'),n('모두',700,'L')],{kind:'objectCards',cards:[['라면 국물','10 mL → 물 50 L'],['간장','10 mL → 물 300 L'],['우유','10 mL → 물 150 L'],['식용유','10 mL → 물 1980 L']]},'50 × 5 = 250 L, 150 × 3 = 450 L. 모두 700 L입니다.');
 if(s===11&&t===3)q.visual={kind:'guessDistance',actual:q.lines[0],rows:q.visual.rows};
 if(s===11&&t===0)set('심화106:1-1',['각 그릇을 가득 채워 같은 크기의 어항에 부었습니다.','어항이 가득 찰 때까지 부은 횟수를 보고, 들이가 작은 그릇부터 고르세요.','남거나 넘친 물은 없습니다.'],['다','가','나'].map((x,i)=>c((i+1)+'번째',['가','나','다'],x)),{kind:'cupTable',labels:['가','나','다'],counts:[12,9,14],shapes:['대접','원통','목 긴 병']},'같은 어항을 채우는 데 부은 횟수가 많을수록 그릇의 들이가 작습니다. 14, 12, 9번 순서이므로 다, 가, 나입니다.');
 if(s===11&&t===2)set('심화115:1-1',['세현이는 약 1 L 750 mL, 은성이는 약 1 L 300 mL로 어림했습니다.','그림에 적힌 실제 들이에 더 가깝게 어림한 사람은 누구인가요?'],[n('세현이 어림의 차이',250,'mL'),n('은성이 어림의 차이',200,'mL'),c('더 가깝게 어림한 사람',['세현','은성'],'은성')],{kind:'labeledBottle',label:'오렌지주스',amount:'1 L 500 mL'},'1750 − 1500 = 250 mL, 1500 − 1300 = 200 mL. 차이가 작은 은성이입니다.');
 if(s===12&&t===2){q.visual={kind:'cupChange',lines:q.lines.slice(0,2)};}
 if(s===12&&t===7)set('심화118:원리 그림',['같은 접시에 같은 열매를 올려 무게를 쟀습니다.','열매 한 개와 빈 접시의 무게를 각각 구하세요.'],[n('열매 두 개의 무게',20,'g'),n('열매 한 개',10,'g'),n('빈 접시',5,'g')],{kind:'plateWeighings',counts:[1,3],totals:[15,35]},'35 − 15 = 20 g이 열매 두 개의 무게입니다. 열매는 10 g, 접시는 15 − 10 = 5 g입니다.');
 if(s===12&&t===6)set('심화118:대표3',['귤이 가득 든 상자는 10 kg 600 g입니다.','귤의 절반을 먹은 뒤 같은 상자를 재니 5 kg 700 g입니다.','빈 상자의 무게는 몇 g인가요? 귤 한 개의 무게는 모두 같습니다.'],[n('귤 절반의 무게',4900,'g'),n('귤 전체의 무게',9800,'g'),n('빈 상자',800,'g')],{kind:'halfBox',counts:[8,4],totals:[10600,5700]},'두 무게의 차이는 먹은 귤 절반의 무게입니다. 10600 − 5700 = 4900 g. 빈 상자는 5700 − 4900 = 800 g입니다.',['귤 그림은 전체와 절반을 나타내는 모형이며, 실제 개수는 주어지지 않았습니다.']);
 if(s===14&&t===6)set('심화122:원리 그림',['달걀 5개를 한 판에 4개씩 담습니다.','달걀을 모두 담으려면 달걀판은 적어도 몇 개 필요한가요?'],[n('필요한 판',2,'개')],{kind:'eggTrays',count:5,slots:4},'한 판에 4개를 담으면 1개가 남으므로 한 판이 더 필요합니다. 모두 2판입니다.');
 if(s===15&&t===4)set('심화112:대표7',['라따뚜이 2인분의 재료입니다.','한 사람에게 필요한 양이 같도록 10인분을 만들려면 토마토소스가 몇 L 필요한가요?'],[n('2인분의 몇 배',5,'배'),n('토마토소스',10,'컵'),n('소스의 양',2000,'mL'),n('L로 바꾸면',2,'L')],{kind:'recipe'},'10 ÷ 2 = 5배, 2 × 5 = 10컵. 200 × 10 = 2000 mL = 2 L입니다.',['인분의 배수 → 컵의 수 → mL → L 순서로 구하세요.']);
 if(s===15&&t===5)set('심화112:7-1',['카카오나무 한 그루에서 열매를 약 30개 수확했습니다.','열매 한 개가 500 g일 때, 수확한 열매의 무게는 약 몇 kg인가요?'],[n('전체를 g으로',15000,'g'),n('약',15,'kg')],{kind:'cacao',count:30,one:500},'500 × 30 = 15000 g = 15 kg입니다.');
 if(s===15&&t===6)set('심화124:원리 그림',['굵기와 재질이 같은 막대는 길이가 같으면 무게도 같습니다.','2 m 막대가 4 kg일 때, 3 m 막대는 몇 kg인가요?'],[n('1 m의 무게',2,'kg'),n('3 m의 무게',6,'kg')],{kind:'rods'},'4 ÷ 2 = 2 kg, 2 × 3 = 6 kg입니다.');
 if(s===10&&t===2){const one=Number(q.fields[0].answer);q.lines=['레몬 1개와 방울토마토 3개의 무게가 같습니다.','방울토마토 5개와 키위 1개의 무게가 같습니다.',`레몬이 ${one*3} g일 때, 키위 한 개는 몇 g인가요?`,'같은 종류의 과일은 한 개의 무게가 같습니다.'];q.fields=[n('방울토마토 한 개',one,'g'),n('키위 한 개',one*5,'g')];q.visual.items.push(bal('방울토마토','키위',5,1,one*5));q.explanation=`${one*3} ÷ 3 = ${one} g, ${one} × 5 = ${one*5} g입니다.`;}
 if(s===16&&t===1)set('심화110:대표5',['감 7개와 사과 8개의 무게가 같습니다.','사과 4개와 배 3개의 무게가 같습니다.','감 한 개가 200 g일 때 배 6개의 무게는 몇 kg 몇 g인가요?','같은 종류의 과일은 한 개의 무게가 같습니다.'],[n('감 7개의 무게',1400,'g'),n('배 6개의 무게 kg',1,'kg'),n('나머지 g',400,'g')],{kind:'balances',items:[bal('감','사과',7,8,1400),bal('사과','배',4,3,700)]},'사과 8개는 배 6개와 같습니다. 감 7개의 무게와 같으므로 200 × 7 = 1400 g = 1 kg 400 g입니다.');
 if(s===16&&t===6)set('심화126:원리 그림',['우유의 무게는 빵의 무게보다 100 g 더 무겁습니다.','빵 한 개와 우유 한 개의 무게를 더하면 200 g입니다.','빵 한 개와 우유 한 개는 각각 몇 g인가요?'],[n('빵 두 개의 무게',100,'g'),n('빵 한 개',50,'g'),n('우유 한 개',150,'g')],{kind:'substitution'},'우유를 빵 + 100 g으로 바꾸면 빵 두 개 + 100 g = 200 g입니다. 빵은 50 g, 우유는 150 g입니다.');
 if(s===17&&q.visual?.kind==='flow')q.visual={...q.visual,kind:'bathFlow'};
 if(s===4&&t===6)makeLifeQuestion(q,seed);
 if(s===9&&t===7)makeLimitQuestion(q,seed);
 if(s===9&&t===6)q.column={a:q.visual.items[0].value,b:q.visual.items[1].value,operation:'+',large:'kg',small:'g'};
 return reviseCore(q,seed);
}

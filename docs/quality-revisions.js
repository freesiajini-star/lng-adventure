import {makeCargoQuestion} from './cargo-problems.js?v=7af37fb1a1cf';
// Quantities are generated in grams or millilitres; pictures never expose an answer.
export const hasBatchim=s=>{const n=String(s).trim().codePointAt(String(s).trim().length-1);return n>=0xac00&&n<=0xd7a3&&(n-0xac00)%28!==0;};
export const subject=s=>s+(hasBatchim(s)?'이':'가');
export const topic=s=>s+(hasBatchim(s)?'은':'는');
export const WEIGHT_OBJECTS=[
 ['지우개',20,50],['볼펜',10,30],['구슬',5,20],['바둑돌',5,15],['필통',100,250],['골프공',40,50],
 ['귤',80,180],['사과',150,300],['배',300,650],['레몬',80,180],['감자',100,300],['고구마',150,350],['당근',100,300],['두부',300,500],['통조림',150,450],['공책',100,300],['책가방',1500,3500],['호박',1000,2500],['무',700,1800],['배추',1500,3000],['양배추',1000,2500],['축구공',400,450],['멜론',1000,2000],['수박',3000,6000],['자전거',8000,15000],['텔레비전',7000,16000],['승용차',1000000,2000000],['트럭',3000000,8000000]
];
export function reviseQuality(q,seed){
 if(q.stage===14&&[4,5,6].includes(q.type))return makeCargoQuestion(q,seed,q.type===6?0:undefined);
 let state=(seed+q.stage*991+q.type*719)>>>0;const random=()=>{state+=0x6D2B79F5;let t=state;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;},r=(a,b)=>a+Math.floor(random()*(b-a+1)),pick=a=>a[r(0,a.length-1)],shuffle=a=>a.map(value=>({value,sort:random()})).sort((a,b)=>a.sort-b.sort).map(x=>x.value);
 const num=(label,answer,unit='g')=>({kind:'number',label,answer:String(answer),unit}),choice=(label,options,answer)=>({kind:'choice',label,options,answer}),set=(lines,fields,visual,explanation)=>Object.assign(q,{lines,fields,visual,explanation,facts:[],work:[]});
 if(q.stage===3&&[1,2,3].includes(q.type)){const objects=shuffle([['대접',500,'mL'],['주사기',3,'mL'],['양동이',10,'L'],['욕조',200,'L'],['물병',500,'mL'],['물통',2,'L'],['물컵',250,'mL'],['계량컵',500,'mL']]).slice(0,3);set(['각 물건의 들이에 알맞은 단위를 고르세요.'],objects.map(([label,,unit])=>choice(label,['L','mL'],unit)),{kind:'objectCards',cards:objects.map(([label,n])=>[label,'약 '+n+' (L, mL)'])},objects.map(([label,n,unit])=>label+' 약 '+n+' '+unit).join(', '));}
 if(q.stage===11&&q.visual?.kind==='countTable'&&q.visual.rows?.length===3)q.visual={kind:'guessDistance',actual:q.lines[0],rows:q.visual.rows};
 if(q.stage===7&&q.type===3){
  const [label,lo,hi]=pick(WEIGHT_OBJECTS.filter(x=>['사과','배','귤','레몬','감자','고구마','당근'].includes(x[0]))),count=r(1,3),one=r(Math.ceil(lo/50),Math.floor(hi/50))*50,box=r(1,3)*1000,total=box+one*count;
  set([`빈 상자의 무게는 ${box/1000} kg입니다. 이 상자에 한 개에 ${one} g인 ${label} ${count}개를 넣었습니다. ${label==='배'?'배가':subject(label)} 든 상자의 무게는 몇 g인가요?`],[num('물건이 든 상자',total)],{kind:'package',box,items:count,one,total:null,label},`${box/1000} kg = ${box} g, ${box} + ${one} × ${count} = ${total} g입니다.`);
 }
 if(q.stage===8&&[0,2].includes(q.type)){
  const chosen=shuffle(WEIGHT_OBJECTS).slice(0,3),cards=[],fields=[];
  for(const [label,lo,hi]of chosen){const unit=lo>=1000000?'t':lo>=1000?'kg':'g',divisor=unit==='t'?1000000:unit==='kg'?1000:5,value=r(Math.ceil(lo/divisor),Math.floor(hi/divisor))*(unit==='g'?5:1);cards.push([label,`약 ${value} (g, kg, t)`]);fields.push(choice(label,['g','kg','t'],unit));}
  set(['그림 속 물건의 무게에 알맞은 단위를 각각 고르세요.'],fields,{kind:'objectCards',cards},fields.map((f,i)=>`${cards[i][0]}: ${cards[i][1].replace('(g, kg, t)',f.answer)}`).join(', '));
 }
 if(q.stage===8&&[1,3].includes(q.type)){
  const threshold=pick([100,300,500,1000,2000,5000]),heavier=random()<.5,below=WEIGHT_OBJECTS.filter(x=>x[2]<threshold),above=WEIGHT_OBJECTS.filter(x=>x[1]>threshold);if(below.length&&above.length){
   const yes=pick(heavier?above:below),wrong=shuffle(heavier?below:above).slice(0,2),all=shuffle([yes,...wrong]),cards=all.map(([label])=>[label,'']);
   set([`무게가 ${threshold>=1000?threshold/1000+' kg':threshold+' g'}보다 ${heavier?'무거운':'가벼운'} 것을 고르세요.`],[choice('물건',all.map(x=>x[0]),yes[0])],{kind:'objectCards',cards},`${threshold} g을 기준으로 비교하면 ${yes[0]}입니다.`);
  }
 }
 if(q.stage===8&&[4,5,6].includes(q.type)){
  const candidates=WEIGHT_OBJECTS.filter(x=>x[1]>=80&&x[2]<=3000),a=pick(candidates),b=pick(candidates.filter(x=>x[0]!==a[0]));
  const dial=x=>({label:x[0],value:r(Math.ceil(x[1]/50),Math.floor(x[2]/50))*50,max:3000,step:50}),items=[dial(a),dial(b)];
  if(q.type===6){while(items[0].value===items[1].value)items[1]=dial(b);set(['두 저울을 읽고 더 무거운 것을 고르세요.'],[choice('더 무거운 것',items.map(x=>x.label),items[items[0].value>items[1].value?0:1].label)],{kind:'pairedDials',items},items.map(x=>`${x.label} ${x.value} g`).join(', '));}
  else{const v=items[0];set([q.type===4?'저울의 작은 눈금 한 칸은 몇 g인가요?':'저울의 눈금을 읽으세요.'],[num(q.type===4?'한 눈금':'읽은 값',q.type===4?v.step:v.value)],{kind:'illustratedDial',...v},`한 눈금은 ${v.step} g이고, ${v.label}의 무게는 ${v.value} g입니다.`);}
 }
 if(q.stage===12&&q.type===2){const before=r(20,40)*100,one=r(2,5)*100,count=r(2,5),after=before+one*count;set([`물 ${Math.floor(before/1000)} L${before%1000?' '+before%1000+' mL':''}에 같은 컵으로 물을 가득 담아 ${count}번 더 부었더니 ${Math.floor(after/1000)} L${after%1000?' '+after%1000+' mL':''}가 되었습니다. 컵의 들이는 몇 mL인가요?`],[num('더 부은 물 전체',one*count,'mL'),num('컵의 들이',one,'mL')],{kind:'cupChange',before,after,count,one,capacity:Math.ceil(after/1000)*1000},`${after} − ${before} = ${one*count} mL, ${one*count} ÷ ${count} = ${one} mL입니다.`);}
 if(q.stage===15&&q.type===4){
  const [dish,liquid,art,servings,cups]=pick([['라따뚜이','토마토소스','ratatouille',2,2],['토마토 수프','토마토소스','soup-tomato',2,2],['옥수수 수프','우유','soup-corn',4,2],['감자 수프','우유','soup-potato',4,2],['채소 수프','채소 국물','soup-vegetable',3,3],['팥빙수','우유','patbingsu',3,1]]),multiple=r(2,6),cup=200,total=cups*cup*multiple;
  set([`${dish} ${servings}인분에 ${liquid} ${cups}컵이 필요합니다. 한 컵은 ${cup} mL입니다. 한 사람에게 필요한 양이 같도록 ${servings*multiple}인분을 만들려면 ${topic(liquid)} 몇 mL 필요한가요?`],[num('필요한 양',total,'mL')],{kind:'recipe',dish,liquid,art,servings,cups,cup},`${servings*multiple} ÷ ${servings} = ${multiple}, ${cups} × ${cup} × ${multiple} = ${total} mL입니다.`);
 }
 if(q.stage===16&&q.visual){q.visual.objectScale=2;if(q.type===4)q.lines=q.lines.filter(line=>line!=='같은 종류의 물건은 한 개의 무게나 한 병의 들이가 모두 같습니다.');else q.lines=q.lines.map(line=>line==='같은 종류의 물건은 한 개의 무게나 한 병의 들이가 모두 같습니다.'?'같은 종류의 물건은 한 개의 무게가 같습니다.':line);}
 return q;
}

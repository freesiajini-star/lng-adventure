import {TYPE_GROUPS,GROUP_TITLES} from './type-groups.js?v=7dc80e4c82cc';
export {POUR_VARIANT_COUNT,createPourDeck} from './pour-problems.js?v=7dc80e4c82cc';
import {restoreQuestion,EXTRA_TYPES} from './restoration.js?v=7dc80e4c82cc';
import {reviewQuestion} from './curriculum.js?v=7dc80e4c82cc';
// All quantities are integers in mL or g. This module is shared by the server and QA.
export const STAGES = ['들이 비교','L와 mL','들이 어림과 측정','들이 덧셈·뺄셈','물의 양 같게 하기','무게 비교','g·kg·t','무게 어림과 측정','무게 덧셈·뺄셈','한 개의 무게','비교와 어림','처음 양 찾기','각각의 양 찾기','몇 개까지 담을까?','필요한 양과 가격','저울의 비밀','물 채우는 시간'];
export const COLORS=['#df7152','#d87832','#cc8327','#b49620','#559c43','#168e81','#327fc0','#676ac6','#9961b9','#bd6f9a','#d73e81','#dc6b21','#b9900a','#159968','#1687bb','#3766ce','#9850c4'];
export const TYPE_NAMES=[['옮겨 담기','같은 그릇','컵의 개수','들이 순서','채우는 횟수','몇 배일까?'],['L를 mL로','mL를 L와 mL로','단위 바꾸기','옳은 변환','크기 비교','순서 정하기'],['기준으로 어림','알맞은 단위','알맞은 물건','단위 고치기','가까운 어림','눈금 읽기'],['들이 더하기','받아올려 더하기','들이 빼기','받아내려 빼기','남은 양','빈칸 찾기'],['차이 구하기','옮길 양','같아진 양','눈금과 물 옮기기','옮긴 양 판단','처음 양 찾기'],['저울 기울기','무게 순서','단위 물체','무게 차이','단위 물체 비교','한 개씩 비교'],['kg를 g으로','g을 kg와 g으로','t와 kg','상자와 배','크기 비교','순서 정하기'],['알맞은 단위','기준으로 어림','단위 고치기','1 kg과 비교','한 눈금의 값','저울 읽기'],['무게 더하기','받아올려 더하기','무게 빼기','받아내려 빼기','더 담을 무게','빈칸 찾기'],['똑같이 나누기','상자 무게 빼기','평형 저울','두 저울 연결','거꾸로 찾기','묶음 거꾸로'],['횟수로 비교','이어 비교','가까운 어림','어림의 차이','가까운 순서','덜어낸 횟수'],['넣고 빼기','처음 양','한 컵의 들이','한 번 덜어낸 양','한 개의 무게','빈 상자의 무게'],['합과 차','남은 양 나누기','두 사람의 양','세 그릇의 양','큰 통 바꾸기','무게 나누기'],['최대 개수','최소 트럭 수','최소 통 수','두 종류의 짐','내린 뒤의 여유','남은 한도'],['기준 무게와 가격','두 물건의 가격','거스름돈','가격으로 양 찾기','요리 재료','기준량의 몇 배'],['저울 연결','묶음 바꾸기','두 식 더하기','두 식 빼기','개수 맞추기','묶음의 무게'],['두 수도','새는 물','시간 단위 맞추기','일부 찬 물통','모인 양','나가는 양 찾기']];
for(const [stage,names] of Object.entries(EXTRA_TYPES))TYPE_NAMES[Number(stage)-1].push(...names);
TYPE_NAMES[4][0]='같게 옮기기';TYPE_NAMES[4][3]='처음 양 찾기';TYPE_NAMES[5][0]='무게 비교하기';TYPE_NAMES[5][4]='한 개의 무게 비교';TYPE_NAMES[5][6]='무게는 몇 배';TYPE_NAMES[5][5]='가장 가벼운 것과 무거운 것';
for(const[stage,titles]of Object.entries(GROUP_TITLES))for(const[type,title]of Object.entries(titles))TYPE_NAMES[stage-1][type]=title;
export const ACTIVE_TYPES=TYPE_NAMES.map((names,i)=>i===5?[0,4,6,5]:Object.keys(TYPE_GROUPS[i+1]||names).map(Number));
export const NICKS=[['🐱','고양이'],['🐰','토끼'],['🦊','여우'],['🐻','곰'],['🐼','판다'],['🐨','코알라'],['🐯','호랑이'],['🦁','사자'],['🐸','개구리'],['🐧','펭귄'],['🦉','부엉이'],['🐬','돌고래'],['🐢','거북이'],['🦔','고슴도치'],['🐿️','다람쥐'],['🦦','수달'],['🦌','사슴'],['🦒','기린'],['🦓','얼룩말'],['🦘','캥거루'],['🦭','물개'],['🦋','나비'],['🐝','꿀벌'],['🐹','햄스터'],['🐺','늑대']];
export const cap=n=>n<1000?`${n} mL`:`${Math.floor(n/1000)} L${n%1000?' '+n%1000+' mL':''}`;
export const mass=n=>n<1000?`${n} g`:`${Math.floor(n/1000)} kg${n%1000?' '+n%1000+' g':''}`;
export function rng(seed){let x=seed>>>0;return()=>{x+=0x6D2B79F5;let t=x;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
export function makeQuestion(stage,type,seed=1){
 const variants=TYPE_GROUPS[stage]?.[type],variant=variants?.[(Math.max(0,seed-1)>>>0)%variants.length]??type;
 const q=makeQuestionRaw(stage,variant,seed);if(q.visual?.kind==='comparisonBars')q.visual.material=['우유','주스','밀가루','쌀','설탕','소금','물'].find(name=>q.lines.join(' ').includes(name))||(q.visual.unit==='g'?'밀가루':'물');q.type=type;q.title=TYPE_NAMES[stage-1][type];return q;
}
function makeQuestionRaw(stage,type,seed=1){
 if(!TYPE_NAMES[stage-1]?.[type])throw Error('없는 문항 유형');
 if(type>=6){const q=restoreQuestion({stage,type,title:TYPE_NAMES[stage-1][type],lines:[],fields:[],facts:[],work:[]},seed);validateQuestion(q);return q;}
 const random=rng(seed), r=(a,b)=>a+Math.floor(random()*(b-a+1)), pick=a=>a[r(0,a.length-1)];
 let q={stage,type,title:TYPE_NAMES[stage-1][type],lines:[],fields:[],visual:null,explanation:'',facts:[]};
 const num=(label,value,unit='')=>{q.fields.push({label,unit,kind:'number',answer:String(value)});};
 const choice=(label,options,value)=>{q.fields.push({label,kind:'choice',options,answer:String(value)});};
 const lines=(...s)=>q.lines.push(...s);const fact=(label,left,right)=>q.facts.push({label,left,right});
 const a=r(2,8),b=r(1,5),u=r(1,8)*100;
 if(stage===1){
  if(type===0){const small=(a+1)*100,big=small+200;lines('물병에 물을 가득 채워 빈 꽃병에 모두 부었더니 물이 넘쳤습니다.','들이가 더 큰 것은 무엇인가요?');choice('들이가 더 큰 것',['물병','꽃병'],'물병');q.visual={kind:'overflow',source:big,target:small};q.explanation='물병의 물이 꽃병을 채우고도 남으므로 물병의 들이가 더 큽니다.';fact('넘치는 양',big-small,200);}
  else if(type===1||type===3){const values=[300,600,900],order=pick([[0,2,1],[2,0,1],[1,2,0]]),v=order.map(i=>values[i]);lines('세 용기에 가득 담긴 물을 모양과 크기가 같은 그릇에 각각 옮겼습니다.',type===1?'들이가 가장 큰 용기를 고르세요.':'들이가 큰 것부터 차례로 고르세요.');q.visual={kind:'vessels',values:v,max:1000,labels:['가','나','다'],ticks:0};if(type===1)choice('가장 큰 용기',['가','나','다'],['가','나','다'][v.indexOf(900)]);else{const labels=['가','나','다'];for(let i=0;i<3;i++)choice(`${i+1}번째`,labels,labels[v.indexOf([900,600,300][i])]);}q.explanation='같은 그릇에서는 물높이가 높을수록 옮겨 담은 물의 양이 많습니다.';}
  else if(type===2||type===5){const n=r(2,4),m=n*2;lines(`가 병의 물은 같은 컵 ${n}개에, 나 병의 물은 같은 컵 ${m}개에 가득 담깁니다.`,type===2?'들이가 더 큰 병을 고르세요.':'나 병의 들이는 가 병 들이의 몇 배인가요?');q.visual={kind:'cups',groups:[{label:'가 병',count:n},{label:'나 병',count:m}]};if(type===2)choice('더 큰 병',['가 병','나 병'],'나 병');else num('몇 배',2,'배');q.explanation=`컵 ${m}개는 ${n}개의 2배이므로 나 병의 들이는 가 병의 2배입니다.`;fact('컵 배수',m,n*2);}
  else{const n=pick([3,4,6]),m=n*2;lines(`같은 크기의 빈 수조를 채우는 데 가 컵으로 ${n}번, 나 컵으로 ${m}번 부었습니다.`,'매번 컵에 물을 가득 담았습니다. 들이가 더 큰 컵을 고르세요.');choice('더 큰 컵',['가 컵','나 컵'],'가 컵');q.visual={kind:'countTable',rows:[['가 컵',n+'번'],['나 컵',m+'번']]};q.explanation='같은 수조를 채울 때 더 적게 부어도 되는 컵의 들이가 더 큽니다.';fact('같은 수조',n*200,m*100);}
 }
 if(stage===2||stage===7){const volume=stage===2,large=volume?'L':'kg',small=volume?'mL':'g',n=a*1000+u,fmt=volume?cap:mass;
  if(type===0){lines(`${a} ${large}는 몇 ${small}인가요?`);num('바꾼 양',a*1000,small);q.explanation=`1 ${large} = 1000 ${small}이므로 ${a} × 1000 = ${a*1000}입니다.`;}
  if(type===1){lines(`${n} ${small}를 ${large}와 ${small}로 나타내세요.`);num(large,a,large);num(small,u,small);q.explanation=`${n} = ${a*1000} + ${u}이므로 ${fmt(n)}입니다.`;}
  if(type===2){if(volume){lines(`${fmt(n)}는 몇 ${small}인가요?`);num('바꾼 양',n,small);}else{lines(`${a} t ${b*100} kg은 몇 kg인가요?`);num('바꾼 무게',a*1000+b*100,'kg');}q.explanation=volume?`${a} × 1000 + ${u} = ${n} mL입니다.`:`1 t = 1000 kg이므로 ${a*1000+b*100} kg입니다.`;}
  if(type===3){const opts=[`${n} ${small} = ${a} ${large} ${u} ${small}`,`${n} ${small} = ${a*10} ${large} ${u} ${small}`,`${a} ${large} = ${a*100} ${small}`];lines('단위를 바르게 바꾼 것을 고르세요.');choice('옳은 식',opts,opts[0]);q.explanation=`1 ${large} = 1000 ${small}입니다.`;}
  if(type===4){const delta=pick([-100,0,100]);lines('두 양을 비교하세요.');q.visual={kind:'equation',text:`${fmt(n)}  ○  ${n+delta} ${small}`};choice('알맞은 기호',['>','=','<'],delta<0?'>':delta>0?'<':'=');q.explanation=`${fmt(n)} = ${n} ${small}로 바꾸어 비교합니다.`;}
  if(type===5){const vals=[n+200,n,n+100];lines(volume?'들이가 작은 것부터 차례로 고르세요.':'무게가 가벼운 것부터 차례로 고르세요.');q.visual={kind:'countTable',rows:vals.map((x,i)=>[['가','나','다'][i],i===1?fmt(x):x+' '+small])};for(let i=0;i<3;i++)choice(`${i+1}번째`,['가','나','다'],['나','다','가'][i]);q.explanation=`같은 단위로 바꾸면 ${n}, ${n+100}, ${n+200} ${small} 순서입니다.`;}
 }
 if(stage===3||stage===8){const vol=stage===3,unit=vol?'mL':'g',big=vol?'L':'kg';
  if(type===0||type===1||type===2||type===3){
   if(type===0){const base=200,n=r(2,5);lines(`${vol?'주스':'쌀'} ${base} ${unit}를 ${n}번 ${vol?'부으면 병이 가득 찰':'담으면 봉지가 가득 찰'} 것 같습니다.`,`${vol?'병의 들이':'봉지의 무게'}를 어림하세요.`);q.visual={kind:'reference',label:vol?'주스':'쌀',value:base,unit,count:n};num('어림한 양',base*n,unit);q.explanation=`${base} × ${n} = 약 ${base*n} ${unit}입니다.`;}
   if(type===1){lines(vol?'물컵의 들이는 약 250 (L, mL)입니다.':'배추 한 통의 무게는 약 2 (g, kg, t)입니다.');choice('알맞은 단위',vol?['L','mL']:['g','kg','t'],vol?'mL':'kg');q.explanation=vol?'일반적인 물컵의 들이는 수백 mL 정도입니다.':'배추 한 통은 보통 kg으로 무게를 나타냅니다.';}
   if(type===2){if(vol){lines('들이가 약 3 mL인 물건으로 알맞은 것을 고르세요.');choice('알맞은 물건',['작은 약물 주사기','목욕용 욕조','큰 양동이'],'작은 약물 주사기');}else{lines('책가방의 무게를 약 2 g이라고 적었습니다.','숫자 2를 그대로 두고 단위를 고치세요.');choice('알맞은 단위',['g','kg','t'],'kg');}q.explanation=vol?'작은 약물 주사기는 몇 mL의 액체를 담는 데 사용합니다.':'책가방의 무게는 g보다 kg으로 나타내는 것이 알맞습니다.';}
   if(type===3){if(vol){lines('욕조의 들이를 약 200 mL라고 적었습니다.','숫자 200을 그대로 두고 단위를 고치세요.');choice('알맞은 단위',['L','mL'],'L');q.explanation='목욕용 욕조의 들이는 수백 L 정도입니다.';}else{lines('무게가 1 kg보다 가벼운 것을 고르세요.');choice('물건',['무게 270 g인 배구공','무게 8 kg인 자전거','무게 20 kg인 책상'],'무게 270 g인 배구공');q.explanation='1 kg = 1000 g이고 270 g은 1000 g보다 작습니다.';}}
  } else if(type===4&&vol){const actual=1500,v=[1250,1400,1800];lines('실제 들이가 1 L 500 mL인 병을 세 사람이 어림했습니다.','실제 들이에 가장 가깝게 어림한 사람을 고르세요.');q.visual={kind:'countTable',rows:v.map((x,i)=>[['가','나','다'][i],cap(x)])};choice('가장 가까운 사람',['가','나','다'],'나');q.explanation='차이는 각각 250 mL, 100 mL, 300 mL이므로 나가 가장 가깝습니다.';}
  else{const step=vol?100:50,max=vol?1000:2000,value=step*r(3,vol?9:35);lines(!vol&&type===4?'저울의 작은 눈금 한 칸은 몇 g인가요?':`${vol?'계량컵':'저울'}의 눈금을 읽으세요.`);q.visual={kind:vol?'vessels':'dial',values:[value],value,max,step,labels:[''],ticks:step,unit};num(!vol&&type===4?'한 눈금':'읽은 값',!vol&&type===4?step:value,unit);q.explanation=`작은 눈금 한 칸은 ${step} ${unit}이고, 표시된 양은 ${value} ${unit}입니다.`;fact('눈금 정렬',value%step,0);}
 }
 if(stage===4||stage===9){const vol=stage===4,small=vol?'mL':'g',fmt=vol?cap:mass;let x,y,z;
  if(type===0||type===1){x=a*1000+(type===0?200:700);y=b*1000+(type===0?300:600);z=x+y;lines('계산하세요.');q.visual={kind:'equation',text:`${fmt(x)} + ${fmt(y)}`};}
  else if(type===2||type===3){x=(a+b)*1000+(type===2?800:200);y=b*1000+(type===2?300:600);z=x-y;lines('계산하세요.');q.visual={kind:'equation',text:`${fmt(x)} − ${fmt(y)}`};}
  else if(type===4){x=(a+b)*1000+200;y=b*1000+700;z=x-y;lines(vol?`물 ${fmt(x)} 중 ${fmt(y)}를 사용했습니다.`:`최대 ${fmt(x)}까지 담는 가방에 ${fmt(y)}를 담았습니다.`,vol?'남은 물은 얼마인가요?':'더 담을 수 있는 무게는 얼마인가요?');}
  else{x=(a+b)*1000+300;y=b*1000+800;z=x-y;lines('빈칸에 알맞은 양을 구하세요.');q.visual={kind:'equation',text:`${fmt(x)} − □ = ${fmt(z)}`};}
  q.column={a:x,b:type===5?z:y,operation:type<2?'+':'−',large:vol?'L':'kg',small:vol?'mL':'g',optional:type===5||stage===4&&type===4};
  const ans=type===5?y:z;num(vol?'L':'kg',Math.floor(ans/1000),vol?'L':'kg');num(small,ans%1000,small);q.explanation=type===5?`${fmt(x)} − ${fmt(z)} = ${fmt(y)}입니다.`:`${fmt(x)} ${type<2?'+':'−'} ${fmt(y)} = ${fmt(z)}입니다.`;fact('연산',type<2?x+y:x-y,z);
 }
 if(stage===5){const low=r(2,7)*100,move=r(1,4)*100,high=low+move*2,equal=low+move;
  lines(`가 그릇에 물 ${high} mL, 나 그릇에 물 ${low} mL가 있습니다.`);
  if(type===0){lines('두 그릇에 담긴 물의 양의 차이는 몇 mL인가요?');num('양의 차이',high-low,'mL');}
  if(type===1||type===3){lines('물의 양을 같게 하려면 가에서 나로 몇 mL를 옮겨야 하나요?');num('옮길 양',move,'mL');}
  if(type===2){lines('물의 양이 같아지도록 가에서 나로 옮겼습니다.','두 그릇에는 물이 각각 몇 mL 있나요?');num('각각의 양',equal,'mL');}
  if(type===4){lines(`가에서 나로 ${move} mL를 옮기면 두 물의 양이 (같습니다 / 다릅니다).`);choice('옮긴 뒤',['같습니다','다릅니다'],'같습니다');num('각각의 양',equal,'mL');}
  if(type===5){q.lines=[];lines(`가에서 나로 물 ${move} mL를 옮겼더니 각각 ${equal} mL가 되었습니다.`,'처음 가 그릇에는 몇 mL가 있었나요?');num('처음 가의 양',high,'mL');}
  q.visual={kind:'vessels',values:type===5?[equal,equal]:[high,low],max:2000,labels:['가','나'],ticks:type===3?100:0};q.explanation=`차이 ${high-low} mL의 절반인 ${move} mL를 옮기면 각각 ${equal} mL가 됩니다.`;fact('전체 보존',high+low,equal*2);fact('옮기기',high-move,low+move);
 }
 if(stage===6){
  if(type===0||type===1){const x=r(2,4)*100,y=x+100,z=y+100;q.visual={kind:'balances',items:[{left:'가',right:'나',leftMass:x,rightMass:y,leftCount:1,rightCount:1},...(type===1?[{left:'나',right:'다',leftMass:y,rightMass:z,leftCount:1,rightCount:1}]:[])]};lines(type===0?'저울을 보고 더 무거운 물건을 고르세요.':'저울을 보고 가장 가벼운 물건을 고르세요.');choice('물건',type===0?['가','나']:['가','나','다'],type===0?'나':'가');q.explanation='양팔저울에서 아래로 내려간 쪽이 더 무겁습니다.';}
  if(type===2||type===3||type===4){const n=r(5,9),m=n+3;lines(type===4?`같은 골프공이 바둑돌 ${m}개와도, 공깃돌 ${n}개와도 무게가 같습니다.`:`가 물건은 같은 구슬 ${n}개, 나 물건은 같은 구슬 ${m}개와 무게가 같습니다.`);q.visual={kind:'countTable',rows:type===4?[['골프공','바둑돌 '+m+'개'],['골프공','공깃돌 '+n+'개']]:[['가',n+'개'],['나',m+'개']]};if(type===2){lines('더 무거운 물건은 무엇인가요?');choice('더 무거운 물건',['가','나'],'나');}if(type===3){lines('나가 가보다 구슬 몇 개만큼 더 무거운가요?');num('무게 차이',m-n,'개');}if(type===4){lines('한 개의 무게가 더 무거운 것은 무엇인가요?');choice('더 무거운 것',['바둑돌','공깃돌'],'공깃돌');}q.explanation=type===4?'같은 무게를 나타낼 때 더 적게 필요한 공깃돌 한 개가 더 무겁습니다.':`나가 구슬 ${m-n}개만큼 더 무겁습니다.`;}
  if(type===5){lines('볼펜 4자루와 지우개 2개의 무게가 같습니다.','지우개 2개와 필통 1개의 무게도 같습니다.','한 개씩 비교할 때 가장 가벼운 것을 고르세요.');q.visual={kind:'balances',items:[{left:'볼펜',right:'지우개',leftMass:40,rightMass:40,leftCount:4,rightCount:2},{left:'지우개',right:'필통',leftMass:40,rightMass:40,leftCount:2,rightCount:1}]};choice('가장 가벼운 것',['볼펜','지우개','필통'],'볼펜');q.explanation='볼펜 한 자루를 10 g이라고 하면 지우개는 20 g, 필통은 40 g입니다.';}
 }
 if(stage===10){const one=r(3,9)*50,count=r(3,6),box=r(1,4)*100,total=one*count;
  if(type===0||type===5){lines(`무게가 같은 사과 ${count}개의 무게가 ${mass(total)}입니다.`,'사과 한 개의 무게를 구하세요.');num('한 개',one,'g');q.explanation=`${total} ÷ ${count} = ${one} g입니다.`;}
  if(type===1){lines(`빈 상자의 무게는 ${box} g입니다.`,`같은 사과 ${count}개를 넣고 재니 ${mass(total+box)}입니다.`,'사과 한 개의 무게는 몇 g인가요?');num('한 개',one,'g');q.explanation=`(${total+box} − ${box}) ÷ ${count} = ${one} g입니다.`;}
  if(type===2){lines(`레몬 1개와 같은 방울토마토 3개의 무게가 같습니다.`,`레몬이 ${one*3} g이면 토마토 한 개는 몇 g인가요?`);q.visual={kind:'balances',items:[{left:'레몬',right:'토마토',leftCount:1,rightCount:3,leftMass:one*3,rightMass:one*3}]};num('토마토 한 개',one,'g');q.explanation=`${one*3} ÷ 3 = ${one} g입니다.`;}
  if(type===3||type===4){lines(`사과 1개와 귤 3개의 무게가 같습니다.`,`귤 2개와 배 1개의 무게도 같습니다.`,type===3?`사과가 ${one*3} g이면 배 한 개는 몇 g인가요?`:`배가 ${one*2} g이면 사과 한 개는 몇 g인가요?`);q.visual={kind:'balances',items:[{left:'사과',right:'귤',leftCount:1,rightCount:3,leftMass:one*3,rightMass:one*3},{left:'귤',right:'배',leftCount:2,rightCount:1,leftMass:one*2,rightMass:one*2}]};num('한 개의 무게',type===3?one*2:one*3,'g');q.explanation=`귤 한 개는 ${one} g입니다. 따라서 ${type===3?'배':'사과'} 한 개는 ${type===3?one*2:one*3} g입니다.`;}
  fact('전체 무게',one*count,total);
 }
 if(stage===11){
  if(type===0||type===1||type===5){const n=pick([3,4,6]),ratio=pick([2,3]);if(type===0){lines(`같은 크기의 빈 수조를 가 컵으로 ${n}번, 나 컵으로 ${n*ratio}번 채웠습니다.`,'매번 가득 담아 부었습니다. 들이가 더 작은 컵은 무엇인가요?');choice('더 작은 컵',['가 컵','나 컵'],'나 컵');}else{lines(`한 병의 물을 가 컵으로 가득 담아 ${n*ratio}번 덜면 남지 않습니다.`,`나 컵의 들이는 가 컵의 ${ratio}배입니다.`,'나 컵으로 가득 담아 덜면 몇 번인가요?');num('덜어내는 횟수',n,'번');}q.explanation=`컵의 들이가 ${ratio}배이면 같은 양을 담는 횟수는 ${ratio}분의 1이 됩니다.`;fact('총량',n*ratio*100,n*(ratio*100));}
  else{const actual=(a+1)*1000+500,vs=[actual-300,actual+100,actual+500],diff=vs.map(x=>Math.abs(x-actual));lines(`물통의 실제 들이는 ${cap(actual)}입니다.`,'세 사람이 다음과 같이 어림했습니다.');q.visual={kind:'countTable',rows:vs.map((x,i)=>[['가','나','다'][i],cap(x)])};if(type===2){lines('가장 가깝게 어림한 사람을 고르세요.');choice('사람',['가','나','다'],'나');}if(type===3){lines('나의 어림값과 실제 값의 차이를 구하세요.');num('차이',100,'mL');}if(type===4){lines('실제 값에 가까운 사람부터 차례로 고르세요.');for(let i=0;i<3;i++)choice(`${i+1}번째`,['가','나','다'],['나','가','다'][i]);}q.explanation=`실제 값과의 차이는 가 ${diff[0]} mL, 나 ${diff[1]} mL, 다 ${diff[2]} mL입니다.`;}
 }
 if(stage===12){const cup=r(2,7)*100,count=r(3,6),initial=r(2,6)*1000+300,added=cup*count;
  if(type===0){const used=r(1,2)*1000;lines(`물 ${cap(initial)}에서 ${cap(used)}를 사용하고 ${cap(added)}를 더 부었습니다.`,'남은 물은 몇 mL인가요?');num('남은 물',initial-used+added,'mL');q.explanation=`${initial} − ${used} + ${added} = ${initial-used+added} mL입니다.`;}
  if(type===1){lines(`같은 컵으로 물 ${cup} mL씩 ${count}번 덜어냈더니 ${cap(initial)}가 남았습니다.`,'처음 물은 몇 mL였나요?');num('처음 물',initial+added,'mL');q.explanation=`${initial} + ${cup} × ${count} = ${initial+added} mL입니다.`;}
  if(type===2){lines(`물 ${cap(initial)}에 같은 컵으로 가득 담아 ${count}번 더 부었더니 ${cap(initial+added)}가 되었습니다.`,'컵의 들이는 몇 mL인가요?');num('컵의 들이',cup,'mL');q.explanation=`(${initial+added} − ${initial}) ÷ ${count} = ${cup} mL입니다.`;}
  if(type===3){lines(`쌀 ${mass(initial+added)}에서 같은 그릇으로 ${count}번 덜어냈더니 ${mass(initial)}이 남았습니다.`,'매번 덜어낸 무게가 같습니다. 한 번에 몇 g씩 덜었나요?');num('한 번의 무게',cup,'g');q.explanation=`(${initial+added} − ${initial}) ÷ ${count} = ${cup} g입니다.`;}
  if(type===4||type===5){const box=300,one=cup,n=count;lines(`같은 사과 ${n}개를 상자에 넣고 재니 ${mass(box+n*one)}입니다.`,`사과 ${type===4?1:2}개를 꺼내고 재니 ${mass(box+(n-(type===4?1:2))*one)}입니다.`,type===4?'사과 한 개의 무게는 몇 g인가요?':'빈 상자의 무게는 몇 g인가요?');num(type===4?'한 개':'빈 상자',type===4?one:box,'g');q.explanation=type===4?`두 무게의 차이 ${one} g이 사과 한 개의 무게입니다.`:`두 무게의 차이 ${one*2} g은 사과 2개의 무게입니다. 한 개 ${one} g이므로 빈 상자는 ${box} g입니다.`;}
 }
 if(stage===13){const low=r(5,15)*100,diff=r(2,8)*100,high=low+diff,total=low+high;
  if(type===0||type===2||type===5){const weight=type===5;lines(`${weight?'밀가루':'물'} ${weight?mass(total):cap(total)}를 두 ${weight?'봉지':'병'}에 모두 나누어 담았습니다.`,`큰 쪽에 ${weight?mass(diff):cap(diff)} 더 많습니다.`,'작은 쪽과 큰 쪽의 양을 각각 구하세요.');num('작은 쪽',low,weight?'g':'mL');num('큰 쪽',high,weight?'g':'mL');q.explanation=`(${total} − ${diff}) ÷ 2 = ${low}, ${low} + ${diff} = ${high}입니다.`;}
  if(type===1){const used=500;lines(`떡 ${mass(total+used)} 중 ${used} g을 먹었습니다.`,`남은 떡을 두 봉지에 모두 나누어 담으니 무게 차이가 ${diff} g입니다.`,'작은 봉지의 떡은 몇 g인가요?');num('작은 봉지',low,'g');q.explanation=`남은 떡은 ${total} g입니다. (${total} − ${diff}) ÷ 2 = ${low} g입니다.`;}
  if(type===3){const d1=200,d2=300,mid=low+d1,max=mid+d2;lines(`물 ${cap(low+mid+max)}를 가·나·다 그릇에 가득 나누어 담았습니다.`,'가보다 나에 200 mL 더 많고, 나보다 다에 300 mL 더 많습니다.','가 그릇의 들이는 몇 mL인가요?');num('가 그릇',low,'mL');q.explanation=`가의 양 3개보다 200 + 500 = 700 mL 더 많습니다. (${low+mid+max} − 700) ÷ 3 = ${low} mL입니다.`;fact('세 그릇',low+mid+max,low*3+700);}
  if(type===4){const small=pick([200,300,400]),total=small*7,remain=600;lines(`물 ${cap(total+remain)}를 큰 통 2개와 작은 통 3개에 가득 담으니 ${remain} mL가 남았습니다.`,'큰 통의 들이는 작은 통의 2배입니다. 큰 통의 들이는 몇 mL인가요?');num('큰 통',small*2,'mL');q.explanation=`큰 통 2개는 작은 통 4개와 같습니다. (${total+remain} − ${remain}) ÷ 7 × 2 = ${small*2} mL입니다.`;fact('일곱 통',small*2*2+small*3,total);}
  fact('두 양의 합',low+high,total);fact('두 양의 차',high-low,diff);
 }
 if(stage===14){
  if(type===0){const limit=pick([1000,2000,3000]),item=pick([60,80,120,150]),empty=200,available=limit-empty,n=Math.floor(available/item);lines(`전체 무게 ${limit} kg까지 허용하는 다리를 건너려고 합니다.`,`빈 트럭은 ${empty} kg이고, 상자 한 개는 ${item} kg입니다.`,'상자를 최대 몇 개 실을 수 있나요?');num('최대 개수',n,'개');q.explanation=`짐은 ${available} kg까지 실을 수 있습니다. ${n}개는 ${n*item} kg, ${n+1}개는 ${(n+1)*item} kg이므로 최대 ${n}개입니다.`;fact('최대 허용',Number(n*item<=available&&(n+1)*item>available),1);}
  if(type===1||type===3){const item=pick([60,80,120]),count=r(25,65),limit=1000,per=Math.floor(limit/item),trucks=Math.ceil(count/per);lines(`${item} kg짜리 상자 ${count}개를 트럭으로 모두 옮깁니다.`,'트럭 한 대에는 짐을 1 t까지 실을 수 있습니다.','상자는 나누지 않습니다. 트럭은 적어도 몇 대 필요한가요?');num('최소 트럭 수',trucks,'대');q.explanation=`한 대에 최대 ${per}개를 실을 수 있습니다. ${count} ÷ ${per}의 몫${count%per?'에 1을 더하면':'은'} ${trucks}대입니다.`;fact('실제 적재',Number(trucks*per>=count&&(trucks-1)*per<count),1);}
  if(type===2||type===5){const size=pick([300,400,500]),total=type===5?size*r(4,8):size*r(4,8)+100,n=Math.ceil(total/size);lines(`주스 ${cap(total)}를 들이가 ${size} mL인 병에 모두 나누어 담습니다.`,'병은 적어도 몇 개 필요한가요?');num('병의 수',n,'개');q.explanation=`${total} ÷ ${size} = ${Math.floor(total/size)}${total%size?'…'+total%size:''}이므로 ${n}개입니다.`;}
  if(type===4){const limit=3500,boxes=26,box=80,removed=10,kicks=50,kick=25,removedKick=15,load=(boxes-removed)*box+(kicks-removedKick)*kick;lines('짐을 3 t 500 kg까지 싣는 승강기에 80 kg짜리 상자 26개와 25 kg짜리 기계 50개를 실었습니다.','상자 10개와 기계 15개를 내렸습니다. 더 실을 수 있는 무게는 몇 kg인가요?');num('더 실을 무게',limit-load,'kg');q.explanation=`남은 짐은 16 × 80 + 35 × 25 = ${load} kg입니다. 3500 − ${load} = ${limit-load} kg입니다.`;}
 }
 if(stage===15){const price=pick([1200,1600,2000]),unitWeight=400,per100=price/4;
  if(type===0){lines(`과일 400 g의 값은 ${price}원입니다.`,'무게에 비례해 값을 매길 때 1 kg의 값은 얼마인가요?');num('가격',per100*10,'원');q.explanation=`100 g은 ${per100}원, 1 kg은 ${per100} × 10 = ${per100*10}원입니다.`;}
  if(type===1||type===2){const x=per100*10,y=6000*1.5,cost=x+y;lines(`토마토 400 g의 값은 ${price}원, 귤 1 kg의 값은 6000원입니다.`,'토마토 1 kg과 귤 1 kg 500 g을 샀습니다.',type===1?'모두 얼마인가요?':'20000원을 내면 거스름돈은 얼마인가요?','무게에 비례해 값을 매깁니다.');num(type===1?'총가격':'거스름돈',type===1?cost:20000-cost,'원');q.explanation=`토마토 ${x}원 + 귤 ${y}원 = ${cost}원입니다.${type===2?' 거스름돈은 '+(20000-cost)+'원입니다.':''}`;}
  if(type===3){const weight=pick([300,500,700]),cost=per100*weight/100;lines(`과자 400 g의 값은 ${price}원입니다.`,`무게에 비례해 값을 매길 때 ${cost}원어치는 몇 g인가요?`);num('무게',weight,'g');q.explanation=`100 g에 ${per100}원이므로 ${cost} ÷ ${per100} × 100 = ${weight} g입니다.`;}
  if(type===4){const servings=pick([6,8,10]),cups=servings,amount=cups*200;lines('수프 2인분에는 소스 2컵이 필요합니다.',`같은 비율로 ${servings}인분을 만들려고 합니다. 한 컵은 200 mL입니다.`,'필요한 소스는 몇 mL인가요?');num('소스',amount,'mL');q.explanation=`${servings}인분은 2인분의 ${servings/2}배입니다. 2 × ${servings/2} × 200 = ${amount} mL입니다.`;}
  if(type===5){const count=r(12,30),one=500;lines(`한 개가 ${one} g인 열매를 ${count}개 땄습니다.`,'열매의 전체 무게는 몇 kg 몇 g인가요?');num('kg',Math.floor(count*one/1000),'kg');num('g',count*one%1000,'g');q.explanation=`500 × ${count} = ${count*one} g = ${mass(count*one)}입니다.`;}
 }
 if(stage===16){const x=r(3,8)*100,y=r(2,5)*50;
  if(type===0||type===1){const one=r(2,7)*20;lines(`지우개 5개와 풀 4개의 무게가 같고, 풀 2개와 가위 1개의 무게가 같습니다.`,`지우개 한 개가 ${one} g일 때 ${type===0?'가위 1개':'가위 2개'}의 무게는 몇 g인가요?`);q.visual={kind:'balances',items:[{left:'지우개',right:'풀',leftCount:5,rightCount:4,leftMass:one*5,rightMass:one*5},{left:'풀',right:'가위',leftCount:2,rightCount:1,leftMass:one*2.5,rightMass:one*2.5}]};num('무게',one*2.5*(type===0?1:2),'g');q.explanation=`풀 4개의 무게는 ${one*5} g입니다. 가위 1개는 그 절반인 ${one*2.5} g입니다.`;}
  if(type===2||type===3||type===5){const sum=3*x+2*y,diff=3*x-2*y;lines(`가 물건 3개와 나 물건 2개의 무게를 더하면 ${sum} g입니다.`,`가 물건 3개의 무게에서 나 물건 2개의 무게를 빼면 ${diff} g입니다.`);if(type===2){lines('가 물건 한 개의 무게를 구하세요.');choice('나를 없애려면',['두 식 더하기','두 식 빼기'],'두 식 더하기');num('가 한 개',x,'g');}if(type===3){lines('나 물건 한 개의 무게를 구하세요.');choice('가를 없애려면',['두 식 더하기','두 식 빼기'],'두 식 빼기');num('나 한 개',y,'g');}if(type===5){lines('가 물건 5개의 무게를 구하세요.');num('가 5개',x*5,'g');}q.explanation=`두 식을 더하면 가 6개가 ${sum+diff} g이므로 가 한 개는 ${x} g입니다. 나 한 개는 ${y} g입니다.`;fact('더해 없애기',sum+diff,6*x);fact('빼서 없애기',sum-diff,4*y);}
  if(type===4){const milk=300,juice=400;lines('우유 2병과 주스 5병의 들이의 합은 2 L 600 mL입니다.','우유 4병과 주스 1병의 들이의 합은 1 L 600 mL입니다.','같은 종류의 병은 들이가 같습니다. 우유 3병과 주스 3병은 모두 몇 mL인가요?');num('합한 들이',milk*3+juice*3,'mL');q.explanation='두 조건을 더하면 우유 6병과 주스 6병이 4200 mL입니다. 그 절반은 2100 mL입니다.';fact('조건1',2*milk+5*juice,2600);fact('조건2',4*milk+juice,1600);}
 }
 if(stage===17){const inflow=pick([400,500,600]),out=100,net=inflow-out,time=pick([10,15,20]),capacity=net*time;
  if(type===0){lines('가 수도에서는 1초에 250 mL, 나 수도에서는 1초에 150 mL씩 물이 나옵니다.','두 수도를 동시에 틀어 빈 2 L 물통을 채웁니다. 몇 초 걸리나요?');num('초당 들어오는 양',400,'mL');num('걸리는 시간',5,'초');q.explanation='1초에 250 + 150 = 400 mL이므로 2000 ÷ 400 = 5초입니다.';}
  if(type===1||type===3){const initial=type===3?net*2:0;lines(`들이가 ${cap(capacity)}인 물통에 ${initial?cap(initial)+'의 물이 있습니다.':'물이 없습니다.'}`,`1초에 ${inflow} mL씩 들어오고 ${out} mL씩 빠져나갑니다.`,'물통을 가득 채우는 데 몇 초 걸리나요?');num('초당 늘어나는 양',net,'mL');num('걸리는 시간',(capacity-initial)/net,'초');q.explanation=`1초에 ${inflow} − ${out} = ${net} mL씩 늘어납니다. ${capacity-initial} ÷ ${net} = ${(capacity-initial)/net}초입니다.`;fact('물 보존',initial+net*((capacity-initial)/net),capacity);}
  if(type===2){lines('수도에서는 2초에 1 L 500 mL씩 물이 나옵니다.','1초에 350 mL씩 빠져나가는 빈 6 L 물통을 채웁니다. 몇 초 걸리나요?');num('초당 들어오는 양',750,'mL');num('걸리는 시간',15,'초');q.explanation='1초에 1500 ÷ 2 = 750 mL가 들어옵니다. 6000 ÷ (750 − 350) = 15초입니다.';}
  if(type===4){lines(`빈 수조에 1초에 ${inflow} mL씩 물이 들어오고 ${out} mL씩 빠져나갑니다.`,`${time}초 뒤 수조에 모인 물은 몇 mL인가요?`,'수조는 넘치지 않을 만큼 큽니다.');num('모인 물',capacity,'mL');q.explanation=`(${inflow} − ${out}) × ${time} = ${capacity} mL입니다.`;}
  if(type===5){lines(`빈 ${cap(capacity)} 수조에 1초에 ${inflow} mL씩 물을 넣었습니다.`,`동시에 일정하게 물을 빼니 ${time}초 뒤 가득 찼습니다.`,'1초에 몇 mL씩 물을 뺐나요?');num('빠져나간 양',out,'mL');q.explanation=`초당 늘어난 양은 ${capacity} ÷ ${time} = ${net} mL입니다. ${inflow} − ${net} = ${out} mL입니다.`;}
  q.visual={kind:'flow',container:type<4?'물통':'수조',capacity:type===0?2000:type===2?6000:type===4?null:capacity,initial:type===3?net*2:0,inflow:type===0?400:type===2?'1500 mL / 2초':inflow,outflow:type===0?0:type===2?350:type===5?'?':out};
 }
 reviewQuestion(q,{r,pick,cap,mass});restoreQuestion(q,seed);validateQuestion(q);return q;
}
export function validateQuestion(q){
 if(!q.lines.length||!q.fields.length||!q.explanation)throw Error('불완전한 문항');
 for(const f of q.fields){if(f.kind==='number'&&(!/^\d+$/.test(f.answer)||Number(f.answer)>10000000))throw Error(`정수가 아닌 답: ${q.stage}/${q.type}`);if(f.kind==='multi'&&(!Array.isArray(f.answer)||!f.answer.length||new Set(f.answer).size!==f.answer.length||f.answer.some(x=>!f.options.includes(x))))throw Error('잘못된 복수 선택 정답');if(f.kind!=='multi'&&f.options&&!f.options.includes(f.answer))throw Error('선택지에 없는 답');if(f.options&&new Set(f.options).size!==f.options.length)throw Error('중복 선택지');}
 for(const f of q.facts)if(f.left!==f.right)throw Error(`수학 검증 실패: ${f.label}`);
 if(q.visual?.kind==='vessels')for(const v of q.visual.values)if(v<0||v>q.visual.max)throw Error('용량 초과');
 if(q.visual?.kind==='dial'&&(q.visual.value<0||q.visual.value>q.visual.max||q.visual.value%q.visual.step))throw Error('저울 범위');
 return true;
}
export function publicQuestion(q){const {explanation,facts,...rest}=q;return {...rest,fields:q.fields.map(({answer,...f})=>f)};}
export function grade(q,answers){const wrong=q.fields.map((f,i)=>{const answer=answers[i];if(f.kind==='multi')return Array.isArray(answer)&&new Set(answer).size===answer.length&&JSON.stringify([...answer].sort())===JSON.stringify([...f.answer].sort())?-1:i;return String(answer??'').trim()===f.answer?-1:i;}).filter(i=>i>=0);return {ok:!wrong.length,wrong};}

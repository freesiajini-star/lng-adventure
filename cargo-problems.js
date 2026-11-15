// Fictional conditions, expressed internally in kg. Every allocation is constructed.
export const CARGO_SCENES=[
 ['철근 운반','트럭','대','철근','철근 묶음','개','개',[10,20,25,30],[5,10,20],[1000,2000,3000],'truck','rod','carrier-11'],
 ['사과 창고','창고 한 칸','칸','사과 상자','배 상자','상자','상자',[10,15,20,25],[10,20],[1000,2000,3000],'warehouse','apple','pear'],
 ['밀가루와 설탕','트럭','대','밀가루 포대','설탕 포대','포대','포대',[10,20],[5,10],[1000,2000,3000],'truck','carrier-11','carrier-11'],
 ['연결된 화물열차','화물칸','칸','페인트통','모래 자루','통','자루',[20,25,40,50],[5,8,10,20],[1000,2000,3000],'freightTrain','paint','carrier-11'],
 ['도서관 책 운반','운반 수레','대','책 상자','그림책 상자','상자','상자',[5,10,15,20],[5,10],[100,150,200],'carrier-13','limit-6-0','limit-6-1'],
 ['택배차에 소포 싣기','택배차','대','소포','택배 상자','개','개',[5,10,20,25],[5,10,20],[400,600,800,1000],'truck','carrier-11','carrier-11'],
 ['학교 체육창고','선반 한 칸','칸','체육용품 상자','공 상자','개','개',[4,5,8,10],[4,5,10],[40,60,80,100,120],'storageShelf','soccerBall','carrier-11'],
 ['이삿짐 승강기','승강기','번','이삿짐 상자','책 상자','개','개',[10,15,20,25],[5,10,20],[400,600,800,1000],'carrier-8','carrier-11','limit-2-0'],
 ['쌀 포대 옮기기','손수레','번','쌀 포대','곡물 포대','포대','포대',[10,15,20,25],[5,10],[100,150,200,250],'carrier-13','rice','carrier-11'],
 ['과일 배달','배달 차량','대','사과 상자','배 상자','상자','상자',[10,20,25],[10,20],[1000,2000,3000],'truck','apple','pear'],
 ['화물선 컨테이너','화물칸','칸','컨테이너','작은 컨테이너','개','개',[2000,3000,4000,6000],[1000,2000],[6000,12000,18000,24000],'cargoShip','carrier-11','carrier-11'],
 ['공사장 벽돌','운반 수레','대','벽돌','작은 벽돌','장','장',[2,3,4,5],[2,3],[40,60,100,120],'carrier-13','carrier-11','carrier-11'],
 ['재활용품 수거','수거 차량','대','종이 묶음','플라스틱 묶음','묶음','묶음',[10,20,25],[5,10,20],[1000,2000,3000,4000],'truck','limit-18-2','limit-18-5'],
 ['공연장 무대 장비','장비 수레','대','스피커','조명 상자','개','개',[20,30,40,50],[10,15,20,25],[200,300,400,500],'carrier-13','carrier-11','carrier-11'],
 ['농장 감자 운반','운반 차량','대','감자 상자','고구마 상자','상자','상자',[10,15,20,25],[10,20],[300,400,600,800,1000],'truck','potato','sweetPotato'],
 ['대형 화분 운반','운반 카트','대','화분','작은 화분','개','개',[10,20,25,35,40],[5,10,20],[100,150,200,250,300],'carrier-13','plant-flower','plant-lettuce'],
 ['책상과 의자 배송','배송 차량','대','책상','의자','개','개',[15,20,30,40],[5,10,15],[300,500,600,800,1000],'truck','carrier-11','carrier-11'],
 ['박물관 전시품','운반 수레','대','조각품','받침대','개','개',[20,25,50],[10,20,25],[150,200,250,300,400],'carrier-13','metalWeight','plate'],
 ['공항 화물 운반','화물 운반차','대','화물 상자','작은 화물 상자','개','개',[10,20,30,40],[5,10,20],[500,600,800,1000,1500],'truck','carrier-11','carrier-11'],
 ['창고의 여러 선반','선반','개','물품 상자','작은 상자','개','개',[10,15,20,25],[5,10,20,25],[100,150,200,250],'storageShelf','carrier-11','carrier-11']
];
export const cargoMass=n=>n>=1000&&n%1000===0?n/1000+' t':n+' kg';
export function makeCargoQuestion(q,seed,forcedForm){
 let x=(seed+9143)>>>0;const random=()=>{x+=0x6D2B79F5;let t=x;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;},r=(a,b)=>a+Math.floor(random()*(b-a+1)),pick=a=>a[r(0,a.length-1)];
 const form=forcedForm??((seed>>>0)%5),scene=Math.floor((seed>>>0)/5)%20,s=CARGO_SCENES[scene], [title,carrier,carrierUnit,a,b,aUnit,bUnit,weights,weightsB,capacities,carrierArt,artA,artB]=s;
 let capacity=pick(capacities),one=pick(weights),two=pick(weightsB),count=0,first=0,bins=1,loaded=0,answer,unit,question,explanation,allocations=[];
 if(form>=2&&one+two>capacity){one=Math.min(...weights);two=Math.min(...weightsB);}
 const per=Math.floor(capacity/one);if(!per)throw Error('Cargo cannot fit');
 if(form===0){
  count=r(Math.max(2,per-2),Math.min(600,per*3+1));
  if(scene===2){one=20;two=10;capacity=pick([1000,2000,3000]);count=r(2,8)*10;first=r(2,8)*10;let leftA=count,leftB=first;while(leftA||leftB){const takeA=Math.min(leftA,Math.floor(capacity/one));leftA-=takeA;const takeB=Math.min(leftB,Math.floor((capacity-takeA*one)/two));leftB-=takeB;allocations.push({a:takeA,b:takeB,weight:takeA*one+takeB*two});}answer=allocations.length;question=`한 포대에 ${one} kg인 밀가루 ${count}포대와 한 포대에 ${two} kg인 설탕 ${first}포대를 옮깁니다. ${carrier} 한 대에 짐을 ${cargoMass(capacity)}까지 싣습니다. 한 번에 모두 옮기려면 적어도 몇 대가 필요한가요?`;explanation=`전체 무게는 ${one} × ${count} + ${two} × ${first} = ${one*count+two*first} kg입니다. 한 대에 ${capacity} kg까지 나누어 실으면 최소 ${answer}대입니다.`;}
  else{answer=Math.ceil(count/per);let left=count;for(let i=0;i<answer;i++){const n=Math.min(per,left);left-=n;allocations.push({a:n,b:0,weight:n*one});}question=`한 ${aUnit==='장'?'장':aUnit==='포대'?'포대':aUnit==='상자'?'상자':'개'}에 ${cargoMass(one)}인 ${a} ${count}${aUnit}를 옮깁니다. ${carrier}에 한 번에 ${cargoMass(capacity)}까지 ${carrierUnit==='칸'||carrierUnit==='개'?'보관할 수 있습니다':'실을 수 있습니다'}. ${carrierUnit==='번'?'모두 옮기려면 적어도 몇 번 운반해야':'한 번에 모두 나누어 담으려면 '+carrier+'은 적어도 몇 '+carrierUnit+'가 필요할'}까요?`;explanation=`한 곳에 최대 ${Math.floor(capacity/one)}${aUnit}를 담습니다. ${count} ÷ ${Math.floor(capacity/one)}의 몫에 ${count%Math.floor(capacity/one)?'1을 더해':'0을 더해'} ${answer}${carrierUnit}입니다.`;}
  unit=carrierUnit;
 }else if(form===1){
  loaded=scene===7?r(1,3)*100:r(0,Math.max(0,Math.floor(capacity/one/3)))*one;loaded=Math.min(loaded,capacity-one);answer=Math.floor((capacity-loaded)/one);unit=aUnit;
  question=`${carrier}의 ${scene===7?'사람과 짐을 합한 무게':'짐 무게'} 한도는 ${cargoMass(capacity)}입니다. ${loaded?scene===7?'사람들의 무게는 모두 '+loaded+' kg입니다. ':'이미 '+loaded+' kg을 실었습니다. ':''}${a} 한 ${aUnit==='상자'?'상자':aUnit==='포대'?'포대':aUnit==='장'?'장':'개'}는 ${cargoMass(one)}입니다. 최대 몇 ${aUnit}를 더 ${carrierUnit==='칸'||carrierUnit==='개'?'올려놓을':'실을'} 수 있나요?`;
  allocations=[{a:answer,b:0,weight:loaded+one*answer}];explanation=`${capacity} − ${loaded} = ${capacity-loaded} kg, ${capacity-loaded} ÷ ${one}의 몫은 ${answer}입니다. ${answer+1}${aUnit}는 한도를 넘습니다.`;
 }else if(form===2){
  const firstMass=r(1,Math.max(1,Math.floor((capacity-two)/one/3)))*one,secondMass=r(1,Math.max(1,Math.floor((capacity-firstMass)/two/2)))*two;loaded=firstMass+secondMass;answer=capacity-loaded;unit='kg';
  question=`${carrier}의 짐 무게 한도는 ${cargoMass(capacity)}입니다. ${a} ${cargoMass(firstMass)}과 ${b} ${cargoMass(secondMass)}을 실었습니다. 몇 kg을 더 실을 수 있나요?`;
  allocations=[{a:0,b:0,weight:loaded}];q.cargoLoads=[firstMass,secondMass];explanation=`${firstMass} + ${secondMass} = ${loaded} kg, ${capacity} − ${loaded} = ${answer} kg입니다.`;
 }else if(form===3){
  first=r(1,Math.max(1,Math.floor(capacity/one/2)));loaded=first*one;answer=Math.floor((capacity-loaded)/two);unit=bUnit;
  question=`${carrier}에 짐을 ${cargoMass(capacity)}까지 실을 수 있습니다. 한 ${aUnit==='상자'?'상자':'개'}에 ${cargoMass(one)}인 ${a} ${first}${aUnit}를 먼저 실었습니다. 한 ${bUnit==='자루'?'자루':bUnit==='상자'?'상자':'개'}에 ${cargoMass(two)}인 ${b}를 최대 몇 ${bUnit} 더 실을 수 있나요?`;
  allocations=[{a:first,b:answer,weight:loaded+answer*two}];explanation=`${one} × ${first} = ${loaded} kg, ${capacity} − ${loaded} = ${capacity-loaded} kg입니다. ${capacity-loaded} ÷ ${two}의 몫인 ${answer}${bUnit}까지 실을 수 있습니다.`;
 }else{
  bins=r(2,6);first=r(1,Math.max(1,Math.floor(capacity/one/2)));loaded=first*one;const room=capacity-loaded;const divisors=weightsB.filter(n=>room%n===0);two=divisors.length?pick(divisors):pick(weightsB);const each=Math.floor(room/two);answer=each*bins;unit=bUnit;
  allocations=Array.from({length:bins},()=>({a:first,b:each,weight:loaded+each*two}));
  question=`짐을 각각 ${cargoMass(capacity)}까지 담는 ${carrier} ${bins}${carrierUnit==='번'?'대':carrierUnit}가 있습니다. 각 ${carrier}에 ${cargoMass(one)}인 ${a}를 ${first}${aUnit}씩 담았습니다. ${cargoMass(two)}인 ${b}를 각 곳에 나누어 최대 몇 ${bUnit} 더 담을 수 있나요?`;
  explanation=`한 곳의 남은 한도는 ${capacity} − ${one} × ${first} = ${room} kg입니다. 한 곳에 ${Math.floor(room/two)}${bUnit}씩, ${bins}곳에 모두 ${each} × ${bins} = ${answer}${bUnit}를 담습니다.`;
 }
 if(!Number.isInteger(answer)||answer<0||allocations.some(v=>v.weight>capacity||v.weight<0))throw Error('Invalid physical cargo allocation');
 const batchim=s=>(s.charCodeAt(s.length-1)-0xac00)%28!==0;
 question=question.replaceAll(carrier+'은',carrier+(batchim(carrier)?'은':'는')).replace('운반해야까요','운반해야 할까요').replaceAll('한 '+carrier+'에','각 '+carrier+'에').replace(/(개|상자|포대|통|자루|칸|대|묶음|장|번|곳)(를|가)(?=\s)/g,(_,noun,part)=>noun+(part==='를'?(batchim(noun)?'을':'를'):(batchim(noun)?'이':'가')));
 if(form===4)question=question.replaceAll('한 칸 '+bins+'칸',bins+'칸')+' 먼저 담은 물건은 옮기지 않습니다.';
 q.source='심화122:5-1~5-4 생활 확장';q.lines=[question,'물건을 나누거나 쪼개지 않습니다. 문제에서 정한 가상의 한도이며, 운반 기구 자체의 무게는 한도에 포함하지 않습니다.'];q.fields=[{kind:'number',label:form===0?'필요한 최소 수':form===2?'남은 한도':'최대 개수',unit,answer:String(answer)}];q.explanation=explanation;q.facts=[];q.work=[];
 q.visual={kind:'cargoSituation',scene,form,title,carrier,carrierUnit,a,b,aUnit,bUnit,one,two,capacity,count,first,bins,loaded,allocations,carrierArt,artA,artB,...(q.cargoLoads?{loads:q.cargoLoads}:{})};delete q.cargoLoads;return q;
}

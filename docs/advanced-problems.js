import {makeScaleQuestion} from './scale-problems.js?v=179a427bc0f8';
const rng=seed=>{let x=seed>>>0;return()=>{x+=0x6D2B79F5;let z=x;z=Math.imul(z^z>>>15,z|1);z^=z+Math.imul(z^z>>>7,z|61);return((z^z>>>14)>>>0)/4294967296;}};
const mass=n=>n<1000?n+' g':Math.floor(n/1000)+' kg'+(n%1000?' '+n%1000+' g':'');
const numeric=(label,answer)=>({kind:'number',label,answer:String(answer),unit:'g'});
// Name, ImageGen asset, plausible range (g), integer step. All quantities are
// generated first, then used to construct the displayed constraints.
export const RELATION_OBJECTS={
 bread:['빵','breadRoll',60,120,10],milk:['작은 우유 팩','milkCarton',200,250,10],pencilCase:['빈 필통','pencilCase',80,150,10],notebook:['공책','limit-16-0',150,250,10],
 baseball:['야구공','baseball',142,149,1],tennis:['테니스공','tennisBall',56,59,1],apple:['사과','apple',180,300,10],mandarin:['귤','mandarin',80,130,5],doll:['작은 인형','limit-2-1',300,600,50],car:['장난감 자동차','limit-14-1',150,300,10],
 eraser:['지우개','eraser',20,40,5],glue:['풀','glue',40,80,5],block:['나무 블록','toyBlock',40,100,10],robot:['장난감 로봇','limit-2-2',200,500,20],chocolate:['초콜릿','chocolate',30,60,5],snack:['쿠키 상자','limit-4-1',100,200,10],pencil:['연필','pencil',5,10,1],coloredPencil:['색연필 상자','limit-16-1',150,300,10],
 macaron:['마카롱','macaron',15,25,5],cookie:['쿠키','cookie',30,60,5],cookieJar:['빈 과자통','cookieJar',200,350,10],box:['빈 선물 상자','carrier-11',80,180,10],lunchBox:['빈 도시락통','lunchBox',200,350,10],riceBall:['주먹밥','riceBall',70,120,10],marble:['유리구슬','marble',10,20,5],bottle:['빈 유리병','juiceBottle-empty',150,300,10],piggy:['빈 저금통','piggyBank',200,400,10],coin:['놀이용 동전','toyCoin',5,5,1],
 sneaker:['운동화 한 짝','sneaker',200,350,10],slipper:['슬리퍼 한 짝','slipper',80,180,10],paper:['색종이 묶음','origamiPack',80,150,10],sticker:['스티커북','stickerBook',200,350,10],fishBread:['붕어빵','fishBread',80,130,10],hotteok:['호떡','hotteok',90,160,10],paintTube:['물감 튜브','paintTube',50,100,10],brush:['붓','brush',10,25,5],hairPin:['머리핀','hairPin',10,20,5],headband:['머리띠','headband',30,60,5],dogTreat:['강아지 비스킷','dogTreat',10,25,5],soil:['흙 주머니','soilBag',150,300,10],pot:['빈 화분','plantPot',200,400,10],book:['두꺼운 책','limit-2-0',400,650,50],capsule:['빈 캡슐','capsule',15,30,5],
 honeyRice:['꿀떡','honeyRiceCake',20,40,5],yakgwa:['약과','yakgwa',30,60,5],jelly:['젤리 봉지','jellyBag',60,100,10],cupcake:['컵케이크','cupcake',90,160,10],donut:['도넛','donut',60,100,10],gimbap:['김밥 한 줄','gimbap',250,350,10],inari:['유부초밥','inari',40,70,5],melon:['참외','koreanMelon',300,400,10],tomato:['방울토마토','tomato',15,25,5],banana:['바나나','banana',100,160,10],kiwi:['키위','kiwi',70,110,5],potato:['감자','potato',120,220,10],carrot:['당근','carrot',70,150,10],sweetPotato:['고구마','sweetPotato',150,300,10],corn:['옥수수','corn',150,250,10],strawberry:['딸기','strawberry',15,30,5],marker:['사인펜 상자','markerBox',140,220,10],correction:['수정테이프','correctionTape',20,40,5],bookmark:['책갈피','bookmark',5,15,5],keyring:['키링','keyring',15,30,5],saucer:['화분 받침','saucer',80,150,10],towel:['마른 수건','towel',150,250,10],soap:['비누','soap',80,120,10],cushion:['작은 쿠션','cushion',300,600,50]
};
export const SUBSTITUTION_SCENES=[
 ['빵과 우유','difference','bread','milk'],['가방 정리','difference','pencilCase','notebook'],['운동용품 정리','difference','baseball','tennis'],['과일 바구니','difference','apple','mandarin'],['장난감 상자','difference','doll','car'],
 ['과일 무게 바꾸기','ratio','mandarin','apple'],['문구점 꾸러미','ratio','eraser','glue'],['블록과 로봇','ratio','block','robot'],['간식 꾸러미','ratio','chocolate','snack'],['나무 블록 장난감','ratio','block','robot'],
 ['필통 속 물건','compare','pencil','eraser'],['과일 봉지','compare','mandarin','apple'],['학용품 세트','compare','notebook','coloredPencil'],['장난감 꾸러미','compare','block','car'],['디저트 상자','compare','macaron','cookie'],
 ['과자와 과자통','contents','cookie','cookieJar'],['선물 포장','contents','car','box'],['소풍 도시락','known','riceBall','lunchBox'],['구슬병','known','marble','bottle'],['놀이용 저금통','known','coin','piggy'],
 ['한 켤레의 무게','pairs','sneaker','slipper'],['학급 선물','compare','paper','sticker'],['겨울 간식','compare','fishBread','hotteok'],['블록 작품','extend','block','block'],['미술 준비물','compare','paintTube','brush'],
 ['액세서리','ratio','hairPin','headband'],['반려동물 간식통','package','dogTreat','cookieJar'],['작은 화분','known','soil','pot'],['책가방 정리','compare','notebook','book'],['캡슐 장난감','capsule','block','capsule']
];
export const TWO_EQUATION_SCENES=[
 ['겨울 간식','fishBread','hotteok'],['디저트 상자','macaron','cookie'],['명절 간식','honeyRice','yakgwa'],['간식 봉지','jelly','chocolate'],['빵집 진열','cupcake','donut'],['소풍 도시락','gimbap','inari'],
 ['과일 선물','apple','mandarin'],['과일가게','melon','tomato'],['과일 샐러드','banana','kiwi'],['장보기','potato','carrot'],['농산물 직거래','sweetPotato','corn'],['작은 과일 컵','strawberry','tomato'],
 ['책가방 준비물','notebook','pencilCase'],['미술 준비','coloredPencil','marker'],['장난감 정리','block','keyring'],['장난감 선물','car','robot'],['문구점 세트','eraser','correction'],['학급 선물','bookmark','keyring'],
 ['반려동물 꾸러미','snack','dogTreat'],['원예 체험','pot','saucer'],['소풍 가방','bottle','lunchBox'],['체육 창고','baseball','tennis'],['목욕 준비물','towel','soap'],['방 꾸미기','doll','cushion']
];
export function makeRelationQuestion(q,seed,sceneIndex,forceStructure){
 const two=q.type!==6,scenes=two?TWO_EQUATION_SCENES:SUBSTITUTION_SCENES,index=sceneIndex??Math.floor((seed>>>0)/(two?4:3))%scenes.length,scene=scenes[index];
 const random=rng(seed+34897+index*101),r=(a,b)=>a+Math.floor(random()*(b-a+1)),pick=a=>a[r(0,a.length-1)];
 let [title,structure,ak,bk]=two?[scene[0],forceStructure||['sameA','sumDifference','sameB'][index%3],scene[1],scene[2]]:scene;
 let A=RELATION_OBJECTS[ak],B=RELATION_OBJECTS[bk],x=r(Math.ceil(A[2]/A[4]),Math.floor(A[3]/A[4]))*A[4],y=r(Math.ceil(B[2]/B[4]),Math.floor(B[3]/B[4]))*B[4];
 let rows=[],lines=[],fields=[],audit={family:two?'twoEquations':'substitution',index,structure,title};
 const term=(a,b,op='+')=>({a,b,op,total:a*x+(op==='−'?-1:1)*b*y});
 const wording=row=>`${A[0]} ${row.a}개${row.b?'와 '+B[0]+' '+row.b+'개':''}의 무게${row.op==='−'?' 차이':' 합'}는 ${mass(row.total)}입니다.`;
 if(two||structure==='compare'){
  if(structure==='sumDifference'){
   if(x<y){[A,B]=[B,A];[ak,bk]=[bk,ak];[x,y]=[y,x];}
   const a=r(2,4),b=1;rows=[term(a,b),term(a,b,'−')];
   lines=[`${A[0]} ${a}개와 ${B[0]} ${b}개의 무게를 더하면 ${mass(rows[0].total)}입니다.`,`${A[0]} ${a}개의 무게에서 ${B[0]} ${b}개의 무게를 빼면 ${mass(rows[1].total)}입니다.`];
  }else{const a=r(1,3),b=r(1,3),delta=r(1,3);rows=structure==='sameB'||!two?[term(a,b),term(a+delta,b)]:[term(a,b),term(a,b+delta)];lines=rows.map(wording);}
  fields=[numeric(A[0]+' 한 개',x),numeric(B[0]+' 한 개',y)];
 }else if(structure==='difference'||structure==='pairs'){
  if(x===y)y=B[2]!==x?B[2]:B[3];const diff=Math.abs(x-y),heavy=x>y?A:B,light=x>y?B:A;
  rows=[term(1,1)];lines=[`${heavy[0]}의 무게는 ${light[0]}보다 ${diff} g 무겁습니다.`,`${A[0]}과 ${B[0]}의 무게 합은 ${mass(x+y)}입니다.`];fields=[numeric(A[0]+(structure==='pairs'?' 두 짝':' 한 개'),x*(structure==='pairs'?2:1)),numeric(B[0]+(structure==='pairs'?' 두 짝':' 한 개'),y*(structure==='pairs'?2:1))];
 }else if(structure==='ratio'){
  const possibilities=[];for(let n=2;n<=5;n++)for(let w=A[2];w<=A[3];w+=A[4])if(w*n>=B[2]&&w*n<=B[3])possibilities.push([n,w]);
  const [n,w]=pick(possibilities);x=w;y=n*w;const a=r(1,3),b=r(1,2);rows=[{a:n,b:-1,op:'=',total:0},term(a,b)];
  lines=[`${A[0]} ${n}개의 무게는 ${B[0]} 한 개의 무게와 같습니다.`,`${A[0]} ${a}개와 ${B[0]} ${b}개의 무게는 모두 ${mass(a*x+b*y)}입니다.`];fields=[numeric(A[0]+' 한 개',x),numeric(B[0]+' 한 개',y)];audit.ratio=n;
 }else if(structure==='extend'){
  const count=r(4,8),extra=r(2,5);rows=[term(count,0)];lines=[`같은 나무 블록 ${count}개로 만든 작품의 무게가 ${mass(count*x)}입니다.`,`같은 블록 ${extra}개를 더 붙이면 작품의 무게는 몇 g인가요?`];fields=[numeric('완성한 작품',(count+extra)*x)];audit.count=count;audit.extra=extra;
 }else{
  const n=structure==='known'&&ak==='marble'||ak==='coin'?r(6,10):r(3,6),m=structure==='package'?n*r(2,3):structure==='capsule'?1:n;
  rows=[term(n,0),{a:m,b:1,op:'+',total:m*x+y}];
  if(structure==='known'){rows=[{a:0,b:1,op:'+',total:y},{a:n,b:1,op:'+',total:n*x+y}];lines=[`${B[0]}의 무게는 ${mass(y)}입니다.`,`${A[0]} ${n}개를 넣었더니 전체 무게가 ${mass(n*x+y)}이 되었습니다.`];fields=[numeric(A[0]+' 한 개',x)];}
  else{lines=[`${A[0]} ${n}개의 무게는 ${mass(n*x)}입니다.`,`${B[0]}에 ${A[0]} ${m}개를 담았더니 전체 무게가 ${mass(m*x+y)}입니다.`];fields=structure==='contents'?[numeric(A[0]+' 한 개',x),numeric(B[0],y)]:[numeric(B[0],y)];}
  audit.count=n;audit.packed=m;
 }
 const condition='같은 종류의 물건은 크기와 무게가 같습니다. '+(structure==='known'||['contents','package','capsule'].includes(structure)?'':'포장재의 무게는 제외합니다.');
 lines.unshift(title+'에서 무게를 비교합니다. '+condition);
 lines.push(structure==='pairs'?'각각 두 짝의 무게는 몇 g인가요?':fields.length===2?'두 물건은 각각 한 개에 몇 g인가요?':structure==='extend'?'':'물음에 답하세요.');
 audit={...audit,keys:[ak,bk],weights:[x,y],rows};
 Object.assign(q,{source:'생활확장16:'+audit.family+':'+index,lines:lines.filter(Boolean),fields,work:[],visual:{kind:'objectEquations',title,labels:[A[0],B[0]],arts:[A[1],B[1]],rows},explanation:`${A[0]} 한 개는 ${x} g, ${B[0]} 한 개는 ${y} g입니다. `+(structure==='pairs'?`두 짝은 각각 ${x*2} g, ${y*2} g입니다.`:structure==='extend'?`${x} × ${audit.count+audit.extra} = ${(audit.count+audit.extra)*x} g입니다.`:'주어진 두 관계에 넣어 확인할 수 있습니다.'),facts:[{label:'생활 관계식',left:1,right:1,audit}]});
 return q;
}
export function reviseAdvanced(q,seed){if(q.stage===15&&[4,5,6].includes(q.type))return makeScaleQuestion(q,seed);if(q.stage===16&&[2,3,4,5,6].includes(q.type))return makeRelationQuestion(q,seed);return q;}

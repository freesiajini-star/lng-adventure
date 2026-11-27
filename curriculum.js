// Source references point to the user-provided printed materials, not to web pages.
export const SOURCE_MAP=[
 ['원리116:1','원리116:2','원리116:3','원리116:2','원리116:4~6','원리116:6'],
 ['원리117:7','원리117:7','원리117:7','원리117:7','원리117:8','원리117:10'],
 ['원리117:11','원리117:12','원리118:13','원리118:14','원리118:15','원리119:23 눈금'],
 ['원리118:16','원리118:16','원리118:16','원리118:16','원리118:18','원리119:21'],
 ['원리119:원리5','원리119:23','원리119:24','원리119:23','원리119:원리5','원리119:원리5 역산'],
 ['원리124:25','원리124:25','원리124:원리6','원리124:원리6','원리124:26','원리124:28'],
 ['원리124:원리7','원리124:원리7','원리124:원리7','원리124:29','원리125:31','원리125:33'],
 ['원리125:34','원리125:원리8','원리125:35','원리125:36','원리125:30 눈금','원리125:30'],
 ['원리126:38','원리126:38','원리126:38','원리126:38','원리127:45','원리126:43'],
 ['원리127:원리10','원리127:47','원리127:원리10','원리127:48','원리127:49','원리127:50'],
 ['심화106:대표','심화106:1-2','심화115:1-1','심화114:대표1','심화115:1-2','심화106:1-3'],
 ['심화107:대표','원리119:20','심화116:대표2','심화117:2-3','심화119:3-1','심화118:대표3'],
 ['심화120:대표4','심화121:4-3','심화121:4-1','심화121:4-4','심화117:2-4','심화121:4-2'],
 ['심화108:대표','심화123:5-1','심화122:대표5 나누어 담기','심화123:5-3','심화108:3-3','심화123:5-4'],
 ['심화124:대표6','심화125:6-2','심화125:6-3','심화125:6-4','심화112:대표7','심화112:7-1'],
 ['심화110:5-1','심화110:대표5','심화126:대표7','심화127:7-2','심화127:7-3','심화127:7-4'],
 ['심화129:8-2','심화128:대표8','심화111:6-3','심화128:대표8 확장','심화129:8-1','심화129:8-4']
];
export function reviewQuestion(q,{r,pick,cap,mass}){
 const {stage:s,type:t}=q;
 q.source=SOURCE_MAP[s-1][t];q.work=[];
 const num=(label,n,unit='')=>({label,answer:String(n),kind:'number',unit});
 const choose=(label,options,answer)=>({label,kind:'choice',options,answer});
 const replace=(lines,fields,visual,explanation)=>Object.assign(q,{lines,fields,visual,explanation,facts:[]});
 if(s===1){
  if(t===0){q.visual={...q.visual,kind:'pour',remainder:q.visual.source-q.visual.target};q.lines=['물병에 물을 가득 담아 빈 꽃병에 모두 부었더니, 꽃병을 채우고도 물이 넘쳤습니다.','물병과 꽃병 중 들이가 더 큰 것을 고르세요.'];}
  if(t===2||t===5){q.lines[0]='두 병에 물을 가득 담아, 모양과 크기가 같은 컵에 옮겼습니다.';q.lines.splice(1,0,'그림의 컵은 모두 가득 찼고, 남거나 넘친 물은 없습니다.');}if(t===1||t===3){q.lines[0]='가·나·다 용기에 가득 있던 물을 모양과 크기가 같은 그릇에 각각 옮겼습니다.';q.lines.splice(1,0,'남거나 넘친 물은 없습니다.');}
  if(t===4){q.lines[0]=q.lines[0].replace('같은 크기의 빈 수조를 채우는 데','모양과 크기가 같은 빈 수조를 각각 가득 채우는 데');q.lines.splice(1,0,'수조를 채우고 남거나 넘친 물은 없습니다.');}
 }
 if(s===3&&t===0){const base=200,n=r(2,4),value=base*n;replace(['200 mL 우유갑의 우유를 꽃병에 옮겨 담은 모습입니다.','같은 양을 몇 번쯤 더 부으면 꽃병이 가득 찰지 생각해 보세요.','꽃병의 들이는 약 몇 mL인가요?'],[choose('가득 채우는 횟수',[String(n-1)+'번',String(n)+'번',String(n+1)+'번'],String(n)+'번'),num('약',value,'mL')],{kind:'estimate',base,value,count:n,unit:'mL',label:'꽃병'},`약 ${n}번 들어가므로 200 × ${n} = 약 ${value} mL입니다.`);}
 if(s===3&&t===2)q.lines=['다음 물건에 알맞은 들이를 각각 고르세요.'],q.fields=[choose('대접',['약 300 mL','약 3 mL','약 3 L'],'약 300 mL'),choose('주사기',['약 300 mL','약 3 mL','약 3 L'],'약 3 mL'),choose('양동이',['약 300 mL','약 3 mL','약 3 L'],'약 3 L')],q.explanation='주사기에는 몇 mL, 대접에는 수백 mL, 양동이에는 몇 L 정도가 들어갑니다.';
 if(s===3&&t===3){q.lines=['친구가 “500 mL 샴푸 통으로 2번쯤 들어갈 것 같으니 물병의 들이는 약 1000 L야.”라고 말했습니다.','잘못된 단위를 고르고 바르게 고치세요.'];q.fields=[choose('1000의 단위',['L','mL'],'mL')];q.explanation='500 mL를 2번 담은 양은 약 1000 mL, 즉 약 1 L입니다.';}
 if(s===3&&t===5)q.work=['0과 1000 mL 사이의 작은 눈금 수를 세어 한 칸의 양을 먼저 알아보세요.'];
 if(s===5){
  q.lines=q.lines.map(x=>x.replace('두 물의 양','두 그릇에 담긴 물의 양'));
  if(t===1||t===3){const [high,low]=q.visual.values,move=(high-low)/2;q.fields=[num('두 물의 양의 차이',high-low,'mL'),num('차이의 절반 = 옮길 양',move,'mL')];q.work=['차이만큼 모두 옮기면 두 그릇의 물의 양이 서로 바뀝니다. 차이의 절반을 옮겨 보세요.'];}
  if(t===4){const [high,low]=q.visual.values,move=pick([(high-low)/2,(high-low)/2+100]),same=high-move===low+move;q.lines[1]=`가에서 나로 ${move} mL를 옮겼습니다. 두 그릇의 물의 양을 비교하세요.`;q.fields=[num('옮긴 뒤 가',high-move,'mL'),num('옮긴 뒤 나',low+move,'mL'),choose('물의 양',['같습니다','다릅니다'],same?'같습니다':'다릅니다')];q.explanation=`가에는 ${high-move} mL, 나에는 ${low+move} mL가 있으므로 ${same?'같습니다':'다릅니다'}.`;q.facts=[];}
 }
 if(s===6){q.lines.push('같은 종류의 물건은 한 개의 무게가 모두 같습니다.');if(t===2||t===3||t===4){const rows=q.visual.rows;const amounts=rows.map(x=>Number(x[1].match(/\d+/)[0]));q.visual={kind:'balances',items:rows.map((x,i)=>({left:t===4?'골프공':x[0],right:t===4?(i?'공깃돌':'바둑돌'):'구슬',leftCount:1,rightCount:amounts[i],leftMass:300,rightMass:300}))};}}
 if(s===7&&t===3){const box=r(1,4)*1000,pear=r(3,7)*50;replace([`빈 상자의 무게는 ${mass(box)}입니다.`,`이 상자에 ${pear} g인 배 1개를 넣었습니다. 배가 든 상자의 무게는 몇 g인가요?`],[num('상자를 g으로',box,'g'),num('배가 든 상자',box+pear,'g')],{kind:'package',box,items:1,one:pear,total:box+pear,label:'배'},`${box} + ${pear} = ${box+pear} g입니다.`);}
 if(s===8&&t===0){q.lines=['알맞은 무게 단위를 각각 고르세요.'];q.fields=[choose('배추 한 통 약 2',['g','kg','t'],'kg'),choose('두부 한 모 약 350',['g','kg','t'],'g'),choose('승용차 한 대 약 1',['g','kg','t'],'t')];q.visual=null;q.explanation='배추는 kg, 두부는 g, 자동차는 t으로 나타내면 알맞습니다.';}
 if(s===8&&t===1){const one=200,n=5;replace(['200 g인 통조림 5개와 양배추 한 통을 비교해 보니 무게가 비슷했습니다.','양배추의 무게는 약 몇 kg인가요?'],[num('통조림 5개의 무게',1000,'g'),num('양배추의 무게는 약',1,'kg')],{kind:'balances',items:[{left:'통조림',right:'양배추',leftCount:5,rightCount:1,leftMass:1000,rightMass:1000}]},'200 × 5 = 1000 g이고, 1000 g = 1 kg입니다.');}
 if(s===8&&t===4)q.work=['숫자가 적힌 두 눈금 사이의 차이와 작은 칸의 수를 비교하세요.'];
 if(s===8&&t===5){q.visual={...q.visual,zoom:true};q.work=['바늘이 가리키는 눈금까지 작은 칸이 몇 개인지 세어 보세요.'];}
 if(s===10){
  if(t===0||t===1){const one=r(2,5)*50,count=r(3,6),box=t===1?r(1,3)*100:0,total=one*count+box;replace([...(box?[`빈 상자의 무게는 ${box} g입니다.`]:[]),`무게가 같은 사과 ${count}개${box?'를 이 상자에 넣고 재니':'의 무게가'} ${mass(total)}입니다.`,'사과 한 개의 무게를 구하세요.'],[...(box?[num('사과만의 무게',one*count,'g')]:[]),num('사과 한 개',one,'g')],{kind:'package',items:count,one,box,total,label:'사과'},`${box?total+' − '+box+' = '+(one*count)+' g. ':''}${one*count} ÷ ${count} = ${one} g입니다.`);}
  if(t>=2){const one=r(3,6)*5;
   if(t===2){replace([`레몬 1개와 방울토마토 3개의 무게가 같습니다.`,`레몬이 ${one*3} g일 때, 방울토마토 한 개는 몇 g인가요?`],[num('방울토마토 한 개',one,'g')],{kind:'balances',items:[{left:'레몬',right:'방울토마토',leftCount:1,rightCount:3,leftMass:one*3,rightMass:one*3}]},`${one*3} ÷ 3 = ${one} g입니다.`);}
   if(t===3||t===4){const citrus=one*3,apple=citrus*3,pear=citrus*4;replace(['사과 1개와 귤 3개의 무게가 같습니다.','귤 4개와 배 1개의 무게가 같습니다.',t===3?`사과가 ${apple} g일 때 배 한 개는 몇 g인가요?`:`배가 ${pear} g일 때 사과 한 개는 몇 g인가요?`],[num('귤 한 개',citrus,'g'),num(t===3?'배 한 개':'사과 한 개',t===3?pear:apple,'g')],{kind:'balances',items:[{left:'사과',right:'귤',leftCount:1,rightCount:3,leftMass:apple,rightMass:apple},{left:'귤',right:'배',leftCount:4,rightCount:1,leftMass:pear,rightMass:pear}]},`귤 한 개는 ${citrus} g이므로 ${t===3?'배':'사과'} 한 개는 ${t===3?pear:apple} g입니다.`);}
   if(t===5){const eraser=r(2,5)*4,glue=eraser*3/2,notebook=glue*3;replace(['지우개 3개와 풀 2개의 무게가 같습니다.','풀 3개와 수첩 1개의 무게가 같습니다.',`수첩이 ${notebook} g일 때 지우개 한 개는 몇 g인가요?`],[num('풀 한 개',glue,'g'),num('풀 2개의 무게',glue*2,'g'),num('지우개 한 개',eraser,'g')],{kind:'balances',items:[{left:'지우개',right:'풀',leftCount:3,rightCount:2,leftMass:eraser*3,rightMass:glue*2},{left:'풀',right:'수첩',leftCount:3,rightCount:1,leftMass:notebook,rightMass:notebook}]},`${notebook} ÷ 3 = ${glue}, ${glue} × 2 ÷ 3 = ${eraser} g입니다.`);}
  }q.lines.push('같은 종류의 물건은 한 개의 무게가 모두 같습니다.');
 }
 if(s===11&&t===1){const kettle=r(6,9),bottle=kettle-2,pot=bottle+3;replace([`주전자·물병·냄비에 물을 가득 담아, 같은 컵에 남김없이 옮겼습니다.`,`주전자는 ${kettle}컵, 물병은 주전자보다 2컵 적고, 냄비는 물병보다 3컵 많습니다.`,'들이가 가장 큰 용기를 고르세요.'],[num('물병',bottle,'컵'),num('냄비',pot,'컵'),choose('가장 큰 용기',['주전자','물병','냄비'],'냄비')],{kind:'countTable',rows:[['주전자',kettle+'컵'],['물병','주전자보다 2컵 적음'],['냄비','물병보다 3컵 많음']]},`물병은 ${bottle}컵, 냄비는 ${pot}컵이므로 냄비의 들이가 가장 큽니다.`);}
 if(s===11&&t===0){q.lines[0]=q.lines[0].replace('같은 크기의 빈 수조를','모양과 크기가 같은 빈 수조를 각각');q.lines.push('채우고 남거나 넘친 물은 없습니다.');}
 if(s===11&&t===3)q.work=['어림값이 실제 값보다 크면 어림값에서 실제 값을 빼고, 작으면 실제 값에서 어림값을 빼세요.'];
 if(s===12){
  if(t===0)q.work=['먼저 사용한 물을 빼고, 나중에 부은 물을 더하세요.'];
  if(t===1||t===2||t===3)q.work=[t===1?'덜어낸 물의 양을 먼저 구한 뒤 남은 물에 더하세요.':'두 양의 차이를 먼저 구한 뒤, 같은 횟수로 나누세요.'];
  if(t===4||t===5){const old=q.lines;q.visual={kind:'weighings',labels:old.slice(0,2)};q.work=['두 번 잰 무게에서 상자의 무게는 같습니다. 두 무게의 차이는 꺼낸 사과의 무게입니다.'];}
 }
 if(s===13){q.work=['작은 쪽의 양을 같은 크기의 묶음으로 나타내 보세요.'];
  if(t===2){const total=pick([850,950,1050]),diff=150,low=(total-diff)/2,high=low+diff;replace([`우유 ${total} mL를 준서와 수혁이가 남김없이 나누어 마셨습니다.`,`준서가 수혁이보다 ${diff} mL 더 마셨습니다. 두 사람이 마신 양을 각각 구하세요.`],[num('수혁',low,'mL'),num('준서',high,'mL')],{kind:'comparisonBars',values:[low,high],labels:['수혁','준서'],total,diff},`(${total} − ${diff}) ÷ 2 = ${low} mL, ${low} + ${diff} = ${high} mL입니다.`);}
  else if(t===0||t===5){const low=Number(q.fields[0].answer),high=Number(q.fields[1].answer);q.visual={kind:'comparisonBars',values:[low,high],labels:['작은 쪽','큰 쪽'],total:low+high,diff:high-low};}
 }
 if(s===14){
  if(t===0){const limit=pick([4000,5000,6000]),empty=1000,item=pick([60,80,120]),available=limit-empty,n=Math.floor(available/item);replace([`전체 무게가 ${limit/1000} t을 넘는 트럭은 건널 수 없는 다리가 있습니다.`,`빈 트럭은 1 t, 상자 한 개는 ${item} kg입니다. 상자를 최대 몇 개 실을 수 있나요?`,'상자를 나누어 싣지 않으며, 사람과 다른 짐의 무게는 생각하지 않습니다.'],[num('최대 개수',n,'개')],{kind:'load',limit,empty,item},`짐은 ${available} kg까지 실을 수 있습니다. ${n}개는 ${n*item} kg, ${n+1}개는 ${(n+1)*item} kg이므로 최대 ${n}개입니다.`);q.facts=[{label:'최대 허용',left:Number(empty+n*item<=limit&&empty+(n+1)*item>limit),right:1}];}
  if(t===3){const flour=r(2,18)*50,sugar=r(2,16)*50,total=flour*20+sugar*10,limit=pick([1000,2000,3000]),n=Math.ceil(total/limit);replace(['밀가루는 한 포대에 20 kg씩 '+flour+'포대, 설탕은 한 포대에 10 kg씩 '+sugar+'포대 있습니다.','이 짐을 트럭 한 대에 '+limit/1000+' t까지 실어 모두 옮기려 합니다. 트럭은 적어도 몇 대 필요한가요?','포대는 나누지 않습니다.'],[num('전체 무게',total,'kg'),num('최소 트럭 수',n,'대')],{kind:'countTable',rows:[['밀가루','20 kg × '+flour+'포대'],['설탕','10 kg × '+sugar+'포대'],['트럭 한 대',limit/1000+' t까지']]},flour*20+' + '+sugar*10+' = '+total+' kg입니다. '+(n-1)+'대에는 '+(n-1)*limit+' kg까지 실을 수 있으므로 적어도 '+n+'대가 필요합니다.');}
  if(t===5){replace(['한 량에 2 t까지 실을 수 있는 화물칸 5량이 연결되어 있습니다.','한 통에 40 kg인 페인트 200통을 먼저 싣고, 한 자루에 8 kg인 모래를 더 싣습니다.','모래를 최대 몇 자루 실을 수 있나요?','각 화물칸에 페인트는 40통씩 실었습니다.'],[num('더 실을 수 있는 무게',2000,'kg'),num('모래',250,'자루')],{kind:'countTable',rows:[['전체 한도','2 t × 5량'],['페인트','40 kg × 200통'],['모래 한 자루','8 kg']]},'10000 − 8000 = 2000 kg, 2000 ÷ 8 = 250자루입니다. 각 칸에 모래를 50자루씩 실을 수 있습니다.');}
  q.work=['한도를 같은 단위로 바꾸고, 물건 한 개를 나누어도 되는 상황인지 확인하세요.'];
 }
 if(s===15){q.lines=q.lines.map(x=>x.replaceAll('무게에 비례해 값을 매길 때','같은 물건은 100 g당 값이 같을 때').replaceAll('무게에 비례해 값을 매깁니다.','같은 물건은 100 g당 값이 같습니다.').replaceAll('같은 비율로','한 사람에게 필요한 양이 같도록'));q.work=['기준이 되는 100 g 또는 한 사람에게 필요한 양을 먼저 구하세요.'];}
 if(s===16){q.lines.push('같은 종류의 물건은 한 개의 무게나 한 병의 들이가 모두 같습니다.');q.work=['양쪽에 똑같이 들어 있는 묶음을 그림으로 비교하세요.'];
  if(t===0||t===1){const one=r(2,5)*4;replace(['지우개 5개와 풀 4개의 무게가 같습니다.','풀 2개와 가위 1개의 무게가 같습니다.',`지우개 한 개가 ${one} g일 때 가위 ${t===0?1:2}개의 무게는 몇 g인가요?`,'같은 종류의 물건은 한 개의 무게가 모두 같습니다.'],[num('풀 4개의 무게',one*5,'g'),num('가위 '+(t===0?1:2)+'개',one*2.5*(t===0?1:2),'g')],{kind:'balances',items:[{left:'지우개',right:'풀',leftCount:5,rightCount:4,leftMass:one*5,rightMass:one*5},{left:'풀',right:'가위',leftCount:2,rightCount:1,leftMass:one*2.5,rightMass:one*2.5}]},`풀 4개는 ${one*5} g, 가위 1개는 그 절반인 ${one*2.5} g입니다.`);}
  if(t===2||t===3||t===5){const rows=q.lines.slice(0,2);q.visual={kind:'relation',rows};q.fields=q.fields.map(f=>f.kind==='choice'?{...f,label:t===2?'같은 나 묶음을 없애는 방법':'같은 가 묶음을 없애는 방법',options:['두 양을 더한다','두 양의 차이를 구한다'],answer:t===2?'두 양을 더한다':'두 양의 차이를 구한다'}:f);}
 }
 if(s===17){q.lines.push('물은 처음부터 끝까지 같은 빠르기로 들어오고 나갑니다.');if(t===0)q.visual={...q.visual,kind:'flow',inlets:q.visual.inlets||[250,150],outflow:0};if(t===3)q.work=['물통의 들이에서 처음 물의 양을 빼면 더 채울 양을 알 수 있습니다.'];}
 // Final condition and presentation checks shared across the source families.
 if(s===3&&t===0)q.lines[1]='꽃병을 처음부터 가득 채우려면 우유갑 몇 개쯤이 필요할지 생각해 보세요.';
 if(s===5&&t===3){const[high,low]=q.visual.values;q.lines=['그림의 두 수조에 들어 있는 물의 양을 눈금으로 읽으세요.','가에서 나로 물을 옮겨 두 물의 양을 같게 하려고 합니다.','읽은 양과 옮길 양을 차례로 구하세요.'];q.fields=[num('가 수조의 물',high,'mL'),num('나 수조의 물',low,'mL'),num('옮길 양',(high-low)/2,'mL')];}
 if(s===6&&(t===2||t===3))q.visual.items.forEach(item=>{item.leftMass=item.rightMass=item.rightCount*10;});
 if(s===7&&t===3)q.visual.total=null;
 if(s===11&&t===0)q.explanation='같은 수조를 채우는 데 나 컵을 더 여러 번 부어야 하므로 나 컵의 들이가 더 작습니다.';
 if(s===12&&(t===4||t===5)){const one=r(2,5)*50,n=r(3,6),removed=t===4?1:2,box=r(2,4)*100,total=box+n*one,after=total-removed*one;replace([`무게가 같은 사과 ${n}개를 상자에 넣고 재니 ${mass(total)}입니다.`,`사과 ${removed}개를 꺼내고 재니 ${mass(after)}입니다.`,t===4?'사과 한 개의 무게는 몇 g인가요?':'빈 상자의 무게는 몇 g인가요?'],[num('꺼낸 사과의 무게',removed*one,'g'),...(t===5?[num('사과 한 개',one,'g')]:[]),num(t===4?'사과 한 개':'빈 상자',t===4?one:box,'g')],{kind:'weighings',counts:[n,n-removed],totals:[total,after],labels:[`상자 + 사과 ${n}개 = ${mass(total)}`,`상자 + 사과 ${n-removed}개 = ${mass(after)}`]},`두 측정값의 차이 ${removed*one} g이 꺼낸 사과 ${removed}개의 무게입니다. 사과 한 개는 ${one} g, 빈 상자는 ${box} g입니다.`);q.work=['두 무게의 차이는 꺼낸 사과의 무게입니다. 상자의 무게는 변하지 않습니다.'];}
 if(s===13&&t===3)q.work=['가 그릇의 양을 한 묶음으로 보고, 나와 다에 더 담긴 양을 각각 표시하세요.'];
 if(s===13&&t===4)q.work=['큰 통 한 개를 작은 통 두 개로 바꾸어 생각해 보세요.'];
 if(s===15){q.work=[t===4?'먼저 몇 인분의 몇 배인지 구한 뒤 컵의 수를 구하세요.':t===5?'열매 한 개의 무게에 개수를 곱하고 kg과 g으로 바꾸세요.':'먼저 100 g의 값을 구하세요.'];if(t===4)q.visual={kind:'countTable',rows:[['수프 2인분','소스 2컵'],['소스 1컵','200 mL']]};}
 if(s===16&&[2,3,5].includes(t)){const total=Number(q.lines[0].match(/(\d+) g/)[1]),difference=Number(q.lines[1].match(/(\d+) g/)[1]);q.visual={kind:'bundleRelations',rows:[{a:3,b:2,op:'+',total},{a:3,b:2,op:'−',total:difference}],labels:['가','나'],unit:'g'};if(t===3)q.explanation=`두 조건의 차이를 구하면 나 4개의 무게가 ${total-difference} g입니다. ${(total-difference)} ÷ 4 = ${q.fields.at(-1).answer} g입니다.`;}
 if(s===16&&t===4)q.visual={kind:'bundleRelations',rows:[{a:2,b:5,op:'+',total:2600},{a:4,b:1,op:'+',total:1600}],labels:['우유','주스'],unit:'mL'};
 if(s===17&&t===0)q.lines[q.lines.length-1]='두 수도에서는 처음부터 끝까지 같은 빠르기로 물이 나옵니다.';
 q.lines=q.lines.map(x=>x.replaceAll('g를','g을').replaceAll('kg는','kg은').replaceAll('kg와','kg과').replaceAll('g로','g으로').replaceAll('g가','g이'));
 // Preserve the intermediate steps of the printed worked problems as blanks.
 if(s===12&&t<=3){const amount=x=>{const l=/(\d+) L/.exec(x),ml=/(\d+) mL/.exec(x),kg=/(\d+) kg/.exec(x),g=/(\d+) g/.exec(x);return Number(l?.[1]||kg?.[1]||0)*1000+Number(ml?.[1]||g?.[1]||0);};const answer=Number(q.fields.at(-1).answer);
  if(t===0){const first=q.lines[0].match(/물 (.+?)에서 (.+?)를 사용하고/);q.fields.unshift(num('사용하고 남은 물',amount(first[1])-amount(first[2]),'mL'));}
  if(t===1){const each=Number(q.lines[0].match(/물 (\d+) mL/)[1]),count=Number(q.lines[0].match(/(\d+)번/)[1]);q.fields.unshift(num('덜어낸 물 전체',each*count,'mL'));}
  if(t===2||t===3){const count=Number(q.lines[0].match(/(\d+)번/)[1]);q.fields.unshift(num(t===2?'더 부은 물 전체':'덜어낸 쌀 전체',answer*count,t===2?'mL':'g'));}
 }
 if(s===13&&(t===0||t===2||t===5)){const small=Number(q.fields[0].answer);q.fields.unshift(num('전체에서 차이를 뺀 양',small*2,t===5?'g':'mL'));}
 if(s===15){const final=Number(q.fields[0].answer),price=Number(q.lines[0].match(/값은 (\d+)원/ )?.[1]||0);
  if(t===0)q.fields.unshift(num('100 g의 값',price/4,'원'));
  if(t===1){const tomato=price/4*10;q.fields.unshift(num('토마토의 값',tomato,'원'),num('귤의 값',9000,'원'));}
  if(t===2)q.fields.unshift(num('산 물건의 전체 값',20000-final,'원'));
  if(t===3)q.fields.unshift(num('100 g의 값',price/4,'원'));
  if(t===4)q.fields.unshift(num('필요한 컵의 수',final/200,'컵'));
  if(t===5){const total=Number(q.fields[0].answer)*1000+Number(q.fields[1].answer);q.fields.unshift(num('전체를 g으로',total,'g'));}
 }
 if(s===16&&[2,3,5].includes(t)){const target=Number(q.fields.at(-1).answer),index=q.fields.length-1;q.fields.splice(index,0,num(t===3?'나 4개의 무게':t===5?'가 한 개의 무게':'가 6개의 무게',t===3?target*4:t===5?target/5:target*6,'g'));}
 // Randomize choice positions without changing their mathematical meaning.
 for(const f of q.fields)if(f.kind==='choice')for(let i=f.options.length-1;i>0;i--){const j=r(0,i);[f.options[i],f.options[j]]=[f.options[j],f.options[i]];}
 return q;
}

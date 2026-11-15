import {seeded} from './core-revisions.js';
// Each table is a fictional plan, recipe, product label or a measured result.
export const LIFE_SCENES=[
 {title:'학교 텃밭',intro:'오늘 정한 화분 물주기 계획입니다.',items:['상추','방울토마토','고추','꽃'],values:[200,300,400,500],art:'plant',unit:'화분 1개',count:'개'},
 {title:'물총 놀이',intro:'표는 놀이용 물총의 들이입니다.',items:['작은 물총','중간 물총','큰 물총','배낭 물총'],values:[150,300,500,1000],art:'watergun',unit:'1개',count:'개'},
 {title:'운동회 음료',intro:'운동회에서 표의 용기에 물을 가득 담으려고 합니다.',items:['작은 종이컵','큰 종이컵','작은 물병','일반 물병'],values:[150,200,350,500],art:'drink',unit:'1개',count:'개'},
 {title:'관찰 수조',intro:'체험관에서 정한 수조에 넣을 물의 양입니다.',items:['A 수조','B 수조','C 수조','D 수조'],values:[1500,2000,2500,3000],art:'tank',unit:'1개',mode:'sum'},
 {title:'과일 음료',intro:'표는 우리 가게의 음료 만드는 방법입니다. 농축액과 물을 섞습니다.',items:['딸기 농축액','포도 농축액','복숭아 농축액','레몬 농축액'],values:[100,150,200,250],art:'fruit',unit:'농축액 10 mL',mode:'recipe'},
 {title:'비눗방울 체험',intro:'선생님과 비눗방울 체험을 합니다. 표는 체험용 원액의 설명서입니다.',items:['A 원액','B 원액','C 원액','D 원액'],values:[100,150,200,250],art:'bubble',unit:'원액 10 mL',mode:'recipe'},
 {title:'미술 준비',intro:'표는 활동 한 모둠에 준비하기로 정한 물의 양입니다.',items:['작은 그림','중간 그림','큰 그림','공동 벽화'],values:[100,200,300,500],art:'paint',unit:'1모둠',count:'모둠'},
 {title:'계량컵 실험',intro:'표는 계량컵에 들어 있는 물의 양입니다.',items:['A 계량컵','B 계량컵','C 계량컵','D 계량컵'],values:[150,250,350,500],art:'measure',unit:'1개',mode:'pour'},
 {title:'물 나누어 담기',intro:'표는 물병의 들이입니다. 물을 흘리지 않고 나누어 담습니다.',items:['A 물병','B 물병','C 물병','D 물병'],values:[200,300,400,500],art:'bottle',unit:'1개',mode:'remain'},
 {title:'빗물 모으기',intro:'표는 빗물받이 통에 실제로 모인 빗물을 잰 결과입니다.',items:['A 빗물받이','B 빗물받이','C 빗물받이','D 빗물받이'],values:[300,450,600,750],art:'rain',unit:'모인 양',mode:'sum'},
 {title:'물풍선 놀이',intro:'놀이 규칙에 따라 풍선에 넣기로 정한 물의 양입니다.',items:['작은 풍선','중간 풍선','큰 풍선','특대 풍선'],values:[50,100,150,200],art:'balloon',unit:'1개',count:'개'},
 {title:'주스 주문',intro:'표는 컵 한 잔에 담을 주스의 양입니다. 얼음은 넣지 않습니다.',items:['어린이 컵','작은 컵','중간 컵','큰 컵'],values:[150,250,350,500],art:'juice',unit:'1잔',count:'잔'},
 {title:'요리 교실',intro:'표는 요리 교실에서 정한 수프 1인분에 넣는 물의 양입니다.',items:['감자수프','옥수수수프','채소수프','토마토수프'],values:[200,250,300,350],art:'soup',unit:'1인분',count:'인분'},
 {title:'쌀 씻을 물',intro:'표는 쌀 씻기 체험에 준비하기로 정한 물의 양입니다.',items:['1모둠','2모둠','3모둠','4모둠'],values:[500,700,900,1000],art:'rice',unit:'1모둠',mode:'sum'},
 {title:'물 절약',intro:'표는 학생들이 같은 조건에서 수도꼭지로 받아 잰 물의 양입니다.',items:['A 측정','B 측정','C 측정','D 측정'],values:[300,400,500,600],art:'tap',unit:'측정한 양',mode:'sum'},
 {title:'캠핑 식수',intro:'표는 캠핑용 물병에 담을 물의 양입니다.',items:['A 물병','B 물병','C 물병','D 물병'],values:[250,350,500,750],art:'camp',unit:'1개',count:'개'},
 {title:'얼음틀 준비',intro:'표는 얼음이 얼 때 늘어날 공간을 남기고 한 칸에 넣을 물의 양입니다.',items:['작은 얼음틀','중간 얼음틀','큰 얼음틀','왕얼음틀'],values:[10,15,20,30],art:'ice',unit:'한 칸',count:'칸'},
 {title:'꽃병 준비',intro:'표는 꽃병마다 표시한 높이까지 담을 물의 양입니다.',items:['작은 꽃병','둥근 꽃병','긴 꽃병','큰 꽃병'],values:[200,350,500,750],art:'vase',unit:'1개',count:'개'},
 {title:'분수대 모형',intro:'표는 순환하는 분수대 모형의 물통에 처음 넣을 물의 양입니다.',items:['A 모형','B 모형','C 모형','D 모형'],values:[300,450,600,800],art:'fountain',unit:'1개',count:'개'},
 {title:'간식 음료',intro:'표는 컵 한 개에 담을 음료의 양입니다. 우유와 주스를 따로 준비합니다.',items:['작은 컵','중간 컵','큰 컵','특대 컵'],values:[100,150,200,250],art:'snack',unit:'1개',mode:'separate'}
];
export function makeLifeQuestion(q,seed){
 const sceneIndex=(seed>>>0)%20,scene=LIFE_SCENES[sceneIndex],random=seeded(seed+73513),r=(a,b)=>a+Math.floor(random()*(b-a+1));
 const order=[0,1,2,3];for(let i=3;i>0;i--){const j=r(0,i);[order[i],order[j]]=[order[j],order[i]];}
 const variation=r(0,2),step=scene.art==='ice'?5:scene.art==='tank'?100:scene.art==='balloon'?10:25;
 const rows=order.map(i=>({label:scene.items[i],value:scene.values[i]+variation*step,art:scene.art,index:i}));
 if(sceneIndex===3&&rows[0].value+rows[1].value>5000){const j=rows.findIndex((x,i)=>i>1&&x.value+rows[0].value<=5000);[rows[1],rows[j]]=[rows[j],rows[1]];}
 const[a,b]=rows,mode=scene.mode||'multiply',ca=['sum','pour'].includes(mode)?1:scene.art==='ice'?r(5,12):r(1,scene.values.some(x=>x>=750)?3:4),cb=['sum','pour'].includes(mode)?1:scene.art==='ice'?r(5,12):r(1,scene.values.some(x=>x>=750)?3:4);
 const pa=a.value*ca,pb=b.value*cb,total=pa+pb,initial=mode==='remain'?Math.ceil((total+200+r(0,4)*100)/1000)*1000:null;
 let question,answer=total;
 // Korean wording below is deliberately short and names the exact measured quantity.
 if(mode==='sum')question=a.label+', '+b.label+'의 물을 합하면 모두 얼마인가요?';
 else if(mode==='pour')question=a.label+', '+b.label+'의 물을 들이 '+(total+500)+' mL인 빈 비커에 흘리지 않고 모두 부었습니다. 비커에 든 물은 얼마인가요?';
 else if(mode==='recipe')question=a.label+' '+ca*10+' mL, '+b.label+' '+cb*10+' mL로 각각 '+(sceneIndex===4?'음료':'비눗방울액')+'를 만들 때, 섞을 물은 모두 얼마인가요?';
 else if(mode==='remain'){question='물 '+initial+' mL에서 '+a.label+' '+ca+'개, '+b.label+' '+cb+'개를 가득 채우면 물은 얼마 남나요?';answer=initial-total;}
 else if(mode==='separate')question='우유는 '+a.label+' '+ca+'개에, 주스는 '+b.label+' '+cb+'개에 담습니다. 우유와 주스는 각각 몇 mL이고, 전체 음료는 얼마인가요?';
 else {const suffix=sceneIndex===0?' 화분':'';question=a.label+suffix+' '+ca+(scene.count||'개')+', '+b.label+suffix+' '+cb+(scene.count||'개')+(sceneIndex===1||sceneIndex===2?'를 가득 채울 물은':'에 쓸 '+(scene.art==='juice'?'주스':'물')+'은')+' 모두 얼마인가요?';}
 const mixed=mode==='separate'||(answer>=1000&&random()<.6),fields=[];
 const num=(label,value,unit)=>({kind:'number',label,answer:String(value),unit});
 if(mode==='separate')fields.push(num('우유',pa,'mL'),num('주스',pb,'mL'));
 if(mixed)fields.push(num('전체 L',Math.floor(answer/1000),'L'),num('나머지 mL',answer%1000,'mL'));else fields.push(num(mode==='remain'?'남은 양':'모두',answer,'mL'));
 q.source='원리119:22 생활 확장';q.lines=[scene.intro+' '+question+(mixed?' L와 mL로 쓰세요.':' mL로 쓰세요.')];q.fields=fields;q.facts=[];q.work=[];
 q.visual={kind:'lifeTable',scene:sceneIndex,title:scene.title,rows,basis:scene.unit,recipe:mode==='recipe',selected:[a.label,b.label],quantities:[ca,cb],initial,total,parts:[pa,pb]};
 q.explanation=(ca===1?String(a.value):a.value+' × '+ca)+' = '+pa+' mL, '+(cb===1?String(b.value):b.value+' × '+cb)+' = '+pb+' mL입니다. '+pa+' + '+pb+' = '+total+' mL'+(initial!==null?'이므로 '+initial+' − '+total+' = '+answer+' mL가 남습니다.':'입니다.')+(mixed?' '+answer+' mL = '+Math.floor(answer/1000)+' L '+answer%1000+' mL입니다.':'');
 return q;
}

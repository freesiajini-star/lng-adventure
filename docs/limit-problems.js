import {subject,topic} from './quality-revisions.js?v=c3242010be6a';
import {seeded} from './core-revisions.js?v=c3242010be6a';
const SCENES=[
 ['소풍 가방','소풍 가방에 넣을 짐의 한도입니다.',['물병','도시락','돗자리','간식','그림책','손수건 꾸러미'],[[400,800],[500,1000],[300,800],[100,400],[250,700],[100,250]]],
 ['캠핑 배낭','캠핑 활동에서 정한 배낭 짐의 한도입니다.',['침낭','손전등','물통','간식','접이식 의자','캠핑 냄비'],[[600,1400],[150,450],[600,1500],[150,500],[800,1800],[400,900]]],
 ['택배 드론','문제 속 택배 드론에 표시된 최대 적재량입니다.',['책','인형','장난감 로봇','퍼즐','문구 세트','선물 상자'],[[300,900],[150,500],[300,900],[300,700],[250,700],[200,600]]],
 ['운반 로봇','문제 속 운반 로봇에 표시된 최대 적재량입니다.',['책 상자','블록 상자','공 상자','인형 상자','문구 상자','장난감 상자'],[[900,1600],[700,1400],[500,1200],[400,1000],[600,1300],[600,1300]]],
 ['빵집 선물','빵집에서 정한 선물 상품의 무게 한도입니다.',['식빵','쿠키 상자','머핀 세트','파운드케이크','크루아상 세트','마들렌 상자'],[[400,800],[300,650],[350,700],[400,850],[250,550],[250,600]]],
 ['과일 선물','가게에서 정한 과일 선물의 무게 한도입니다.',['사과 봉지','귤 봉지','배 상자','포도 상자','복숭아 상자','딸기 상자'],[[650,1400],[600,1400],[1100,1900],[600,1200],[900,1800],[400,900]]],
 ['도서관 꾸러미','도서관에서 정한 책 꾸러미의 무게 한도입니다.',['그림책','동화책','과학책','역사책','백과사전','만화책'],[[300,650],[350,750],[450,900],[450,900],[800,1500],[250,600]]],
 ['장난감 배','실험으로 확인한 장난감 배 모형의 최대 적재량입니다.',['돌주머니','블록 상자','장난감 자동차','모래주머니','플라스틱 추','금속 추'],[[200,650],[250,650],[100,350],[250,750],[100,500],[100,500]]],
 ['엘리베이터 모형','문제 속 장난감 엘리베이터의 최대 적재량입니다.',['로봇 장난감','블록 상자','인형','장난감 자동차','공 상자','퍼즐 상자'],[[300,800],[300,800],[150,550],[100,400],[250,650],[250,650]]],
 ['로켓 모형','전시용 로켓 모형의 짐칸에 표시된 무게 한도입니다.',['카메라 모형','배터리 모형','탐사 로봇 모형','통신 장치 모형','표본 상자','관측 장비 모형'],[[300,850],[350,900],[500,1400],[300,900],[300,1000],[450,1200]]],
 ['여행 가방','여행 활동에서 정한 가방 짐의 무게 한도입니다.',['옷 꾸러미','신발','책','세면도구 가방','장난감','기념품'],[[500,1300],[500,1000],[300,850],[300,750],[250,700],[250,800]]],
 ['택배 포장','이 배송 활동에서 정한 택배 무게 한도입니다.',['책','옷','인형','문구 세트','장난감','과자 상자'],[[300,850],[300,800],[150,550],[250,650],[200,650],[250,600]]],
 ['자전거 바구니','문제 속 자전거 바구니에 표시된 최대 적재량입니다.',['책','도시락','물병','과일 봉지','작은 장난감','문구 꾸러미'],[[300,850],[500,1000],[400,900],[500,1100],[150,450],[300,700]]],
 ['손수레','문제 속 손수레에 표시된 최대 적재량입니다.',['작은 화분','흙 봉지','책 상자','물통','장난감 상자','공구 상자'],[[600,1400],[800,1800],[900,1600],[700,1600],[500,1300],[700,1500]]],
 ['기차 모형','장난감 기차 화물칸에 표시된 최대 적재량입니다.',['블록 상자','장난감 자동차','작은 인형','구슬 상자','퍼즐 상자','나무 블록'],[[300,800],[100,350],[100,450],[300,800],[250,650],[300,750]]],
 ['반려동물 꾸러미','가게에서 정한 간식 포장 무게 한도입니다. 먹일 양을 정하는 문제는 아닙니다.',['강아지 간식','고양이 간식','사료 소포장','반려동물 비스킷','간식 캔','작은 장난감'],[[150,500],[150,450],[300,900],[200,550],[150,450],[100,300]]],
 ['축제 경품','학교 축제에서 정한 경품 꾸러미의 무게 한도입니다.',['공책','색연필','퍼즐','작은 인형','문구 세트','장난감'],[[150,450],[150,450],[300,700],[100,400],[250,650],[250,750]]],
 ['재활용품 수거','이번 수거 활동에서 정한 묶음의 무게 한도입니다. 병·캔·우유갑은 모두 비어 있습니다.',['종이 묶음','빈 플라스틱병 묶음','골판지 묶음','빈 금속 캔 묶음','잡지 묶음','빈 우유갑 묶음'],[[400,1200],[150,500],[350,1000],[150,450],[500,1300],[150,450]]],
 ['미술 재료','모둠에서 정한 미술 재료 꾸러미의 무게 한도입니다.',['색연필 상자','물감 세트','도화지 묶음','점토','붓 세트','색종이 묶음'],[[200,500],[250,650],[350,1000],[300,900],[100,350],[150,500]]],
 ['시장 장바구니','이번 장보기 활동에서 정한 물건의 무게 한도입니다.',['사과 봉지','감자 봉지','당근 봉지','귤 봉지','양파 봉지','고구마 봉지'],[[650,1400],[600,1500],[450,1100],[600,1400],[600,1300],[600,1400]]]
];
export const LIMIT_SCENES=SCENES;
const fmt=g=>g>=1000?Math.floor(g/1000)+' kg'+(g%1000?' '+g%1000+' g':''):g+' g';
function combos(ids,size){if(!size)return [[]];if(ids.length<size)return [];return ids.flatMap((id,i)=>combos(ids.slice(i+1),size-1).map(rest=>[id,...rest]));}
export function makeLimitQuestion(q,seed){
 const scene=(seed>>>0)%20,form=Math.floor((seed>>>0)/20)%6,[title,intro,names,ranges]=SCENES[scene],random=seeded(seed+0x471a3);
 const r=(a,b)=>a+Math.floor(random()*(b-a+1)),pick=a=>a[r(0,a.length-1)],shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=r(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};
 let data;
 for(let attempt=0;attempt<500;attempt++){
  const used=new Set(),items=shuffle(names.map((name,index)=>{const[lo,hi]=ranges[index];let weight;do weight=r(Math.ceil(lo/50),Math.floor(hi/50))*50;while(used.has(weight));used.add(weight);return{id:index,name,weight};})).slice(0,form===3?r(5,6):r(4,form===0?5:6)),ids=items.map(x=>x.id),byId=new Map(items.map(x=>[x.id,x])),base=[0,10,11,19].includes(scene)&&random()<.3?(scene===10?r(16,28):scene===0?r(3,8):r(2,7))*50:0;
  const sum=group=>base+group.reduce((n,id)=>n+byId.get(id).weight,0),label=group=>group.map(id=>byId.get(id).name).join(' + ');
  let candidates=[],limit,loaded=[],required=null,options=[],answer,fields,question,explanation;
  if([0,1,3,4].includes(form)){
   if(form===3){required=pick(ids);candidates=shuffle(combos(ids.filter(id=>id!==required),2)).slice(0,r(4,6)).map(other=>[required,...other]);}
   else candidates=shuffle([...combos(ids,2),...combos(ids,3)]).slice(0,r(4,6));
   if(candidates.length<4)continue;
   const totals=candidates.map(sum),boundaries=[...new Set(totals)].sort((a,b)=>a-b).slice(0,-1).filter(n=>n>=500&&n<=5000);if(!boundaries.length)continue;limit=pick(boundaries);const valid=totals.map((x,i)=>x<=limit?i:-1).filter(i=>i>=0);if(!valid.length||valid.length===candidates.length)continue;
   options=candidates.map((group,i)=>(i+1)+'. '+label(form===3?group.filter(id=>id!==required):group));
   if(form===0){fields=options.map((o,i)=>({kind:'choice',label:o,options:['가능','불가능'],answer:totals[i]<=limit?'가능':'불가능'}));question='각 조합이 한도를 지키는지 판단하세요. 후보는 각각 따로 생각하세요.';}
   if(form===1||form===3){if(valid.length>3)continue;answer=valid.map(i=>options[i]);fields=[{kind:'multi',label:'가능한 조합 모두',options,answer}];question=form===1?'한도를 지키는 조합을 모두 고르세요. 후보는 각각 따로 생각하세요.':topic(byId.get(required).name)+' 반드시 넣습니다. 함께 넣을 나머지 두 물건의 조합을 모두 고르세요.';}
   if(form===4){const best=Math.max(...valid.map(i=>totals[i]));if(totals.filter(x=>x===best).length!==1)continue;fields=[{kind:'choice',label:'한도에 가장 가까운 조합',options,answer:options[totals.indexOf(best)]}];question='한도를 넘지 않으면서 가장 무거운 조합을 고르세요.';}
   explanation=candidates.map((g,i)=>(i+1)+'번: '+g.map(id=>byId.get(id).weight).join(' + ')+(base?' + 빈 포장 '+base:'')+' = '+totals[i]+' g, '+(totals[i]<=limit?'가능':'불가능')).join('. ')+'.';
  }
  if(form===2){
   loaded=[pick(ids)];const others=items.filter(x=>x.id!==loaded[0]),weights=others.map(x=>x.weight).sort((a,b)=>a-b),room=pick(weights.slice(0,-1));limit=sum(loaded)+room;if(limit<500||limit>5000)continue;
   options=others.map(x=>x.name);answer=others.filter(x=>sum(loaded)+x.weight<=limit).map(x=>x.name);if(!answer.length||answer.length===others.length)continue;
   fields=[{kind:'multi',label:'하나씩 추가할 수 있는 물건 모두',options,answer}];question='이미 '+subject(label(loaded))+' 실려 있습니다. 나머지 물건을 하나씩만 더한다면, 추가할 수 있는 물건을 모두 고르세요. 선택한 물건을 동시에 싣는 것은 아닙니다.';
   explanation='이미 실린 무게'+(base?'와 빈 포장 무게':'')+'는 '+sum(loaded)+' g입니다. '+limit+' − '+sum(loaded)+' = '+room+' g이 남습니다. '+answer.join(', ')+'는 각각 '+room+' g을 넘지 않습니다.';
  }
  if(form===5){
   loaded=shuffle(ids).slice(0,3);const total=sum(loaded),min=Math.min(...loaded.map(id=>byId.get(id).weight)),excess=r(1,Math.max(1,Math.floor(Math.max(...loaded.map(id=>byId.get(id).weight))/50)))*50;limit=total-excess;
   if(limit<500||limit>5000)continue;const eligible=loaded.map(id=>byId.get(id)).filter(x=>total-x.weight<=limit).sort((a,b)=>a.weight-b.weight);if(!eligible.length)continue;
   options=shuffle(loaded).map(id=>byId.get(id).name);fields=[{kind:'choice',label:'뺄 물건',options,answer:eligible[0].name}];question='현재 '+subject(label(loaded))+' 실려 있고, 총무게는 '+fmt(total)+'입니다. 한도를 지키도록 한 가지만 뺄 때, 뺄 수 있는 물건 중 가장 가벼운 것을 고르세요.';
   explanation=total+' − '+limit+' = '+excess+' g 이상을 빼야 합니다. 그중 가장 가벼운 '+eligible[0].name+' '+eligible[0].weight+' g을 빼면 '+(total-eligible[0].weight)+' g으로 한도를 지킵니다.';
  }
  if(!fields)continue;
  data={scene,form,title,items,limit,base,loaded,required,candidates,candidateTotals:candidates.map(sum)};
  q.source='원리127:46 생활 확장';q.lines=[intro+' 한도는 '+fmt(limit)+'입니다. '+(base?'빈 포장의 무게 '+fmt(base)+'도 한도에 포함합니다. ':'바깥 가방·상자나 운반 기구 자체의 무게는 계산하지 않습니다. ')+question];q.fields=fields;q.visual={kind:'limitPacking',...data};q.explanation=explanation;q.facts=[];q.work=[];return q;
 }
 throw Error('유효한 한도 문제를 만들지 못했습니다: '+scene+'/'+form);
}

import {reviseQuality} from './quality-revisions.js?v=fc046b738e6e';
export const seeded=(seed=1)=>{let x=seed>>>0;return()=>{x+=0x6D2B79F5;let t=x;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};};
const number=(label,value,unit='mL')=>({kind:'number',label,answer:String(value),unit});
const choice=(label,options,answer)=>({kind:'choice',label,options:[...options],answer});
export function reviseCore(q,seed){
 const random=seeded(seed+q.stage*1951+q.type*101),r=(a,b)=>a+Math.floor(random()*(b-a+1)),pick=a=>a[r(0,a.length-1)],shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=r(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};
 const set=(lines,fields,visual,explanation)=>Object.assign(q,{lines,fields,visual,explanation,facts:[],work:[]});
 if(q.stage===3&&q.type===0){
  const patterns=[[1,1],[.5,.5,.5,.5],[1/3,1/3,1/3],[1,.5,.5],[1,.5],[1/3,1/3,1/3,1/3,1/3,1/3],[1,1,1],[.5,.5,.5],[1,1,.5,.5]];
  const fills=pick(patterns),total=Math.round(fills.reduce((a,b)=>a+b,0)*1000);
  const name=total>1000?'물통':pick(['물병','계량컵']);
  set(['그림의 그릇은 각각 1 L까지 담을 수 있습니다. '+name+'에 가득 있던 물을 남김없이 옮겼습니다. '+name+'의 들이는 약 몇 mL인가요?'],[number('약',total)],{kind:'referenceEstimate',fills,receiverCapacity:1000,source:name},'1 L = 1000 mL입니다. 그림의 물을 모두 합하면 약 '+total+' mL이므로 '+name+'의 들이는 약 '+total+' mL입니다.');
 }
 if(q.stage===5){
  const from=pick(['가','나']),to=from==='가'?'나':'가',low=r(2,9)*100,move=r(1,5)*100,high=low+move*2,equal=low+move,values=from==='가'?[high,low]:[low,high];
  {
   set(['두 수조의 물을 흘리지 않고 옮겨 양을 같게 하려고 합니다. '+from+'에서 '+to+'로 몇 mL를 옮겨야 하나요?'],[number('옮길 물',move)],{kind:'equalizeTanks',values,max:2500,labels:['가','나'],ticks:100},'두 양의 차이는 '+(high-low)+' mL입니다. 그 절반인 '+move+' mL를 옮기면 두 수조는 각각 '+equal+' mL가 됩니다.');
   // Keep ID 3 as the second family: infer original amounts from a transfer.
   if([3,4,5].includes(q.type))set([from+'에서 '+to+'로 물 '+move+' mL를 옮겼더니 두 수조에 각각 '+equal+' mL가 되었습니다. 처음 물의 양은 각각 몇 mL였나요?'],[number('처음 '+from,high),number('처음 '+to,low)],{kind:'equalizeTanks',values:[equal,equal],max:2500,labels:['가','나'],ticks:100,after:true},from+'는 '+equal+' + '+move+' = '+high+' mL, '+to+'는 '+equal+' − '+move+' = '+low+' mL입니다.');
  }
 }
 if(q.stage===6){
  const type=({1:0,2:0,3:4})[q.type]??q.type;
  const items=shuffle(['사과','배','감자','고구마','당근','귤']),[a,b,c]=items,one=r(2,5)*25;
  const bal=(left,right,lc,rc,lm,rm=lm)=>({left,right,leftCount:lc,rightCount:rc,leftMass:lm,rightMass:rm});
  if(type===0){const heavy=random()<.5,swap=random()<.5;set(['저울을 보고 더 '+(heavy?'무거운':'가벼운')+' 것을 고르세요.'],[choice('물건',[a,b],heavy?b:a)],{kind:'balances',items:[swap?bal(b,a,1,1,one+100,one):bal(a,b,1,1,one,one+100)]},'저울에서 아래로 내려간 쪽이 더 무겁고, 올라간 쪽이 더 가볍습니다.');}
  if(type===4){
   const [x,y,z,n,m,total]=pick([['귤','방울토마토','사과',2,6,180],['지우개','볼펜','필통',3,6,60],['감자','귤','배',2,4,400],['당근','방울토마토','고구마',3,6,180],['사과','귤','배',2,4,360]]);
   const copies=r(1,2);let bs=shuffle([bal(x,z,n*copies,copies,total*copies),bal(y,z,m*copies,copies,total*copies)]).map(v=>random()<.5?v:bal(v.right,v.left,v.rightCount,v.leftCount,v.rightMass,v.leftMass));
   set(['수평인 두 저울을 보세요. '+x+' 한 개와 '+y+' 한 개 중 더 무거운 것을 고르세요. 같은 종류의 물건은 한 개의 무게가 같습니다.'],[choice('한 개가 더 무거운 것',shuffle([x,y]),x)],{kind:'balances',items:bs},'같은 '+z+' '+copies+'개와 비교할 때 '+x+'는 '+n*copies+'개, '+y+'는 '+m*copies+'개가 필요합니다. 더 적게 필요한 '+x+' 한 개가 더 무겁습니다.');
  }
  if(type===6){
   const [x,y,z,baseCount,ratio,unit]=pick([['사과','귤','방울토마토',5,2,20],['배','귤','방울토마토',4,3,25],['고구마','귤','방울토마토',2,4,25],['필통','지우개','구슬',4,2,10]]);const count=r(Math.max(2,baseCount-1),baseCount+1);
   set(['수평인 두 저울을 보세요. '+x+' 한 개는 '+y+' 한 개 무게의 몇 배인가요? 같은 종류의 물건은 한 개의 무게가 같습니다.'],[number('몇 배',ratio,'배')],{kind:'balances',items:shuffle([bal(x,z,1,count*ratio,unit*count*ratio),bal(y,z,1,count,unit*count)])},x+' 한 개는 '+z+' '+count*ratio+'개, '+y+' 한 개는 '+count+'개와 같습니다. '+count*ratio+' ÷ '+count+' = '+ratio+'배입니다.');
  }
  if(type===5){const names=shuffle([a,b,c]),light=names[0],mid=names[1],heavy=names[2];let bs=[bal(light,mid,1,1,one,one*2),bal(mid,heavy,1,1,one*2,one*3)];bs=shuffle(bs).map(x=>random()<.5?x:bal(x.right,x.left,x.rightCount,x.leftCount,x.rightMass,x.leftMass));set(['저울을 보고 가장 가벼운 것과 가장 무거운 것을 차례로 고르세요. 같은 종류의 물건은 한 개의 무게가 같습니다.'],[choice('가장 가벼운 것',items.slice(0,3),light),choice('가장 무거운 것',items.slice(0,3),heavy)],{kind:'balances',items:bs},'가벼운 순서는 '+names.join(', ')+'입니다. 가장 가벼운 것은 '+light+', 가장 무거운 것은 '+heavy+'입니다.');}
 }
 return reviseQuality(q,seed);
}

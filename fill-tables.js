// All capacities are exact integer mL. Counts describe repeated full pours into one tank.
export function makeFillTableQuestion(q,seed){
 let state=(seed+Math.imul(q.type,0x9e3779b9))>>>0;
 const random=()=>{state+=0x6D2B79F5;let z=state;z=Math.imul(z^z>>>15,z|1);z^=z+Math.imul(z^z>>>7,z|61);return((z^z>>>14)>>>0)/4294967296;};
 const pick=a=>a[Math.floor(random()*a.length)];
 const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 const ranges=[['주전자',600,1500],['작은 컵',100,250],['머그잔',200,500],['물병',300,1200],['유리그릇',250,800],['계량컵',250,1000],['텀블러',250,700]];
 let tank,counts,sources,pairs;
 for(let attempt=0;attempt<200;attempt++){
  tank=pick([1200,1800,2400,3600]);
  const candidates=Array.from({length:15},(_,i)=>i+2).filter(n=>tank%n===0&&tank/n>=100&&tank/n<=1500);
  counts=shuffle(candidates).slice(0,4);if(counts.length<4)continue;
  sources=[];
  for(const count of counts){const allowed=ranges.filter(([name,lo,hi])=>!sources.includes(name)&&tank/count>=lo&&tank/count<=hi);if(!allowed.length)break;sources.push(pick(allowed)[0]);}
  if(sources.length<4)continue;
  pairs=[];for(let a=0;a<4;a++)for(let b=0;b<4;b++)if(a!==b&&counts[b]%counts[a]===0&&counts[b]/counts[a]>=2&&counts[b]/counts[a]<=4)pairs.push([a,b]);
  if(q.type!==5||pairs.length)break;
 }
 if(sources.length!==4||(q.type===5&&!pairs.length))throw Error('Cannot construct valid filling comparison');
 const labels=['가','나','다','라'],order=counts.map((count,i)=>({count,label:labels[i]})).sort((a,b)=>a.count-b.count).map(x=>x.label);
 const choice=(label,answer)=>({label,answer,kind:'choice',options:[...labels]});
 q.source='원리116:4~6';q.visual={kind:'fillTable',labels,counts,sources,tank,capacities:counts.map(n=>tank/n)};
 q.lines=['각 용기에 물을 가득 담아 같은 수조를 채웠습니다.','표는 수조를 가득 채울 때까지 부은 횟수입니다. 남거나 넘친 물은 없습니다.'];
 q.facts=[];q.work=[];
 if(q.type===3){const descending=random()<.5;const answers=descending?order:[...order].reverse();q.lines.push('들이가 '+(descending?'큰':'작은')+' 것부터 차례로 고르세요.');q.fields=answers.map((x,i)=>choice((i+1)+'번째',x));}
 if(q.type===4){const other=random()<.5;q.lines.push(other?'들이가 가장 작은 용기와 둘째로 큰 용기를 고르세요.':'들이가 가장 큰 용기와 둘째로 작은 용기를 고르세요.');q.fields=other?[choice('가장 작은 용기',order[3]),choice('둘째로 큰 용기',order[1])]:[choice('가장 큰 용기',order[0]),choice('둘째로 작은 용기',order[2])];}
 if(q.type===5){const[a,b]=pick(pairs);q.lines.push(labels[a]+' 용기의 들이는 '+labels[b]+' 용기 들이의 몇 배인가요?');q.fields=[{label:'몇 배',kind:'number',unit:'배',answer:String(counts[b]/counts[a])}];q.explanation=labels[a]+'는 '+counts[a]+'번, '+labels[b]+'는 '+counts[b]+'번 부어 같은 수조를 채웁니다. '+counts[b]+' ÷ '+counts[a]+' = '+counts[b]/counts[a]+'이므로 '+counts[b]/counts[a]+'배입니다.';}
 else q.explanation='같은 수조를 채울 때 부은 횟수가 적을수록 용기의 들이가 큽니다. 큰 순서는 '+order.join(', ')+'입니다.';
 return q;
}

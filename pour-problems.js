// Child-friendly nominal capacities (mL). No alcohol, medicines, or hazardous liquids.
export const POUR_CONTAINERS=[
 {id:'waterBottle',name:'물병',capacities:[350,500,750,1000,1500,2000],liquid:'물',color:'#68b7c9',target:true},
 {id:'milkCarton',name:'우유갑',capacities:[200,500,1000],liquid:'우유',color:'#719cd0',target:false},
 {id:'juiceCarton',name:'주스갑',capacities:[200,500,1000],liquid:'주스',color:'#e9ab55',target:false},
 {id:'juiceBottle',name:'주스병',capacities:[250,500,1000,1500],liquid:'주스',color:'#e8a15c',target:true},
 {id:'pitcher',name:'물통',capacities:[1000,1500,2000],liquid:'물',color:'#83bfae',target:true},
 {id:'glass',name:'유리컵',capacities:[150,200,250,300],liquid:'물',color:'#9ac4dc',target:true},
 {id:'mug',name:'머그컵',capacities:[200,250,300,350],liquid:'물',color:'#d995a5',target:true},
 {id:'tumbler',name:'텀블러',capacities:[350,500,600],liquid:'물',color:'#a2b5d9',target:true},
 {id:'bowl',name:'유리그릇',capacities:[300,500,700],liquid:'물',color:'#c0b2d7',target:true},
 {id:'measureJug',name:'계량컵',capacities:[250,500,1000],liquid:'물',color:'#b2c5a4',target:true},
 {id:'vase',name:'꽃병',capacities:[300,500,750,1000],liquid:'물',color:'#d4a7c7',target:true}
];
export const POUR_SCENARIOS=[];
for(const from of POUR_CONTAINERS)for(const to of POUR_CONTAINERS){
 if(!to.target||from.id===to.id||(from.liquid!=='물'&&to.id==='vase'))continue;
 for(const source of from.capacities)for(const target of to.capacities)POUR_SCENARIOS.push({from,to,source,target});
}
export const POUR_VARIANT_COUNT=POUR_SCENARIOS.length;
export function makePourQuestion(q,seed){
 const index=(seed>>>0)%POUR_VARIANT_COUNT,{from,to,source,target}=POUR_SCENARIOS[index];
 const filled=Math.min(source,target),remainder=Math.max(0,source-target),space=target-filled;
 const outcome=remainder?'overflow':space?'space':'equal';
 const liquid=from.liquid,objectParticle=liquid==='물'?'을':'를',subjectParticle=liquid==='물'?'이':'가';
 q.title='옮겨 담기';q.source='원리116:1 생활 용기 변형';
 q.lines=[`${from.name}에 가득 든 ${liquid}${objectParticle} 빈 ${to.name}에 모두 부었습니다.`,outcome==='overflow'?`${to.name}에 ${liquid}${subjectParticle} 가득 차고 넘쳤습니다.`:outcome==='space'?`${to.name}에 ${liquid}${subjectParticle} 더 들어갈 공간이 남았습니다.`:`${to.name}에 ${liquid}${subjectParticle} 넘치지 않고 가득 찼습니다.`, '들이가 더 많은 것은 어느 것일까요?'];
 const answer=source>target?from.name:source<target?to.name:'같아요';
 const choices=[from.name,to.name,'같아요'];if((seed>>>0)%2)choices.reverse();
 q.fields=[{label:'들이가 더 많은 용기',hideLabel:true,kind:'choice',options:choices,answer}];
 q.visual={kind:'pourCompare',variant:index,from:{...from},to:{...to},source,target,filled,remainder,space,outcome,liquid};
 q.explanation=outcome==='overflow'?`${from.name}에 있던 ${liquid}${subjectParticle} ${to.name}에 가득 차고도 남으므로 ${from.name}의 들이가 더 큽니다.`:outcome==='space'?`${from.name}에 있던 ${liquid}를 모두 부어도 빈 공간이 남으므로 ${to.name}의 들이가 더 큽니다.`:'가득 든 양을 모두 옮겼을 때 넘치지 않고 가득 찼으므로 두 용기의 들이가 같습니다.';
 q.work=[];q.facts=[{label:'옮긴 물의 보존',left:filled+remainder,right:source},{label:'받는 용기의 빈 공간',left:filled+space,right:target}];
 return q;
}

// Visit each available container pair once per round; consume its variants without replacement.
export function createPourDeck(random=Math.random){
 const shuffle=items=>{const copy=[...items];for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;};
 const catalog=new Map();POUR_SCENARIOS.forEach((v,i)=>{const key=v.from.id+'/'+v.to.id;if(!catalog.has(key))catalog.set(key,[]);catalog.get(key).push(i);});
 let groups=new Map(),round=[],previous='';
 return {next(){if(![...groups.values()].some(a=>a.length)){groups=new Map([...catalog].map(([k,ids])=>[k,shuffle(ids)]));round=[];}
  if(!round.length)round=shuffle([...groups].filter(([,ids])=>ids.length).map(([k])=>k));
  if(round.at(-1)===previous&&round.length>1)[round[0],round[round.length-1]]=[round.at(-1),round[0]];
  const key=round.pop();previous=key;return groups.get(key).pop();
 }};
}

// Whole-object classroom ranges (g), not universal weights for every specimen.
// Reference edible portions and cultivar weights are documented in the audit.
export const WEIGHING_OBJECTS=[
 {label:'사과',art:'apple',min:180,max:300,step:10},
 {label:'배',art:'pear',min:300,max:550,step:10},
 {label:'귤',art:'mandarin',min:80,max:130,step:5},
 {label:'레몬',art:'lemon',min:70,max:120,step:5},
 {label:'키위',art:'kiwi',min:70,max:110,step:5},
 {label:'딸기',art:'strawberry',min:15,max:30,step:5},
 {label:'방울토마토',art:'tomato',min:15,max:25,step:5},
 {label:'감자',art:'potato',min:120,max:220,step:10},
 {label:'고구마',art:'sweetPotato',min:130,max:230,step:10},
 {label:'당근',art:'carrot',min:70,max:150,step:10},
 {label:'감',art:'persimmon',min:180,max:240,step:10},
 {label:'참외',art:'koreanMelon',min:300,max:400,step:10}
];
export function makeContainerWeightQuestion(q,seed){
 let state=(seed+q.type*971+12043)>>>0;
 const random=()=>{state+=0x6D2B79F5;let t=state;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;},r=(a,b)=>a+Math.floor(random()*(b-a+1));
 const item=WEIGHING_OBJECTS[r(0,WEIGHING_OBJECTS.length-1)],one=r(Math.ceil(item.min/item.step),Math.floor(item.max/item.step))*item.step,mode=q.type;
 const half=mode===6,container=half?'상자':['접시','유리그릇','상자'][r(0,2)],containerArt={접시:'plate',유리그릇:'bowl-empty',상자:'carrier-11'}[container];
 const empty=container==='상자'?r(6,18)*10:r(10,25)*10;
 let counts;if(half)counts=[8,4];else if(mode===4){const n=r(3,4);counts=[n,n-1];}else if(mode===5)counts=[4,2];else{const n=r(1,2);counts=[n,n+2];}
 const totals=counts.map(n=>n*one+empty),difference=Math.abs(totals[1]-totals[0]),delta=Math.abs(counts[1]-counts[0]);
 const field=(label,answer)=>({kind:'number',label,answer:String(answer),unit:'g'});
 q.lines=half?[`${item.label} ${counts[0]}개를 상자에 넣고 잰 무게와, 절반인 ${counts[1]}개가 남은 같은 상자의 무게입니다.`,`같은 종류의 ${item.label} 한 개의 무게는 모두 같습니다. 빈 상자의 무게는 몇 g인가요?`]:[`같은 ${container}에 같은 종류와 크기의 ${item.label}를 올려 무게를 쟀습니다.`,mode===4?`${item.label} 한 개의 무게는 몇 g인가요?`:mode===5?`빈 ${container}의 무게는 몇 g인가요?`:`${item.label} 한 개와 빈 ${container}의 무게를 각각 구하세요.`];
 q.fields=half?[field(`${item.label} 절반의 무게`,one*4),field(`${item.label} 전체의 무게`,one*8),field('빈 상자',empty)]:mode===4?[field(`${item.label} 한 개`,one)]:[field(`${item.label} ${delta}개의 무게`,difference),field(`${item.label} 한 개`,one),field(`빈 ${container}`,empty)];
 q.visual={kind:half?'halfBox':'plateWeighings',mode,counts,totals,label:item.label,objectArt:item.art,container,containerArt,one,empty};
 q.explanation=`두 무게의 차이는 ${difference} g이고 ${item.label} ${delta}개의 무게입니다. 한 개는 ${difference} ÷ ${delta} = ${one} g입니다. 빈 ${container}의 무게는 ${totals[0]} − ${counts[0]} × ${one} = ${empty} g입니다.`;
 q.work=[];q.facts=counts.map((n,i)=>({label:'물건과 그릇의 무게 '+i,left:totals[i],right:n*one+empty}));
 return q;
}

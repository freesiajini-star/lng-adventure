export function createAdvancedDeck(random=Math.random){
 const decks=new Map();
 return{seed(stage,type,seed){
  const family=stage===15&&[4,5,6].includes(type)?'scale':stage===16&&[2,3,4,5].includes(type)?'equations':stage===16&&(type===6||type===0&&seed%3===0)?'substitution':null;
  if(!family)return seed;
  const count=family==='equations'?24:30,divisor=family==='equations'?4:3;
  const d=decks.get(family)||{bag:[],last:-1};
  if(!d.bag.length){d.bag=Array.from({length:count},(_,i)=>i);for(let i=count-1;i>0;i--){const j=Math.floor(random()*(i+1));[d.bag[i],d.bag[j]]=[d.bag[j],d.bag[i]];}}
  let at=d.bag.findIndex(n=>n!==d.last&&(family!=='equations'||n%3!==d.last%3));if(at<0)at=0;
  const index=d.bag.splice(at,1)[0];d.last=index;decks.set(family,d);
  return Math.floor((seed>>>0)/(count*divisor))*count*divisor+index*divisor+(type===0?0:seed%divisor);
 }};
}

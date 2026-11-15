// The outline and liquid level share one volume model: round vessels rotate; cartons have a fixed square-body depth.
// Volume of each linear radius segment: pi*h*(r0²+r0*r1+r1²)/3.
const controls={
 waterBottle:[[18,16],[43,16],[61,33],[70,36],[158,36],[172,29]],
 juiceBottle:[[18,20],[37,20],[56,38],[155,38],[170,30]],
 milkCarton:[[10,1],[34,34],[170,34]],juiceCarton:[[10,1],[34,34],[170,34]],
 pitcher:[[22,43],[42,38],[145,34],[170,29]],
 glass:[[35,38],[167,29]],mug:[[35,36],[160,36],[170,31]],
 tumbler:[[20,32],[158,28],[171,25]],
 bowl:[[85,61],[111,53],[151,33],[169,18]],
 measureJug:[[32,40],[151,32],[170,28]],
 vase:[[22,26],[52,20],[90,34],[127,41],[158,32],[173,25]]
};
export function vesselProfile(id){const p=controls[id];if(!p)throw Error('Unknown container '+id);const result=[p[0]];for(let i=1;i<p.length;i++){const[y0,r0]=p[i-1],[y1,r1]=p[i],steps=Math.ceil((y1-y0)/3);for(let j=1;j<=steps;j++){const t=j/steps,s=id.endsWith('Carton')?t:t*t*(3-2*t);result.push([y0+(y1-y0)*t,r0+(r1-r0)*s]);}}if(id.endsWith('Carton'))result.depth=68;return result;}
const slice=(a,b,p)=>p.depth?(b[0]-a[0])*p.depth*(a[1]+b[1]):Math.PI*(b[0]-a[0])*(a[1]**2+a[1]*b[1]+b[1]**2)/3;
export function radiusAt(profile,y){for(let i=1;i<profile.length;i++){const a=profile[i-1],b=profile[i];if(y<=b[0])return a[1]+(b[1]-a[1])*(y-a[0])/(b[0]-a[0]);}return profile.at(-1)[1];}
export function volumeBelow(profile,y){let volume=0;for(let i=1;i<profile.length;i++){const a=profile[i-1],b=profile[i];if(y>=b[0])continue;volume+=slice(y>a[0]?[y,radiusAt(profile,y)]:a,b,profile);}return volume;}
export function fillLevel(profile,fraction){if(fraction<0||fraction>1)throw Error('Fill fraction outside vessel');const top=profile[0][0],bottom=profile.at(-1)[0],total=volumeBelow(profile,top);if(!fraction)return bottom;if(fraction===1)return top;let lo=top,hi=bottom;for(let i=0;i<45;i++){const mid=(lo+hi)/2;if(volumeBelow(profile,mid)>total*fraction)lo=mid;else hi=mid;}return(lo+hi)/2;}
export function vesselGeometry(id,capacity,amount){if(!Number.isFinite(capacity)||capacity<=0||amount<0||amount>capacity)throw Error('Invalid vessel volume');const profile=vesselProfile(id),volume=volumeBelow(profile,profile[0][0]);return {profile,scale:Math.cbrt(capacity*1000/volume),level:fillLevel(profile,amount/capacity),volume};}

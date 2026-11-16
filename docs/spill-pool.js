// A stable, softly lobed outline, varied by question rather than a perfect oval.
function outline(uid){
 let seed=0;for(const c of uid)seed=(seed*31+c.charCodeAt(0))>>>0;
 const phase=(seed%628)/100,points=Array.from({length:16},(_,i)=>{
  const a=i*Math.PI/8,r=.86+.095*Math.sin(3*a+phase)+.04*Math.sin(5*a-phase);
  return[Math.cos(a)*r,Math.sin(a)*r];
 });
 const point=p=>p.map(n=>Math.max(-1,Math.min(1,n)).toFixed(4)).join(' ');
 let d='M'+point(points[0]);
 for(let i=0;i<points.length;i++){
  const a=points[(i+15)%16],b=points[i],c=points[(i+1)%16],e=points[(i+2)%16];
  d+='C'+point(b.map((n,j)=>n+(c[j]-a[j])/6))+' '+point(c.map((n,j)=>n-(e[j]-b[j])/6))+' '+point(c);
 }
 return d+'Z';
}
export function spillPool(pool,liquid,scale,uid){
 const d=outline(uid),id=uid+'-pool',milk=liquid==='우유',juice=liquid==='주스';
 const light=milk?'#fffdf0':juice?'#ffd264':'#d4f9ff',body=milk?'#f8edda':juice?'#ffa30e':'#8edce6',edge=milk?'#c2ad8a':juice?'#d29024':'#409eb6';
 const depth=Math.max(12,2.4/scale)/pool.ry;
 return `<g class="ground-pool" data-liquid="${liquid}" transform="translate(${pool.cx} ${pool.cy}) scale(${pool.rx} ${pool.ry})">
 <defs><linearGradient id="${id}-surface" x1=".2" y1="0" x2=".6" y2="1"><stop stop-color="${light}"/><stop offset=".5" stop-color="${body}"/><stop offset="1" stop-color="${edge}"/></linearGradient><linearGradient id="${id}-depth" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${body}"/><stop offset="1" stop-color="${edge}"/></linearGradient><radialGradient id="${id}-gloss" cx=".3" cy=".1" r=".85"><stop stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><clipPath id="${id}-clip"><path d="${d}"/></clipPath></defs>
 <path d="${d}" transform="translate(0 ${depth+.06})" fill="${edge}" opacity=".15"/>
 <path class="pool-depth" d="${d}" transform="translate(0 ${depth})" fill="url(#${id}-depth)" stroke="${edge}" stroke-width=".65" vector-effect="non-scaling-stroke"/>
 <path class="pool-surface" d="${d}" fill="url(#${id}-surface)" stroke="${edge}" stroke-width=".75" vector-effect="non-scaling-stroke"/>
 <g clip-path="url(#${id}-clip)"><path d="M-.92-.12C-.65-.83-.17-.87.29-.45C.6-.17.03.08-.29-.02C-.58-.1-.76.14-.92-.12Z" fill="url(#${id}-gloss)"/>
 <path d="M-.72-.22C-.59-.57-.41-.67-.23-.6M-.09-.65L-.04-.64" fill="none" stroke="#fff" stroke-opacity=".88" stroke-width="1.5" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
 <path d="M-.65.48C-.32.79.19.73.44.51" fill="none" stroke="${light}" stroke-opacity=".75" stroke-width=".9" stroke-linecap="round" vector-effect="non-scaling-stroke"/></g></g>`;
}

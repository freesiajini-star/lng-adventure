import {ART_PROFILES,ART_AXES,ART_BOUNDS} from './art-vessel-profiles.js?v=58cc96d8ef86';
import {artImage,vesselArt} from './art-catalog.js?v=58cc96d8ef86';
import {volumeBelow,fillLevel,radiusAt} from './pour-geometry.js?v=58cc96d8ef86';
const profiles={...ART_PROFILES,milkCarton:[[150,210],[880,210]],juiceCarton:[[150,210],[880,210]]};
export function paintedGeometry(id,capacity,amount){if(!(capacity>0)||amount<0||amount>capacity)throw Error('Invalid painted volume');const profile=profiles[id].map(p=>[...p]);if(id.endsWith('Carton'))profile.depth=420;const volume=volumeBelow(profile,profile[0][0]);return {profile,volume,scale:Math.cbrt(capacity*1000/volume),level:fillLevel(profile,amount/capacity)};}
const center=id=>ART_AXES[id]??500;
export function paintedVessel(id,capacity,amount,liquid,cx,baseline,camera,uid,overflow=false){
 const g=paintedGeometry(id,capacity,amount),scale=g.scale*camera,p=g.profile,axis=center(id),bottom=p.at(-1)[0],y=baseline-bottom*scale,opaque=id.endsWith('Carton'),full=liquid==='우유'?'milk-full':liquid==='주스'?'juice-full':'water-full',color=liquid==='우유'?'#f8edda':liquid==='주스'?'#f4b54f':'#8edce6';
 const lower=[[g.level,radiusAt(p,g.level)],...p.filter(a=>a[0]>g.level)],liquidPath='M'+lower.map(([yy,r])=>[-r,yy].join(',')).join('L')+'L'+[...lower].reverse().map(([yy,r])=>[r,yy].join(',')).join('L')+'Z';
 // Independently painted empty/full assets do not share an identical silhouette.
 // A full vessel must therefore use one complete asset, never two overlaid outlines.
 let inner=artImage(vesselArt(id,opaque||amount===capacity?full:'empty'),-axis,0,1000);
 if(!opaque&&amount>0&&amount<capacity){inner+=`<defs><clipPath id="${uid}"><path d="${liquidPath}"/></clipPath></defs><g clip-path="url(#${uid})">${artImage(vesselArt(id,full),-axis,0,1000)}</g><ellipse cx="0" cy="${g.level}" rx="${radiusAt(p,g.level)*.94}" ry="14" clip-path="url(#${uid})" fill="${color}" fill-opacity=".7" stroke="${color}" stroke-width="2"/>`;}
 let effect='';const bounds=ART_BOUNDS[id]||[0,1000],left=(bounds[0]-axis)*scale,right=(bounds[1]-axis)*scale;
 let min=left,max=right;
 if(overflow){const points=p.map(([yy,r])=>[-r-8,yy]),foot=points.at(-1),pool={cx:foot[0]-24,cy:bottom+12,rx:125,ry:22},edge=liquid==='우유'?'#d9c9ad':liquid==='주스'?'#d99728':'#4aa4b5';min=Math.min(min,(pool.cx-pool.rx)*scale);let flow='M'+points[0];for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],mid=(a[1]+b[1])/2;flow+=`C${a[0]},${mid} ${b[0]},${mid} ${b[0]},${b[1]}`;}flow+=`Q${foot[0]},${pool.cy} ${pool.cx},${pool.cy}`;effect=`<g class="wall-overflow" data-liquid="${liquid}"><ellipse cx="${pool.cx}" cy="${pool.cy}" rx="${pool.rx}" ry="${pool.ry}" fill="${color}" fill-opacity=".9" stroke="${edge}" stroke-width="3"/><path d="${flow}" fill="none" stroke="${edge}" stroke-width="20" stroke-linecap="round"/><path d="${flow}" fill="none" stroke="${color}" stroke-width="14" stroke-linecap="round"/><path d="${flow}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/></g>`;}
 return {markup:`<g class="painted-vessel" data-fill="${amount/capacity}" transform="translate(${cx} ${y}) scale(${scale})">${inner}${effect}</g>`,min,max,geometry:g};
}
const tx=(x,y,s,size=18)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="#36585c" font-family="Malgun Gothic,sans-serif">${s}</text>`;
export function renderPaintedPour(v){
 const ga=paintedGeometry(v.from.id,v.source,v.source),gb=paintedGeometry(v.to.id,v.target,v.filled),extent=(id,g)=>(g.profile.at(-1)[0]-(id==='pitcher'?40:g.profile[0][0]))*g.scale,camera=193/Math.max(extent(v.from.id,ga),extent(v.to.id,gb)),base=238;
 const build=(id,capacity,amount,cx,uid,overflow)=>{let a=paintedVessel(id,capacity,amount,v.liquid,0,base,camera,uid,overflow);return paintedVessel(id,capacity,amount,v.liquid,cx-(a.min+a.max)/2,base,camera,uid,overflow).markup;};
 const a=build(v.from.id,v.source,v.source,165,'painted-a-'+v.variant,false),b=build(v.to.id,v.target,v.filled,595,'painted-b-'+v.variant,v.outcome==='overflow'),situation=v.outcome==='overflow'?'가득 차고 넘쳤어요':v.outcome==='space'?'빈 공간이 남았어요':'넘치지 않고 가득 찼어요';
 return `<svg class="pour-illustration" viewBox="0 0 760 315" role="img" aria-label="${v.from.name}의 ${v.liquid}를 ${v.to.name}에 모두 부은 뒤 ${situation}"><rect x="15" y="6" width="300" height="300" rx="22" fill="#fff" stroke="#dbe8e0"/><rect x="445" y="6" width="300" height="300" rx="22" fill="#fff" stroke="#dbe8e0"/>${tx(165,32,'붓기 전',16)}${tx(595,32,'모두 부은 뒤',16)}${a}${b}<path d="M345 145H402M390 134L403 145L390 156" fill="none" stroke="#8eaca1" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>${tx(375,180,'모두 붓기',14)}${tx(165,278,v.from.name+'에 가득',19)}${tx(595,278,v.to.name,19)}${tx(595,299,situation,14)}</svg>`;
}

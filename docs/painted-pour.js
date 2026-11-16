import {ART_PROFILES,ART_AXES,ART_BOUNDS} from './art-vessel-profiles.js?v=7997b9eb88db';
import {artImage,vesselArt} from './art-catalog.js?v=7997b9eb88db';
import {volumeBelow,fillLevel,radiusAt} from './pour-geometry.js?v=7997b9eb88db';
// Interior coordinates of the EMPTY artwork. Rim ellipses, sleeves, labels and
// reflections are not changes in the vessel's internal radius.
const profiles={...ART_PROFILES,
 waterBottle:[[100,105],[190,105],[265,195],[320,210],[785,210],[850,170],[875,80]],
 juiceBottle:[[115,120],[205,120],[290,170],[395,235],[800,235],[855,190],[875,90]],
 pitcher:[[240,125],[300,125],[370,265],[440,280],[810,280],[870,220],[895,100]],
 glass:[[215,255],[760,220],[815,205],[835,130]],
 mug:[[270,250],[350,270],[620,270],[760,235],[820,180],[840,100]],
 tumbler:[[145,210],[410,195],[620,180],[815,165],[865,130],[880,75]],
 bowl:[[385,425],[470,410],[580,365],[690,290],[760,205],[790,100]],
 measureJug:[[160,310],[320,290],[600,260],[755,240],[800,195],[820,100]],
 vase:[[155,180],[240,145],[360,130],[480,240],[610,315],[700,300],[800,245],[875,160],[895,90]],
 milkCarton:[[150,210],[880,210]],juiceCarton:[[150,210],[880,210]]};
export function paintedGeometry(id,capacity,amount){if(!(capacity>0)||amount<0||amount>capacity)throw Error('Invalid painted volume');const profile=profiles[id].map(p=>[...p]);if(id.endsWith('Carton'))profile.depth=420;const volume=volumeBelow(profile,profile[0][0]);return {profile,volume,scale:Math.cbrt(capacity*1000/volume),level:fillLevel(profile,amount/capacity)};}
// Bottle axes are calibrated to the empty artwork used by the liquid overlay,
// rather than the independently painted full-bottle assets in ART_AXES.
export const EMPTY_BOTTLE_AXES={waterBottle:566.40625,juiceBottle:557.2916666666666};
const center=id=>EMPTY_BOTTLE_AXES[id]??ART_AXES[id]??500;
export function paintedVessel(id,capacity,amount,liquid,cx,baseline,camera,uid,overflow=false){
 const g=paintedGeometry(id,capacity,amount),scale=g.scale*camera,p=g.profile,axis=center(id),bottom=p.at(-1)[0],y=baseline-bottom*scale,opaque=id.endsWith('Carton'),full=liquid==='우유'?'milk-full':liquid==='주스'?'juice-full':'water-full',color=liquid==='우유'?'#f8edda':liquid==='주스'?'#f4b54f':'#8edce6';
 const lower=[[g.level,radiusAt(p,g.level)],...p.filter(a=>a[0]>g.level)],liquidPath='M'+lower.map(([yy,r])=>[-r,yy].join(',')).join('L')+'L'+[...lower].reverse().map(([yy,r])=>[r,yy].join(',')).join('L')+'Z';
 // One fixed silhouette for every quantity. Independently painted "full" assets
 // contain arbitrary headspace and cannot represent a calculated fill level.
 let inner=artImage(vesselArt(id,opaque?full:'empty'),-axis,0,1000);
 if(!opaque&&amount>0){inner+=`<defs><clipPath id="${uid}"><path d="${liquidPath}"/></clipPath></defs><path class="calculated-liquid" data-liquid="${liquid}" data-level="${g.level}" d="${liquidPath}" fill="${color}" fill-opacity="${liquid==='우유'?'.94':'.68'}" style="mix-blend-mode:multiply"/><ellipse cx="0" cy="${g.level}" rx="${radiusAt(p,g.level)*.97}" ry="${Math.min(70,radiusAt(p,g.level)*.16)}" fill="${color}" fill-opacity=".8" stroke="${color}" stroke-width="2"/>`;}
 let effect='',ground='';const bounds=ART_BOUNDS[id]||[0,1000],left=(bounds[0]-axis)*scale,right=(bounds[1]-axis)*scale;
 let min=left,max=right;
 if(overflow){const points=p.map(([yy,r])=>[-r-8,yy]),foot=points.at(-1),pool={cx:foot[0]-25,cy:bottom+18,rx:3*Math.max(150,18/scale),ry:3*Math.max(30,4/scale)},streamWidth=Math.max(22,3/scale),edge=liquid==='우유'?'#b5a184':liquid==='주스'?'#d99728':'#4aa4b5';max=Math.max(max,(pool.cx+pool.rx)*scale);min=Math.min(min,(pool.cx-pool.rx)*scale,...points.map(([x])=>x*scale-streamWidth*scale));let flow='M'+points[0];for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],mid=(a[1]+b[1])/2;flow+=`C${a[0]},${mid} ${b[0]},${mid} ${b[0]},${b[1]}`;}flow+=`Q${foot[0]},${pool.cy} ${pool.cx},${pool.cy}`;ground=`<g class="ground-pool"><ellipse cx="${pool.cx}" cy="${pool.cy}" rx="${pool.rx}" ry="${pool.ry}" fill="${color}" fill-opacity=".85" stroke="${edge}" stroke-width="${Math.max(3,.7/scale)}"/></g>`;effect=`<g class="wall-overflow" data-liquid="${liquid}"><path d="${flow}" fill="none" stroke="${edge}" stroke-width="${streamWidth+Math.max(5,.7/scale)}" stroke-linecap="round"/><path d="${flow}" fill="none" stroke="${color}" stroke-width="${streamWidth}" stroke-linecap="round"/><path d="${flow}" fill="none" stroke="#fff" stroke-opacity=".48" stroke-width="${Math.max(4,.7/scale)}" stroke-linecap="round"/></g>`;}
 return {markup:`<g class="painted-vessel" data-fill="${amount/capacity}" transform="translate(${cx} ${y}) scale(${scale})">${ground}${inner}${effect}</g>`,min,max,geometry:g};
}
const tx=(x,y,s,size=18)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="#36585c" font-family="Malgun Gothic,sans-serif">${s}</text>`;
export function renderPaintedPour(v){
 const ga=paintedGeometry(v.from.id,v.source,v.source),gb=paintedGeometry(v.to.id,v.target,v.filled),extent=(id,g)=>(g.profile.at(-1)[0]-(id==='pitcher'?40:g.profile[0][0]))*g.scale,base=238;
 let camera=180/Math.max(extent(v.from.id,ga),extent(v.to.id,gb));
 // Both panels use the same physical scale, including handles and spilled water.
 for(let i=0;i<3;i++){const left=paintedVessel(v.from.id,v.source,v.source,v.liquid,0,base,camera,'fit-a'),right=paintedVessel(v.to.id,v.target,v.filled,v.liquid,0,base,camera,'fit-b',v.outcome==='overflow'),width=Math.max(left.max-left.min,right.max-right.min);if(width<=260)break;camera*=260/width;}
 const build=(id,capacity,amount,cx,uid,overflow)=>{let a=paintedVessel(id,capacity,amount,v.liquid,0,base,camera,uid,overflow);return paintedVessel(id,capacity,amount,v.liquid,cx-(a.min+a.max)/2,base,camera,uid,overflow).markup;};
 const a=build(v.from.id,v.source,v.source,165,'painted-a-'+v.variant,false),b=build(v.to.id,v.target,v.filled,595,'painted-b-'+v.variant,v.outcome==='overflow'),situation=v.outcome==='overflow'?'가득 차고 넘쳤어요':v.outcome==='space'?'빈 공간이 남았어요':'넘치지 않고 가득 찼어요';
 const labelY=v.outcome==='overflow'?298:278,height=labelY+37;
 return `<svg class="pour-illustration" viewBox="0 0 760 ${height}" role="img" aria-label="${v.from.name}의 ${v.liquid}를 ${v.to.name}에 모두 부은 뒤 ${situation}"><rect x="15" y="6" width="300" height="${height-15}" rx="22" fill="#fff" stroke="#dbe8e0"/><rect x="445" y="6" width="300" height="${height-15}" rx="22" fill="#fff" stroke="#dbe8e0"/>${tx(165,32,'붓기 전',16)}${tx(595,32,'모두 부은 뒤',16)}${a}${b}<defs><linearGradient id="pour-direction" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#b5d7ca"/><stop offset="1" stop-color="#6b9c91"/></linearGradient></defs><path d="M345 140H386V132L406 145L386 158V150H345Z" fill="url(#pour-direction)" stroke="#719b8e" stroke-width=".9" stroke-linejoin="round"/><path d="M349 142H384" stroke="#e6f2eb" stroke-width="1.2" stroke-linecap="round"/>${tx(375,180,'모두 붓기',14)}${tx(165,labelY,v.from.name+'에 가득',19)}${tx(595,labelY,v.to.name,19)}${tx(595,labelY+21,situation,14)}</svg>`;
}

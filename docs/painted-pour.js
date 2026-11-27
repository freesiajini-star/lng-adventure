import {VESSEL_PHOTO_BOUNDS} from './vessel-photo-bounds.js?v=f8b8778b26df';
import {spillPool} from './spill-pool.js?v=f8b8778b26df';
import {ART_PROFILES,ART_AXES,ART_BOUNDS} from './art-vessel-profiles.js?v=f8b8778b26df';
import {artImage,vesselArt} from './art-catalog.js?v=f8b8778b26df';
import {volumeBelow,fillLevel,radiusAt} from './pour-geometry.js?v=f8b8778b26df';
// Interior coordinates of the EMPTY artwork. Rim ellipses, sleeves, labels and
// reflections are not changes in the vessel's internal radius.
const profiles={...ART_PROFILES,
 waterBottle:[[100,105],[190,105],[265,195],[320,210],[785,210],[850,170],[875,80]],
 juiceBottle:[[112,105],[205,105],[270,133],[350,205],[430,222],[790,222],[840,185],[869,95]],
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
export const EMPTY_BOTTLE_AXES={waterBottle:566.40625,juiceBottle:550,tumbler:550};
const center=id=>EMPTY_BOTTLE_AXES[id]??ART_AXES[id]??500;
export function vesselPhotoLayout(id,state,axis=center(id)){const e=VESSEL_PHOTO_BOUNDS[id+':empty'],f=VESSEL_PHOTO_BOUNDS[id+':'+state];if(!e||!f)return{x:-axis,y:0,w:1000,h:1000};const sx=(e[2]-e[0])/(f[2]-f[0]),sy=(e[3]-e[1])/(f[3]-f[1]);return{x:e[0]-axis-f[0]*sx,y:e[1]-f[1]*sy,w:1000*sx,h:1000*sy};}
export function paintedVessel(id,capacity,amount,liquid,cx,baseline,camera,uid,overflow=false){
 const g=paintedGeometry(id,capacity,amount),scale=g.scale*camera,p=g.profile,axis=center(id),bottom=p.at(-1)[0],y=baseline-bottom*scale,opaque=id.endsWith('Carton'),full=liquid==='우유'?'milk-full':liquid==='주스'?'juice-full':'water-full',color=liquid==='우유'?'#fff9e9':liquid==='주스'?'#ffa30e':'#8edce6';
 const lower=[[g.level,radiusAt(p,g.level)],...p.filter(a=>a[0]>g.level)],liquidPath='M'+lower.map(([yy,r])=>[-r,yy].join(',')).join('L')+'L'+[...lower].reverse().map(([yy,r])=>[r,yy].join(',')).join('L')+'Z';
 // One fixed silhouette for every quantity. Independently painted "full" assets
 // contain arbitrary headspace and cannot represent a calculated fill level.
 let inner=artImage(vesselArt(id,opaque?full:'empty'),-axis,0,1000);
 if(!opaque&&amount>0){
  const placement=vesselPhotoLayout(id,full,axis),photo=artImage(vesselArt(id,full),placement.x,placement.y,placement.w,placement.h).replace('xMidYMid meet','none'),r=radiusAt(p,g.level),depth=Math.min(65,r*.18),all=uid+'-interior',silhouette='M'+p.map(([yy,rr])=>[-rr,yy].join(',')).join('L')+'L'+[...p].reverse().map(([yy,rr])=>[rr,yy].join(',')).join('L')+'Z';
  const front=id==='tumbler'?'<rect x="-230" y="410" width="460" height="220"/>':id==='juiceBottle'?'<ellipse cx="0" cy="645" rx="156" ry="112"/>':id==='waterBottle'?'<rect x="-160" y="155" width="320" height="65"/>':'';
  const curved='M'+[-r,g.level].join(',')+'L'+lower.slice(1).map(([yy,rr])=>[-rr,yy].join(',')).join('L')+'L'+[...lower].reverse().map(([yy,rr])=>[rr,yy].join(',')).join('L')+'Q0,'+(g.level+2*depth)+' '+[-r,g.level].join(',')+'Z';
  const metadata=`<path class="calculated-liquid" data-liquid="${liquid}" data-level="${g.level}" d="${liquidPath}" fill="none"/>`;
  if(amount===capacity)inner=`<g class="full-painted-liquid">${photo}</g>${metadata}`;
  else inner+=`<defs><clipPath id="${all}"><path d="${silhouette}"/></clipPath><clipPath id="${uid}"><path d="${curved}"/><ellipse cx="0" cy="${g.level}" rx="${r}" ry="${depth}"/></clipPath><clipPath id="${uid}-front">${front}</clipPath></defs><g clip-path="url(#${all})"><g clip-path="url(#${uid})">${photo}</g></g><g clip-path="url(#${uid}-front)">${artImage(vesselArt(id,'empty'),-axis,0,1000)}</g>${metadata}`;
 }
 let effect='',ground='';const bounds=ART_BOUNDS[id]||[0,1000],left=(bounds[0]-axis)*scale,right=(bounds[1]-axis)*scale;
 let min=left,max=right;
 if(overflow){const foot=-p.at(-1)[1]-8,pool={cx:foot-25,cy:bottom+18,rx:3*Math.max(150,18/scale),ry:3*Math.max(30,4/scale)};max=Math.max(max,(pool.cx+pool.rx)*scale);min=Math.min(min,(pool.cx-pool.rx)*scale);ground=spillPool(pool,liquid,scale,uid);}

 return {markup:`<g class="painted-vessel" data-fill="${amount/capacity}" transform="translate(${cx} ${y}) scale(${scale})">${ground}${inner}${effect}</g>`,min,max,geometry:g};
}
const tx=(x,y,s,size=18)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="var(--stage-ink,#304f4b)" font-family="Malgun Gothic,sans-serif">${s}</text>`;
export function renderPaintedPour(v){
 const ga=paintedGeometry(v.from.id,v.source,v.source),gb=paintedGeometry(v.to.id,v.target,v.filled),extent=(id,g)=>(g.profile.at(-1)[0]-(id==='pitcher'?40:g.profile[0][0]))*g.scale,base=238;
 let camera=180/Math.max(extent(v.from.id,ga),extent(v.to.id,gb));
 // Both panels use the same physical scale, including handles and spilled water.
 for(let i=0;i<3;i++){const left=paintedVessel(v.from.id,v.source,v.source,v.liquid,0,base,camera,'fit-a'),right=paintedVessel(v.to.id,v.target,v.filled,v.liquid,0,base,camera,'fit-b',v.outcome==='overflow'),width=Math.max(left.max-left.min,right.max-right.min);if(width<=260)break;camera*=260/width;}
 const build=(id,capacity,amount,cx,uid,overflow)=>{let a=paintedVessel(id,capacity,amount,v.liquid,0,base,camera,uid,overflow);return paintedVessel(id,capacity,amount,v.liquid,cx-(a.min+a.max)/2,base,camera,uid,overflow).markup;};
 const a=build(v.from.id,v.source,v.source,165,'painted-a-'+v.variant,false),b=build(v.to.id,v.target,v.filled,595,'painted-b-'+v.variant,v.outcome==='overflow'),situation=v.outcome==='overflow'?'가득 차고 넘쳤어요':v.outcome==='space'?'빈 공간이 남았어요':'넘치지 않고 가득 찼어요';
 const labelY=v.outcome==='overflow'?298:278,height=labelY+37;
 return `<svg class="pour-illustration" viewBox="0 0 760 ${height}" role="img" aria-label="${v.from.name}의 ${v.liquid}를 ${v.to.name}에 모두 부은 뒤 ${situation}"><rect x="15" y="6" width="300" height="${height-15}" rx="22" fill="var(--stage-panel,#fff)" stroke="var(--stage-edge,#dbe8e0)"/><rect x="445" y="6" width="300" height="${height-15}" rx="22" fill="var(--stage-panel,#fff)" stroke="var(--stage-edge,#dbe8e0)"/>${tx(165,32,'붓기 전',16)}${tx(595,32,'모두 부은 뒤',16)}${a}${b}<defs><linearGradient id="pour-direction" x1="0" y1="0" x2="0" y2="1"><stop stop-color="var(--diagram-main-top,#b5d7ca)"/><stop offset="1" stop-color="var(--diagram-main-bottom,#6b9c91)"/></linearGradient></defs><path d="M345 140H386V132L406 145L386 158V150H345Z" fill="url(#pour-direction)" stroke="var(--stage-ink,#719b8e)" stroke-width=".9" stroke-linejoin="round"/><path d="M349 142H384" stroke="#e6f2eb" stroke-width="1.2" stroke-linecap="round"/>${tx(375,180,'모두 붓기',14)}${tx(165,labelY,v.from.name+'에 가득',19)}${tx(595,labelY,v.to.name,19)}${tx(595,labelY+21,situation,14)}</svg>`;
}

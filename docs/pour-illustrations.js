import {renderPaintedPour} from './painted-pour.js?v=d192a6acac2b';
import {transferArrow} from './source-vessels.js?v=d192a6acac2b';
import {vesselGeometry,radiusAt,fillLevel,wallOverflow} from './pour-geometry.js?v=d192a6acac2b';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=(x,y,s,size=18,color='#3e5d61')=>`<text x="${x}" y="${y}" text-anchor="middle" fill="${color}" font-family="Malgun Gothic,sans-serif" font-size="${size}">${esc(s)}</text>`;
const outline=p=>'M'+p.map(([y,r])=>`${r},${y}`).join('L')+'L'+[...p].reverse().map(([y,r])=>`${-r},${y}`).join('L')+'Z';
export function illustration(v,capacity,amount,liquid,cx,baseline,camera,id,receiving){
 const g=vesselGeometry(v.id,capacity,amount),p=g.profile,d=outline(p),top=p[0][0],bottom=p.at(-1)[0],scale=g.scale*camera,y=baseline-bottom*scale;
 const liquidColors=liquid==='우유'?['#fffcef','#f1dfb9']:liquid==='주스'?['#ffce78','#e9a348']:['#9de1eb','#55b7d1'];
 const maxRadius=Math.max(...p.map(x=>x[1]));
 let defs=`<linearGradient id="${id}-glass" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${v.color}" stop-opacity=".38"/><stop offset=".22" stop-color="#fff" stop-opacity=".92"/><stop offset=".65" stop-color="#eefbff" stop-opacity=".68"/><stop offset="1" stop-color="${v.color}" stop-opacity=".62"/></linearGradient><linearGradient id="${id}-drink" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${liquidColors[0]}"/><stop offset="1" stop-color="${liquidColors[1]}"/></linearGradient><linearGradient id="${id}-carton"><stop stop-color="#fffdfa"/><stop offset=".7" stop-color="#f5f2e7"/><stop offset="1" stop-color="#d9e1df"/></linearGradient><clipPath id="${id}-clip"><path d="${d}"/></clipPath>`;
 let handles='';if(['mug','measureJug'].includes(v.id)){const r=radiusAt(p,65);handles=`<path d="M${r-3} 62C${r+55} 47 ${r+55} 123 ${r-4} 121" stroke="${v.color}" stroke-width="15" fill="none"/><path d="M${r-3} 62C${r+55} 47 ${r+55} 123 ${r-4} 121" stroke="#fffaf0" stroke-width="8" fill="none" opacity=".8"/>`;}
 if(v.id==='pitcher')handles=`<path d="M-38 59V17Q-38-8 0-8T38 17V59" fill="none" stroke="${v.color}" stroke-width="9"/><path d="M-38 59V17Q-38-8 0-8T38 17V59" fill="none" stroke="#fffaf0" stroke-width="3" opacity=".7"/>`;
 const opaque=v.id.endsWith('Carton');let art=handles+`<path d="${d}" fill="${opaque?'url(#'+id+'-carton)':'url(#'+id+'-glass)'}" stroke="#6f979c" stroke-width="1.7" stroke-linejoin="round"/>`;
 if(!opaque&&amount>0){const r=radiusAt(p,g.level);art+=`<g clip-path="url(#${id}-clip)"><rect x="${-maxRadius-2}" y="${g.level}" width="${2*maxRadius+4}" height="${bottom-g.level+2}" fill="url(#${id}-drink)" opacity=".84"/><ellipse cx="0" cy="${g.level}" rx="${r}" ry="3.5" fill="${liquidColors[0]}" stroke="${liquidColors[1]}" stroke-width=".8"/></g>`;}
 // Recognizable product details sit on the vessel, never change the liquid boundary.
 if(v.id==='pitcher'){art+=`<g clip-path="url(#${id}-clip)"><path d="M-50 80h100m-100 57h100" stroke="${v.color}" stroke-width="6" opacity=".55"/><path d="M-38 85v44m76-44v44" stroke="#fff" stroke-width="4" opacity=".45"/></g>`;if(!receiving)art+=`<rect x="-29" y="17" width="58" height="12" rx="4" fill="${v.color}" stroke="#6f979c" stroke-width="1.3"/>`;}
 else if(v.id==='waterBottle'){
  art+=`<g clip-path="url(#${id}-clip)">`+[80,94,108,122,143,154].map(a=>`<path d="M-40 ${a}Q0 ${a+4} 40 ${a}" fill="none" stroke="#5d99aa" stroke-width="1" opacity=".36"/>`).join('')+`<rect x="-40" y="103" width="80" height="32" fill="#b7dce6" opacity=".8"/><path d="M0 109C-18 126-2 133 0 133C17 131 15 121 0 109Z" fill="#fff" opacity=".85"/></g>`;
 }else if(v.id==='juiceBottle')art+=`<g clip-path="url(#${id}-clip)"><rect x="-40" y="87" width="80" height="51" fill="#fff2cf" opacity=".9"/><circle cy="110" r="15" fill="#edab53" stroke="#cf9147"/><path d="M0 95Q15 78 20 93Q10 102 0 95" fill="#8eae6e"/></g>`;
 else if(opaque){art+=`<path d="M-34 35H34M0 10V35L34 52" fill="none" stroke="#99a6a3" stroke-width="1.1"/><path d="M-33 66H33V159H-33Z" fill="${v.color}" opacity=".82"/><path d="M-33 140Q-5 121 18 140T34 140V161H-33Z" fill="#fff8e5" opacity=".85"/>${text(0,99,v.id==='milkCarton'?'우유':'주스',17,'#fffef1')}<circle cy="120" r="10" fill="${v.id==='milkCarton'?'#fbf5e5':'#f2c064'}"/><path d="M-7 117Q0 109 7 117" stroke="${v.id==='milkCarton'?'#92acc3':'#d8a04b'}" stroke-width="3" fill="none"/>`;
 }else if(v.id==='measureJug'){for(const fraction of [.2,.4,.6,.8]){const a=fillLevel(p,fraction);art+=`<path d="M${radiusAt(p,a)-15} ${a}h12" stroke="#738f88" stroke-width="1.2"/>`;} }
 else if(v.id==='tumbler')art+=`<g clip-path="url(#${id}-clip)"><rect x="-36" y="78" width="72" height="43" rx="5" fill="${v.color}" opacity=".7"/><path d="M-25 87h50m-50 8h50m-50 8h50m-50 8h50" stroke="#fff" stroke-width=".8" opacity=".5"/></g>`;
 else if(v.id==='vase')art+=`<g opacity=".54" fill="#fffdf6"><ellipse cx="0" cy="124" rx="5" ry="12"/><ellipse cx="0" cy="124" rx="5" ry="12" transform="rotate(60 0 124)"/><ellipse cx="0" cy="124" rx="5" ry="12" transform="rotate(120 0 124)"/><circle cy="124" r="4" fill="#e9c37b"/></g>`;
 if(!opaque){const highlight=p.filter(([a])=>a>top+10&&a<bottom-14).map(([a,r])=>`${-r*.72},${a}`);if(highlight.length)art+=`<path d="M${highlight.join('L')}" fill="none" stroke="#fff" stroke-width="4.5" opacity=".65" stroke-linecap="round"/>`;art+=`<ellipse cy="${top}" rx="${p[0][1]}" ry="3.5" fill="#f9feff" fill-opacity=".7" stroke="#7da2a7" stroke-width="1.3"/>`;}
 if(v.id.endsWith('Bottle')&&!receiving)art+=`<rect x="${-p[0][1]-2}" y="${top-11}" width="${2*p[0][1]+4}" height="11" rx="3" fill="${v.color}" stroke="#66939d" stroke-width="1.2"/><path d="M-9 ${top-9}v7m6-7v7m6-7v7m6-7v7" stroke="#fff" stroke-opacity=".55"/>`;
 const shadow=`<ellipse cx="${cx}" cy="${baseline+6}" rx="${Math.max(25,maxRadius*scale)}" ry="6" fill="#8da7a1" opacity=".15"/>`;
 return {markup:`<defs>${defs}</defs>${shadow}<g transform="translate(${cx} ${y}) scale(${scale})">${art}</g>`,geometry:g,topY:y+top*scale,rightX:cx+p[0][1]*scale,base:baseline,scale,originX:cx,originY:y};
}
// Center the whole receiver silhouette, handle and spilled liquid together.
export function receiverCenterX(v,g,camera){
 const scale=g.scale*camera,r=Math.max(...g.profile.map(p=>p[1]));
 let left=-(r+.85)*scale,right=(r+.85)*scale;
 if(['mug','measureJug'].includes(v.to.id)){
  const t=Math.sqrt(3422)-58,u=1-t,h=radiusAt(g.profile,65);
  const x=u*u*u*(h-3)+3*u*u*t*(h+55)+3*u*t*t*(h+55)+t*t*t*(h-4);
  right=Math.max(right,(x+7.5)*scale);
 }
 if(v.to.id==='pitcher'){left=Math.min(left,-42.5*scale);right=Math.max(right,42.5*scale);}
 if(v.outcome==='overflow'){
  const flow=wallOverflow(g.profile,scale,0,0);
  left=Math.min(left,flow.pool.cx-flow.pool.rx,...flow.points.map(p=>p[0]-1.9));
  right=Math.max(right,flow.pool.cx+flow.pool.rx,...flow.points.map(p=>p[0]+1.9));
 }
 return 595-(left+right)/2;
}
export function renderPourComparison(v){return renderPaintedPour(v);}

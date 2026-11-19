import {paintedVessel,paintedGeometry} from './painted-pour.js?v=dff2bdf4f217';
import {artImage,lifeArtwork} from './art-catalog.js?v=dff2bdf4f217';
import {illustration} from './pour-illustrations.js?v=dff2bdf4f217';
import {vesselGeometry} from './pour-geometry.js?v=dff2bdf4f217';
import {source,sourceDefs,transferArrow} from './source-vessels.js?v=dff2bdf4f217';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tx=(x,y,s,size=17)=>`<text x="${x}" y="${y}" text-anchor="middle" font-family="Malgun Gothic,sans-serif" font-size="${size}" fill="var(--stage-ink,#304f4b)">${esc(s)}</text>`;
const colors=['#e78d9c','#b5b3dc','#f1c37c','#9ac8ad'];
const leaf='<path d="M0 10Q-23-10-21-24Q-4-28 0-4Q6-36 24-26Q21-6 0 10" fill="#8fba71" stroke="#628e59" stroke-width="1.5"/>';
function fruit(i){
 if(i===0)return '<path d="M0-15Q-27-25-19-2L-4 22Q0 29 5 22L20-2Q27-25 0-15Z" fill="#e58e97" stroke="#b77d7b"/><path d="M-21-15-9-18-5-27 1-20 10-27 11-17 22-14 8-9 0-13-9-9Z" fill="#96b575"/>'+[[-9,-4],[8,-3],[-5,7],[5,13]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="1.5" ry="2.5" fill="#ffe9ad"/>`).join('');
 if(i===1)return '<g fill="#9a83b5" stroke="#796795">'+[[0,-8],[-9,-3],[9,-3],[-5,7],[5,7],[0,16]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="8"/>`).join('')+'</g><path d="M0-16Q2-26 13-23" stroke="#83a568" stroke-width="3" fill="none"/>';
 if(i===3)return '<g transform="rotate(-24)"><path d="M-26 0Q-26-19 0-19T26 0Q26 19 0 19T-26 0Z" fill="#efd27e" stroke="#bea16b"/><path d="M-18-6Q-8-15 7-11" stroke="#fff2b6" stroke-width="4" stroke-linecap="round" fill="none"/></g>';
 return '<path d="M0-13C-19-28-29-4-14 13Q0 31 14 13C29-4 19-28 0-13Z" fill="#edbb94" stroke="#b18567"/><path d="M0-14Q-3-27 13-24Q10-12 0-14" fill="#8db270"/><path d="M0-12Q11 2 0 21" stroke="#d59e80" stroke-width="1.7" fill="none"/><path d="M-12-8Q-19 1-11 9" stroke="#fff7d1" stroke-width="3" fill="none"/>';
}
function pot(i){return `<path d="M-30 9H30L24 42Q0 49-24 42Z" fill="url(#life-pot)" stroke="#ae8c6c" stroke-width="1.6"/><ellipse cy="9" rx="30" ry="7" fill="#806f58" stroke="#ae8c6c"/><g transform="translate(0 1)">${leaf}${i===1?'<circle cx="-12" cy="-11" r="9" fill="#e38e74"/><circle cx="15" cy="-5" r="7" fill="#e38e74"/>':i===2?'<path d="M7-18Q28-13 10 4Q22-13 7-18" fill="#e88b70"/>':i===3?'<g fill="#e5a0b8"><circle cy="-32" r="10"/><circle cx="-11" cy="-22" r="10"/><circle cx="11" cy="-22" r="10"/><circle cy="-12" r="10"/><circle cy="-22" r="7" fill="#f0d28f"/></g>':''}</g>`;}
function bottle(i,art){return `<g transform="scale(${.65+i*.07})">${source('물병')}</g>${art==='camp'?'<path d="M-19-22Q-25-55 18-43" fill="none" stroke="#567e7d" stroke-width="4"/><path d="M-17 5h34v20h-34" fill="#c5d9b3"/><path d="M-10 18 0 8 10 18Z" fill="#688e72"/>':''}${art==='fruit'?`<g transform="translate(0 4) scale(.55)">${fruit(i)}</g>`:''}`;}
function art(row,scene,rows){
 if(row.art==='paint'){const widths=[104,120,140,154],heights=[88,104,120,132],i=row.index||0,w=widths[i],h=heights[i];return `<rect x="${-w/2+3}" y="${32-h+4}" width="${w}" height="${h}" rx="3" fill="#46515b" opacity=".12"/><rect x="${-w/2}" y="${32-h}" width="${w}" height="${h}" rx="3" fill="#fffdf9" stroke="#bcc4cb" stroke-width="1.4"/><path d="M${w/2-14} ${32-h}v14h14" fill="#e4eaf0"/>`+artImage('paint',-52,-35,104,94);}
 if(row.art==='tap'){const colors=[[1,1,1],[.88,.55,.32],[1,.79,.38],[1,.86,.25]],i=row.index||0,c=colors[i],id='tap-metal-'+i;return `<defs><filter id="${id}" color-interpolation-filters="sRGB"><feColorMatrix values="${c[0]*.2126} ${c[0]*.7152} ${c[0]*.0722} 0 0 ${c[1]*.2126} ${c[1]*.7152} ${c[1]*.0722} 0 0 ${c[2]*.2126} ${c[2]*.7152} ${c[2]*.0722} 0 0 0 0 0 1 0"/></filter></defs><g filter="url(#${id})">${artImage('tap',-70,-70,140,130)}</g>`;}
 if(row.art==='measure'){const g=paintedGeometry('measureJug',1000,row.value);return paintedVessel('measureJug',1000,row.value,'물',0,50,.14/g.scale,'measure-table-'+row.index).markup;}
 if(['juice','snack','drink'].includes(row.art)){const id=row.art==='drink'&&row.index>=2?'waterBottle':'glass',max=Math.max(...rows.map(r=>r.value)),geometries=rows.map(r=>paintedGeometry(row.art==='drink'&&r.index>=2?'waterBottle':'glass',r.value/.8,r.value)),camera=120/Math.max(...geometries.map(g=>(g.profile.at(-1)[0]-g.profile[0][0])*g.scale)),liquid=row.art==='snack'?(rows.indexOf(row)===0?'우유':rows.indexOf(row)===1?'주스':'물'):row.art==='juice'?'주스':'물';return paintedVessel(id,row.value/.8,row.value,liquid,0,55,camera,'life-'+scene+'-'+row.index).markup;}
 if(row.art==='rice'){const scale=.95*Math.cbrt(row.value/Math.max(...rows.map(r=>r.value)));return artImage('rice',-70*scale,48-130*scale,140*scale,130*scale);}
 if(row.art==='rain'){const max=Math.max(...rows.map(r=>r.value)),scale=Math.cbrt(row.value/max);return artImage('rainBucket',-70*scale,55-135*scale,140*scale,135*scale);}
 const scale=['bottle','camp','tank','ice'].includes(row.art)?.76+(row.index||0)*.08:1;return artImage(lifeArtwork(row),-70*scale,-70*scale,140*scale,130*scale);
}

export function renderLifeTable(v){let out=sourceDefs()+`<defs><linearGradient id="life-pot"><stop stop-color="#ecd2b7"/><stop offset="1" stop-color="#c49a75"/></linearGradient></defs>${tx(360,27,v.title,21)}`;
 const head=v.recipe?'섞는 물':v.scene===9||v.scene===14?'측정한 양':'물 또는 음료의 양';
 out+=`<rect x="15" y="46" width="690" height="258" rx="12" fill="var(--stage-panel,#fffdf8)" stroke="var(--stage-edge,#a6b9ae)"/><path d="M15 237H705V269H15Z" fill="var(--stage-soft,#e8eee4)"/><path d="M15 237H705M15 269H705" stroke="var(--stage-edge,#a6b9ae)"/>`;
 v.rows.forEach((row,i)=>{const x=101+i*172;out+=`<g transform="translate(${x} 131)">${art(row,v.scene,v.rows)}</g>${tx(x,220,row.label,16)}${tx(x,259,v.basis,14)}${tx(x,293,row.value+' mL',20)}`;if(i)out+=`<path d="M${15+i*172} 46V304" stroke="var(--stage-edge,#a6b9ae)"/>`;});
 if(v.recipe)out+=tx(360,332,'표의 수치는 '+v.basis+'에 '+head+'입니다.',15);
 return `<svg viewBox="0 0 720 350" role="img" aria-label="${esc(v.title)} 그림표">${out}</svg>`;
}
export function referenceLayout(v){
 const total=Math.round(v.fills.reduce((n,f)=>n+f*1000,0)),id=v.source==='물통'?'pitcher':v.source==='계량컵'?'measureJug':'waterBottle',a=paintedGeometry(id,total,total),b=paintedGeometry('glass',1000,1000),height=g=>(g.profile.at(-1)[0]-g.profile[0][0])*g.scale,camera=155/Math.max(height(a),height(b));return{total,id,camera,width:Math.max(650,280+v.fills.length*128)};
}
export function renderReference(v){const {total,id,camera,width}=referenceLayout(v);let out=paintedVessel(id,total,total,'물',120,210,camera,'reference-source').markup+tx(120,245,v.source,16)+transferArrow(200,125);v.fills.forEach((f,i)=>{const x=300+i*128;out+=paintedVessel('glass',1000,f*1000,'물',x,210,camera,'reference-'+i).markup+tx(x,28,'1 L 그릇',14)+tx(x,245,f===1?'가득':f===.5?'약 절반':'약 3분의 1',13);});return '<svg viewBox="0 0 '+width+' 265" role="img" aria-label="같은 축척으로 그린 물통과 그릇의 물의 양">'+out+'</svg>';}

import {artImage,vesselArt,VESSEL_IDS} from './art-catalog.js';
export const sourceDefs=()=>`<defs><linearGradient id="sv-metal"><stop stop-color="#a7bec7"/><stop offset=".3" stop-color="#f9fcfc"/><stop offset=".65" stop-color="#d0dee3"/><stop offset="1" stop-color="#96afb9"/></linearGradient><linearGradient id="sv-yellow"><stop stop-color="#ffe9a0"/><stop offset="1" stop-color="#e5ba58"/></linearGradient><linearGradient id="sv-pink"><stop stop-color="#ef9cae"/><stop offset=".4" stop-color="#ffd0d8"/><stop offset="1" stop-color="#d77d93"/></linearGradient><linearGradient id="sv-glass"><stop stop-color="#b6e0e9" stop-opacity=".5"/><stop offset=".3" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#a5d2df" stop-opacity=".4"/></linearGradient><linearGradient id="sv-water" x2="0" y2="1"><stop stop-color="#a5e4ee"/><stop offset="1" stop-color="#68bfd5"/></linearGradient></defs>`;
export const transferArrow=(x,y,vertical=false)=>`<g transform="translate(${x} ${y})${vertical?' rotate(90)':''}"><path d="M0-4H22V-10L34 0L22 10V4H0Z" fill="var(--diagram-main-mid,#91ada5)" stroke="var(--stage-ink,#78998e)" stroke-width=".7" stroke-linejoin="round"/></g>`;
const text=(x,y,s,size=17)=>`<text x="${x}" y="${y}" text-anchor="middle" font-family="Malgun Gothic,sans-serif" font-size="${size}" fill="var(--stage-ink,#304f4b)">${s}</text>`;
export function source(name){
 if(VESSEL_IDS[name]||['주전자','작은 컵'].includes(name))return artImage(vesselArt(name==='주전자'?'kettle':name==='작은 컵'?'smallCup':name),-70,-72,140,125);
 if(name==='물통')return `<path d="M-27-18V-38Q0-58 27-38V-18" stroke="#78a59c" stroke-width="6" fill="none"/><path d="M-25-20H25V-5L39 7V40Q0 49-39 40V7L-25-5Z" fill="url(#sv-water)" stroke="#78aab9" stroke-width="2"/><path d="M-21-20H21V-29H-21Z" fill="#98bdb0" stroke="#78a59c"/><path d="M-27 10V35" stroke="#fff9" stroke-width="5"/><path d="M-37 7H37M-37 30H37" stroke="#90b9b1" stroke-width="5" opacity=".6"/>`;

 if(name==='주전자')return `<path d="M-29-13V-32Q-29-56 0-56T29-32V-13" fill="none" stroke="#586970" stroke-width="7"/><path d="M-31 2Q-44 5-49-13L-63-22L-57-28Q-43-27-37-16L-25-9" fill="url(#sv-metal)" stroke="#7c929c" stroke-width="1.8"/><path d="M-35-17Q0-29 35-17L40 24Q40 34 0 35T-40 24Z" fill="url(#sv-metal)" stroke="#7c929c" stroke-width="1.8"/><ellipse cy="-17" rx="35" ry="9" fill="#dae6e8" stroke="#7c929c"/><ellipse cy="-20" rx="24" ry="5" fill="#becdd0" stroke="#7c929c"/><rect x="-8" y="-31" width="16" height="10" rx="4" fill="#b87c53" stroke="#806448"/><path d="M-29-8L-31 20" stroke="white" stroke-width="5" opacity=".8" stroke-linecap="round"/>`;
 if(name==='작은 컵')return `<path d="M-21-8L-16 31Q0 39 16 31L21-8" fill="url(#sv-yellow)" stroke="#b8984c" stroke-width="1.8"/><ellipse cy="-8" rx="21" ry="6" fill="#fff2bb" stroke="#b8984c"/><ellipse cy="-8" rx="17" ry="3" fill="#b7e2e9"/><path d="M-15 0L-12 25" stroke="#fffbea" stroke-width="3" stroke-linecap="round"/>`;
 if(name==='물병')return `<path d="M-13-42H13V-21L29-6V31Q0 42-29 31V-6L-13-21Z" fill="url(#sv-water)" stroke="#78aab9" stroke-width="2"/><path d="M-27-5H27V30Q0 39-27 30Z" fill="#99dce8" opacity=".8"/><rect x="-16" y="-49" width="32" height="9" rx="3" fill="#88b6a1"/><path d="M-28 9H28V24H-28" fill="#d9edf1"/><path d="M-21-1V27" stroke="white" stroke-width="3"/>`;
 if(name==='유리그릇')return `<path d="M-49-4Q-45 24-21 34H21Q45 24 49-4" fill="url(#sv-glass)" stroke="#78aab9" stroke-width="2"/><ellipse cy="-4" rx="49" ry="10" fill="#b5eaf1" stroke="#78aab9" stroke-width="2"/><path d="M-39 5Q-35 20-23 27" fill="none" stroke="white" stroke-width="4" stroke-linecap="round"/>`;
 if(name==='계량컵')return `<path d="M29-15C65-20 65 30 29 25" fill="none" stroke="#7da8b3" stroke-width="7"/><path d="M-38-28L-28-14V32Q0 41 29 32V-28Z" fill="url(#sv-glass)" stroke="#78aab9" stroke-width="2"/><path d="M-26-26H27V31Q0 39-26 31Z" fill="#9cdce8" opacity=".8"/><path d="M10-3H24M16 6H24M10 15H24M16 24H24" stroke="#728f99" stroke-width="2"/><path d="M-20-12V27" stroke="white" stroke-width="3"/>`;
 if(name==='텀블러')return `<path d="M-26-39H26L21 31Q0 40-21 31Z" fill="#a1bbc9" stroke="#6e909f" stroke-width="2"/><ellipse cy="-39" rx="26" ry="6" fill="#dbf0f2" stroke="#6e909f"/><ellipse cy="-39" rx="21" ry="3" fill="#9dd9e4"/><path d="M-23-9H23L21 15H-21Z" fill="#809cae"/><path d="M-18-28L-15 27" stroke="#e7f6f6" stroke-width="4" stroke-linecap="round"/>`;
 return `<path d="M27-10C65-22 65 35 27 25" fill="none" stroke="#b85f76" stroke-width="10"/><path d="M27-10C65-22 65 35 27 25" fill="none" stroke="#f2b7c1" stroke-width="5"/><path d="M-29-23H29V26Q29 37 0 37T-29 26Z" fill="url(#sv-pink)" stroke="#ad6477" stroke-width="1.8"/><ellipse cy="-23" rx="29" ry="6" fill="#ffe0e3" stroke="#ad6477"/><ellipse cy="-23" rx="24" ry="3" fill="#b7e2e9"/><path d="M-22-13V22" stroke="#ffe8eb" stroke-width="4" opacity=".8" stroke-linecap="round"/>`;
}
export function renderSourceVessels(v){
 const defs=sourceDefs();
 let out=defs;
 v.values.forEach((amount,i)=>{
  const x=110+i*210,level=300-110*amount/v.max;
  out+=`<rect x="${x-93}" y="12" width="186" height="360" rx="20" fill="var(--stage-panel,#fffefa)" fill-opacity=".65" stroke="var(--stage-edge,#dce8e2)"/><g transform="translate(${x} 87)">${source(v.sources[i])}</g>${text(x,151,v.labels[i]+' '+v.sources[i])}${transferArrow(x,168,true)}<g transform="translate(0 35)"><ellipse cx="${x}" cy="307" rx="49" ry="6" fill="#729b9f" opacity=".12"/><path d="M${x-42} 190V300a42 9 0 0 0 84 0V190" fill="url(#sv-glass)" stroke="#78aab9" stroke-width="1.8"/><path d="M${x-40} ${level}V300a40 8 0 0 0 80 0V${level}" fill="url(#sv-water)" opacity=".85"/><ellipse cx="${x}" cy="${level}" rx="40" ry="8" fill="#b5eaf1" stroke="#6cb9cf" stroke-width="1.2"/><ellipse cx="${x}" cy="190" rx="42" ry="9" fill="#f5fdff" fill-opacity=".5" stroke="#78aab9" stroke-width="1.8"/><path d="M${x-33} 201V293" stroke="white" stroke-width="4" opacity=".8" stroke-linecap="round"/><path d="M${x-42} 300a42 9 0 0 0 84 0" fill="none" stroke="#78aab9" stroke-width="1.5"/></g>`;
 });
 return `<svg viewBox="0 0 640 389" role="img" aria-label="세 용기의 물을 모양과 크기가 같은 투명한 원통 그릇에 각각 옮긴 모습">${out}</svg>`;
}

function cup(x,y){return artImage('glass-water-full',x-29.7,y-8.8,59.4,69.3);}
export function renderCupGroups(v){
 let out=sourceDefs();
 v.groups.forEach((g,i)=>{
  const y=16+i*185;
  out+=`<rect x="14" y="${y}" width="612" height="171" rx="20" fill="var(--stage-panel,#fffefa)" fill-opacity=".7" stroke="var(--stage-edge,#dce8e2)"/><g transform="translate(90 ${y+73})">${source(g.source)}</g>${text(90,y+145,g.label,16)}${transferArrow(164,y+84)}`;
  // The artwork has transparent side margins; a 52-unit pitch keeps the
  // visible glasses separate while fitting all eight in the existing panel.
  const pitch=52,start=226+(8-g.count)*pitch/2;
  for(let n=0;n<g.count;n++)out+=cup(start+n*pitch,y+56);
 });
 return `<svg viewBox="0 0 640 397" role="img" aria-label="두 용기에 가득 있던 물을 같은 컵에 남김없이 옮긴 모습">${out}</svg>`;
}

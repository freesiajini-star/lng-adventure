import {artImage} from './art-catalog.js?v=179a427bc0f8';
import {source,sourceDefs} from './source-vessels.js?v=179a427bc0f8';
const text=(x,y,s,size=18)=>`<text x="${x}" y="${y}" text-anchor="middle" font-family="Malgun Gothic,sans-serif" font-size="${size}" fill="var(--stage-ink,#304f4b)">${s}</text>`;
export function renderFillTable(v){
 const names=v.sources||v.shapes?.map(n=>({'대접':'유리그릇','원통':'텀블러','목 긴 병':'물병'}[n]||n))||['작은 컵','텀블러','머그잔','유리그릇'];
 const n=v.labels.length,w=680,head=140,cell=(w-head)/n;
 let out=sourceDefs()+`<rect x="12" y="10" width="696" height="386" rx="22" fill="var(--stage-panel,#fffefa)" fill-opacity=".75" stroke="var(--stage-edge,#dce8e2)"/>${text(258,56,'같은 수조를 가득 채우기',22)}${text(258,86,'매번 용기에 물을 가득 담아 부어요.',16)}${artImage('aquarium',515,5,180,115)}`;
 names.forEach((name,i)=>{const x=20+head+cell*(i+.5);out+=`<g transform="translate(${x} 205)">${source(name)}</g>${text(x,278,name,16)}`;});
 out+=`<rect x="20" y="296" width="680" height="80" rx="7" fill="var(--stage-panel,#fffdf6)" stroke="var(--stage-edge,#94aaa0)"/><path d="M20 336H700" stroke="var(--stage-edge,#94aaa0)"/><path d="M20 296H700V336H20Z" fill="var(--stage-soft,#e8eee4)" opacity=".7"/>${text(90,323,'용기')}${text(90,364,'부은 횟수(번)',16)}`;
 for(let i=0;i<n;i++){const x=20+head+cell*i;out+=`<path d="M${x} 296V376" stroke="var(--stage-edge,#94aaa0)"/>${text(x+cell/2,323,v.labels[i],20)}${text(x+cell/2,364,v.counts[i],22)}`;}
 return `<svg viewBox="0 0 720 406" role="img" aria-label="같은 수조를 가득 채우기 위해 각 용기로 부은 횟수 표">${out}</svg>`;
}

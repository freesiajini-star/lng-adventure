import {artPath} from './art-catalog.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderObjectEquations(v){
 const group=(index,count)=>`<figure class="equation-objects"><div class="equation-items" data-object="${esc(v.labels[index])}" data-count="${count}">${Array.from({length:count},()=>`<img alt="${esc(v.labels[index])}" src="${artPath(v.arts[index])}">`).join('')}</div><figcaption>${esc(v.labels[index])} ${count}개</figcaption></figure>`;
 return `<div class="object-equations" role="group" aria-label="${esc(v.title)}의 주어진 무게 관계">${v.rows.map(row=>`<div class="object-equation">${row.a>0?group(0,row.a):''}${row.op==='='?'<span class="relation-sign">=</span>'+group(1,1):(row.a>0&&row.b>0?'<span class="relation-sign">'+esc(row.op)+'</span>':'')+(row.b>0?group(1,row.b):'')+'<span class="relation-sign">=</span><strong class="object-total">'+row.total+' g</strong>'}</div>`).join('')}</div>`;
}
export function renderScaleStory(v){return `<div class="scale-story"><div class="scale-story-art">${v.arts.map(id=>`<img src="${artPath(id)}" alt="${esc(v.title)}">`).join('')}</div><table><tbody>${v.rows.map(([label,value])=>`<tr><th>${esc(label)}</th><td>${esc(value)}</td></tr>`).join('')}</tbody></table></div>`;}

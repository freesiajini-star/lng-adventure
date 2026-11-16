import {artPath,OBJECT_ART} from './art-catalog.js?v=6847332b44dd';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderBundleRelations(v){
 const group=(label,count)=>{const bottle=v.unit==='mL',id=label==='우유'?'waterBottle-milk-full':label==='주스'?'juiceBottle-juice-full':OBJECT_ART[label]||(label==='나'?'bowl-empty':'metalWeight'),unit=bottle?'병':'개';return `<div class="relation-object" data-count="${count}"><img src="${artPath(id)}" alt="${esc(label)}"><div class="relation-object-caption"><span>${esc(label)}${['가','나'].includes(label)?' 물건':''}</span><strong>× ${count}${unit}</strong></div></div>`;};
 return `<div class="bundle-relations" role="group" aria-label="두 조건을 그림과 개수로 나타낸 식">${v.rows.map(row=>`<div class="bundle-equation">${group(v.labels[0],row.a)}<span class="relation-sign">${esc(row.op)}</span>${group(v.labels[1],row.b)}<span class="relation-sign">=</span><span class="relation-total">${row.total} <span>${esc(v.unit)}</span></span></div>`).join('')}</div>`;
}


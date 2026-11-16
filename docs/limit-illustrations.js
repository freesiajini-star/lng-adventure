import {artPath} from './art-catalog.js?v=852a8fa87cf3';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mass=g=>g>=1000?`${Math.floor(g/1000)} kg${g%1000?' '+g%1000+' g':''}`:`${g} g`;
export function renderLimit(v){
 const hero=v.scene%4,sheet=Math.floor(v.scene/4),byId=new Map(v.items.map(x=>[x.id,x]));
 return `<div class="limit-packing" data-scene="${v.scene}" data-structure="${v.form}"><div class="limit-context"><img class="limit-carrier" alt="${esc(v.title)}" src="${artPath('carrier-'+v.scene)}"><div><h3>${esc(v.title)}</h3><p class="limit-badge">무게 한도 <strong>${mass(v.limit)}</strong></p>${v.base?`<p>빈 포장 ${mass(v.base)} 포함</p>`:''}</div></div><div class="limit-items">${v.items.map(x=>`<figure class="limit-item ${v.loaded.includes(x.id)?'is-loaded':''}"><img class="limit-item-art" alt="${esc(x.name)}" src="${artPath('limit-'+v.scene+'-'+x.id)}"><figcaption><b>${esc(x.name)}</b><span>${mass(x.weight)}</span>${v.loaded.includes(x.id)?'<small>이미 실린 물건</small>':v.required===x.id?'<small>반드시 넣어요</small>':''}</figcaption></figure>`).join('')}</div></div>`;
}

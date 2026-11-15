import {artPath} from './art-catalog.js?v=674765997735';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderGuess(v){return `<div class="guess-visual"><figure><img src="${artPath('pitcher-water-full')}" alt="물이 든 물통"><figcaption>${esc(v.actual)}</figcaption></figure><table><thead><tr><th>어림한 사람</th>${v.rows.map(([name])=>`<th>${esc(name)}</th>`).join('')}</tr></thead><tbody><tr><th>어림한 들이</th>${v.rows.map(([,amount])=>`<td>${esc(amount)}</td>`).join('')}</tr></tbody></table></div>`;}

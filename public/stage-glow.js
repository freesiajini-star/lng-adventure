// All button silhouettes cut holes in one shared shadow layer, so neighboring
// shadows cannot darken a button face. Button backgrounds remain untouched.
const observers=new WeakMap();
export function mountStageGlow(host){
 if(!host)return;
 observers.get(host)?.disconnect();
 const layer=document.createElementNS('http://www.w3.org/2000/svg','svg');
 layer.classList.add('stage-glow-layer');layer.setAttribute('aria-hidden','true');
 host.prepend(layer);
 const list=host.querySelector('.stage-list');
 let frame,settleUntil=0;
 const draw=()=>{
  cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
   if(!host.isConnected)return;
   const bounds=host.getBoundingClientRect(),w=bounds.width,h=bounds.height;
   const rects=[...host.querySelectorAll('.stage-button')].map(button=>{
    const r=button.getBoundingClientRect(),radius=parseFloat(getComputedStyle(button).borderTopLeftRadius)||12;
    return `<rect x="${r.left-bounds.left}" y="${r.top-bounds.top}" width="${r.width}" height="${r.height}" rx="${radius}"/>`;
   }).join('');
   layer.setAttribute('viewBox',`0 0 ${w} ${h}`);
   layer.innerHTML=`<defs><filter id="stage-glow-blur" filterUnits="userSpaceOnUse" x="-40" y="-40" width="${w+80}" height="${h+80}"><feGaussianBlur stdDeviation="10"/></filter><mask id="stage-glow-holes" maskUnits="userSpaceOnUse" x="-40" y="-40" width="${w+80}" height="${h+80}"><rect x="-40" y="-40" width="${w+80}" height="${h+80}" fill="white"/><g fill="black">${rects}</g></mask></defs><g mask="url(#stage-glow-holes)"><g fill="black" opacity=".6" filter="url(#stage-glow-blur)">${rects}</g></g>`;
   if(performance.now()<settleUntil)draw();
  });
 };
 const observer=new ResizeObserver(draw);observer.observe(host);observer.observe(list);
 observers.set(host,observer);list.addEventListener('scroll',draw,{passive:true});
 host.onpointerover=host.onpointerout=host.onpointerdown=host.onpointerup=()=>{settleUntil=performance.now()+200;draw();};
 draw();
}

// Rank shadows share one background layer. Every card silhouette is cut out,
// preventing a later sibling's shadow from tinting a translucent card face.
export function mountRankGlow(workspace){
 if(!workspace)return;
 const layer=document.createElementNS('http://www.w3.org/2000/svg','svg');
 layer.classList.add('rank-glow-layer');layer.setAttribute('aria-hidden','true');workspace.prepend(layer);
 let frame;
 const resize=new ResizeObserver(()=>schedule());
 const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(draw);};
 const draw=()=>{
  if(!workspace.isConnected){resize.disconnect();mutation.disconnect();return;}
  const b=workspace.getBoundingClientRect(),w=b.width,h=b.height;
  const rect=el=>{const r=el.getBoundingClientRect(),radius=parseFloat(getComputedStyle(el).borderTopLeftRadius)||0;return `<rect x="${r.left-b.left}" y="${r.top-b.top}" width="${r.width}" height="${r.height}" rx="${radius}"/>`;};
  const cards=[...workspace.querySelectorAll('.rank-sidebar .side-card,.other-ranks-panel .side-card')].filter(el=>el.getBoundingClientRect().width);
  const holes=[...cards,...workspace.querySelectorAll('.stage-button,.main-column,.score-strip>div')];
  for(const el of holes)resize.observe(el);
  layer.setAttribute('viewBox',`0 0 ${w} ${h}`);
  layer.innerHTML=`<defs><filter id="rank-glow-blur" filterUnits="userSpaceOnUse" x="-40" y="-40" width="${w+80}" height="${h+80}"><feGaussianBlur stdDeviation="10"/></filter><mask id="rank-glow-holes" maskUnits="userSpaceOnUse" x="-40" y="-40" width="${w+80}" height="${h+80}"><rect x="-40" y="-40" width="${w+80}" height="${h+80}" fill="white"/><g fill="black">${holes.map(rect).join('')}</g></mask></defs><g mask="url(#rank-glow-holes)"><g fill="black" opacity=".6" filter="url(#rank-glow-blur)">${cards.map(rect).join('')}</g></g>`;
 };
 const mutation=new MutationObserver(records=>{if(records.some(r=>!layer.contains(r.target)))schedule();});
 mutation.observe(workspace,{childList:true,subtree:true});resize.observe(workspace);window.addEventListener('resize',schedule,{passive:true});schedule();
}

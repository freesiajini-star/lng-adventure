// Measure the existing responsive drawing, then enlarge it in normal document
// flow. Reserve its full height so enlarged tables never cover the answers.
export function visualFactor(stage,type){
 if(stage===1){if(type===1)return 1.05;if(type===2)return 2.25;if([3,4,5].includes(type))return 1.95;}
 if(stage===10&&[0,1].includes(type))return 1.5;
 if(stage===3&&[1,2,3].includes(type))return 1.2;
 if(stage===4&&type===6)return 1.3;
 if(stage===17)return 1.1;
 if(stage===8&&[0,2,4,5,6].includes(type))return 1.1;
 return 1;
}
export function enlargeWorksheet(box){
 if(!box)return;const factor=visualFactor(Number(box.dataset.worksheetStage),Number(box.dataset.type));
 if(factor===1)return;
 const drawings=[...box.querySelectorAll('svg')].filter(svg=>!svg.parentElement.closest('svg')&&!svg.classList.contains('electronic-weighing'));
 for(const drawing of drawings){
  if(drawing.dataset.originalStyle!==undefined)drawing.setAttribute('style',drawing.dataset.originalStyle);
  else drawing.dataset.originalStyle=drawing.getAttribute('style')||'';
 }
 const sizes=drawings.map(drawing=>({drawing,rect:drawing.getBoundingClientRect(),parent:drawing.parentElement}));
 for(const {drawing,rect,parent} of sizes){
  const css=getComputedStyle(parent),columns=parent.classList.contains('restored-pair')?parent.children.length:1;
  const available=(parent.clientWidth-parseFloat(css.paddingLeft)-parseFloat(css.paddingRight)-(parseFloat(css.columnGap)||0)*(columns-1))/columns;
  // A max-height constrained SVG can have a wide letterboxed element box.
  // Enlarge its visible viewBox rather than counting those empty side margins.
  const view=drawing.viewBox.baseVal,fit=Math.min(rect.width/view.width,rect.height/view.height);
  const width=view.width*fit,height=view.height*fit;let ratio=Math.min(factor,available/width);
  if(innerWidth>700&&box.dataset.worksheetStage==='1'&&['fillTable','bottleCups'].includes(box.dataset.visual))ratio=Math.min(ratio,(box.dataset.visual==='bottleCups'?Math.max(255,(innerHeight-740)*1.5):Math.max(221,(innerHeight-740)*1.3))/height);
  Object.assign(drawing.style,{width:width*ratio+'px',height:height*ratio+'px',maxWidth:'100%',maxHeight:'none',flexShrink:'0'});
 }
 box.dataset.enlargement=String(factor);
}

export function fitDiagramText(box){
 const body=document.querySelector('.problem-body');const question=document.querySelector('.question-text');if(!question)return [];
 const limit=parseFloat(getComputedStyle(question).fontSize)*.95;
 const nodes=[...(box?.querySelectorAll('svg text,h2,h3,p,span,b,strong,th,td,figcaption')||[]),...(body?.querySelectorAll('.column-work h2,.column-message,.column-help summary,.answer-label')||[])];
 const measured=nodes.map(node=>{const svg=node instanceof SVGElement,scale=svg?Math.hypot(node.getScreenCTM()?.a||0,node.getScreenCTM()?.b||0):1;node.dataset.originalFontSize??=parseFloat(getComputedStyle(node).fontSize);return {node,scale,size:Number(node.dataset.originalFontSize)};});
 return measured.filter(({node,scale,size})=>{if(!scale)return false;const capped=size*scale>limit;const floor=box?.dataset.worksheetStage==='1'&&box.dataset.visual==='fillTable'&&node instanceof SVGElement?12:0;node.style.fontSize=Math.min(limit,Math.max(floor,size*scale))/scale+'px';if(capped)node.dataset.fontCapped='true';else delete node.dataset.fontCapped;return capped;}).map(({node,size,scale})=>({text:node.textContent,from:size*scale,to:limit}));
}

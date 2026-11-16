// Measure the existing responsive drawing, then enlarge it in normal document
// flow. Reserve its full height so enlarged tables never cover the answers.
export function visualFactor(stage,type){
 if(stage===1&&[1,2,3,4,5].includes(type)||stage===10&&[0,1].includes(type))return 1.5;
 if(stage===3&&[1,2,3].includes(type))return 1.2;
 if(stage===4&&type===6)return 1.3;
 if(stage===8&&[0,2,4,5,6].includes(type))return 1.1;
 return 1;
}
export function enlargeWorksheet(box){
 if(!box)return;const factor=visualFactor(Number(box.dataset.worksheetStage),Number(box.dataset.type));
 if(factor===1)return;
 const drawings=[...box.querySelectorAll('svg')].filter(svg=>!svg.parentElement.closest('svg'));
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
  const width=view.width*fit,height=view.height*fit,ratio=Math.min(factor,available/width);
  Object.assign(drawing.style,{width:width*ratio+'px',height:height*ratio+'px',maxWidth:'100%',maxHeight:'none',flexShrink:'0'});
 }
 box.dataset.enlargement=String(factor);
}

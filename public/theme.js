const selector=document.createElement('select');selector.className='theme-select';selector.setAttribute('aria-label','배경 선택');selector.innerHTML='<option value="bakery">포근한 빵집 배경</option><option value="chalk">차분한 칠판 배경</option>';
let saved='bakery';try{saved=localStorage.getItem('lng-background')||'bakery';}catch{}
function apply(value){document.body.classList.toggle('theme-bakery',value==='bakery');document.body.classList.toggle('theme-chalk',value==='chalk');selector.value=value;}
apply(saved==='chalk'?'chalk':'bakery');selector.onchange=()=>{apply(selector.value);try{localStorage.setItem('lng-background',selector.value);}catch{}};document.querySelector('.header-right')?.prepend(selector);

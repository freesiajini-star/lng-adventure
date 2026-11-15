export function columnSteps(a,b,operation){
 if(!Number.isInteger(a)||!Number.isInteger(b)||a<0||b<0||!['+','−','-'].includes(operation)||operation!=='+'&&a<b)throw Error('잘못된 세로셈');
 const length=Math.max(4,String(operation==='+'?a+b:a).length),top=String(a).padStart(length,'0').split('').map(Number),bottom=String(b).padStart(length,'0').split('').map(Number),current=[...top],notes=Array(length).fill(null),result=Array(length).fill(null),changed=Array(length).fill(false),steps=[];
 const save=(message,focus)=>steps.push({top:[...current],notes:[...notes],changed:[...changed],result:[...result],message,focus});
 let carry=0;
 for(let i=length-1;i>=0;i--){
  const place=Math.pow(10,length-1-i),label=place>=1000?(place/1000)+' L 자리':place+' mL 자리';
  if(operation==='+'){
   const sum=top[i]+bottom[i]+carry;result[i]=sum%10;
   const prev=carry;carry=Math.floor(sum/10);if(carry&&i>0)notes[i-1]=carry;
   save(label+': '+top[i]+' + '+bottom[i]+(prev?' + '+prev:'')+' = '+sum+(carry?'. '+carry+'을 윗자리로 올립니다.':'.'),i);
  }else{
   if(current[i]<bottom[i]){
    let donor=i-1;while(donor>=0&&current[donor]===0)donor--;if(donor<0)throw Error('빌릴 자리가 없음');
    current[donor]--;notes[donor]=current[donor];changed[donor]=true;save('왼쪽의 수에서 1을 빌립니다. 빌려준 자리는 '+current[donor]+'이 됩니다.',donor);
    for(let k=donor+1;k<=i;k++){
     current[k]+=10;notes[k]=current[k];changed[k]=true;save('빌려온 1을 이 자리의 10으로 바꿉니다.',k);
     if(k<i){current[k]--;notes[k]=current[k];save('다음 자리에 1을 빌려주어 '+current[k]+'이 됩니다.',k);}
    }
   }
   result[i]=current[i]-bottom[i];save(label+': '+current[i]+' − '+bottom[i]+' = '+result[i]+'.',i);
  }
 }
 return {a,b,operation:operation==='+'?'+':'−',top,bottom,length,steps,result:Number(result.join(''))};
}

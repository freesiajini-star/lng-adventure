// Keep teacher access across tabs and browser restarts, separately from student
// sessions. Store the Firebase session, never the shortcut/password in the URL.
export function createTeacherStorage({persistent=globalThis.localStorage,temporary=globalThis.sessionStorage}={}){
 const teacher=value=>{try{const token=JSON.parse(value).idToken.split('.')[1];return JSON.parse(atob(token.replace(/-/g,'+').replace(/_/g,'/'))).lngRole==='teacher';}catch{return false;}};
 const savedKey=key=>key.replace(/^lng-auth:/,'lng-teacher-auth:');
 return {
  getItem(key){
   let value=null;try{value=persistent.getItem(savedKey(key));}catch{}
   if(teacher(value))return value;
   try{value=temporary.getItem(key);}catch{}
   if(!teacher(value))return null;
   try{persistent.setItem(savedKey(key),value);}catch{}
   return value;
  },
  setItem(key,value){if(!teacher(value))return;try{persistent.setItem(savedKey(key),value);}catch{temporary.setItem(key,value);}},
  removeItem(key){try{persistent.removeItem(savedKey(key));}catch{}try{if(teacher(temporary.getItem(key)))temporary.removeItem(key);}catch{}}
 };
}

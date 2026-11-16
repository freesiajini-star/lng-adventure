// Keep teacher access across tabs and browser restarts, separately from student
// sessions. Store the Firebase session, never the shortcut/password in the URL.
import {FIREBASE_CONFIG} from './firebase-config.js?v=e451e9f15934';
export function isTeacherClaims(claims,email){return claims.lngRole==='teacher'||Boolean(email&&claims.email_verified===true&&claims.firebase?.sign_in_provider==='google.com'&&claims.email?.toLowerCase()===email.toLowerCase());}
export function createTeacherStorage({persistent=globalThis.localStorage,temporary=globalThis.sessionStorage,teacherGoogleEmail=FIREBASE_CONFIG.teacherGoogleEmail}={}){
 const teacher=value=>{try{const token=JSON.parse(value).idToken.split('.')[1];return isTeacherClaims(JSON.parse(atob(token.replace(/-/g,'+').replace(/_/g,'/'))),teacherGoogleEmail);}catch{return false;}};
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

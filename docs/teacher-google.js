import {FIREBASE_CONFIG} from './firebase-config.js?v=fc046b738e6e';
let authPromise;
export function prepareTeacherGoogle(){
 return authPromise??=(async()=>{
  const [{initializeApp},authSDK]=await Promise.all([
   import('https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js'),
   import('https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js')
  ]);
  const app=initializeApp({...FIREBASE_CONFIG,authDomain:FIREBASE_CONFIG.projectId+'.firebaseapp.com'},'teacher-google');
  const auth=authSDK.getAuth(app);await authSDK.setPersistence(auth,authSDK.inMemoryPersistence);
  return{auth,authSDK};
 })();
}
export async function signInTeacherGoogle(api){
 if(!FIREBASE_CONFIG.teacherGoogleEmail)throw Error('교사 Google 계정 연결을 준비 중입니다.');
 const {auth,authSDK}=await prepareTeacherGoogle(),provider=new authSDK.GoogleAuthProvider();
 provider.setCustomParameters({prompt:'select_account',login_hint:FIREBASE_CONFIG.teacherGoogleEmail});
 try{
  const {user}=await authSDK.signInWithPopup(auth,provider),idToken=await user.getIdToken();
  await api('/api/teacher/google-login',{idToken,refreshToken:user.refreshToken});
 }catch(error){
  const messages={'auth/popup-closed-by-user':'로그인 창을 닫았습니다. 다시 눌러 주세요.','auth/popup-blocked':'브라우저에서 로그인 팝업을 허용해 주세요.','auth/unauthorized-domain':'이 사이트의 Google 로그인 연결을 확인해 주세요.'};
  throw Error(messages[error.code]||error.message||'Google 로그인을 완료하지 못했습니다.');
 }finally{await authSDK.signOut(auth);}
}

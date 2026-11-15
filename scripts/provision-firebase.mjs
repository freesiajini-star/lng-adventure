// Run locally once, AFTER the new Spark project is created. Never ship credentials.
import {existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {randomInt,randomBytes} from 'node:crypto';
const projectId='lng-adventure';
if(!process.argv.includes('--apply')){console.log('안내: 새 lng-adventure 프로젝트의 무료 요금제 확인 후 계정을 준비하는 도구입니다.\nGOOGLE_APPLICATION_CREDENTIALS, LNG_DATABASE_URL, LNG_WEB_API_KEY 환경변수를 설정하고 --apply로 실행합니다.\n결제계정을 연결하거나 유료 서비스를 만드는 동작은 없습니다.');process.exit(0);}
const keyPath=process.env.GOOGLE_APPLICATION_CREDENTIALS,dbURL=process.env.LNG_DATABASE_URL,apiKey=process.env.LNG_WEB_API_KEY;
if(!keyPath||!dbURL||!apiKey)throw Error('새 프로젝트의 로컬 관리 키 경로, Database URL, 공개 Web API 키가 필요합니다.');
const serviceAccount=JSON.parse(readFileSync(keyPath,'utf8'));if(serviceAccount.project_id!==projectId)throw Error('기존 프로젝트는 수정하지 않습니다. lng-adventure 키만 허용합니다.');
if(!/^https:\/\/lng-adventure(?:-default-rtdb)?(?:\.[a-z0-9-]+)?\.(?:firebasedatabase\.app|firebaseio\.com)\/?$/.test(dbURL))throw Error('lng-adventure의 공식 Realtime Database 주소만 허용합니다.');
let appModule,authModule,databaseModule;try{appModule=await import('firebase-admin/app');authModule=await import('firebase-admin/auth');databaseModule=await import('firebase-admin/database');}catch{throw Error('초기 설정에만 Firebase Admin SDK가 필요합니다. npm install --no-save firebase-admin 후 다시 실행하세요. 브라우저 앱에는 포함하지 않습니다.');}
const credential=appModule.cert(serviceAccount),access=await credential.getAccessToken();
const billingResponse=await fetch(`https://cloudbilling.googleapis.com/v1/projects/${projectId}/billingInfo`,{headers:{Authorization:'Bearer '+access.access_token}});
if(!billingResponse.ok)throw Error('결제계정 미연결 상태를 확인하지 못했습니다. 안전을 위해 계정 생성과 배포를 중단합니다.');
const billing=await billingResponse.json();if(billing.billingEnabled||billing.billingAccountName)throw Error('결제계정이 연결되어 있습니다. 무료 전용 조건에 맞지 않아 중단합니다. 요금제를 자동 변경하지 않습니다.');
const app=appModule.initializeApp({credential,projectId,databaseURL:dbURL}),auth=authModule.getAuth(app),db=databaseModule.getDatabase(app);
mkdirSync('.private',{recursive:true});const statePath='.private/lng-setup.json';let state;if(existsSync(statePath))state=JSON.parse(readFileSync(statePath,'utf8'));else{const passwords=new Set(),students=[];for(let c=1;c<=5;c++)for(let n=1;n<=25;n++){let password;do{password=String(randomInt(100000,1000000));}while(passwords.has(password));passwords.add(password);students.push({id:`c${c}s${String(n).padStart(2,'0')}`,classNo:c,studentNo:n,password,qrSecret:randomBytes(32).toString('hex')});}state={projectId,teacherPassword:randomBytes(12).toString('base64url'),students};writeFileSync(statePath,JSON.stringify(state,null,2),{mode:0o600,flag:'wx'});}
if(state.projectId!==projectId||state.students.length!==125)throw Error('초기 설정 기록을 확인해 주세요.');
async function ensureUser(uid,email,password,claims){let existing;try{existing=await auth.getUser(uid);}catch(e){if(e.code!=='auth/user-not-found')throw e;existing=await auth.createUser({uid,email,password,emailVerified:true});}if(existing.email!==email)throw Error('기존 계정의 이메일이 다릅니다. 덮어쓰지 않습니다.');await auth.setCustomUserClaims(uid,claims);}
await ensureUser('lng-teacher','teacher@lng-adventure.invalid',state.teacherPassword,{lngRole:'teacher'});
for(const s of state.students){const claims={lngRole:'student',lngStudent:s.id,lngClass:s.classNo};const email=`${s.id}@students.lng-adventure.invalid`;await ensureUser('lng-'+s.id,email,s.password,{...claims,lngKind:'password'});await ensureUser('lng-qr-'+s.id,`qr-${s.id}@students.lng-adventure.invalid`,s.qrSecret,{...claims,lngKind:'qr'});const paths={};const profile=db.ref(`lngAdventure/students/${s.classNo}/${s.id}`);if(!(await profile.get()).exists())paths[`students/${s.classNo}/${s.id}`]={id:s.id,class_no:s.classNo,student_no:s.studentNo,nickname:'',initialized:false,qrValidAfter:0};if(!(await db.ref(`lngAdventure/credentials/${s.classNo}/${s.id}`).get()).exists()){paths[`credentials/${s.classNo}/${s.id}`]={password:s.password,qrSecret:s.qrSecret};paths[`firstLogin/${s.classNo}/${s.id}`]={email,password:s.password};}if(Object.keys(paths).length)await db.ref('lngAdventure').update(paths);}
const points=Object.fromEntries(Array.from({length:17},(_,i)=>[i+1,i<10?1:2]));if(!(await db.ref('lngAdventure/settings/points').get()).exists())await db.ref('lngAdventure/settings/points').set(points);
await db.setRules(readFileSync('firebase/database.rules.json','utf8'));await db.ref('lngAdventure/settings/ready').set(true);
const config={enabled:true,projectId,apiKey,databaseURL:dbURL,root:'lngAdventure',teacherEmail:'teacher@lng-adventure.invalid',studentEmailDomain:'students.lng-adventure.invalid',requiredPlan:'SPARK'};
writeFileSync('public/firebase-config.js','// Public web configuration only. No service-account key.\nexport const FIREBASE_CONFIG='+JSON.stringify(config,null,2)+';\n');
console.log('완료: 무료 결제 미연결 확인 · 125명 비밀번호/QR 계정 준비 · 보안 규칙 적용.\n교사 비밀번호와 초기 설정 기록은 .private/lng-setup.json에만 저장했습니다. 공개 저장소에 올리지 마세요.\nnpm run build로 정적 배포 파일을 다시 만드세요.');
await appModule.deleteApp(app);

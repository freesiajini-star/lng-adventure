import {test} from 'node:test';import assert from 'node:assert/strict';import {createFirebaseAPI} from '../public/firebase-client.js';import {makeQuestion} from '../math.js';
const memory=()=>{const values=new Map();return{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)}};
test('student resume and answer accept Firebase stage arrays with null holes',async()=>{
 const f=fixture();await f.api('/api/register',{classNo:1,studentNo:1,nickname:'고양이'});
 const stats={correct:1,wrong:0,score:1,total:1,questions:1};
 f.data.studentDays={'2026-11-15':{c1s01:{total:{correct:1,wrong:0,score:1,total:1},stages:[null,stats],seen:{},sessions:{}}}};
 assert.deepEqual((await f.api('/api/me')).usage.stages,{'1':1});
 const q=await f.api('/api/question',{stage:1,type:2});
 const result=await f.api('/api/answer',{questionId:q.id,answers:makeQuestion(1,2,7).fields.map(x=>x.answer)});
 assert.equal(result.ok,true);assert.equal(result.usage.stages[1],2);
 assert.equal(f.data.monthlySummaries['2026-11'].c1s01.total.total,2);
});
function fixture({failFirstWrite=false,seed=7,teacherGoogleEmail,at='2026-11-15T12:00:00+09:00'}={}){let time=new Date(at).getTime();const id='c1s01';let version=0,calls=0;const data={settings:{ready:true,points:{1:1,13:10}},students:{1:{[id]:{id,class_no:1,student_no:1,nickname:'',initialized:false,qrValidAfter:0}}},firstLogin:{1:{[id]:{email:id+'@students.lng-adventure.invalid',password:'123456'}}},credentials:{1:{[id]:{password:'123456',qrSecret:'a'.repeat(64)}}}};
 const get=path=>{let value=data;for(const p of path.split('/').filter(Boolean))value=value?.[p];return structuredClone(value??null);};const set=(path,value)=>{const parts=path.split('/').filter(Boolean);let node=data;for(const p of parts.slice(0,-1))node=node[p]??(node[p]={});node[parts.at(-1)]=structuredClone(value);version++;};
 const jwt=claims=>['e30',Buffer.from(JSON.stringify(claims)).toString('base64url'),'signature'].join('.');
 const auth=claims=>({idToken:jwt(claims),refreshToken:'test-refresh',expiresIn:3600});
 const fetchImpl=async(url,options={})=>{calls++;const u=new URL(url);if(u.hostname==='identitytoolkit.googleapis.com'){const b=JSON.parse(options.body);if(u.pathname.endsWith(':lookup')){const c=JSON.parse(Buffer.from(b.idToken.split('.')[1],'base64url'));return Response.json({users:[{email:c.email,emailVerified:c.email_verified}]});}if(u.pathname.endsWith(':signUp'))return Response.json(auth({firebase:{sign_in_provider:'anonymous'}}));if(u.pathname.endsWith(':signInWithPassword')){if(b.email.startsWith('teacher@'))return Response.json(auth({lngRole:'teacher'}));if(b.password!=='123456'&&b.password!=='a'.repeat(64))return Response.json({error:{message:'INVALID_LOGIN_CREDENTIALS'}},{status:400});return Response.json(auth({lngRole:'student',lngStudent:id,lngClass:1,lngKind:b.email.startsWith('qr-')?'qr':'password',auth_time:Math.floor(time/1000)}));}return Response.json({ok:true});}
  const path=decodeURIComponent(u.pathname).replace(/^\/lngAdventure\/?/,'').replace(/\.json$/,''),headers=new Headers(options.headers),method=options.method||'GET';if(failFirstWrite&&method==='PUT'&&path.startsWith('studentDays/')){failFirstWrite=false;throw Error('offline test');}if(method==='GET')return Response.json(get(path),{headers:{etag:'"'+version+'"'}});if(headers.has('if-match')&&headers.get('if-match')!=='"'+version+'"')return new Response('null',{status:412});const b=JSON.parse(options.body);if(method==='PATCH')for(const[k,v]of Object.entries(b))set([path,k].filter(Boolean).join('/'),v);else set(path,b);return Response.json(b);};
 const config={teacherGoogleEmail,enabled:true,projectId:'lng-adventure',apiKey:'test-only',databaseURL:'https://test.invalid',root:'lngAdventure',teacherEmail:'teacher@lng-adventure.invalid',studentEmailDomain:'students.lng-adventure.invalid',requiredPlan:'SPARK'};
 const api=createFirebaseAPI({config,fetchImpl,storage:memory(),queueStorage:memory(),clock:()=>time,random:()=>seed});return{api,data,getCalls:()=>calls,setTime:at=>time=new Date(at).getTime()};}
test('Firebase REST first login, authoritative identity, scoring retry and monthly snapshots',async()=>{const f=fixture(),api=f.api;assert.equal((await api('/api/me')).role,null);const registered=await api('/api/register',{classNo:1,studentNo:1,nickname:'고양이'});assert.equal(registered.password,'123456');assert.equal(registered.student.nickname,'고양이');assert.equal((await api('/api/me')).role,'student');await assert.rejects(()=>api('/api/teacher/credentials?class=1'),/교사/);const q=await api('/api/question',{stage:13,type:0}),answers=makeQuestion(13,0,7).fields.map(f=>f.answer),bad=[...answers];bad[0]='9999';assert.equal((await api('/api/answer',{questionId:q.id,answers:bad})).ok,false);await api('/api/answer',{questionId:q.id,answers:bad});const correction=await api('/api/answer',{questionId:q.id,answers});assert.equal(correction.ok,true);assert.equal(correction.corrected,true);await api('/api/answer',{questionId:q.id,answers});const d=f.data.studentDays['2026-11-15'].c1s01;assert.equal(d.total.correct,0);assert.equal(d.total.wrong,1);assert.equal(d.seen[q.id].corrected,true);assert.equal(d.stages[13].questions,1);assert.equal(f.data.monthlySummaries['2026-11'].c1s01.total.score,-1);const rank=await api('/api/rankings?stage=13');assert.equal(rank.rows.find(x=>x.stage===0).score,-1);const before=f.getCalls();await api('/api/rankings?stage=13');assert.equal(f.getCalls(),before);await api('/api/logout',{});await assert.rejects(()=>api('/api/login',{classNo:1,studentNo:1,password:'999999'}),/비밀번호/);assert.equal((await api('/api/login',{classNo:1,studentNo:1,password:'123456'})).student.id,'c1s01');});
test('teacher credentials and summaries use teacher authorization, QR login is a separate secret',async()=>{const f=fixture();await f.api('/api/teacher/login',{password:'test-only'});const c=await f.api('/api/teacher/credentials?class=1');assert.equal(c.students.length,1);assert.equal(c.students[0].password,'123456');const payload=JSON.parse(Buffer.from(c.students[0].qr_token,'base64url'));assert.equal(payload.secret,'a'.repeat(64));assert.notEqual(payload.secret,c.students[0].password);const view=await f.api('/api/teacher/data?day=2026-11-15&month=2026-11');assert.equal(view.students.length,1);assert.deepEqual(view.monthly,[]);await f.api('/api/logout',{});const first=await f.api('/api/login',{qr:c.students[0].qr_token});assert.equal(first.needsNickname,true);assert.equal((await f.api('/api/register',{classNo:1,studentNo:1,nickname:'토끼'})).password,'123456');});
test('unconfigured or non-Spark/wrong-project configurations do not send network requests',async()=>{let calls=0;const api=createFirebaseAPI({config:{enabled:false,projectId:'lng-adventure',requiredPlan:'SPARK'},fetchImpl:()=>{calls++;throw Error('must not connect')},storage:memory(),queueStorage:memory()});assert.deepEqual(await api('/api/me'),{role:null});await assert.rejects(()=>api('/api/login',{classNo:1,studentNo:1,password:'123456'}),/연결/);assert.equal(calls,0);});
test('header lookup returns only nickname and first-visit status',async()=>{const f=fixture();assert.deepEqual(await f.api('/api/student-lookup?class=1&number=1'),{nickname:'',initialized:false});await f.api('/api/register',{classNo:1,studentNo:1,nickname:'토끼'});await f.api('/api/logout');const lookup=await f.api('/api/student-lookup?class=1&number=1');assert.deepEqual(lookup,{nickname:'토끼',initialized:true});assert.equal('password'in lookup,false);});

test('requested pouring variants reach signed-in students and invalid variants are rejected',async()=>{
 const {POUR_SCENARIOS}=await import('../pour-problems.js');const {POUR_VARIANT_COUNT}=await import('../math.js');
 const f=fixture();await f.api('/api/register',{classNo:1,studentNo:1,nickname:'토끼'});
 const variant=POUR_SCENARIOS.findIndex(v=>v.from.id==='milkCarton'&&v.to.id==='waterBottle'&&v.source===200&&v.target===2000);
 const q=await f.api('/api/question',{stage:1,type:0,variant});assert.equal(q.visual.variant,variant);assert.equal(q.visual.remainder,0);assert.equal(q.visual.space,1800);assert.ok(q.fields.every(f=>!('answer'in f)));
 await assert.rejects(()=>f.api('/api/question',{stage:1,type:0,variant:POUR_VARIANT_COUNT}),/변형/);
});

test('first-answer credit respects teacher points and correction after reconnect remains -1',async()=>{
 const first=fixture();first.data.settings.points[1]=7;await first.api('/api/register',{classNo:1,studentNo:1,nickname:'토끼'});const q=await first.api('/api/question',{stage:1,type:0,variant:0}),answer=makeQuestion(1,0,0).fields.map(f=>f.answer);const result=await first.api('/api/answer',{questionId:q.id,answers:answer});assert.equal(result.corrected,false);assert.equal(first.data.studentDays['2026-11-15'].c1s01.total.score,7);
 const offline=fixture({failFirstWrite:true});await offline.api('/api/register',{classNo:1,studentNo:1,nickname:'토끼'});const q2=await offline.api('/api/question',{stage:1,type:0,variant:0});const pending=await offline.api('/api/answer',{questionId:q2.id,answers:['틀린 선택']});assert.equal(pending.pending,true);const fixed=await offline.api('/api/answer',{questionId:q2.id,answers:answer});assert.equal(fixed.ok,true);assert.equal(fixed.corrected,true);let total=offline.data.studentDays['2026-11-15'].c1s01.total;assert.deepEqual(total,{correct:0,wrong:1,score:-1,total:1});await offline.api('/api/presence',{stage:1,visible:true,active:true});assert.deepEqual(offline.data.studentDays['2026-11-15'].c1s01.total,total);assert.equal(offline.data.monthlySummaries['2026-11'].c1s01.total.score,-1);
});

test('application credit is always 2 even with legacy 10-point settings',async()=>{const f=fixture();await f.api('/api/register',{classNo:1,studentNo:1,nickname:'토끼'});const q=await f.api('/api/question',{stage:13,type:0});const answer=makeQuestion(13,0,7).fields.map(f=>f.answer);const result=await f.api('/api/answer',{questionId:q.id,answers:answer});assert.equal(result.ok,true);assert.equal(f.data.studentDays['2026-11-15'].c1s01.total.score,2);});

test('multiple selection and column intermediate mistakes count once and corrections earn no credit',async()=>{for(const [stage,type,seed]of[[9,7,21],[4,2,2]]){const f=fixture({seed});await f.api('/api/register',{classNo:1,studentNo:1,nickname:'토끼'});const q=await f.api('/api/question',{stage,type}),full=makeQuestion(stage,type,seed),answers=full.fields.map(f=>f.answer),bad=full.fields.map(()=> '');if(full.fields[0].kind==='multi')bad[0]=[];await f.api('/api/answer',{questionId:q.id,answers:bad});await f.api('/api/answer',{questionId:q.id,answers:bad});const result=await f.api('/api/answer',{questionId:q.id,answers});assert.equal(result.ok,true);assert.equal(result.corrected,true);assert.deepEqual(f.data.studentDays['2026-11-15'].c1s01.total,{correct:0,wrong:1,score:-1,total:1});}});

test('nickname picker reads actual class reservations and only confirmation registers the nickname',async()=>{const f=fixture();f.data.nicknames={1:{고양이:'c1s02'}};const x=await f.api('/api/nickname-options',{classNo:1,studentNo:1});assert.ok(!x.names.includes('고양이'));assert.ok(x.names.includes('토끼'));assert.equal(f.data.students[1].c1s01.initialized,false);assert.equal((await f.api('/api/me')).role,null);await assert.rejects(()=>f.api('/api/register',{classNo:1,studentNo:1,nickname:'고양이'}),/우리 반/);const registered=await f.api('/api/register',{classNo:1,studentNo:1,nickname:'토끼'});assert.equal(registered.password,'123456');assert.equal(f.data.students[1].c1s01.nickname,'토끼');assert.equal(f.data.nicknames[1].토끼,'c1s01');await assert.rejects(()=>f.api('/api/nickname-options',{classNo:1,studentNo:1}),/이미/);});

import {createTeacherStorage} from '../public/teacher-session.js';
test('teacher access persists across tabs and stays separate from student sessions',()=>{
 const persistent=memory(),temporary=memory(),key='lng-auth:lng-adventure';
 const session=role=>JSON.stringify({idToken:'e30.'+Buffer.from(JSON.stringify({lngRole:role})).toString('base64url')+'.signature',refreshToken:'test-refresh'});
 const teacher=session('teacher'),student=session('student');temporary.setItem(key,teacher);
 const first=createTeacherStorage({persistent,temporary});assert.equal(first.getItem(key),teacher);
 temporary.removeItem(key);const nextTab=createTeacherStorage({persistent,temporary});assert.equal(nextTab.getItem(key),teacher);
 temporary.setItem(key,student);assert.equal(nextTab.getItem(key),teacher);nextTab.removeItem(key);
 assert.equal(nextTab.getItem(key),null);assert.equal(temporary.getItem(key),student);
 nextTab.setItem(key,student);assert.equal(nextTab.getItem(key),null);
});

import {publicOverviewSnapshot} from '../public/public-overview.js';
test('public overview publishes aggregate counts without student identifiers or login secrets',async()=>{
 const snapshot=publicOverviewSnapshot({month:'2026-11',students:[{id:'private-id',class_no:1,student_no:12,nickname:'secret-name',visible:true,at:1000,stage:2,password:'private-password',qr_token:'private-qr'}],monthly:[{student_id:'private-id',stage:2,correct:3,wrong:1,total:4,points:2}]},1000);
 assert.deepEqual(snapshot.classes.c1,{participants:1,correct:3,wrong:1,total:4,score:2,connected:1});
 assert.equal(snapshot.stages.s2.participants,1);assert.equal(snapshot.stages.s2.total,4);
 const json=JSON.stringify(snapshot);for(const text of['private-id','secret-name','private-password','private-qr','student_no','student_id'])assert.ok(!json.includes(text));
 const f=fixture();assert.equal(await f.api('/api/public-overview'),null);
 await assert.rejects(()=>f.api('/api/teacher/publish-overview',{}),/교사/);
 await f.api('/api/teacher/login',{password:'test-only'});await f.api('/api/teacher/publish-overview',{});await f.api('/api/logout');
 assert.ok((await f.api('/api/public-overview')).classes.c1);await assert.rejects(()=>f.api('/api/teacher/credentials?class=1'),/교사/);
});

import {isTeacherClaims} from '../public/teacher-session.js';
test('Google teacher access requires the designated, verified Google identity',async()=>{
 const email='teacher@example.com',claims={email,email_verified:true,firebase:{sign_in_provider:'google.com'},exp:Date.now()/1000+3600};
 assert.equal(isTeacherClaims(claims,email),true);assert.equal(isTeacherClaims({...claims,email:'other@example.com'},email),false);assert.equal(isTeacherClaims({...claims,email_verified:false},email),false);assert.equal(isTeacherClaims({...claims,firebase:{sign_in_provider:'password'}},email),false);
 const f=fixture({teacherGoogleEmail:email}),token=c=>'e30.'+Buffer.from(JSON.stringify(c)).toString('base64url')+'.test';
 await assert.rejects(()=>f.api('/api/teacher/google-login',{idToken:token({...claims,email:'other@example.com'}),refreshToken:'test'}),/교사 Google/);
 assert.equal((await f.api('/api/me')).role,null);
 await f.api('/api/teacher/google-login',{idToken:token(claims),refreshToken:'test'});assert.equal((await f.api('/api/me')).role,'teacher');
 assert.equal((await f.api('/api/teacher/credentials?class=1')).students.length,1);
 const persistent=memory(),temporary=memory(),storage=createTeacherStorage({persistent,temporary,teacherGoogleEmail:email});
 const value=JSON.stringify({idToken:token(claims),refreshToken:'test'});storage.setItem('lng-auth:lng-adventure',value);assert.equal(createTeacherStorage({persistent,temporary,teacherGoogleEmail:email}).getItem('lng-auth:lng-adventure'),value);
});
test('selected-only policy gives zero for both outcomes, mixed credit and practice exceptions remain normal',async()=>{
 const f=fixture();await f.api('/api/register',{classNo:1,studentNo:1,nickname:'고양이'});
 f.data.settings.scoringPolicy={version:1,defaults:{configured:true,blocked:{s4t2:true}},classes:{},updatedAt:0};
 const answers=makeQuestion(4,2,7).fields.map(x=>x.answer),bad=answers.map(()=> '999999');
 const selected=await f.api('/api/question',{stage:4,type:2,selectionMode:'selected'});assert.equal(selected.creditEligible,false);
 assert.equal((await f.api('/api/answer',{questionId:selected.id,answers:bad})).ok,false);
 assert.equal((await f.api('/api/answer',{questionId:selected.id,answers})).corrected,true);
 const mixed=await f.api('/api/question',{stage:4,type:2,selectionMode:'mixed'});assert.equal(mixed.creditEligible,true);await f.api('/api/answer',{questionId:mixed.id,answers});
 let d=f.data.studentDays['2026-11-15'].c1s01;assert.equal(d.total.score,1);assert.deepEqual(d.types.s4t2,{total:2,mixed:1,selected:1,correct:1,wrong:1});
 await assert.rejects(()=>f.api('/api/teacher/scoring-policy',{scope:'all',blocked:{},practice:{}}),/교사/);
 await f.api('/api/teacher/login',{password:'test-only'});await f.api('/api/teacher/scoring-policy',{scope:'all',blocked:{s4t2:true},practice:{s4t2:true}});
 assert.equal(f.data.settings.scoringPolicy.defaults.practice.s4t2,true);await f.api('/api/logout',{});await f.api('/api/login',{classNo:1,studentNo:1,password:'123456'});
 const practice=await f.api('/api/question',{stage:4,type:2,selectionMode:'selected'});assert.equal(practice.creditEligible,true);await f.api('/api/answer',{questionId:practice.id,answers});assert.equal(f.data.studentDays['2026-11-15'].c1s01.total.score,2);
 assert.equal(f.data.monthlySummaries['2026-11'].c1s01.types.s4t2.total,3);
});
test('teacher data accepts sparse numeric stage records and presence keeps earlier visit dates',async()=>{
 const f=fixture();await f.api('/api/register',{classNo:1,studentNo:1,nickname:'고양이'});f.data.presence={c1s01:{visits:{'2026-11-14':1}}};await f.api('/api/presence',{stage:1,visible:true,active:true});assert.equal(f.data.presence.c1s01.visits['2026-11-14'],1);assert.ok(f.data.presence.c1s01.visits['2026-11-15']);
 const stages=[null,{correct:1,wrong:0,score:1,total:1,questions:1}];f.data.dailySummaries={'2026-11-15':{1:{c1s01:{total:{total:1},stages,sessions:{}}}}};f.data.monthlySummaries={'2026-11':{c1s01:{stages},empty:null}};
 await f.api('/api/teacher/login',{password:'test-only'});const data=await f.api('/api/teacher/data?day=2026-11-15&month=2026-11');assert.equal(data.monthly.length,1);assert.equal(data.monthly[0].stage,1);assert.equal(data.daily.c1s01.stages[1].questions,1);
});

test('student question and answer are blocked at 21:00 before any network or record writes',async()=>{const f=fixture({at:'2026-11-15T20:59:59+09:00'});await f.api('/api/register',{classNo:1,studentNo:1,nickname:'고양이'});const q=await f.api('/api/question',{stage:1,type:2}),before=structuredClone(f.data),calls=f.getCalls();f.setTime('2026-11-15T21:00:00+09:00');for(const [path,body]of [['/api/question',{stage:1,type:2}],['/api/answer',{questionId:q.id,answers:makeQuestion(1,2,7).fields.map(f=>f.answer)}]])await assert.rejects(()=>f.api(path,body),e=>e.status===423);assert.equal(f.getCalls(),calls);assert.deepEqual(f.data,before);});

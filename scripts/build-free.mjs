import {cpSync,existsSync,mkdirSync,writeFileSync,readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
const configSource=readFileSync('public/firebase-config.js','utf8');if(!configSource.includes("projectId:'lng-adventure'")&&!configSource.includes('"projectId": "lng-adventure"'))throw Error('새 lng-adventure 프로젝트만 배포할 수 있습니다.');
if(existsSync('node_modules/qrcode-generator/dist/qrcode.js')){mkdirSync('public/vendor',{recursive:true});cpSync('node_modules/qrcode-generator/dist/qrcode.js','public/vendor/qrcode.js');}
if(!existsSync('public/vendor/qrcode.js'))throw Error('QR 라이브러리가 없습니다. npm install을 먼저 실행해 주세요.');
cpSync('math.js','public/math.js');mkdirSync('docs',{recursive:true});cpSync('public','docs',{recursive:true});writeFileSync('docs/.nojekyll','');
// No server, D1, Functions, Cloud Run, Storage or Sites deployment is created.
for(const name of readdirSync('docs'))if(['api.js','server.mjs','hosting.json'].includes(name))throw Error('정적 배포에 서버 파일이 포함되어 있습니다.');
for(const f of ['index.html','teacher.html']){const html=readFileSync(join('docs',f),'utf8');if(/(?:src|href)="\//.test(html))throw Error('GitHub 하위 경로에서 깨지는 절대 경로가 있습니다.');}
console.log('GitHub Pages 정적 파일 준비 완료: docs/ · 무료 Spark 연결 전용');

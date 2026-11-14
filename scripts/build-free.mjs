import {createHash} from 'node:crypto';
import {cpSync,existsSync,mkdirSync,writeFileSync,readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
const configSource=readFileSync('public/firebase-config.js','utf8');if(!configSource.includes("projectId:'lng-adventure'")&&!configSource.includes('"projectId": "lng-adventure"'))throw Error('새 lng-adventure 프로젝트만 배포할 수 있습니다.');
if(existsSync('node_modules/qrcode-generator/dist/qrcode.js')){mkdirSync('public/vendor',{recursive:true});cpSync('node_modules/qrcode-generator/dist/qrcode.js','public/vendor/qrcode.js');}
if(!existsSync('public/vendor/qrcode.js'))throw Error('QR 라이브러리가 없습니다. npm install을 먼저 실행해 주세요.');
cpSync('restoration.js','public/restoration.js');cpSync('curriculum.js','public/curriculum.js');cpSync('math.js','public/math.js');mkdirSync('docs',{recursive:true});cpSync('public','docs',{recursive:true});writeFileSync('docs/.nojekyll','');
// Content versions prevent mixing old cached generators with new UI/diagrams.
const assets=readdirSync('public').filter(name=>/\.(?:js|css|html)$/.test(name)).sort();
const fingerprint=createHash('sha256');for(const name of assets)fingerprint.update(name).update(readFileSync(join('public',name)));
const version=fingerprint.digest('hex').slice(0,12);
for(const name of assets){let data=readFileSync(join('docs',name),'utf8');
 if(name.endsWith('.js'))data=data.replace(/(from\s*['"])(\.\/[^'"]+\.js)(['"])/g,'$1$2?v='+version+'$3');
 if(name.endsWith('.html'))data=data.replace(/((?:src|href)="\.\/[^"?]+\.(?:js|css))"/g,'$1?v='+version+'"').replace(/<body\b/,'<body data-build="'+version+'"');
 writeFileSync(join('docs',name),data);
}
console.log('Content version: '+version);
// No server, D1, Functions, Cloud Run, Storage or Sites deployment is created.
for(const name of readdirSync('docs'))if(['api.js','server.mjs','hosting.json'].includes(name))throw Error('정적 배포에 서버 파일이 포함되어 있습니다.');
for(const f of ['index.html','teacher.html']){const html=readFileSync(join('docs',f),'utf8');if(/(?:src|href)="\//.test(html))throw Error('GitHub 하위 경로에서 깨지는 절대 경로가 있습니다.');}
console.log('GitHub Pages 정적 파일 준비 완료: docs/ · 무료 Spark 연결 전용');

const sourceMath=await import('../math.js'),builtMath=await import('../docs/math.js?build='+version),builtVisual=await import('../docs/visuals.js?build='+version);let checked=0;
for(let stage=1;stage<=17;stage++)for(let type=0;type<sourceMath.TYPE_NAMES[stage-1].length;type++){const expected=sourceMath.makeQuestion(stage,type,31),actual=builtMath.makeQuestion(stage,type,31);if(JSON.stringify(actual)!==JSON.stringify(expected))throw Error('배포 문항 불일치 '+stage+'/'+type);builtVisual.renderVisual(actual.visual);checked++;}
console.log('배포 모듈 일치 검사: '+checked+'유형 통과');

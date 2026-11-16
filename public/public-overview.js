const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const empty=()=>({participants:0,correct:0,wrong:0,score:0,total:0,connected:0});
export function publicOverviewSnapshot(data,now=Date.now()){
 const classes=Object.fromEntries([1,2,3,4,5].map(n=>['c'+n,empty()])),stages=Object.fromEntries(Array.from({length:17},(_,i)=>['s'+(i+1),empty()]));
 for(const student of data.students){
  const group=classes['c'+student.class_no];if(!group)continue;
  const events=data.monthly.filter(e=>e.student_id===student.id),online=student.visible&&now-student.at<60000;
  if(events.some(e=>e.total>0))group.participants++;
  if(online)group.connected++;
  const visited=new Set();for(const e of events){const stage=stages['s'+e.stage];if(!stage)continue;for(const row of[group,stage]){row.correct+=e.correct||0;row.wrong+=e.wrong||0;row.score+=e.points||0;row.total+=e.total||0;}if(e.total>0&&!visited.has(e.stage)){stage.participants++;visited.add(e.stage);}}
  if(online&&stages['s'+student.stage])stages['s'+student.stage].connected++;
 }
 return{updatedAt:now,month:data.month,classes,stages};
}
export function publicOverviewMarkup(snapshot,stageNames){
 if(!snapshot)return '<section class="panel"><h2>공개 학습 현황</h2><p>아직 공개 집계가 없습니다. 교사 화면에서 현황을 갱신하면 표시됩니다.</p></section>';
 const values=Object.values(snapshot.classes),total=key=>values.reduce((sum,v)=>sum+(v[key]||0),0),percent=row=>row.total?(row.correct/row.total*100).toFixed(1)+'%':'—';
 const table=(entries,label)=>'<div class="table-scroll"><table><thead><tr><th>'+label+'</th><th>참여 인원</th><th>총풀이</th><th>정답률</th><th>점수 합계</th></tr></thead><tbody>'+entries.map(([name,row])=>'<tr><th>'+esc(name)+'</th><td>'+row.participants+'명</td><td>'+row.total+'회</td><td>'+percent(row)+'</td><td>'+row.score+'점</td></tr>').join('')+'</tbody></table></div>';
 return '<section class="panel"><h2>공개 학습 현황 · '+esc(snapshot.month)+'</h2><p class="session-note">집계 시각: '+esc(new Date(snapshot.updatedAt).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'}))+' · 교사 화면에서 갱신한 집계입니다.</p><div class="cards"><div class="card"><small>학습 참여</small><strong>'+total('participants')+'명</strong></div><div class="card"><small>총풀이</small><strong>'+total('total')+'회</strong></div><div class="card"><small>집계 당시 접속</small><strong>'+total('connected')+'명</strong></div></div></section><section class="panel"><h2>학급별 현황</h2>'+table([1,2,3,4,5].map(n=>[n+'반',snapshot.classes['c'+n]]),'반')+'</section><section class="panel"><h2>단계별 현황</h2>'+table(stageNames.map((name,i)=>[(i+1)+'. '+name,snapshot.stages['s'+(i+1)]]),'단계')+'</section>';
}

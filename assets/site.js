async function renderSection(sectionId){
  const res=await fetch(`/data/${sectionId}.json`,{cache:'no-store'});
  if(!res.ok){ document.querySelector('#app').innerHTML=`<p>Failed to load ${sectionId}</p>`; return; }
  const data=await res.json();
  const triClass=c=>`tri-${(c||'Blue').toLowerCase()}`;
  const esc=s=> (s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const cards=data.map(it=>`
    <article class="card">
      <div class="mono">${esc(it.repo)}@${esc(it.ref)} · <a href="${it.href}" target="_blank" rel="noopener">view</a></div>
      <h3>${esc(it.title)}</h3>
      <span class="badge ${triClass(it.triage)}">${it.triage}</span>
      ${it.summary?`<p>${esc(it.summary)}</p>`:''}
    </article>`).join('');
  const counts=data.reduce((m,it)=>(m[it.triage]=(m[it.triage]||0)+1,m),{});
  const legend=['Blue','Green','Yellow','Orange','Red'].map(c=>`<span class="badge ${triClass(c)}">${c}: ${counts[c]||0}</span>`).join(' ');
  document.querySelector('#legend').innerHTML=legend;
  document.querySelector('#count').textContent=`${data.length} items`;
  document.querySelector('#app').innerHTML=`<div class="grid">${cards}</div>`;
}

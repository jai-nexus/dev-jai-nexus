/* Minimal client helpers for dev.jai.nexus */
function esc(s){return (s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}
function triClass(c){return `tri-${(c||'Blue').toLowerCase()}`}

/* Fetch JSON from /data with optional basePath (''|'../' etc.) */
async function loadJson(rel, basePath=''){ const r=await fetch(`${basePath}data/${rel}`,{cache:'no-store'}); if(!r.ok) throw new Error(`load ${rel}`); return r.json(); }

/* Cards renderer (agents/contexts/repos/issues/tasks ...) */
function renderCards(el, items){
  el.innerHTML = `<div class="grid">${
    items.map(it=>`<article class="card">
      <div class="mono">${esc(it.repo||it.source||'')} ${it.ref?('· '+esc(it.ref)):""} ${it.href?`· <a href="${it.href}" target="_blank" rel="noopener">view</a>`:""}</div>
      <h3>${esc(it.title||it.name||it.id||'(untitled)')}</h3>
      ${it.triage?`<span class="badge ${triClass(it.triage)}">${it.triage}</span>`:""}
      ${it.summary?`<p>${esc(it.summary)}</p>`:""}
    </article>`).join('')
  }</div>`;
}

/* Legend counts for 5-color triage (SoT v1.1) */
function renderLegend(el, items){
  const colors=['Blue','Green','Yellow','Orange','Red'];
  const counts = items.reduce((m,it)=>{if(it.triage)m[it.triage]=(m[it.triage]||0)+1; return m;},{});
  el.innerHTML = colors.map(c=>`<span class="badge ${triClass(c)}">${c}: ${counts[c]||0}</span>`).join(' ');
}

/* Simple text tree from sourcetree JSON items[{nh,path,type}] */
function renderTree(el, data){
  const rows = (data.items||[]).map(it=>{
    const depth = (it.nh.split('.').length-2); // nh starts at "1" for first item
    const pad = '  '.repeat(Math.max(0, depth));
    return `${it.nh} ${pad}${it.path}`;
  });
  el.innerHTML = `<pre class="tree">${rows.join('\n')}</pre>`;
}

/* Page booters */
async function bootAgents(basePath=''){ const d=await loadJson('agents.json',basePath); renderLegend(document.querySelector('#legend'),d); renderCards(document.querySelector('#app'),d); document.querySelector('#count').textContent=`${d.length} items`; }
async function bootContexts(basePath=''){ const d=await loadJson('contexts.json',basePath); renderLegend(document.querySelector('#legend'),d); renderCards(document.querySelector('#app'),d); document.querySelector('#count').textContent=`${d.length} items`; }
async function bootRepos(basePath=''){ const d=await loadJson('repos.json',basePath); renderCards(document.querySelector('#app'),d); document.querySelector('#count').textContent=`${d.length} repos`; }
async function bootIssues(basePath=''){ const d=await loadJson('github_issues.json',basePath); renderCards(document.querySelector('#app'),d); document.querySelector('#count').textContent=`${d.length} issues`; }
async function bootSot(basePath=''){ const d=await loadJson('sot_triage_counts.json',basePath); const el=document.querySelector('#app'); el.innerHTML = `<pre class="tree">${esc(JSON.stringify(d,null,2))}</pre>`; }
async function bootSourcetree(basePath=''){ const d=await loadJson('sourcetree.bundle.json',basePath); renderTree(document.querySelector('#app'), d); document.querySelector('#count').textContent=`${(d.items||[]).length} nodes`; }

window.__devjai = { bootAgents, bootContexts, bootRepos, bootIssues, bootSot, bootSourcetree };

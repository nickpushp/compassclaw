<?php
require __DIR__ . '/auth.php';   // Basic Auth gate (skuloo / bcrypt). Blocks unauth.

// --------------------------------------------------------------------------
// Canonical candidate profile — used to build AI payloads for the smart
// buttons. Server-rendered into the page as a JS constant (safe: no secrets).
// --------------------------------------------------------------------------
$PROFILE = [
  'summary' => "Nicholas Pertuset — AI automation engineer and CRM/Salesforce "
             . "specialist who ships production LLM and voice-agent systems for "
             . "revenue teams. Founder-operator background: builds end-to-end "
             . "automation, forward-deployed/solutions-engineering delivery, and "
             . "CRM migrations that stick.",
  'skills'  => "LLM orchestration, AI voice agents (Retell, VAPI, ElevenLabs), "
             . "Make.com (Certified Expert), n8n, Zapier (Expert), Salesforce "
             . "(Certified AI Associate), ServiceNow, RAG pipelines, CRM "
             . "migration, Botpress, Power Automate, integrations, forward "
             . "deployed / solutions engineering",
  'history' => "Founder, Compass Claw + BioDental AI (Nov 2025-present) — "
             . "AI automation agency building voice agents and workflow "
             . "automation for local businesses. CRM & Automation Analyst, "
             . "SNHU/Stefanini (Feb 2023-Jul 2025). District Manager, Verizon "
             . "(2020-2023). Data Analyst, AT&T (2009-2012). Contact: "
             . "nicholaspertuset@gmail.com, (469) 777-6061, Ohio, remote.",
];

// --------------------------------------------------------------------------
// Load ranked jobs (already sorted fit desc when written).
// --------------------------------------------------------------------------
$jobs = [];
$raw = @file_get_contents(__DIR__ . '/jobs.json');
if ($raw !== false) {
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) $jobs = $decoded;
}
usort($jobs, fn($a,$b) => ($b['fit_score'] ?? 0) <=> ($a['fit_score'] ?? 0));

// Header freshness note.
$count = count($jobs);
$dates = array_filter(array_map(fn($j)=>$j['posted_date'] ?? '', $jobs));
$minD = $dates ? min($dates) : '';
$maxD = $dates ? max($dates) : '';

function e($s){ return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }

// "x days ago" from a YYYY-MM-DD string.
function ago($d){
    $d = trim((string)$d);
    if ($d === '') return '';
    $ts = strtotime($d);
    if ($ts === false) return e($d);
    $days = (int) floor((time() - $ts) / 86400);
    if ($days <= 0) return 'today';
    if ($days === 1) return '1 day ago';
    return $days . ' days ago';
}
?><!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Job Hunt Engine</title>
<style>
  :root{
    --paper:#F8F6F3; --ink:#101214; --accent:#FF5C1A; --teal:#0F766E;
    --line:#e7e2d9; --muted:#6b6b6b; --card:#ffffff;
  }
  *{box-sizing:border-box}
  html,body{margin:0;padding:0}
  body{
    background:var(--paper); color:var(--ink);
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Roboto,Helvetica,Arial,sans-serif;
    line-height:1.45;
  }
  header{
    padding:18px 22px; border-bottom:1px solid var(--line);
    display:flex; align-items:baseline; gap:14px; flex-wrap:wrap;
    position:sticky; top:0; background:var(--paper); z-index:20;
  }
  header h1{font-size:19px; margin:0; letter-spacing:-0.02em}
  header .dot{color:var(--accent)}
  header .fresh{font-size:12.5px; color:var(--muted); margin-left:auto}
  .wrap{display:flex; gap:0; min-height:calc(100vh - 61px)}
  /* list */
  .list{
    width:42%; max-width:560px; border-right:1px solid var(--line);
    overflow-y:auto; height:calc(100vh - 61px); position:sticky; top:61px;
  }
  .job{
    padding:13px 18px; border-bottom:1px solid var(--line); cursor:pointer;
    display:grid; grid-template-columns:44px 1fr; gap:12px; align-items:start;
  }
  .job:hover{background:#fff}
  .job.active{background:#fff; box-shadow:inset 3px 0 0 var(--accent)}
  .fit{
    font-weight:700; font-size:15px; width:42px; height:42px; border-radius:9px;
    display:flex; align-items:center; justify-content:center; color:#fff;
  }
  .job h3{margin:0 0 3px; font-size:14.5px; letter-spacing:-0.01em}
  .meta{font-size:12.5px; color:var(--muted); display:flex; gap:7px; flex-wrap:wrap; align-items:center}
  .pill{
    font-size:11px; padding:1.5px 7px; border-radius:20px; font-weight:600;
    background:#eee; color:#333; white-space:nowrap;
  }
  .pill.upwork{background:var(--teal); color:#fff}
  .pill.type{background:#efe9df; color:#5a5348}
  .snip{font-size:12.5px; color:#555; margin-top:5px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden}
  /* detail */
  .detail{flex:1; padding:26px 30px; overflow-y:auto; height:calc(100vh - 61px)}
  .detail .empty{color:var(--muted); font-size:14px; margin-top:40px; text-align:center}
  .d-head{display:flex; gap:14px; align-items:flex-start; margin-bottom:6px}
  .d-head .fit{width:52px; height:52px; font-size:18px; flex:none}
  .detail h2{font-size:21px; margin:0 0 4px; letter-spacing:-0.02em}
  .d-sub{font-size:14px; color:#333; margin-bottom:2px}
  .d-meta{font-size:12.5px; color:var(--muted); display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin:8px 0 18px}
  .block{background:var(--card); border:1px solid var(--line); border-radius:12px; padding:15px 17px; margin-bottom:14px}
  .block h4{margin:0 0 7px; font-size:12px; text-transform:uppercase; letter-spacing:0.08em; color:var(--muted)}
  .block p{margin:0; font-size:13.5px}
  .why-not{color:#7a5a00}
  .actions{display:flex; gap:10px; flex-wrap:wrap; margin:6px 0 16px}
  .btn{
    border:none; border-radius:10px; padding:11px 16px; font-size:13.5px;
    font-weight:600; cursor:pointer; font-family:inherit;
  }
  .btn.apply{background:var(--ink); color:#fff; text-decoration:none; display:inline-flex; align-items:center}
  .btn.smart{background:var(--accent); color:#fff}
  .btn.smart:disabled{opacity:.6; cursor:wait}
  .btn.ghost{background:#efe9df; color:#3a352d}
  .ai-out{margin-top:4px}
  .ai-out textarea{
    width:100%; min-height:230px; border:1px solid var(--line); border-radius:12px;
    padding:14px; font-size:13.5px; font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
    line-height:1.5; resize:vertical; background:#fff; color:var(--ink);
  }
  .ai-tools{display:flex; gap:8px; align-items:center; margin-top:8px; flex-wrap:wrap}
  .ai-model{font-size:11.5px; color:var(--muted); margin-left:auto}
  .err{background:#fff2ea; border:1px solid #ffd4bd; color:#a8400f; padding:10px 13px; border-radius:10px; font-size:13px; margin-top:8px}
  .hint{font-size:11.5px; color:var(--muted)}
  @media (max-width:820px){
    .wrap{flex-direction:column}
    .list{width:100%; max-width:none; height:auto; position:static; border-right:none; border-bottom:1px solid var(--line); max-height:44vh}
    .detail{height:auto}
    header .fresh{margin-left:0; width:100%}
  }
</style>
</head>
<body>
<header>
  <h1>Job Hunt Engine<span class="dot">.</span></h1>
  <span class="fresh">
    <?= $count ?> ranked roles<?= ($minD && $maxD) ? ' &middot; posted '.e($minD).' → '.e($maxD) : '' ?>
  </span>
</header>

<div class="wrap">
  <div class="list" id="list"></div>
  <div class="detail" id="detail">
    <div class="empty">Select a role on the left to see the fit breakdown and generate tailored materials.</div>
  </div>
</div>

<script>
const JOBS = <?= json_encode($jobs, JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE) ?>;
const PROFILE = <?= json_encode($PROFILE, JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE) ?>;

function fitColor(n){
  n = +n || 0;
  if (n >= 88) return '#0F766E';
  if (n >= 80) return '#3f8f2e';
  if (n >= 70) return '#c98a12';
  return '#8a8a8a';
}
function ago(d){
  if(!d) return '';
  const t = Date.parse(d); if(isNaN(t)) return d;
  const days = Math.floor((Date.now()-t)/86400000);
  if(days<=0) return 'today';
  if(days===1) return '1 day ago';
  return days+' days ago';
}
function esc(s){ const d=document.createElement('div'); d.textContent=s==null?'':s; return d.innerHTML; }

function sourcePill(src){
  const s=(src||'').toLowerCase();
  if(s==='upwork') return '<span class="pill upwork">Upwork</span>';
  if(s==='greenhouse') return '<span class="pill">Greenhouse</span>';
  if(s==='remoteok') return '<span class="pill">RemoteOK</span>';
  return src ? '<span class="pill">'+esc(src)+'</span>' : '';
}

let activeIdx = -1;

function renderList(){
  const el = document.getElementById('list');
  el.innerHTML = JOBS.map((j,i)=>{
    const fc = fitColor(j.fit_score);
    return `<div class="job" data-i="${i}" onclick="selectJob(${i})">
      <div class="fit" style="background:${fc}">${(+j.fit_score||0)}</div>
      <div>
        <h3>${esc(j.title)||'(untitled role)'}</h3>
        <div class="meta">
          <strong>${esc(j.company)||'—'}</strong>
          ${sourcePill(j.source)}
          ${j.apply_type?`<span class="pill type">${esc(j.apply_type)}</span>`:''}
          ${j.remote?`<span>${esc(j.remote)}</span>`:(j.location?`<span>${esc(j.location)}</span>`:'')}
          ${j.posted_date?`<span>${ago(j.posted_date)}</span>`:''}
        </div>
        ${j.why_fit?`<div class="snip">${esc(j.why_fit)}</div>`:''}
      </div>
    </div>`;
  }).join('');
}

function selectJob(i){
  activeIdx = i;
  document.querySelectorAll('.job').forEach(n=>n.classList.toggle('active', +n.dataset.i===i));
  const j = JOBS[i];
  const fc = fitColor(j.fit_score);
  const loc = j.remote || j.location || '';
  const d = document.getElementById('detail');
  d.innerHTML = `
    <div class="d-head">
      <div class="fit" style="background:${fc}">${(+j.fit_score||0)}</div>
      <div>
        <h2>${esc(j.title)||'(untitled role)'}</h2>
        <div class="d-sub"><strong>${esc(j.company)||'—'}</strong></div>
        <div class="d-meta">
          ${sourcePill(j.source)}
          ${j.apply_type?`<span class="pill type">${esc(j.apply_type)}</span>`:''}
          ${loc?`<span>${esc(loc)}</span>`:''}
          ${j.posted_date?`<span>${ago(j.posted_date)}</span>`:''}
        </div>
      </div>
    </div>

    <div class="actions">
      ${j.url?`<a class="btn apply" href="${esc(j.url)}" target="_blank" rel="noopener">Apply / View posting ↗</a>`:''}
      <button class="btn smart" id="btnCover" onclick="genCover(${i})">✦ Draft Cover Letter</button>
      <button class="btn smart" id="btnResume" onclick="genResume(${i})">✦ Tailor Resume</button>
    </div>

    ${j.fit_summary?`<div class="block"><h4>Fit summary</h4><p>${esc(j.fit_summary)}</p></div>`:''}
    ${j.why_fit?`<div class="block"><h4>Why it fits</h4><p>${esc(j.why_fit)}</p></div>`:''}
    ${j.why_not?`<div class="block"><h4>Watch-outs</h4><p class="why-not">${esc(j.why_not)}</p></div>`:''}

    <div id="aiCover" class="ai-out"></div>
    <div id="aiResume" class="ai-out"></div>
  `;
}

async function callProxy(task, job){
  const res = await fetch('/ai/proxy.php', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ task, payload: { job, profile: PROFILE } })
  });
  return res.json();
}

function aiPanel(containerId, label){
  const c = document.getElementById(containerId);
  c.innerHTML = `<div class="block">
    <h4>${label}</h4>
    <textarea id="${containerId}_ta"></textarea>
    <div class="ai-tools">
      <button class="btn ghost" onclick="copyTa('${containerId}_ta')">Copy</button>
      <button class="btn ghost" onclick="downloadTa('${containerId}_ta','${label}')">Download</button>
      <span class="ai-model" id="${containerId}_model"></span>
    </div>
  </div>`;
}

async function genCover(i){
  const btn = document.getElementById('btnCover');
  const c = document.getElementById('aiCover');
  btn.disabled = true; const old = btn.textContent; btn.textContent = 'Generating…';
  c.innerHTML = `<div class="hint">Drafting a tailored cover letter…</div>`;
  try{
    const r = await callProxy('cover_letter', JOBS[i]);
    if(!r.ok){ c.innerHTML = `<div class="err">${esc(r.error||'AI temporarily busy — try again in a moment')}</div>`; }
    else{
      aiPanel('aiCover','Cover Letter');
      document.getElementById('aiCover_ta').value = r.content;
      document.getElementById('aiCover_model').textContent = `via ${r.provider} · ${r.model_used}`;
    }
  }catch(e){ c.innerHTML = `<div class="err">Network hiccup — try again in a moment.</div>`; }
  btn.disabled = false; btn.textContent = old;
}

async function genResume(i){
  const btn = document.getElementById('btnResume');
  const c = document.getElementById('aiResume');
  btn.disabled = true; const old = btn.textContent; btn.textContent = 'Tailoring…';
  c.innerHTML = `<div class="hint">Tailoring your summary + skills…</div>`;
  try{
    const r = await callProxy('tailor_resume', JOBS[i]);
    if(!r.ok){ c.innerHTML = `<div class="err">${esc(r.error||'AI temporarily busy — try again in a moment')}</div>`; }
    else{
      aiPanel('aiResume','Tailored Resume Summary');
      document.getElementById('aiResume_ta').value = r.content;
      document.getElementById('aiResume_model').textContent = `via ${r.provider} · ${r.model_used}`;
    }
  }catch(e){ c.innerHTML = `<div class="err">Network hiccup — try again in a moment.</div>`; }
  btn.disabled = false; btn.textContent = old;
}

function copyTa(id){
  const ta = document.getElementById(id); if(!ta) return;
  ta.select(); navigator.clipboard.writeText(ta.value);
}
function downloadTa(id,label){
  const ta = document.getElementById(id); if(!ta) return;
  const blob = new Blob([ta.value], {type:'text/plain'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = label.replace(/\s+/g,'_')+'.txt';
  a.click();
}

renderList();
if(JOBS.length) selectJob(0);
</script>
</body>
</html>

// AT5 Tutor app — vanilla JS, no dependencies
(function(){
"use strict";

// ---------- helpers ----------
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const store = {
  get(k, d){ try{ const v = localStorage.getItem("at5:"+k); return v===null ? d : JSON.parse(v); }catch(e){ return (store.mem[k] ?? d); } },
  set(k, v){ store.mem[k]=v; try{ localStorage.setItem("at5:"+k, JSON.stringify(v)); }catch(e){} },
  mem:{}
};
const EVI = Object.fromEntries(EVIDENCE.map(e => [e.id, e]));
const caseOf = e => SOURCES[e.src].case;
const caseLabel = {RW:"Rwanda", UA:"Ukraine", YE:"Yemen (AT4)", CL:"Class"};
const shuffle = a => { a=[...a]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; };
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.classList.add("show"); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove("show"),1600); }
function copy(text){
  const done=()=>toast("Copied");
  if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(done).catch(()=>fallback()); } else fallback();
  function fallback(){ const ta=document.createElement("textarea"); ta.value=text; document.body.appendChild(ta); ta.select(); try{document.execCommand("copy"); done();}catch(e){toast("Copy failed");} ta.remove(); }
}
function oralCite(e){
  const s = SOURCES[e.src];
  if(e.src==="R") return `According to the chapter 'Genocide in Rwanda', page ${e.page}, …`;
  return s.oral + " …";
}
function citeShort(e){
  const s = SOURCES[e.src];
  return e.src==="R" ? `${s.short}, p. ${e.page}` : s.short;
}
function evCard(e, opts={}){
  const c = caseOf(e);
  const th = e.themes.map(t=>`<span class="pill th">${esc(THEMES[t]||t)}</span>`).join("");
  return `<div class="ev" id="ev-${e.id}">
    <div class="meta"><span class="pill ${c}">${caseLabel[c]}</span><b>${esc(citeShort(e))}</b>${e.date?`<span>· ${esc(e.date)}</span>`:""}<span>· ${e.id}</span></div>
    <div>${esc(e.fact)}</div>
    ${e.quote?`<div class="quote">Quote: “${esc(e.quote)}”</div>`:""}
    <div class="cite">Say it: <i>${esc(oralCite(e))}</i></div>
    ${opts.noThemes?"":`<div style="margin-top:6px">${th}</div>`}
    <div class="row noprint" style="margin-top:6px"><button class="btn small" data-copy="${esc(oralCite(e).replace(" …"," ") + e.fact)}">Copy with citation</button></div>
  </div>`;
}
function bindCopy(root){ $$("[data-copy]", root).forEach(b => b.onclick = () => copy(b.dataset.copy)); }

// ---------- confidence ----------
const CONF = ["Not yet","Getting there","Confident"];
const conf = n => store.get("conf"+n, -1);
function navDots(){ QUESTIONS.forEach(q => { const d=$(`#dot${q.n}`); if(!d) return; const c=conf(q.n); d.className="dot"+(c===2?" done":c===1?" mid":""); }); }

// ---------- speech ----------
function speak(text){ Voice.play(Voice.sentences(text), {voiceName: mainVoice(), onError: toast}); }
const stopSpeak = () => Voice.stop();

// Classmate defaults to a different voice from the narrator
function classmateVoice(){ const vs=Voice.voiceList(); if(Voice.settings.voice2 && vs.some(v=>v.name===Voice.settings.voice2)) return Voice.settings.voice2; const main=mainVoice(); const other=vs.find(v=>v.name!==main && (v.lang==="Claude")===(main||"").startsWith("claude:")) || vs.find(v=>v.name!==main); return other ? other.name : main; }
function mainVoice(){ const vs=Voice.voiceList(); if(Voice.settings.voice && vs.some(v=>v.name===Voice.settings.voice)) return Voice.settings.voice; return vs[0] ? vs[0].name : ""; }
// Voice settings bar (voice, classmate voice, speed) — shared by every page that reads aloud
function voiceBar(withClassmate){
  const opts = sel => Voice.voiceList().map(v=>`<option value="${esc(v.name)}" ${v.name===sel?"selected":""}>${esc(v.label)}</option>`).join("") || `<option value="">Default voice</option>`;
  return `<div class="vbar noprint">
    <label>Voice <select data-vset="voice">${opts(mainVoice())}</select></label>
    ${withClassmate?`<label>Classmate voice <select data-vset="voice2">${opts(classmateVoice())}</select></label>`:""}
    <label>Speed <select data-vset="rate">${[0.75,0.85,0.95,1,1.1,1.25].map(r=>`<option value="${r}" ${+Voice.settings.rate===r?"selected":""}>${r}×</option>`).join("")}</select></label>
    <button class="btn small" data-vtest>Test</button>
  </div>`;
}
function bindVoiceBar(root){
  $$("[data-vset]", root).forEach(s => s.onchange = () => Voice.setSetting(s.dataset.vset, s.dataset.vset==="rate" ? +s.value : s.value));
  $$("[data-vtest]", root).forEach(b => b.onclick = () => Voice.play(["This is how your answers will sound."], {voiceName: mainVoice(), onError: toast}));
}
// Renders text as clickable sentences; returns a highlighter
function sentenceView(el, text, {hideWords=false, onPick}={}){
  const parts = Voice.sentences(text);
  el.innerHTML = parts.map((s,i)=>`<span class="sent" data-i="${i}">${hideWords ? s.split(/(\s+)/).map((w,j)=> /\s+/.test(w)?w : ((j/2)%3===2 && w.length>2 ? `<span class="w hide">${esc(w)}</span>` : esc(w))).join("") : esc(s)}</span>`).join(" ");
  $$(".w.hide", el).forEach(w => w.onclick = ev => { ev.stopPropagation(); w.classList.remove("hide"); });
  if(onPick) $$(".sent", el).forEach(s => s.onclick = () => onPick(+s.dataset.i));
  return { parts, mark(i, cls="on"){ $$(".sent", el).forEach(s => s.classList.toggle(cls, +s.dataset.i===i)); if(i>=0){ const s=$(`.sent[data-i="${i}"]`, el); s && s.scrollIntoView({block:"nearest", behavior:"smooth"}); } }, clear(){ $$(".sent", el).forEach(s=>s.classList.remove("on","turn")); } };
}
Voice.onVoices(() => { $$(".vbar").forEach(bar => { const holder=bar.parentNode; const withC=!!$("[data-vset=voice2]",bar); const tmp=document.createElement("div"); tmp.innerHTML=voiceBar(withC); holder.replaceChild(tmp.firstElementChild, bar); bindVoiceBar(holder); }); });

// ---------- timers ----------
let activeTimer = null;
function clearTimer(){ if(activeTimer){ clearInterval(activeTimer); activeTimer=null; } }

// ---------- router ----------
const routes = {};
function go(){
  stopSpeak(); clearTimer(); stopRec();
  const rs = $("#results"); if(rs){ rs.classList.remove("show"); const si=$("#search"); if(si) si.value=""; }
  // Plain hashes only (e.g. #q-3, #speak-u2, #evidence-R25, #flash-nums) so the page works on GitHub Pages and claude.ai
  const h = location.hash.replace(/^#\/?/,"") || "home";
  const dash = h.indexOf("-");
  const key = dash>0 ? h.slice(0,dash) : h;
  const arg = dash>0 ? h.slice(dash+1) : "";
  const params = new URLSearchParams();
  const parts = [];
  if(key==="q") parts.push(arg);
  if(key==="speak" && arg) params.set("q", arg);
  if(key==="evidence" && arg) params.set("focus", arg);
  if(key==="flash" && arg) params.set("deck", arg);
  const fn = routes[key] || routes.home;
  const main = $("#view");
  main.innerHTML = fn(parts, params) || "";
  if(fn.after) fn.after(parts, params, main);
  bindCopy(main);
  $$("nav.side a").forEach(a => { const href=a.getAttribute("href"); a.classList.toggle("active", href==="#"+h || href==="#"+key); });
  $("nav.side").classList.remove("open");
  const fab=$("#askfab"); if(fab) fab.classList.toggle("hide", key==="ask");
  navDots();
  if(!params.get("focus")) window.scrollTo(0,0);
}
window.addEventListener("hashchange", go);

// ---------- HOME ----------
routes.home = () => {
  const dates = [["Monday group","2026-11-23T13:05:00+11:00"],["Wednesday group","2026-11-25T13:05:00+11:00"]];
  const now = Date.now();
  const cd = dates.map(([l,d]) => { const ms=new Date(d)-now; if(ms<=0) return `<div class="tile"><div class="k">${l}</div><div class="t">Done 🎉</div></div>`; const days=Math.floor(ms/864e5), hrs=Math.floor(ms%864e5/36e5); return `<div class="tile"><div class="k">${l}</div><div class="countdown">${days}d ${hrs}h</div><div class="note">${new Date(d).toLocaleDateString("en-AU",{weekday:"short",day:"numeric",month:"short"})}, 1:05 pm</div></div>`; }).join("");
  const confCount = QUESTIONS.filter(q=>conf(q.n)===2).length;
  const known = store.get("known",[]).length;
  const best = store.get("quizBest",null);
  return `
  <h1>AT5 Academic Discussion Tutor</h1>
  <p class="lead">MUF0152 Contemporary Issues 2 · Rwanda (1994) & Russia–Ukraine War · 40-minute group discussion · one A4 note sheet allowed.</p>
  <div class="grid">${cd}
    <div class="tile"><div class="k">Questions confident</div><div class="countdown">${confCount}/8</div></div>
    <div class="tile"><div class="k">Quiz best</div><div class="countdown">${best===null?"—":best+"%"}</div><div class="note">${known} flashcards known</div></div>
  </div>

  <h2>How to use this</h2>
  <div class="card">
    <ol style="margin:0;padding-left:20px">
      <li><b>Work one question at a time.</b> Read the word-by-word breakdown first, then the model answer and the evidence.</li>
      <li><b>Say it out loud</b> on <a href="#speak">Voice practice</a>: live transcript and instant feedback, replying to a classmate's challenge, and shadowing the model answers.</li>
      <li><b>Prepare for push-back</b>: every question has replies for when another student disagrees.</li>
      <li><b>Drill the unseen questions</b> with the 1-minute prep timer, like the real thing.</li>
      <li><b>Lock in facts</b> with <a href="#flash">Flashcards</a> and the <a href="#quiz">Quiz</a>.</li>
      <li><b>Build and print your A4 sheet</b> on the <a href="#a4">A4 sheet</a> page.</li>
    </ol>
  </div>

  <h2>The 8 questions</h2>
  <div class="grid">${QUESTIONS.map(q=>`<a class="tile" href="#q-${q.n}"><div class="k">Question ${q.n} · ${CONF[conf(q.n)]||"Not started"}</div><div class="t">${esc(q.q)}</div></a>`).join("")}</div>

  <h2>Teacher's rules (from the Week 13 slides)</h2>
  <div class="card">
    <ul style="margin:0;padding-left:20px">
      <li>Use <b>Rwanda and Ukraine</b> as your case studies — no random new ones. The only extra case is <b>Yemen (your own AT4 presentation)</b>, and only for Q8, linked back to Rwanda and Ukraine.</li>
      <li>"Conflict" was added to Q2 and Q4 to <b>broaden</b> your evidence.</li>
      <li>Find <b>2–4 pieces of evidence</b> per question, from <b>each</b> case study.</li>
      <li>Extra research should <b>fill gaps, NOT find new examples</b>.</li>
      <li>For each point ask: <b>why is this so?</b> and <b>what could the counter-argument be?</b></li>
      <li>You can link to other subjects, like Global Studies.</li>
    </ul>
  </div>

  <h2>How you're marked</h2>
  <div class="card"><table>${RUBRIC.map(r=>`<tr><th style="width:34%">${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join("")}</table></div>
  `;
};

// ---------- QUESTION ----------
function highlightQ(q){
  const text = q.q, low = text.toLowerCase(), spans = [];
  q.keywords.forEach(([k,tip]) => {
    k.replace(/^AND |^OR /,"").split("…").map(s=>s.trim()).filter(Boolean).forEach(part => {
      let from = 0, at;
      while((at = low.indexOf(part.toLowerCase(), from)) !== -1){
        const end = at + part.length;
        if(!spans.some(s => at < s.end && end > s.start)){ spans.push({start:at, end, tip}); break; }
        from = at + 1;
      }
    });
  });
  spans.sort((a,b)=>a.start-b.start);
  let out = "", pos = 0;
  spans.forEach(s => { out += esc(text.slice(pos, s.start)) + `<mark title="${esc(s.tip)}">${esc(text.slice(s.start, s.end))}</mark>`; pos = s.end; });
  return out + esc(text.slice(pos));
}
const SHORT = ["Most important cause today","Short & long-term consequences","Quick vs long conflicts","Media bias & public support","Who controls information","Challenges in ending conflict","What ordinary people can do","What I've learned"];
routes.q = (parts) => {
  const n = +parts[0] || 1;
  const q = QUESTIONS.find(x=>x.n===n);
  if(!q) return "<p>Question not found.</p>";
  const c = conf(n);
  const words = q.spoken.split(/\s+/).length;
  return `
  <div class="note">Question ${n} of 8</div>
  <div class="card"><div class="qtext">${highlightQ(q)}</div>
    <div class="row" style="margin-top:12px"><button class="btn small" id="askQ">💬 Ask Claude about Q${n}</button><span class="note">How ready are you?</span>
      ${CONF.map((l,i)=>`<button class="btn small ${c===i?(i===2?"good":"primary"):""}" data-conf="${i}">${l}</button>`).join("")}
    </div>
  </div>
  <div class="tabs" id="tabs">
    ${["Breakdown","Model answer","Evidence","Push-back","My version","A4 line"].map((t,i)=>`<button data-tab="${i}" class="${i===0?"on":""}">${t}</button>`).join("")}
  </div>
  <div id="tab0">
    <h3>What each word demands</h3>
    <div class="kw">${q.keywords.map(([k,v])=>`<div>${esc(k)}</div><div>${esc(v)}</div>`).join("")}</div>
    <div class="trap"><b>Trap to avoid:</b> ${esc(q.trap)}</div>
    <h3>Recommended position</h3>
    <div class="position">${esc(q.position)}</div>
    <h3>Answer structure (45–75 sec)</h3>
    <ol><li><b>Position</b> — one sentence that answers the exact question.</li><li><b>Evidence 1</b> — with the source said out loud.</li><li><b>Evidence 2</b> — from the other case study.</li><li><b>Explain why</b> — link evidence back to your position.</li><li><b>Limit / other view</b> — "However…" then return to your view.</li></ol>
  </div>
  <div id="tab1" hidden>
    ${voiceBar(false)}
    <div class="row noprint">
      <button class="btn primary" id="listen">▶ Listen</button><button class="btn" id="pause">❚❚ Pause</button><button class="btn" id="stop">■ Stop</button>
      <button class="btn" id="shadow">🗣 Shadow</button>
      <button class="btn" id="memory">Memory mode</button>
      <a class="btn" href="#speak-${n}">Practise with timer</a>
      <span class="note">${words} words · about ${Math.round(words/2.4)} sec spoken</span>
    </div>
    <div class="turnbanner" id="turn" hidden>Your turn — repeat that sentence</div>
    <div class="card"><div class="spoken" id="spoken"></div></div>
    <p class="note"><b>Listen</b> highlights each sentence as it's read — tap any sentence to start from there. <b>Shadow</b> pauses after each sentence so you can repeat it out loud. <b>Memory mode</b> hides every third word (tap to reveal). Learn the structure and evidence, not every word, so it sounds natural.</p>
  </div>
  <div id="tab2" hidden>
    <p class="note">${q.n===8 ? "Your own case study (Yemen, AT4) first, then link back to Rwanda and Ukraine." : "Rwanda evidence first, then Ukraine. Aim to use at least one from each."}</p>
    ${q.evidence.map(id=>EVI[id]).filter(Boolean).sort((a,b)=>{const r=q.n===8?{YE:0,RW:1,UA:2,CL:3}:{RW:0,UA:1,YE:2,CL:3}; return (r[caseOf(a)]??9)-(r[caseOf(b)]??9);}).map(e=>evCard(e)).join("")}
    <a class="btn" href="#evidence">Open full evidence bank →</a>
  </div>
  <div id="tab3" hidden>
    <p class="note">What another student might say, and how you can respond while keeping your view.</p>
    ${q.counters.map(([a,b])=>`<div class="counter"><b>If someone says: ${esc(a)}</b>You can reply: ${esc(b)}</div>`).join("")}
  </div>
  <div id="tab4" hidden>
    <p class="note">Write your own version in your own words. It saves on this device and appears on your A4 sheet.</p>
    ${["Position","Rwanda evidence (+ source)","Ukraine evidence (+ source)","Why — link back","Limit / other view"].map((l,i)=>`<label class="f">${l}</label><textarea data-plan="${i}">${esc(store.get(`plan${n}_${i}`,""))}</textarea>`).join("")}
    <div class="row" style="margin-top:10px"><button class="btn primary" id="readmine">▶ Read mine aloud</button><a class="btn" href="#speak-${n}">Practise with timer</a></div>
  </div>
  <div id="tab5" hidden>
    <h3>Suggested A4 line</h3>
    <div class="a4line">${esc(q.a4)}</div>
    <label class="f">Your A4 line (edit freely; used on the A4 sheet page)</label>
    <textarea id="mya4" style="min-height:110px">${esc(store.get("a4_"+n, q.a4))}</textarea>
    <div class="row" style="margin-top:8px"><button class="btn" id="reseta4">Reset to suggested</button><a class="btn" href="#a4">Open A4 sheet →</a></div>
  </div>
  <div class="row noprint" style="margin-top:24px;justify-content:space-between">
    ${n>1?`<a class="btn" href="#q-${n-1}">← Q${n-1}</a>`:"<span></span>"}
    ${n<8?`<a class="btn primary" href="#q-${n+1}">Q${n+1} →</a>`:`<a class="btn primary" href="#unseen">Unseen drill →</a>`}
  </div>`;
};
routes.q.after = (parts, params, main) => {
  const n = +parts[0] || 1;
  const q = QUESTIONS.find(x=>x.n===n); if(!q) return;
  $$("#tabs button", main).forEach(b => b.onclick = () => {
    $$("#tabs button", main).forEach(x=>x.classList.toggle("on", x===b));
    for(let i=0;i<6;i++) $("#tab"+i, main).hidden = (i != b.dataset.tab);
    stopSpeak();
  });
  $$("[data-conf]", main).forEach(b => b.onclick = () => { store.set("conf"+n, +b.dataset.conf); go(); });
  ASK.lastQ = n;
  $("#askQ", main).onclick = () => askClaude("", {q:n, send:false});
  bindVoiceBar(main);
  let mem=false, view;
  const turn=$("#turn", main);
  const run = (start=0, shadow=false) => {
    turn.hidden=true;
    Voice.play(view.parts, { start, voiceName: mainVoice(),
      onSentence: i => { turn.hidden=true; view.clear(); view.mark(i); },
      gap: shadow ? (s => Math.max(1800, s.split(/\s+/).length*420/Voice.settings.rate)) : null,
      onGap: i => { view.mark(i,"turn"); turn.hidden=false; },
      onEnd: () => { view.clear(); turn.hidden=true; $("#pause",main).textContent="❚❚ Pause"; },
      onError: toast });
  };
  const render = () => { view = sentenceView($("#spoken", main), q.spoken, {hideWords:mem, onPick: i => run(i, false)}); };
  render();
  $("#listen", main).onclick = () => run(0,false);
  $("#shadow", main).onclick = () => run(0,true);
  $("#pause", main).onclick = (ev) => { if(!Voice.isPlaying()) return; if(Voice.isPaused()){ Voice.resume(); ev.target.textContent="❚❚ Pause"; } else { Voice.pause(); ev.target.textContent="▶ Resume"; } };
  $("#stop", main).onclick = () => { Voice.stop(); view.clear(); turn.hidden=true; };
  $("#memory", main).onclick = (ev) => { mem=!mem; ev.target.classList.toggle("primary", mem); Voice.stop(); render(); };
  $$("[data-plan]", main).forEach(t => t.oninput = () => store.set(`plan${n}_${t.dataset.plan}`, t.value));
  $("#readmine", main).onclick = () => { const txt=$$("[data-plan]",main).map(t=>t.value).join(" "); txt.trim()?speak(txt):toast("Write something first"); };
  $("#mya4", main).oninput = e => store.set("a4_"+n, e.target.value);
  $("#reseta4", main).onclick = () => { store.set("a4_"+n, q.a4); $("#mya4",main).value=q.a4; toast("Reset"); };
};

// ---------- EVIDENCE BANK ----------
routes.evidence = (parts, params) => `
  <h1>Evidence bank</h1>
  <p class="lead">${EVIDENCE.length} facts, all checked against your readings. Filter by case, theme or source, or search.</p>
  <div class="filters noprint">
    <select id="fcase"><option value="">All cases</option><option value="RW">Rwanda</option><option value="UA">Ukraine</option><option value="YE">Yemen (your AT4 case)</option><option value="CL">Class</option></select>
    <select id="ftheme"><option value="">All themes</option>${Object.entries(THEMES).map(([k,v])=>`<option value="${k}">${v}</option>`).join("")}</select>
    <select id="fsrc"><option value="">All sources</option>${Object.entries(SOURCES).map(([k,s])=>`<option value="${k}">${esc(s.short)}</option>`).join("")}</select>
    <input type="text" id="ftext" placeholder="Search facts…">
  </div>
  <div class="note" id="fcount"></div>
  <div id="evlist"></div>`;
routes.evidence.after = (parts, params, main) => {
  const draw = () => {
    const c=$("#fcase").value, t=$("#ftheme").value, s=$("#fsrc").value, x=$("#ftext").value.toLowerCase().trim();
    const list = EVIDENCE.filter(e => (!c||caseOf(e)===c) && (!t||e.themes.includes(t)) && (!s||e.src===s) && (!x || (e.fact+" "+(e.quote||"")+" "+e.id+" "+(e.date||"")).toLowerCase().includes(x)));
    $("#fcount").textContent = `${list.length} shown`;
    $("#evlist").innerHTML = list.map(e=>evCard(e)).join("");
    bindCopy($("#evlist"));
  };
  ["fcase","ftheme","fsrc"].forEach(id => $("#"+id).onchange = draw);
  $("#ftext").oninput = draw;
  if(params.get("theme")) $("#ftheme").value = params.get("theme");
  draw();
  const f = params.get("focus");
  if(f){ const el=$("#ev-"+f); if(el){ el.scrollIntoView({block:"center"}); el.style.outline="3px solid var(--accent)"; } }
};

// ---------- SPEAK (voice practice) ----------
const S = { rec:null, recorder:null, meterRaf:0, sessionAudio:{} };
function stopRec(){
  if(S.rec){ S.rec.stop(); S.rec=null; }
  if(S.recorder){ S.recorder.stop(); S.recorder=null; }
  cancelAnimationFrame(S.meterRaf);
}
const fmtT = s => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;
function micNote(){
  const missing=[]; if(!Voice.transcriptOK) missing.push("live transcript"); if(!Voice.hasRec) missing.push("recording");
  return missing.length ? `<div class="trap noprint"><b>Heads-up:</b> ${missing.join(" and ")} isn't available in this browser. Chrome or Safari opened directly (e.g. your GitHub Pages link) works best. You can still tap the transcript box and use your keyboard's 🎤 dictation, then press <b>Check my answer</b>.</div>` : "";
}
function allQuestionOptions(sel){
  return QUESTIONS.map(q=>`<option value="${q.n}" ${String(q.n)===sel?"selected":""}>Q${q.n}: ${esc(q.q)}</option>`).join("") +
    UNSEEN.map((u,i)=>`<option value="u${i}" ${sel==="u"+i?"selected":""}>Unseen: ${esc(u.q)}</option>`).join("");
}
function questionFor(v){ if(String(v)[0]==="u"){ const u=UNSEEN[+String(v).slice(1)]; return {id:"u"+String(v).slice(1), q:u.q, model:"Suggested angle: "+u.angle}; } const q=QUESTIONS.find(x=>x.n===+v); return {id:String(q.n), q:q.q, model:q.spoken}; }
function feedbackHTML(r, model, modelLabel){
  return `<div class="fb">
    <div class="row" style="justify-content:space-between"><div><div class="note">Score</div><div class="score ${r.score>=80?"good":r.score>=55?"mid":"low"}">${r.score}%</div></div>
    <div class="note" style="text-align:right">${r.words} words · ${Math.round(r.secs)} sec${r.wpm?` · ${r.wpm} wpm`:""}</div></div>
    ${r.checks.map(c=>`<div class="chk ${c.ok?"ok":"no"}"><span>${c.ok?"✓":"✗"}</span><div><b>${esc(c.label)}</b>${c.ok?"":`<div class="note">${esc(c.tip)}</div>`}</div></div>`).join("")}
    <p class="note">Automatic checks look for key words in your transcript, so names like "Iskoujina" may be misheard — fix the transcript and press Check again.</p>
    <div class="row" style="margin:10px 0"><button class="btn primary" data-askfb>💬 Get Claude's detailed feedback</button></div>
    <details><summary><b>${modelLabel}</b></summary><div class="spoken" style="margin-top:8px">${esc(model)}</div></details>
  </div>`;
}
// Starts transcript + recorder + level meter. Returns a stopper that resolves to {text, audio}.
async function startCapture(main, {transcript=true, record=true}){
  const ta=$(".tx", main), interim=$(".interim", main), meter=$(".meter span", main), note=$(".capnote", main);
  ta.value=""; ta.readOnly=false; interim.textContent=""; note.textContent="";
  if(transcript && Voice.transcriptOK){
    S.rec = Voice.Recognizer((fin, inter) => { ta.value=fin; interim.textContent=inter; ta.scrollTop=ta.scrollHeight; },
      st => { if(st==="needs-click"){ ta.readOnly=false; note.textContent="Tap Start again to turn on the live transcript."; } if(st==="blocked"||st==="network") ta.readOnly=false; if(st==="blocked") note.textContent="Live transcript blocked — allow the microphone, or dictate into the box after."; if(st==="network") note.textContent="Live transcript needs an internet connection."; });
    if(S.rec.start()) ta.readOnly=true;   // locked only while live transcript is writing
  }
  if(record && Voice.hasRec){
    try{ S.recorder = Voice.Recorder(); await S.recorder.start();
      const tick=()=>{ if(!S.recorder) return; meter.style.width=Math.round(S.recorder.level()*100)+"%"; S.meterRaf=requestAnimationFrame(tick); }; tick();
    }catch(e){ S.recorder=null; note.textContent = (note.textContent?note.textContent+" ":"") + "Recording blocked — allow microphone access to record."; }
  }
  return async () => {
    const rec=S.rec, recorder=S.recorder; S.rec=null; S.recorder=null; cancelAnimationFrame(S.meterRaf); meter.style.width="0";
    if(rec) rec.stop();
    const audio = recorder ? await recorder.stop() : null;
    await new Promise(r=>setTimeout(r,400)); // let the last words arrive
    ta.readOnly=false; if(interim.textContent){ ta.value=(ta.value+" "+interim.textContent).trim(); interim.textContent=""; }
    return {text: ta.value, audio};
  };
}
const captureBox = () => `
  <div class="meter" title="Microphone level"><span></span></div>
  <label class="f">Transcript <span class="note">(live if supported — you can edit it, or dictate/type into it)</span></label>
  <textarea class="tx" style="min-height:110px" placeholder="Your words appear here as you speak…"></textarea>
  <div class="interim note"></div><div class="capnote note"></div>`;

routes.speak = (parts, params) => {
  const sel = params.get("q") || "1";
  return `
  <h1>Voice practice</h1>
  <p class="lead">Speak your answers, get instant feedback, practise replying to classmates, and shadow the model answers.</p>
  <div class="tabs" id="vtabs">${["🎙 Answer a question","💬 Respond to a classmate","🗣 Shadowing","📈 My attempts"].map((t,i)=>`<button data-vt="${i}" class="${i===0?"on":""}">${t}</button>`).join("")}</div>
  ${voiceBar(true)}
  ${micNote()}

  <div id="vt0">
    <div class="card">
      <label class="f">Question</label>
      <select id="sq">${allQuestionOptions(sel)}</select>
      <div class="row" style="margin-top:10px">
        <label class="check" style="margin:0"><input type="checkbox" id="prep" checked> 1-minute prep</label>
        <label class="check" style="margin:0"><input type="checkbox" id="optTx" ${Voice.transcriptOK?"checked":"disabled"}> Live transcript</label>
        <label class="check" style="margin:0"><input type="checkbox" id="optRec" ${Voice.hasRec?"checked":"disabled"}> Record audio</label>
        <button class="btn small" id="rand">🎲 Random</button>
        <button class="btn small" id="hearQ">🔊 Hear question</button>
      </div>
      <div class="qtext" id="sqtext" style="margin-top:14px"></div>
      <div class="timer" id="clock">0:00</div>
      <div class="bar"><span id="cbar" style="width:0"></span></div>
      <div class="note" id="cstate" style="text-align:center;margin-top:6px">Press Start. Speak for 45–75 seconds.</div>
      <div class="row" style="justify-content:center;margin-top:12px">
        <button class="btn primary" id="start">Start</button>
        <button class="btn good" id="finish">■ Stop & check</button>
      </div>
      ${captureBox()}
      <div class="row" style="margin-top:8px"><button class="btn" id="checkBtn">Check my answer</button><span class="note">Uses the transcript above.</span></div>
      <audio id="playback" controls style="width:100%;margin-top:12px;display:none"></audio>
    </div>
    <details class="card"><summary><b>Plan notes (for your 1-minute prep)</b></summary>
      ${["Position","Rwanda evidence + source","Ukraine evidence + source","However…"].map(l=>`<label class="f">${l}</label><textarea class="sp"></textarea>`).join("")}
    </details>
    <div id="fb0"></div>
  </div>

  <div id="vt1" hidden>
    <div class="card">
      <p class="note" style="margin-top:0">A classmate challenges your view. <b>Listen first</b> (the text is hidden — listening is marked), then reply in 20–45 seconds: acknowledge their point, give evidence, and return to your view.</p>
      <div class="note" id="rcontext"></div>
      <div class="classmate" id="rsay"><span class="note">Press "Play challenge".</span></div>
      <div class="row" style="margin-top:10px">
        <button class="btn primary" id="rplay">🎧 Play challenge</button>
        <button class="btn" id="rshow">Show text</button>
        <button class="btn" id="rnext">Next challenge →</button>
        <label class="check" style="margin:0"><input type="checkbox" id="rauto" checked> Start my reply automatically</label>
      </div>
      <div class="timer" id="rclock">0:00</div>
      <div class="note" id="rstate" style="text-align:center">—</div>
      <div class="row" style="justify-content:center;margin-top:10px"><button class="btn primary" id="rstart">Start reply</button><button class="btn good" id="rstop">■ Stop & check</button></div>
      ${captureBox()}
      <div class="row" style="margin-top:8px"><button class="btn" id="rcheck">Check my reply</button></div>
      <audio id="rplayback" controls style="width:100%;margin-top:12px;display:none"></audio>
    </div>
    <div id="fb1"></div>
  </div>

  <div id="vt2" hidden>
    <div class="card">
      <p class="note" style="margin-top:0">Shadowing: the model answer is read one sentence at a time, then pauses so you can repeat it out loud. Great for natural rhythm and remembering citations.</p>
      <label class="f">Model answer</label>
      <select id="shq">${QUESTIONS.map(q=>`<option value="${q.n}" ${String(q.n)===sel?"selected":""}>Q${q.n}: ${esc(q.q)}</option>`).join("")}</select>
      <div class="row" style="margin-top:10px">
        <label>Pause length <select id="shgap" style="width:auto"><option value="1">Normal</option><option value="1.5" selected>Longer</option><option value="2">Longest</option></select></label>
        <label class="check" style="margin:0"><input type="checkbox" id="shhide"> Hide text (harder)</label>
      </div>
      <div class="row" style="margin-top:10px"><button class="btn primary" id="shstart">▶ Start</button><button class="btn" id="shpause">❚❚ Pause</button><button class="btn" id="shrepeat">↺ Repeat sentence</button><button class="btn" id="shstop">■ Stop</button><span class="note" id="shpos"></span></div>
      <div class="turnbanner" id="shturn" hidden>Your turn — say it</div>
      <div class="spoken" id="shtext" style="margin-top:10px"></div>
    </div>
  </div>

  <div id="vt3" hidden><div id="attempts"></div></div>`;
};

routes.speak.after = (parts, params, main) => {
  bindVoiceBar(main);
  // tabs
  $$("#vtabs button", main).forEach(b => b.onclick = () => {
    stopRec(); clearTimer(); Voice.stop();
    $$("#vtabs button", main).forEach(x=>x.classList.toggle("on", x===b));
    for(let i=0;i<4;i++) $("#vt"+i, main).hidden = (i != b.dataset.vt);
    if(b.dataset.vt==="3") drawAttempts();
  });

  // ===== Answer a question =====
  const box0=$("#vt0", main);
  const showQ = () => { $("#sqtext").textContent=questionFor($("#sq").value).q; $("#fb0").innerHTML=""; };
  $("#sq").onchange = showQ; showQ();
  $("#rand").onclick = () => { const o=$$("#sq option"); $("#sq").value=o[Math.floor(Math.random()*o.length)].value; showQ(); };
  $("#hearQ").onclick = () => speak(questionFor($("#sq").value).q);
  const clock=$("#clock"), bar=$("#cbar"), st=$("#cstate");
  let stopper=null, t0=0, secs=0, lastAudio=null;
  const talk = async () => {
    clearTimer(); clock.className="timer talk"; st.textContent="Speak now — aim for 45–75 seconds";
    t0=Date.now(); secs=0;
    const pending = startCapture(box0, {transcript:$("#optTx").checked, record:$("#optRec").checked});
    stopper = async () => (await pending)();
    activeTimer=setInterval(()=>{ secs=(Date.now()-t0)/1000; clock.textContent=fmtT(secs); bar.style.width=Math.min(100,secs/75*100)+"%";
      if(secs>=45 && secs<75) st.textContent="✓ In the target range — finish your point";
      if(secs>=75){ clock.className="timer over"; st.textContent="Over 75 seconds — wrap up now"; }
      if(secs>=150) finish(); },200);
  };
  $("#start").onclick = () => {
    if($("#start").dataset.go){ delete $("#start").dataset.go; $("#start").textContent="Start"; talk(); return; }
    stopRec(); clearTimer(); Voice.stop(); $("#fb0").innerHTML=""; secs=0;
    if($("#prep").checked){
      const p0=Date.now(); clock.className="timer prep"; st.textContent="Prep — position + one Rwanda + one Ukraine fact";
      activeTimer=setInterval(()=>{ const left=60-(Date.now()-p0)/1000; clock.textContent=fmtT(Math.max(0,Math.ceil(left))); bar.style.width=(100-Math.max(0,left)/60*100)+"%"; if(left<=0){ clearTimer();
        if(Voice.hasDictation && $("#optTx").checked){ clock.className="timer over"; clock.textContent="Go!"; st.textContent="Prep over — tap 🎙 Speak now"; $("#start").textContent="🎙 Speak now"; $("#start").dataset.go="1"; }
        else talk(); } },200);
    } else talk();
  };
  const finish = async () => {
    clearTimer();
    if(!stopper){ st.textContent="Stopped."; return; }
    const s=stopper; stopper=null; st.textContent="Checking…";
    const {text, audio} = await s();
    if(audio){ const a=$("#playback"); a.src=audio.url; a.style.display="block"; lastAudio=audio; }
    st.textContent="Done — see your feedback below.";
    check(text, secs, true);
  };
  $("#finish").onclick = finish;
  const check = (text, s, save) => {
    const Q=questionFor($("#sq").value);
    if(!text.trim()){ $("#fb0").innerHTML=`<div class="trap">No words captured. Type or dictate what you said into the transcript box, then press <b>Check my answer</b>.</div>`; return; }
    const r=Voice.analyse(text, s>=8 ? s : text.split(/\s+/).length/2.4, Q.q, "answer");
    $("#fb0").innerHTML = feedbackHTML(r, Q.model, String(Q.id)[0]==="u" ? "Suggested angle" : "Compare with the model answer");
    $("#fb0 [data-askfb]").onclick = () => askClaude(`Check my spoken answer. Question: "${Q.q}"\nI spoke for about ${Math.round(r.secs)} seconds. Transcript (from speech recognition, so names may be misspelled):\n"${text.trim()}"`, {q: String(Q.id)[0]==="u" ? 0 : +Q.id});
    if(save && text!==S.lastSaved){ S.lastSaved=text; const id=Date.now(); Voice.saveAttempt({id, at:new Date().toISOString(), mode:"answer", q:Q.id, secs:Math.round(r.secs), wpm:r.wpm, score:r.score, text:text.slice(0,800)}); if(lastAudio) S.sessionAudio[id]=lastAudio; }
    $("#fb0").scrollIntoView({behavior:"smooth", block:"start"});
  };
  $("#checkBtn").onclick = () => check($(".tx", box0).value, secs, true);

  // ===== Respond to a classmate =====
  const box1=$("#vt1", main);
  const pool = QUESTIONS.flatMap(q => q.counters.map(([say, reply]) => ({n:q.n, q:q.q, say:say.replace(/^"|"$/g,"").replace(/^“|”$/g,"").replace(/\s*\(p\.[^)]*\)\s*$/,""), reply})));
  let order=shuffle(pool.map((_,i)=>i)), ri=0, rStopper=null, rSecs=0, rAudio=null;
  const cur = () => pool[order[ri]];
  const drawR = () => { const c=cur(); $("#rcontext").textContent=`From Q${c.n}: ${c.q}`; $("#rsay").innerHTML=`<span class="note">Text hidden — press Play challenge.</span>`; $("#rsay").dataset.shown=""; $("#rclock").textContent="0:00"; $("#rclock").className="timer"; $("#rstate").textContent="—"; $("#fb1").innerHTML=""; $(".tx",box1).value=""; };
  drawR();
  $("#rshow").onclick = () => { $("#rsay").textContent = "Classmate: " + cur().say; };
  $("#rnext").onclick = () => { stopRec(); clearTimer(); Voice.stop(); rStopper=null; ri=(ri+1)%order.length; drawR(); };
  const rTalk = async () => {
    clearTimer(); $("#rclock").className="timer talk"; $("#rstate").textContent="Reply now: acknowledge → evidence → your view";
    const s0=Date.now(); rSecs=0;
    const pending = startCapture(box1, {transcript:true, record:Voice.hasRec});
    rStopper = async () => (await pending)();
    activeTimer=setInterval(()=>{ rSecs=(Date.now()-s0)/1000; $("#rclock").textContent=fmtT(rSecs); if(rSecs>=45){ $("#rclock").className="timer over"; $("#rstate").textContent="Wrap up — replies should be short"; } if(rSecs>=90) rFinish(); },200);
  };
  $("#rplay").onclick = () => {
    stopRec(); clearTimer(); rStopper=null; $("#fb1").innerHTML="";
    $("#rstate").textContent="Listening…";
    Voice.play(Voice.sentences(cur().say), { voiceName: classmateVoice(), onError: toast,
      onEnd: () => {
        if(!$("#rauto").checked || Voice.hasDictation){ $("#rstate").textContent="Your turn — press Start reply"; return; }
        let n=3; $("#rclock").className="timer prep"; $("#rclock").textContent=n; $("#rstate").textContent="Your turn in…";
        activeTimer=setInterval(()=>{ n--; if(n>0) $("#rclock").textContent=n; else { clearTimer(); rTalk(); } },1000);
      } });
  };
  $("#rstart").onclick = () => { stopRec(); Voice.stop(); rTalk(); };
  const rFinish = async () => {
    clearTimer(); if(!rStopper){ $("#rstate").textContent="Stopped."; return; }
    const s=rStopper; rStopper=null; $("#rstate").textContent="Checking…";
    const {text, audio} = await s();
    if(audio){ const a=$("#rplayback"); a.src=audio.url; a.style.display="block"; rAudio=audio; }
    $("#rstate").textContent="Done.";
    rCheck(text, rSecs, true);
  };
  $("#rstop").onclick = rFinish;
  const rCheck = (text, s, save) => {
    const c=cur();
    if(!text.trim()){ $("#fb1").innerHTML=`<div class="trap">No words captured. Type or dictate your reply into the transcript box, then press <b>Check my reply</b>.</div>`; return; }
    const r=Voice.analyse(text, s>=8 ? s : text.split(/\s+/).length/2.4, c.q, "respond");
    $("#fb1").innerHTML = `<div class="classmate" style="margin:12px 0">Classmate: ${esc(c.say)}</div>` + feedbackHTML(r, c.reply, "A strong reply");
    $("#fb1 [data-askfb]").onclick = () => askClaude(`A classmate said: "${c.say}" (about Q${c.n}: "${c.q}"). Here is my spoken reply (speech recognition transcript):\n"${text.trim()}"\nHow well did I listen and respond? Give me a stronger reply I could say.`, {q:c.n});
    if(save && text!==S.lastSaved){ S.lastSaved=text; const id=Date.now(); Voice.saveAttempt({id, at:new Date().toISOString(), mode:"respond", q:String(c.n), secs:Math.round(r.secs), wpm:r.wpm, score:r.score, text:text.slice(0,800)}); if(rAudio) S.sessionAudio[id]=rAudio; }
  };
  $("#rcheck").onclick = () => rCheck($(".tx",box1).value, rSecs, true);

  // ===== Shadowing =====
  let shView, shIdx=0;
  const drawSh = () => { const q=QUESTIONS.find(x=>x.n===+$("#shq").value); shView=sentenceView($("#shtext"), q.spoken, {onPick:i=>runSh(i)}); $("#shtext").classList.toggle("blur", $("#shhide").checked); $("#shpos").textContent=`${shView.parts.length} sentences`; $("#shturn").hidden=true; };
  const runSh = (start=0) => {
    const mult=+$("#shgap").value;
    Voice.play(shView.parts, { start, voiceName: mainVoice(),
      onSentence: i => { shIdx=i; $("#shturn").hidden=true; shView.clear(); shView.mark(i); $("#shpos").textContent=`Sentence ${i+1} / ${shView.parts.length}`; },
      gap: s => Math.max(1800, s.split(/\s+/).length*420*mult/Voice.settings.rate),
      onGap: i => { shView.mark(i,"turn"); $("#shturn").hidden=false; },
      onEnd: () => { $("#shturn").hidden=true; shView.clear(); $("#shpos").textContent="Finished — try with 'Hide text' on."; },
      onError: toast });
  };
  $("#shq").onchange = () => { Voice.stop(); drawSh(); };
  $("#shhide").onchange = () => $("#shtext").classList.toggle("blur", $("#shhide").checked);
  $("#shstart").onclick = () => runSh(0);
  $("#shrepeat").onclick = () => runSh(shIdx);
  $("#shpause").onclick = (ev) => { if(!Voice.isPlaying()) return; if(Voice.isPaused()){ Voice.resume(); ev.target.textContent="❚❚ Pause"; } else { Voice.pause(); ev.target.textContent="▶ Resume"; } };
  $("#shstop").onclick = () => { Voice.stop(); shView.clear(); $("#shturn").hidden=true; };
  drawSh();

  // ===== Attempts =====
  function drawAttempts(){
    const list=Voice.attempts();
    const label = a => a.q[0]==="u" ? "Unseen: "+(UNSEEN[+a.q.slice(1)]||{q:"?"}).q : "Q"+a.q+" · "+SHORT[+a.q-1];
    const best={}; list.filter(a=>a.mode==="answer").forEach(a=>{ best[a.q]=Math.max(best[a.q]||0,a.score); });
    $("#attempts").innerHTML = list.length ? `
      <div class="card"><h3 style="margin-top:0">Best score per question</h3>
        <div class="grid">${QUESTIONS.map(q=>`<div class="tile"><div class="k">Q${q.n}</div><div class="t">${best[String(q.n)]!==undefined?best[String(q.n)]+"%":"—"}</div></div>`).join("")}</div></div>
      <div class="card"><h3 style="margin-top:0">History</h3>
        <table><tr><th>When</th><th>What</th><th>Length</th><th>Pace</th><th>Score</th></tr>
        ${list.map(a=>`<tr><td>${new Date(a.at).toLocaleString("en-AU",{weekday:"short",hour:"numeric",minute:"2-digit"})}</td><td>${a.mode==="respond"?"Reply · ":""}${esc(label(a))}${S.sessionAudio[a.id]?`<br><audio controls src="${S.sessionAudio[a.id].url}" style="width:100%;max-width:260px"></audio>`:""}<details><summary class="note">Transcript</summary><div class="note">${esc(a.text)}</div></details></td><td>${a.secs}s</td><td>${a.wpm||"—"}</td><td><b>${a.score}%</b></td></tr>`).join("")}
        </table>
        <p class="note">Scores and transcripts are saved in this browser. Audio is kept only until you close the page.</p>
        <button class="btn small" id="clearAtt">Clear history</button></div>` : `<div class="card">No attempts yet. Use <b>Answer a question</b> or <b>Respond to a classmate</b> and press Stop & check.</div>`;
    const c=$("#clearAtt"); if(c) c.onclick=()=>{ Voice.clearAttempts(); drawAttempts(); toast("History cleared"); };
  }
};

// ---------- UNSEEN DRILL ----------
routes.unseen = () => `
  <h1>Unseen question drill</h1>
  <p class="lead">Midway through, the teacher gives unseen questions with one minute to prepare. Practise connecting your evidence to new questions.</p>
  <div class="card">
    <div class="note">Your unseen question</div>
    <div class="qtext" id="uq"></div>
    <div class="timer prep" id="uclock">1:00</div>
    <div class="row" style="justify-content:center">
      <button class="btn primary" id="ustart">Start 1-minute prep</button>
      <button class="btn" id="unext">Next question</button>
      <a class="btn" id="uspeak" href="#speak">Speak it with timer →</a>
    </div>
  </div>
  <div class="card">
    <h3 style="margin-top:0">1-minute planner</h3>
    <ol style="margin:0;padding-left:20px"><li><b>Decode</b>: underline the key words. What does it really ask?</li><li><b>Position</b>: one-sentence answer.</li><li><b>Pick 1 Rwanda + 1 Ukraine fact</b> you already know.</li><li><b>Link</b> to one of the 8 prepared questions — reuse that evidence.</li><li><b>Limit</b>: "However…"</li></ol>
    <label class="f">Position</label><textarea id="up1"></textarea>
    <label class="f">Evidence (RW / UA)</label><textarea id="up2"></textarea>
    <div class="row" style="margin-top:8px"><button class="btn" id="uangle">Show a suggested angle</button></div>
    <div id="uans" class="position" style="margin-top:10px;display:none"></div>
  </div>
  <h2>All unseen practice questions</h2>
  ${UNSEEN.map((u,i)=>`<div class="ev"><b>${esc(u.q)}</b><details><summary class="note">Suggested angle</summary><div style="margin-top:6px">${esc(u.angle)}</div></details></div>`).join("")}`;
routes.unseen.after = (parts, params, main) => {
  let order=shuffle(UNSEEN.map((_,i)=>i)), idx=0;
  const show=()=>{ clearTimer(); const u=UNSEEN[order[idx]]; $("#uq").textContent=u.q; $("#uclock").textContent="1:00"; $("#uclock").className="timer prep"; $("#uans").style.display="none"; $("#up1").value=""; $("#up2").value=""; $("#uspeak").href="#speak-u"+order[idx]; };
  show();
  $("#unext").onclick=()=>{ idx=(idx+1)%order.length; show(); };
  $("#uangle").onclick=()=>{ $("#uans").textContent=UNSEEN[order[idx]].angle; $("#uans").style.display="block"; };
  $("#ustart").onclick=()=>{ clearTimer(); const t0=Date.now(); activeTimer=setInterval(()=>{ const left=Math.max(0,60-(Date.now()-t0)/1000); $("#uclock").textContent=`0:${String(Math.ceil(left)).padStart(2,"0")}`.replace("0:60","1:00"); if(left<=0){ clearTimer(); $("#uclock").className="timer over"; $("#uclock").textContent="Speak!"; } },200); };
};

// ---------- FLASHCARDS ----------
function decks(){
  const terms = TERMS.map(([f,b],i)=>({id:"T"+i, front:f, back:b}));
  const nums = EVIDENCE.filter(e=>/\d/.test(e.fact) && e.src!=="P").map(e=>{
    const m = e.fact.match(/[~≈]?\d[\d,.]*(?:–\d[\d,.]*)?\s?(?:%|sq km|percent)?/);
    const ans = m ? m[0].trim() : "";
    return {id:"N"+e.id, front:e.fact.replace(m[0], " ____ "), back:`<b>${esc(ans)}</b><br><span class="note">${esc(citeShort(e))}</span>`, html:true};
  });
  const who = EVIDENCE.filter(e=>e.src!=="P").map(e=>({id:"W"+e.id, front:e.fact+"\n\nWhich source + page?", back:`<b>${esc(citeShort(e))}</b><br><i>${esc(oralCite(e))}</i>`, html:true}));
  return {terms:{name:"Key terms",cards:terms}, nums:{name:"Numbers & dates",cards:nums}, who:{name:"Which source?",cards:who}};
}
routes.flash = (parts, params) => {
  const d=decks(); const k=params.get("deck")||"terms";
  return `
  <h1>Flashcards</h1>
  <p class="lead">Tap the card to flip it. Mark the ones you know — they're skipped when "Hide known" is on.</p>
  <div class="row noprint">${Object.entries(d).map(([key,v])=>`<a class="btn ${key===k?"primary":""}" href="#flash-${key}">${v.name} (${v.cards.length})</a>`).join("")}</div>
  <div class="row" style="margin-top:10px"><label class="check" style="margin:0"><input type="checkbox" id="hideKnown" ${store.get("hideKnown",false)?"checked":""}> Hide known</label><button class="btn small" id="fshuffle">Shuffle</button><span class="note" id="fpos"></span></div>
  <div class="flash" id="card"><div class="inner"><div class="face front" id="ffront"></div><div class="face back" id="fback"></div></div></div>
  <div class="row" style="justify-content:center">
    <button class="btn" id="fprev">← Prev</button>
    <button class="btn good" id="fknow">✓ I know this</button>
    <button class="btn" id="fnext">Next →</button>
  </div>`;
};
routes.flash.after = (parts, params) => {
  const k=params.get("deck")||"terms"; const all=decks()[k].cards;
  let list=[], i=0;
  const known = () => new Set(store.get("known",[]));
  const build = (shuf) => { const kn=known(); list = all.filter(c=>!($("#hideKnown").checked && kn.has(c.id))); if(shuf) list=shuffle(list); i=0; draw(); };
  const draw = () => {
    $("#card").classList.remove("flip");
    if(!list.length){ $("#ffront").textContent="All known in this deck 🎉 Untick 'Hide known' to review."; $("#fback").textContent=""; $("#fpos").textContent=""; return; }
    const c=list[i]; $("#ffront").textContent=c.front; $("#ffront").style.whiteSpace="pre-wrap";
    if(c.html) $("#fback").innerHTML=c.back; else $("#fback").textContent=c.back;
    const kn=known(); $("#fknow").textContent = kn.has(c.id) ? "↺ Mark not known" : "✓ I know this";
    $("#fpos").textContent=`${i+1} / ${list.length} · ${[...kn].filter(id=>all.some(c=>c.id===id)).length} known`;
  };
  $("#card").onclick=()=>$("#card").classList.toggle("flip");
  $("#fnext").onclick=()=>{ if(list.length){ i=(i+1)%list.length; draw(); } };
  $("#fprev").onclick=()=>{ if(list.length){ i=(i-1+list.length)%list.length; draw(); } };
  $("#fshuffle").onclick=()=>build(true);
  $("#hideKnown").onchange=e=>{ store.set("hideKnown",e.target.checked); build(false); };
  $("#fknow").onclick=()=>{ if(!list.length) return; const kn=known(); const id=list[i].id; kn.has(id)?kn.delete(id):kn.add(id); store.set("known",[...kn]); if(kn.has(id)) { i=(i+1)%list.length; } draw(); };
  build(false);
};

// ---------- QUIZ ----------
routes.quiz = () => `
  <h1>Quiz</h1>
  <p class="lead">${QUIZ.length} questions on facts, sources, bias types and what the AT5 questions are really asking.</p>
  <div class="card" id="quizbox"></div>`;
routes.quiz.after = () => {
  const qs = shuffle(QUIZ); let i=0, score=0, answered=false;
  const box=$("#quizbox");
  const draw=()=>{
    if(i>=qs.length){
      const pct=Math.round(score/qs.length*100); const best=store.get("quizBest",0); if(pct>best) store.set("quizBest",pct);
      box.innerHTML=`<h2 style="margin-top:0">Score: ${score}/${qs.length} (${pct}%)</h2><p>${pct>=85?"Excellent — you know this material.":pct>=65?"Solid. Review the evidence bank for the ones you missed.":"Keep going — revisit the question pages and flashcards, then try again."}</p><button class="btn primary" id="again">Try again</button>`;
      $("#again").onclick=()=>routes.quiz.after(); return;
    }
    const q=qs[i]; answered=false;
    const order=shuffle(q.o.map((t,j)=>j));
    box.innerHTML=`<div class="note">Question ${i+1} of ${qs.length} · Score ${score}</div><div class="bar" style="margin:6px 0 12px"><span style="width:${i/qs.length*100}%"></span></div>
      <div class="qtext">${esc(q.q)}</div>${order.map(j=>`<button class="opt" data-j="${j}">${esc(q.o[j])}</button>`).join("")}
      <div id="why" class="note" style="margin-top:8px"></div><div class="row" style="margin-top:10px"><button class="btn primary" id="qnext" hidden>Next →</button></div>`;
    $$(".opt",box).forEach(b=>b.onclick=()=>{
      if(answered) return; answered=true; const j=+b.dataset.j;
      if(j===q.a){ score++; b.classList.add("right"); } else { b.classList.add("wrong"); $(`.opt[data-j="${q.a}"]`,box).classList.add("right"); }
      $("#why",box).textContent=(j===q.a?"✓ Correct. ":"✗ Not quite. ")+q.why; $("#qnext",box).hidden=false;
    });
    $("#qnext",box).onclick=()=>{ i++; draw(); };
  };
  draw();
};

// ---------- MEDIA BIAS ----------
routes.bias = () => `
  <h1>Media bias types</h1>
  <p class="lead">Naming the exact type out loud shows you're using class content. Key for Q4 and Q5.</p>
  <div class="card" id="game"></div>
  ${BIAS.map(b=>`<div class="ev"><div class="meta"><span class="pill ${SOURCES[b.src].case}">${caseLabel[SOURCES[b.src].case]}</span><b>${esc(b.name)}</b></div><div>${esc(b.def)}</div><div class="cite"><b>Example from your readings:</b> ${esc(b.ex)}</div></div>`).join("")}
  <p class="note">Some matches (false balance, commercial bias) are interpretations — say "arguably" when you use them.</p>`;
routes.bias.after = () => {
  const g=$("#game"); let order=shuffle(BIAS.map((_,i)=>i)), i=0, score=0;
  const draw=()=>{
    if(i>=order.length){ g.innerHTML=`<h3 style="margin-top:0">Name that bias: ${score}/${order.length}</h3><button class="btn primary" id="gagain">Play again</button>`; $("#gagain").onclick=()=>{order=shuffle(order);i=0;score=0;draw();}; return; }
    const b=BIAS[order[i]];
    g.innerHTML=`<h3 style="margin-top:0">Name that bias (${i+1}/${order.length})</h3><div class="qtext" style="font-weight:500">${esc(b.ex)}</div>
      <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr));margin-top:10px">${shuffle(BIAS.map((x,j)=>j)).map(j=>`<button class="opt" data-j="${j}" style="margin:0">${esc(BIAS[j].name)}</button>`).join("")}</div>
      <div class="note" id="gwhy" style="margin-top:8px"></div>`;
    let done=false;
    $$(".opt",g).forEach(o=>o.onclick=()=>{ if(done) return; done=true; const j=+o.dataset.j; if(j===order[i]){score++;o.classList.add("right");} else {o.classList.add("wrong"); $(`.opt[data-j="${order[i]}"]`,g).classList.add("right");} $("#gwhy").textContent=b.def; setTimeout(()=>{i++;draw();},1600); });
  };
  draw();
};

// ---------- TIMELINE ----------
routes.timeline = () => `
  <h1>Timelines</h1>
  <p class="lead">Use these to show how conflict builds over time (Q3, Q8) and to compare the two main cases. Yemen (your AT4 case) is at the bottom — for Q8 only.</p>
  <div class="cols">
    <div><h2><span class="pill RW">Rwanda</span> Genocide in Rwanda</h2><div class="tl">${TIMELINE.RW.map(([d,t])=>`<div class="i"><b>${esc(d)}</b>${esc(t)}</div>`).join("")}</div></div>
    <div><h2><span class="pill UA">Ukraine</span> Russia–Ukraine War</h2><div class="tl">${TIMELINE.UA.map(([d,t])=>`<div class="i"><b>${esc(d)}</b>${esc(t)}</div>`).join("")}</div></div>
  </div>
  <div class="card"><h3 style="margin-top:0">Comparison at a glance</h3>
  <table><tr><th></th><th>Rwanda</th><th>Ukraine</th></tr>
  <tr><th>Type</th><td>Genocide within a state (plus RPF–government war, 1990–94)</td><td>Inter-state war (Russia invading Ukraine)</td></tr>
  <tr><th>Main media</th><td>Radio, publications, village meetings (p. 250–251)</td><td>Social media, fake websites, AI, deepfakes</td></tr>
  <tr><th>Duration</th><td>Genocide ~3 months; 80% of deaths in ~6 weeks (p. 252)</td><td>Since 2014; full-scale since Feb 2022 — 4.5+ years</td></tr>
  <tr><th>International response</th><td>Abandoned: UNAMIR powerless, troops withdrawn, US blocked help (p. 254–255)</td><td>Strong Western support keeps Ukraine fighting (ISW)</td></tr>
  <tr><th>How it ended / status</th><td>RPF military victory, 19 July 1994 (p. 252)</td><td>Ongoing; ISW: Russian victory "extraordinarily unlikely" unless Western support collapses</td></tr>
  <tr><th>Same</th><td colspan="2">Leaders seeking power; information used as a weapon; peace deals that failed (Arusha / Minsk); international will shaped the outcome</td></tr>
  </table></div>
  <h2><span class="pill YE">Yemen (AT4)</span> Your own case study — Q8 only</h2>
  <p class="note">Source: Al Jazeera (21 Sep 2026), "A simple guide to the Yemen conflict". Always link it back to Rwanda and Ukraine.</p>
  <div class="tl">${TIMELINE.YE.map(([d,t])=>`<div class="i"><b>${esc(d)}</b>${esc(t)}</div>`).join("")}</div>`;

// ---------- PHRASES ----------
routes.phrases = () => `
  <h1>Discussion phrases</h1>
  <p class="lead">Turn-taking, listening and responding, and attribution are marked. Tap a phrase to copy it.</p>
  ${Object.entries(PHRASES).map(([g,list])=>`<div class="card"><h3 style="margin-top:0">${esc(g)}</h3>${list.map(p=>`<button class="opt" data-copy="${esc(p)}">${esc(p)}</button>`).join("")}</div>`).join("")}`;

// ---------- A4 SHEET ----------
routes.a4 = () => `
  <div class="noprint">
    <h1>A4 note sheet</h1>
    <p class="lead">Built from your A4 lines (edit them on each question's "A4 line" tab). Press Print and choose "Fit to page" to get one A4 sheet. Check your teacher's rules on what the sheet can include.</p>
    <div class="row"><button class="btn primary" id="a4print">🖨 Print / save as PDF</button><button class="btn" id="a4copy">Copy all as text</button></div>
    <p class="note">If Print doesn't open (some in-app viewers block it), use "Copy all as text" and paste it into a document.</p>
  </div>
  <div class="card a4print" style="margin-top:14px">
    <h1>AT5 notes — Rwanda & Ukraine</h1>
    ${QUESTIONS.map(q=>`<h3>Q${q.n}. ${esc(q.q)}</h3><div class="a4line">${esc(store.get("a4_"+q.n, q.a4))}</div>`).join("")}
    <h3>Sources (say out loud)</h3>
    <div class="a4line">RW: "Genocide in Rwanda" ch., Prejudice in the Modern World, pp.237–258 | UA-A: Detector Media (Oct 2026) Doppelganger | UA-B: Schrijver (2023), Modern War Institute | UA-C: Institute for the Study of War (Oct 2026) Myth of Inevitable Russian Victory | UA-D: Iskoujina, Gnatchenko & Bernal, Univ. of East Anglia — social media as info-warfare tool</div>
    <h3>Bias types</h3>
    <div class="a4line">selection · omission · sensationalism · false balance · source · headline · commercial · political/ideological · emotional manipulation</div>
    <h3>Key phrases</h3>
    <div class="a4line">In my view… | Building on [name]'s point… | I see your point, but… | Similarly in Ukraine / Whereas in Rwanda… | What do you think, [name]? | According to … page …</div>
  </div>`;

routes.a4.after = (parts, params, main) => {
  $("#a4print", main).onclick = () => { try{ window.print(); }catch(e){ toast("Print is blocked here — use Copy"); } };
  $("#a4copy", main).onclick = () => copy($$(".a4print h1, .a4print h3, .a4print .a4line", main).map(el=>el.innerText).join("\n"));
};

// ---------- SOURCES ----------
routes.sources = () => `
  <h1>Sources & how to cite them out loud</h1>
  <p class="lead">Academic attribution is marked. Name the author or organisation, the year, and the page for Rwanda.</p>
  ${Object.entries(SOURCES).map(([k,s])=>`<div class="ev"><div class="meta"><span class="pill ${s.case}">${caseLabel[s.case]}</span><b>${esc(s.short)}</b></div><div>${esc(s.full)}</div><div class="cite">Say it: <i>${esc(k==="R"?"According to the chapter 'Genocide in Rwanda', page 250, …":s.oral+" …")}</i></div><div class="row" style="margin-top:6px"><a class="btn small" href="#evidence">See facts from this source</a></div></div>`).join("")}
  <div class="card"><h3 style="margin-top:0">Corrections to old notes</h3>
  <ul style="margin:0;padding-left:20px">
    <li>The name "RTLM" is <b>not</b> in your reading — say "the CDR's radio station" (p. 250).</li>
    <li><b>Germans</b> first manufactured the racial categories (p. 242); Belgians deepened them (p. 243).</li>
    <li>ID cards stating Hutu/Tutsi come from <b>Habyarimana's MRND</b> (p. 246) in this reading.</li>
    <li>p. 238 says that "most importantly" prejudice caused the genocide — be ready for this counter-argument on Q1.</li>
  </ul></div>`;

// ---------- ASK CLAUDE (uses the viewer's own claude.ai account via the "sample" capability) ----------
const ASK = { history: store.get("chat", []), lastQ: 0, pending: null, ctrl: null, busy: false, sample: undefined, readAloud: store.get("chatRead", false) };
const ARTIFACT_URL = "https://claude.ai/artifact/1uYFqX8r64mJQVnBjufjLX";
const hasClaude = () => !!(window.claude && typeof window.claude.use === "function");
function getSample(){
  if(ASK.sample !== undefined) return Promise.resolve(ASK.sample);
  if(!hasClaude()){ const k = store.get("apiKey", ""); ASK.sample = k ? makeApiSample(k, store.get("apiModel", API_MODELS[0][0])) : null; return Promise.resolve(ASK.sample); }
  return window.claude.use("sample").then(s => (ASK.sample = s || null)).catch(() => (ASK.sample = null));
}
function askClaude(text, opts={}){ ASK.pending = {text, send: opts.send !== false}; if(opts.q) ASK.lastQ = opts.q; if(location.hash === "#ask") go(); else location.hash = "#ask"; }

let KNOWLEDGE = null;
function knowledge(){
  if(KNOWLEDGE) return KNOWLEDGE;
  const ev = EVIDENCE.map(e => `${e.id} | ${caseLabel[caseOf(e)]} | ${citeShort(e)}${e.date?" | "+e.date:""} | ${e.fact}${e.quote?` | quote: "${e.quote}"`:""}`).join("\n");
  const qs = QUESTIONS.map(q => `Q${q.n}: ${q.q}\n  Key words: ${q.keywords.map(k=>k[0]+" = "+k[1]).join("; ")}\n  Trap: ${q.trap}\n  Recommended position: ${q.position}\n  Evidence IDs: ${q.evidence.join(", ")}\n  Counter-arguments: ${q.counters.map(c=>c[0]+" -> "+c[1]).join(" || ")}`).join("\n\n");
  const src = Object.values(SOURCES).map(s => `- ${s.short}: ${s.full}`).join("\n");
  const bias = BIAS.map(b => `- ${b.name}: ${b.def} Example: ${b.ex}`).join("\n");
  KNOWLEDGE = `SOURCES (the assigned readings)\n${src}\n\nTHE 8 ASSESSED QUESTIONS\n${qs}\n\nEVIDENCE BANK (verified against the readings; Rwanda page numbers are from the 'Genocide in Rwanda' chapter)\n${ev}\n\nMEDIA BIAS TYPES (class handout)\n${bias}\n\nMARKING CRITERIA\n${RUBRIC.map(r=>"- "+r[0]+": "+r[1]).join("\n")}`;
  return KNOWLEDGE;
}
function systemPrompt(){
  const q = QUESTIONS.find(x => x.n === ASK.lastQ);
  return `You are a friendly, expert tutor helping a Monash College Foundation Year student prepare for AT5 in MUF0152 Contemporary Issues 2: a 40-minute academic group discussion (5–6 students) comparing the 1994 Rwandan Genocide and the Russia–Ukraine War. The student may bring one A4 sheet of notes. Midway, the teacher gives unseen questions with one minute to prepare.

RULES
- The teacher said: use ONLY Rwanda and Ukraine as case studies. Never suggest other case studies (no Myanmar, Srebrenica, Colombia, etc.). ONE exception: the student\'s own AT4 peer-presentation case, Yemen and the Houthis (source E = Al Jazeera, 21 Sep 2026, items E1–E9), may be used for Q8 only, because Q8 says "your case study"; always link it back to Rwanda and Ukraine, and use only the E items — never invent Houthi or Yemen facts. Class content (media bias types, non-violent action examples from class) is allowed as supporting links. Extra research should fill gaps, not add new examples.
- Ground every factual claim in the evidence bank below. Cite like (Genocide in Rwanda, p. 250) or (ISW, 2026) or (Detector Media, 2026). Never invent facts, figures, quotes or page numbers. If something is not in the readings, say so plainly and suggest how the student could check.
- Focus on the exact words of each question (e.g. "today", "to what extent", "short-term AND long-term", "ordinary people").
- The student is an English-as-an-additional-language learner: use clear, simple English and short paragraphs. Spoken answers must sound natural when said aloud and last 45–75 seconds (about 110–170 words), with sources named out loud.
- Be concise by default. Use light formatting only: **bold**, short bullet lists. No tables.
- When asked to check or mark an answer: give a score out of 10 against the marking criteria, 2–3 specific strengths, the 2–3 most important fixes, and a short improved version.
- When asked to quiz: ask ONE question at a time and wait for the answer, then give feedback.
- In a mock discussion: play the teacher and three invented classmates (Sam, Priya and Leo). Write each speaker's turn on its own line starting with their name and a colon. Keep each turn to 1–3 sentences. Challenge the student's view with evidence from the readings, agree or build sometimes, and then STOP and wait for the student. Occasionally the teacher asks a follow-up or an unseen question.

${knowledge()}${FOCUS_MARK}${q ? `The student is currently studying Q${q.n}: "${q.q}"` : "General AT5 preparation."}`;
}
const FOCUS_MARK = "\n\nCURRENT FOCUS: ";

// ---- Anthropic API mode (GitHub Pages): the student's own key, saved only in this browser ----
const API_MODELS = [["claude-sonnet-5-5","Claude Sonnet 5.5 — recommended"],["claude-haiku-5-5","Claude Haiku 5.5 — cheapest"],["claude-opus-5-5","Claude Opus 5.5 — strongest, most expensive"]];
function makeApiSample(key, model){
  const fn = async (messages, opts={}) => {
    const sys = messages[0].content, cut = sys.lastIndexOf(FOCUS_MARK);
    const system = [{type:"text", text: sys.slice(0, cut), cache_control:{type:"ephemeral"}}, {type:"text", text: sys.slice(cut).trim()}];
    const body = { model, max_tokens: 2048, stream: true, system, messages: messages.slice(2) };
    let res;
    try{
      res = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", signal: opts.signal,
        headers: { "content-type":"application/json", "x-api-key": key, "anthropic-version":"2023-06-01", "anthropic-dangerous-direct-browser-access":"true" },
        body: JSON.stringify(body) });
    }catch(e){ if(e.name==="AbortError") throw {code:"aborted"}; throw {code:"network", message:"Couldn't reach the Anthropic API — check your internet connection."}; }
    if(!res.ok){
      let msg = ""; try{ const j = await res.json(); msg = (j.error && j.error.message) || ""; }catch(e){}
      if(res.status===401 || res.status===403) throw {code:"bad_key", message: msg || "The API key was rejected."};
      if(res.status===429 || res.status===529) throw {code:"rate_limited", message: msg};
      if(/credit|billing|balance/i.test(msg)) throw {code:"no_credit", message: msg};
      throw {code:"api_error", message: msg || ("API error " + res.status)};
    }
    const reader = res.body.getReader(), dec = new TextDecoder(); let buf = "", text = "", stop = "";
    try{
      for(;;){
        const {value, done} = await reader.read(); if(done) break;
        buf += dec.decode(value, {stream:true});
        let i; while((i = buf.indexOf("\n\n")) !== -1){
          const chunk = buf.slice(0, i); buf = buf.slice(i + 2);
          const line = chunk.split("\n").find(l => l.startsWith("data:")); if(!line) continue;
          let ev; try{ ev = JSON.parse(line.slice(5)); }catch(e){ continue; }
          if(ev.type==="content_block_delta" && ev.delta && ev.delta.type==="text_delta"){ text += ev.delta.text; opts.onText && opts.onText({text, delta: ev.delta.text}); }
          else if(ev.type==="message_delta" && ev.delta && ev.delta.stop_reason){ stop = ev.delta.stop_reason; }
          else if(ev.type==="error"){ throw {code:"api_error", message:(ev.error && ev.error.message) || "Stream error", text}; }
        }
      }
    }catch(e){ if(e && e.name==="AbortError") throw {code:"aborted", text}; throw e.code ? e : {code:"network", message:"The connection dropped.", text}; }
    return { text, truncated: stop === "max_tokens" };
  };
  fn.isApi = true; fn.model = model;
  return fn;
}
function md(text){
  const lines = esc(text).split(/\n/); let out = "", inList = false;
  const inline = s => s.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/(^|\s)\*(\S.+?\S)\*(?=\s|$|[.,;:!?])/g, "$1<i>$2</i>");
  lines.forEach(l => {
    const b = l.match(/^\s*(?:[-*•])\s+(.*)/);
    if(b){ if(!inList){ out += "<ul>"; inList = true; } out += `<li>${inline(b[1])}</li>`; return; }
    if(inList){ out += "</ul>"; inList = false; }
    const h = l.match(/^\s*#{1,4}\s+(.*)/);
    if(h){ out += `<p><b>${inline(h[1])}</b></p>`; return; }
    const sp = l.match(/^(Teacher|Sam|Priya|Leo|You)\s*:\s*(.*)/);
    if(sp){ out += `<p class="turnline"><span class="who who-${sp[1].toLowerCase()}">${sp[1]}</span> ${inline(sp[2])}</p>`; return; }
    out += l.trim() ? `<p>${inline(l)}</p>` : "";
  });
  if(inList) out += "</ul>";
  return out;
}
const plain = t => t.replace(/\*\*|__|#+\s/g, "").replace(/^\s*[-*•]\s+/gm, "");
const CHIPS = [
  ["Explain this question", q => q ? `Explain Q${q.n} simply. What is each key word really asking, and what is the best position to take?` : "Explain what AT5 is assessing and how I should prepare in the next two days."],
  ["Quiz me", q => `Quiz me${q ? " on Q"+q.n : " on Rwanda and Ukraine"}. One question at a time, and tell me if I'm right.`],
  ["Challenge my view", q => `Act like a classmate who disagrees with me${q ? " on Q"+q.n : ""}. Give one strong counter-argument with evidence from the readings, then wait for my reply.`],
  ["Mock discussion", q => `Run a mock AT5 discussion. Start with the teacher asking ${q ? "Q"+q.n : "one of the 8 questions"}, then one classmate gives a short view. Then stop and wait for me. After about 6 of my turns, give me feedback against the marking criteria.`],
  ["Check my answer", q => `Check my answer${q ? " to Q"+q.n : ""}: `, true],
  ["Shorten my A4 line", q => q ? `Make my A4 line for Q${q.n} shorter and easier to glance at, keeping the sources and page numbers:\n${store.get("a4_"+q.n, q.a4)}` : "Help me plan what to put on my A4 note sheet.", true],
  ["Unseen practice", () => "Give me one likely unseen question the teacher might ask. Give me 60 seconds (I'll time it myself), then I'll answer and you give feedback."]
];

routes.ask = () => {
  const q = QUESTIONS.find(x => x.n === ASK.lastQ);
  return `
  <h1>Ask Claude</h1>
  <p class="lead">Your AT5 tutor, using your own claude.ai account. It knows the 8 questions, your evidence bank and the marking criteria, and sticks to Rwanda and Ukraine (plus your own Yemen case for Q8).</p>
  <div id="askAvail"></div>
  <div class="card askcard">
    <div class="row" style="justify-content:space-between">
      <label class="row" style="gap:6px">About <select id="askCtx" style="width:auto">
        <option value="0">General</option>${QUESTIONS.map(x=>`<option value="${x.n}" ${x.n===ASK.lastQ?"selected":""}>Q${x.n} · ${esc(SHORT[x.n-1])}</option>`).join("")}
      </select></label>
      <div class="row"><label class="check" style="margin:0"><input type="checkbox" id="askRead" ${ASK.readAloud?"checked":""}> Read replies aloud</label><button class="btn small" id="askClear">New chat</button></div>
    </div>
    <div class="chips" id="chips">${CHIPS.map((c,i)=>`<button class="chip" data-chip="${i}">${c[0]}</button>`).join("")}</div>
    <div class="chat" id="chat"></div>
    <div class="askrow">
      <textarea id="askIn" rows="2" placeholder="Ask anything about AT5 — e.g. 'How do I answer Q4 if someone says media controls everything?'"></textarea>
      <div class="askbtns">
        <button class="btn" id="askMic" title="Dictate">🎙</button>
        <button class="btn primary" id="askSend">Send</button>
        <button class="btn" id="askStop" hidden>■ Stop</button>
      </div>
    </div>
    <div class="note" id="askNote"></div>
  </div>`;
};
routes.ask.after = async (parts, params, main) => {
  const chat = $("#chat", main), input = $("#askIn", main), note = $("#askNote", main);
  const draw = () => {
    chat.innerHTML = ASK.history.length ? ASK.history.map((m,i) => m.role==="user"
      ? `<div class="msg user">${esc(m.content).replace(/\n/g,"<br>")}</div>`
      : `<div class="msg bot">${md(m.content)}<div class="msgtools"><button class="btn small" data-say="${i}">🔊</button><button class="btn small" data-cp="${i}">Copy</button></div></div>`).join("")
      : `<div class="note" style="text-align:center;padding:24px 8px">Pick a starter above or type a question.<br>The first time, claude.ai asks to <b>Allow use of Claude</b> — press Allow.<br>Tip: dictate your spoken answer with 🎙, then ask "Check my answer".</div>`;
    $$("[data-say]", chat).forEach(b => b.onclick = () => speak(plain(ASK.history[+b.dataset.say].content)));
    $$("[data-cp]", chat).forEach(b => b.onclick = () => copy(plain(ASK.history[+b.dataset.cp].content)));
    chat.scrollTop = chat.scrollHeight;
  };
  draw();
  setTimeout(() => { const r=$(".askrow", main); if(r && r.getBoundingClientRect().bottom > window.innerHeight) r.scrollIntoView({block:"end"}); }, 50);
  $("#askCtx", main).onchange = e => { ASK.lastQ = +e.target.value; };
  $("#askRead", main).onchange = e => { ASK.readAloud = e.target.checked; store.set("chatRead", ASK.readAloud); };
  $("#askClear", main).onclick = () => { if(ASK.ctrl) ASK.ctrl.abort(); ASK.history = []; store.set("chat", []); Voice.stop(); draw(); };

  // dictation into the box
  let rec = null;
  const mic = $("#askMic", main);
  if(!Voice.transcriptOK) mic.hidden = true;
  mic.onclick = () => {
    if(rec){ rec.stop(); rec = null; mic.classList.remove("primary"); mic.textContent = "🎙"; return; }
    const base = input.value ? input.value.trim() + " " : "";
    rec = Voice.Recognizer((fin, inter) => { input.value = base + fin + (inter ? " " + inter : ""); },
      st => { if(st==="blocked"){ note.textContent = "Microphone not allowed — use your keyboard's 🎤 dictation instead."; } if(st==="stopped" || st==="blocked"){ rec = null; mic.classList.remove("primary"); mic.textContent = "🎙"; } });
    rec.start(); mic.classList.add("primary"); mic.textContent = "■";
  };

  const sample = await getSample();
  if(!document.body.contains(chat)) return; // navigated away
  if(!sample && hasClaude()){
    $("#askAvail", main).innerHTML = `<div class="trap"><b>Ask Claude isn't available in this view</b> (the Claude phone/tablet app doesn't allow it yet). Open the same link in <b>Safari or Chrome</b> and sign in to claude.ai: <a href="${ARTIFACT_URL}">${ARTIFACT_URL}</a></div>`;
    $$("#chips button, #askSend, #askMic", main).forEach(b => b.disabled = true);
    return;
  }
  if(!sample){
    $("#askAvail", main).innerHTML = `<div class="card setup">
      <h3 style="margin-top:0">Two ways to chat with Claude here</h3>
      <div class="opt2"><div><b>1. Use your Claude plan</b> <span class="pill th">no extra cost</span><div class="note">Opens this same tutor on claude.ai, signed in with your account. Everything works there, including Ask Claude.</div></div>
        <a class="btn primary" href="${ARTIFACT_URL}#ask" target="_blank" rel="noopener">Open in claude.ai ↗</a></div>
      <div class="opt2"><div><b>2. Chat right here with an Anthropic API key</b> <span class="pill th">pay-as-you-go</span>
        <div class="note">Get a key at console.anthropic.com (separate from your Claude plan — usually a few cents per question). The key is saved <b>only in this browser</b>, never on GitHub. Anyone using this browser could use it, so remove it on shared devices.</div>
        <div class="row" style="margin-top:8px"><input type="password" id="apiKeyIn" placeholder="Paste your key (sk-ant-…)" autocomplete="off" style="flex:2;min-width:220px">
        <select id="apiModelIn" style="flex:1;min-width:200px">${API_MODELS.map(([id,l])=>`<option value="${id}" ${id===store.get("apiModel",API_MODELS[0][0])?"selected":""}>${l}</option>`).join("")}</select>
        <button class="btn" id="apiSave">Save key</button></div></div></div>
    </div>`;
    $("#apiSave", main).onclick = () => {
      const k = $("#apiKeyIn", main).value.trim();
      if(!/^sk-ant-/.test(k)){ toast("That doesn't look like an Anthropic key (sk-ant-…)"); return; }
      store.set("apiKey", k); store.set("apiModel", $("#apiModelIn", main).value); ASK.sample = undefined; toast("Key saved in this browser"); go();
    };
    $$("#chips button, #askSend", main).forEach(b => b.disabled = true);
    return;
  }
  if(sample.isApi){
    $("#askAvail", main).innerHTML = `<div class="apibar">Chatting with your own API key · ${esc((API_MODELS.find(m=>m[0]===sample.model)||[0,sample.model])[1])} · <a href="${ARTIFACT_URL}#ask" target="_blank" rel="noopener">use claude.ai instead</a> · <button class="linkbtn" id="apiRemove">Remove key</button></div>`;
    $("#apiRemove", main).onclick = () => { store.set("apiKey", ""); ASK.sample = undefined; toast("Key removed from this browser"); go(); };
  }

  const send = async (text) => {
    text = (text || "").trim(); if(!text || ASK.busy) return;
    if(rec){ rec.stop(); rec = null; mic.classList.remove("primary"); mic.textContent = "🎙"; }
    Voice.stop(); note.textContent = "";
    ASK.history.push({role:"user", content:text}); input.value = "";
    ASK.history.push({role:"assistant", content:""}); draw();
    const bubble = chat.lastElementChild;
    ASK.busy = true; $("#askSend", main).hidden = true; $("#askStop", main).hidden = false;
    let convo = ASK.history.slice(0, -1).slice(-20); while(convo.length && convo[0].role !== "user") convo.shift();
    const messages = [{role:"user", content: systemPrompt()}, {role:"assistant", content:"Understood. I'll stick to Rwanda and Ukraine (plus Yemen for Q8 only) and the evidence bank."}, ...convo];
    ASK.ctrl = new AbortController();
    const last = ASK.history[ASK.history.length - 1];
    try{
      const res = await sample(messages, { cache:false, signal: ASK.ctrl.signal, onText: ({text}) => { last.content = text; if(document.body.contains(bubble)){ bubble.innerHTML = md(text || "Thinking…"); chat.scrollTop = chat.scrollHeight; } } });
      last.content = res.text + (res.truncated ? "\n\n_(Reply was cut short — ask me to continue.)_" : "");
      if(ASK.readAloud && document.body.contains(chat)) speak(plain(res.text).slice(0, 1800));
    }catch(e){
      const code = e && e.code;
      if(code === "aborted" || (e && e.name === "AbortError")) last.content = (last.content || "") + "\n\n_(Stopped.)_";
      else if(code === "not_granted"){ ASK.history.splice(-2); note.textContent = "Claude access wasn't allowed. Press Send again and choose Allow when asked."; }
      else if(code === "rate_limited"){ ASK.history.splice(-2); input.value = text; note.textContent = "Claude is busy or you've hit a usage limit — wait a minute, then press Send again."; }
      else if(code === "bad_key"){ ASK.history.splice(-2); input.value = text; note.textContent = "Your API key was rejected. Remove it and paste a valid key from console.anthropic.com."; }
      else if(code === "no_credit"){ ASK.history.splice(-2); input.value = text; note.textContent = "Your Anthropic account needs credit (console.anthropic.com → Billing). Or use 'Open in claude.ai' with your Claude plan."; }
      else { if(e && e.text) last.content = e.text; else ASK.history.splice(-2); input.value = input.value || text; note.textContent = "Something went wrong: " + ((e && e.message) || "please try again."); }
    }
    ASK.busy = false; ASK.ctrl = null;
    store.set("chat", ASK.history.slice(-40));
    if(document.body.contains(chat)){ $("#askSend", main).hidden = false; $("#askStop", main).hidden = true; draw(); }
  };
  $("#askSend", main).onclick = () => send(input.value);
  $("#askStop", main).onclick = () => { if(ASK.ctrl) ASK.ctrl.abort(); };
  input.onkeydown = e => { if(e.key === "Enter" && !e.shiftKey){ e.preventDefault(); send(input.value); } };
  $$("[data-chip]", main).forEach(b => b.onclick = () => {
    const c = CHIPS[+b.dataset.chip], q = QUESTIONS.find(x => x.n === ASK.lastQ), txt = c[1](q);
    if(c[2]){ input.value = txt; input.focus(); input.setSelectionRange(txt.length, txt.length); } else send(txt);
  });
  if(ASK.pending){ const p = ASK.pending; ASK.pending = null; if(p.send) send(p.text); else { input.value = p.text; input.focus(); } }
};

// ---------- SEARCH ----------
function buildIndex(){
  const idx=[];
  QUESTIONS.forEach(q=>idx.push({type:"Question "+q.n, title:q.q, text:[q.q,q.position,q.spoken,q.trap,q.counters.flat().join(" ")].join(" "), href:"#q-"+q.n}));
  EVIDENCE.forEach(e=>idx.push({type:`Evidence · ${caseLabel[caseOf(e)]} · ${citeShort(e)}`, title:e.fact, text:e.fact+" "+(e.quote||"")+" "+(e.date||""), href:"#evidence-"+e.id}));
  TERMS.forEach(([f,b])=>idx.push({type:"Key term", title:f+" — "+b, text:f+" "+b, href:"#flash-terms"}));
  BIAS.forEach(b=>idx.push({type:"Bias type", title:b.name+" — "+b.ex, text:b.name+" "+b.def+" "+b.ex, href:"#bias"}));
  UNSEEN.forEach(u=>idx.push({type:"Unseen question", title:u.q, text:u.q+" "+u.angle, href:"#unseen"}));
  return idx;
}
const STOP=new Set("the a an of to in and or is was were what how why who do does did for on at by with that this it be are as from about can".split(" "));
function search(qs, idx){
  const toks=qs.toLowerCase().split(/[^a-z0-9%]+/).filter(t=>t.length>1 && !STOP.has(t));
  if(!toks.length) return [];
  return idx.map(it=>{ const t=it.text.toLowerCase(); let s=0; toks.forEach(k=>{ if(t.includes(k)) s+= (it.title.toLowerCase().includes(k)?2:1); }); return {it,s}; })
    .filter(x=>x.s>0).sort((a,b)=>b.s-a.s).slice(0,12).map(x=>x.it);
}

// ---------- init ----------
document.addEventListener("DOMContentLoaded", () => {
  $("#qnav").innerHTML = QUESTIONS.map(q=>`<a href="#q-${q.n}"><span class="dot" id="dot${q.n}"></span>Q${q.n} · ${esc(SHORT[q.n-1])}</a>`).join("");
  $(".menu-btn").onclick = () => $("nav.side").classList.toggle("open");
  const idx=buildIndex(), inp=$("#search"), res=$("#results");
  inp.oninput = () => {
    const r=search(inp.value, idx);
    res.innerHTML = r.length ? r.map(x=>`<div class="r" data-href="${x.href}"><b>${esc(x.type)}</b>${esc(x.title.slice(0,180))}${x.title.length>180?"…":""}</div>`).join("") : (inp.value.trim()?`<div class="r">No matches — try a different word (e.g. "Arusha", "radio", "drones").</div>`:"");
    res.classList.toggle("show", !!inp.value.trim());
    $$(".r[data-href]",res).forEach(d=>d.onclick=()=>{ location.hash=d.dataset.href; res.classList.remove("show"); inp.value=""; if(location.hash===d.dataset.href) go(); });
  };
  document.addEventListener("click", e => { if(!e.target.closest(".search")) res.classList.remove("show"); });
  go();
});
})();

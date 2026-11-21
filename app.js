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
const caseLabel = {RW:"Rwanda", UA:"Ukraine", CL:"Class"};
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
function speak(text){
  if(!("speechSynthesis" in window)){ toast("Read-aloud isn't supported in this browser"); return; }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/[“”"]/g,""));
  u.lang="en-AU"; u.rate=0.95;
  const v = speechSynthesis.getVoices().find(v=>/en-(AU|GB)/.test(v.lang));
  if(v) u.voice=v;
  speechSynthesis.speak(u);
}
const stopSpeak = () => { if("speechSynthesis" in window) speechSynthesis.cancel(); };

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
      <li><b>Say it out loud</b> on the <a href="#speak">Speak</a> page with the 45–75 second timer, and record yourself.</li>
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
      <li>Use <b>Rwanda and Ukraine</b> as your case studies — no random new ones.</li>
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
    <div class="row" style="margin-top:12px"><span class="note">How ready are you?</span>
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
    <div class="row noprint">
      <button class="btn primary" id="listen">▶ Listen</button><button class="btn" id="stop">■ Stop</button>
      <button class="btn" id="memory">Memory mode</button>
      <a class="btn" href="#speak-${n}">Practise with timer</a>
      <span class="note">${words} words · about ${Math.round(words/2.4)} sec spoken</span>
    </div>
    <div class="card"><div class="spoken" id="spoken">${esc(q.spoken)}</div></div>
    <p class="note">Memory mode hides every third word. Tap a hidden word to reveal it. Don't memorise word-for-word — learn the structure and the evidence so it sounds natural.</p>
  </div>
  <div id="tab2" hidden>
    <p class="note">Rwanda evidence first, then Ukraine. Aim to use at least one from each.</p>
    ${q.evidence.map(id=>EVI[id]).filter(Boolean).sort((a,b)=>caseOf(a)==="RW"?-1:caseOf(b)==="RW"?1:0).map(e=>evCard(e)).join("")}
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
  $("#listen", main).onclick = () => speak(q.spoken);
  $("#stop", main).onclick = stopSpeak;
  let mem=false;
  $("#memory", main).onclick = (ev) => {
    mem=!mem; ev.target.classList.toggle("primary", mem);
    const sp=$("#spoken", main);
    if(!mem){ sp.textContent=q.spoken; return; }
    sp.innerHTML = q.spoken.split(/(\s+)/).map((w,i)=> /\s+/.test(w)?w : ((i/2)%3===2 && w.length>2 ? `<span class="w hide">${esc(w)}</span>` : esc(w))).join("");
    $$(".w.hide", sp).forEach(s=>s.onclick=()=>s.classList.remove("hide"));
  };
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
    <select id="fcase"><option value="">All cases</option><option value="RW">Rwanda</option><option value="UA">Ukraine</option><option value="CL">Class</option></select>
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

// ---------- SPEAK ----------
let rec=null, recStream=null;
function stopRec(){ try{ if(rec && rec.state!=="inactive") rec.stop(); }catch(e){} if(recStream){ recStream.getTracks().forEach(t=>t.stop()); recStream=null; } }
routes.speak = (parts, params) => {
  const sel = params.get("q") || "1";
  return `
  <h1>Speaking practice</h1>
  <p class="lead">Like the real discussion: optional 1-minute prep, then speak for 45–75 seconds. Record yourself and check against the rubric.</p>
  <div class="card">
    <label class="f">Question</label>
    <select id="sq">
      ${QUESTIONS.map(q=>`<option value="${q.n}" ${String(q.n)===sel?"selected":""}>Q${q.n}: ${esc(q.q)}</option>`).join("")}
      ${UNSEEN.map((u,i)=>`<option value="u${i}" ${sel==="u"+i?"selected":""}>Unseen: ${esc(u.q)}</option>`).join("")}
    </select>
    <div class="row" style="margin-top:10px">
      <label class="check" style="margin:0"><input type="checkbox" id="prep" checked> 1-minute prep first</label>
      <button class="btn small" id="rand">🎲 Random question</button>
    </div>
    <div class="qtext" id="sqtext" style="margin-top:14px"></div>
    <div class="timer" id="clock">0:00</div>
    <div class="bar"><span id="cbar" style="width:0"></span></div>
    <div class="note" id="cstate" style="text-align:center;margin-top:6px">Press Start</div>
    <div class="row" style="justify-content:center;margin-top:12px">
      <button class="btn primary" id="start">Start</button>
      <button class="btn" id="stopT">Stop</button>
      <button class="btn" id="recBtn">● Record</button>
    </div>
    <audio id="playback" controls style="width:100%;margin-top:12px;display:none"></audio>
    <div class="note" id="recnote" style="text-align:center"></div>
  </div>
  <div class="cols">
    <div class="card"><h3 style="margin-top:0">Plan (during prep)</h3>
      ${["Position","Rwanda evidence","Ukraine evidence","Why / limit"].map(l=>`<label class="f">${l}</label><textarea class="sp"></textarea>`).join("")}
    </div>
    <div class="card"><h3 style="margin-top:0">Self-check after speaking</h3>
      ${["I answered the EXACT question (key words)","Clear position in my first sentence","Rwanda evidence + source said out loud","Ukraine evidence + source said out loud","Explained WHY, not just described","Mentioned a limit or another view","Between 45 and 75 seconds","Sounded natural, not read out"].map(l=>`<label class="check"><input type="checkbox"> ${l}</label>`).join("")}
      <div class="row" style="margin-top:8px"><button class="btn small" id="showModel">Show model answer / angle</button></div>
      <div id="model" class="spoken" style="margin-top:8px"></div>
    </div>
  </div>`;
};
routes.speak.after = (parts, params, main) => {
  const getQ = () => { const v=$("#sq").value; if(v[0]==="u"){ const u=UNSEEN[+v.slice(1)]; return {q:u.q, model:"Angle: "+u.angle}; } const q=QUESTIONS.find(x=>x.n===+v); return {q:q.q, model:q.spoken}; };
  const showQ = () => { $("#sqtext").textContent=getQ().q; $("#model").textContent=""; };
  $("#sq").onchange = showQ; showQ();
  $("#rand").onclick = () => { const opts=$$("#sq option"); $("#sq").value = opts[Math.floor(Math.random()*opts.length)].value; showQ(); };
  $("#showModel").onclick = () => { $("#model").textContent = getQ().model; };
  const clock=$("#clock"), bar=$("#cbar"), st=$("#cstate");
  const fmt = s => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;
  function talk(){
    clearTimer(); let t=0; const t0=Date.now();
    clock.className="timer talk"; st.textContent="Speak now — aim for 45–75 seconds";
    activeTimer=setInterval(()=>{ t=(Date.now()-t0)/1000; clock.textContent=fmt(t); bar.style.width=Math.min(100,t/75*100)+"%";
      if(t>=45 && t<75) st.textContent="✓ In the target range — wrap up when ready";
      if(t>=75){ clock.className="timer over"; st.textContent="Over 75 seconds — finish your sentence"; } },200);
  }
  $("#start").onclick = () => {
    clearTimer();
    if($("#prep").checked){
      let left=60; const t0=Date.now(); clock.className="timer prep"; st.textContent="Prep time — plan position + 2 pieces of evidence";
      activeTimer=setInterval(()=>{ left=60-(Date.now()-t0)/1000; clock.textContent=fmt(Math.max(0,Math.ceil(left))); bar.style.width=(100-left/60*100)+"%"; if(left<=0){ talk(); } },200);
    } else talk();
  };
  $("#stopT").onclick = () => { clearTimer(); st.textContent="Stopped. Use the self-check."; stopRec(); };
  $("#recBtn").onclick = async () => {
    if(rec && rec.state==="recording"){ stopRec(); return; }
    if(!navigator.mediaDevices || !window.MediaRecorder){ $("#recnote").textContent="Recording isn't available here — try Chrome or Safari, or use your phone's voice memo."; return; }
    try{
      recStream = await navigator.mediaDevices.getUserMedia({audio:true});
      const chunks=[]; rec = new MediaRecorder(recStream);
      rec.ondataavailable = e => chunks.push(e.data);
      rec.onstop = () => { const a=$("#playback"); if(!a) return; a.src=URL.createObjectURL(new Blob(chunks,{type:rec.mimeType||"audio/webm"})); a.style.display="block"; $("#recBtn").textContent="● Record"; $("#recnote").textContent="Listen back: did you cite your sources out loud?"; if(recStream){recStream.getTracks().forEach(t=>t.stop()); recStream=null;} };
      rec.start(); $("#recBtn").textContent="■ Stop recording"; $("#recnote").textContent="Recording…";
    }catch(e){ $("#recnote").textContent="Microphone blocked. Allow mic access in your browser settings, or use a voice memo app."; }
  };
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
  <p class="lead">Use these to show how conflict builds over time (Q3, Q8) and to compare the two cases.</p>
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
  </table></div>`;

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

// Voice module: read-aloud with sentence highlighting, shadowing, live transcript, recording, spoken-answer feedback.
// No dependencies. Uses the Web Speech API (speechSynthesis + SpeechRecognition) and MediaRecorder where the browser allows.
const Voice = (function(){
  "use strict";
  const LS = {
    get(k,d){ try{ const v=localStorage.getItem("at5v:"+k); return v===null?d:JSON.parse(v); }catch(e){ return d; } },
    set(k,v){ try{ localStorage.setItem("at5v:"+k, JSON.stringify(v)); }catch(e){} }
  };

  // ---------- read-aloud ----------
  const hasTTS = typeof window !== "undefined" && "speechSynthesis" in window;
  let voices = [];
  const settings = { voice: LS.get("voice",""), voice2: LS.get("voice2",""), rate: LS.get("rate",0.95) };
  function loadVoices(){
    if(!hasTTS) return [];
    voices = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang));
    voices.sort((a,b) => score(b)-score(a) || a.name.localeCompare(b.name));
    return voices;
    function score(v){ return (/en-AU/i.test(v.lang)?3:/en-GB/i.test(v.lang)?2:/en-US/i.test(v.lang)?1:0) + (/natural|premium|enhanced|neural|siri/i.test(v.name)?2:0); }
  }
  if(hasTTS){ loadVoices(); speechSynthesis.onvoiceschanged = () => { loadVoices(); listeners.forEach(f=>f()); }; }
  const listeners = [];
  const onVoices = f => listeners.push(f);
  const pickVoice = (name) => voices.find(v=>v.name===name) || voices[0] || null;
  function setSetting(k,v){ settings[k]=v; LS.set(k,v); }

  function sentences(text){
    // no lookbehind, for older iPad Safari
    return text.replace(/\s+/g," ").trim().replace(/([.!?]["”’)]?)\s+(?=["“‘(]?[A-Z0-9])/g, "$1\u0001").split("\u0001").filter(Boolean);
  }

  // Speaks sentences one at a time (avoids Chrome's long-utterance cut-off and allows highlighting).
  let job = null;
  function play(parts, opts={}){
    stop();
    if(!hasTTS){ opts.onError && opts.onError("Read-aloud isn't supported in this browser."); return null; }
    const my = job = { i: opts.start||0, parts, paused:false, cancelled:false, gapTimer:null };
    const next = () => {
      if(my.cancelled || job!==my) return;
      if(my.i >= parts.length){ job=null; opts.onEnd && opts.onEnd(); return; }
      const idx = my.i;
      const u = new SpeechSynthesisUtterance(parts[idx].replace(/[“”"]/g,""));
      const v = pickVoice(opts.voiceName || settings.voice); if(v){ u.voice=v; u.lang=v.lang; } else u.lang="en-AU";
      u.rate = opts.rate || settings.rate;
      u.onstart = () => opts.onSentence && opts.onSentence(idx);
      u.onend = () => {
        if(my.cancelled || job!==my) return;
        my.i++;
        const gap = opts.gap ? opts.gap(parts[idx], idx) : 0;   // shadowing: pause for the learner to repeat
        if(gap>0){ opts.onGap && opts.onGap(idx, gap); my.gapTimer = setTimeout(next, gap); } else next();
      };
      u.onerror = (e) => { if(e.error!=="interrupted" && e.error!=="canceled"){ opts.onError && opts.onError("Read-aloud stopped ("+e.error+")."); } };
      speechSynthesis.speak(u);
    };
    next();
    return my;
  }
  function stop(){ if(job){ job.cancelled=true; clearTimeout(job.gapTimer); job=null; } if(hasTTS) speechSynthesis.cancel(); }
  function pause(){ if(hasTTS && job){ speechSynthesis.pause(); job.paused=true; } }
  function resume(){ if(hasTTS && job){ speechSynthesis.resume(); job.paused=false; } }
  const isPaused = () => !!(job && job.paused);
  const isPlaying = () => !!job;

  // ---------- live transcript ----------
  const SR = typeof window !== "undefined" ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
  function Recognizer(onText, onState){
    let rec=null, active=false, finalText="", restarts=0;
    function start(){
      if(!SR){ onState("unsupported"); return false; }
      finalText=""; active=true; restarts=0; make(); return true;
    }
    function make(){
      rec = new SR(); rec.lang="en-AU"; rec.continuous=true; rec.interimResults=true;
      rec.onresult = (e) => {
        let interim="";
        for(let i=e.resultIndex;i<e.results.length;i++){
          const t=e.results[i][0].transcript;
          if(e.results[i].isFinal) finalText += (finalText && !/\s$/.test(finalText)?" ":"") + t.trim();
          else interim += t;
        }
        onText(finalText, interim);
      };
      rec.onerror = (e) => {
        if(e.error==="not-allowed" || e.error==="service-not-allowed"){ active=false; onState("blocked"); }
        else if(e.error==="network"){ active=false; onState("network"); }
      };
      rec.onend = () => { if(active && restarts<40){ restarts++; try{ rec.start(); }catch(err){ setTimeout(()=>{ if(active){ try{ make(); }catch(e2){} } },250); } } else onState("stopped"); };
      try{ rec.start(); onState("listening"); }catch(e){ onState("blocked"); active=false; }
    }
    function stopRec(){ active=false; try{ rec && rec.stop(); }catch(e){} }
    return { start, stop: stopRec, get text(){ return finalText; }, get active(){ return active; } };
  }

  // ---------- recording ----------
  function Recorder(){
    let mr=null, stream=null, chunks=[], t0=0, ctx=null, an=null, buf=null;
    async function start(){
      if(!navigator.mediaDevices || !window.MediaRecorder) throw new Error("unsupported");
      stream = await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}});
      chunks=[]; mr=new MediaRecorder(stream); mr.ondataavailable=e=>{ if(e.data.size) chunks.push(e.data); };
      mr.start(); t0=Date.now();
      try{ const AC=window.AudioContext||window.webkitAudioContext; ctx=new AC(); const src=ctx.createMediaStreamSource(stream); an=ctx.createAnalyser(); an.fftSize=512; src.connect(an); buf=new Uint8Array(an.fftSize); }catch(e){ an=null; }
    }
    function level(){ if(!an) return 0; an.getByteTimeDomainData(buf); let s=0; for(let i=0;i<buf.length;i++){ const x=(buf[i]-128)/128; s+=x*x; } return Math.min(1, Math.sqrt(s/buf.length)*4); }
    function stop(){
      return new Promise(res => {
        if(!mr || mr.state==="inactive"){ cleanup(); res(null); return; }
        mr.onstop = () => { const blob=new Blob(chunks,{type:mr.mimeType||"audio/webm"}); cleanup(); res({blob, url:URL.createObjectURL(blob), secs:(Date.now()-t0)/1000, type:blob.type}); };
        mr.stop();
      });
    }
    function cleanup(){ if(stream){ stream.getTracks().forEach(t=>t.stop()); stream=null; } try{ ctx && ctx.close(); }catch(e){} ctx=null; an=null; }
    return { start, stop, level, get recording(){ return !!(mr && mr.state==="recording"); } };
  }

  // ---------- feedback on a spoken answer ----------
  const STOP = new Set("the a an of to in and or is was were what how why who do does did for on at by with that this it be are as from about can you your use some others any".split(" "));
  const FILLERS = [["um",/\b(um+|umm+|erm+|uh+|er)\b/gi],["you know",/\byou know\b/gi],["basically",/\bbasically\b/gi],["kind of / sort of",/\b(kind of|sort of)\b/gi],["I mean",/\bI mean\b/gi],["like (filler)",/,\s*like,|\blike,?\s+(um|uh)\b/gi]];
  const SOURCES_SAID = [
    ["Genocide in Rwanda", /genocide in rwanda|prejudice in the modern world|rwanda (chapter|reading)/i],
    ["page number", /\bpage\s*\d+|\bpages?\s+(two|three)\s+hundred/i],
    ["ISW", /institute for the study of war|\bisw\b|i s w/i],
    ["Detector Media", /detector media|the insider/i],
    ["Schrijver", /schrijver|schreiver|shriver|schriver|modern war institute/i],
    ["Iskoujina et al.", /iskoujina|iskujina|gnatchenko|bernal|east anglia/i],
    ["attribution verb", /\baccording to\b|\breports? that\b|\bexplains? that\b|\bargues? that\b|\bpoints? out\b|\bnotes? that\b|\bsays? that\b/i]
  ];
  const RW = /\b(rwanda\w*|hutu|tutsi|rpf|arusha|kigali|habyarimana|unamir|interahamwe|cdr|kagame|belgi\w+)\b/i;
  const UA = /\b(ukrain\w*|russia\w*|putin|kremlin|kyiv|kiev|zelensk\w*|doppelganger|crimea|donetsk|luhansk|minsk)\b/i;
  const POSITION = /\b(i think|in my view|i would argue|i'd argue|i believe|in my opinion|the way i see it|i'm convinced|i am convinced|my view is|i'd say|i would say)\b/i;
  const LIMIT = /\b(however|although|though|on the other hand|even though|to some extent|that said|admittedly|but)\b/i;
  const COMPARE = /\b(similarly|whereas|in contrast|both|likewise|unlike|in the same way|the difference)\b/i;
  const RESPOND = /\b(i see your point|i agree|i understand|that's true|that is true|good point|fair point|building on|i'd add|i would add|i'm not sure i agree|i disagree|i see what you mean)\b/i;

  function keyTerms(question){
    return [...new Set(question.toLowerCase().replace(/[^a-z\s-]/g," ").split(/\s+/).filter(w=>w.length>3 && !STOP.has(w)))];
  }
  function analyse(text, secs, question, mode){
    const t = (text||"").trim();
    const words = t ? t.split(/\s+/).length : 0;
    const wpm = secs>5 ? Math.round(words/(secs/60)) : 0;
    const first = t.split(/\s+/).slice(0,30).join(" ");
    const fillers = FILLERS.map(([n,re])=>[n,(t.match(re)||[]).length]).filter(x=>x[1]);
    const fillerTotal = fillers.reduce((s,x)=>s+x[1],0);
    const said = SOURCES_SAID.filter(([n,re])=>re.test(t)).map(x=>x[0]);
    const namedSources = said.filter(n=>!["page number","attribution verb"].includes(n));
    const terms = keyTerms(question||""); const used = terms.filter(w=>t.toLowerCase().includes(w.replace(/s$/,"")));
    const checks = [];
    const add = (ok, label, tip) => checks.push({ok, label, tip});
    if(mode==="respond"){
      add(secs>=15 && secs<=50, `Length: ${Math.round(secs)} sec (aim 20–45)`, secs<15?"Say a bit more — acknowledge, then give one piece of evidence.":"Keep replies shorter than your main answers.");
      add(RESPOND.test(t), "Acknowledged the other person's point", "Start with 'I see your point, but…' or 'That's true to some extent, however…'.");
      add(LIMIT.test(t), "Turned it back to your view (however / but)", "After acknowledging, say 'however…' and restate your position.");
      add(namedSources.length>0, "Backed your reply with a named source", "Add one source: 'According to the Institute for the Study of War…'.");
    } else {
      add(secs>=45 && secs<=75, `Length: ${Math.round(secs)} sec (target 45–75)`, secs<45?"Too short — add your second case study or a 'however' point.":"Too long — cut description and get to your evidence faster.");
      add(POSITION.test(first), "Clear position in your opening", "Open with 'In my view…' or 'I'd argue that…' and answer the exact question.");
      add(used.length >= Math.min(2, terms.length), `Used the question's key words (${used.slice(0,5).join(", ")||"none"})`, `Echo the question's words so it's obvious you're answering it: ${terms.slice(0,6).join(", ")}.`);
      add(RW.test(t), "Rwanda evidence", "Bring in Rwanda — e.g. Arusha, the CDR radio, the RPF, UNAMIR.");
      add(UA.test(t), "Ukraine evidence", "Bring in Ukraine — e.g. ISW, Doppelganger, Putin, Crimea.");
      add(namedSources.length>=2, `Named sources out loud (${namedSources.join(", ")||"none"})`, "Name at least two sources, with a page number for the Rwanda chapter.");
      add(LIMIT.test(t), "Limit or other view (however / although)", "Add one 'However…' sentence, then return to your view.");
      add(COMPARE.test(t), "Comparison language (similarly / whereas / both)", "Link the cases: 'Similarly, in Ukraine…' or 'Whereas in Rwanda…'.");
    }
    add(!wpm || (wpm>=110 && wpm<=170), wpm?`Pace: ${wpm} words/min (aim 120–160)`:"Pace: not measured", wpm>170?"Slow down — pause after each piece of evidence.":"Speed up slightly so you fit your evidence in.");
    add(fillerTotal<=Math.max(2, Math.round(words/60)), `Fillers: ${fillerTotal}${fillers.length?" ("+fillers.map(f=>f[0]+" ×"+f[1]).join(", ")+")":""}`, "Replace 'um' with a short pause — it sounds more confident.");
    const score = Math.round(checks.filter(c=>c.ok).length / checks.length * 100);
    return { words, wpm, secs, checks, score, fillers, namedSources };
  }

  // ---------- saved attempts ----------
  function saveAttempt(a){ const list=LS.get("attempts",[]); list.unshift(a); LS.set("attempts", list.slice(0,60)); }
  const attempts = () => LS.get("attempts",[]);
  function clearAttempts(){ LS.set("attempts",[]); }

  return { hasTTS, hasSR: !!SR, hasRec: typeof window!=="undefined" && !!(navigator.mediaDevices && window.MediaRecorder),
    settings, setSetting, loadVoices, onVoices, voices: () => voices, sentences, play, stop, pause, resume, isPaused, isPlaying,
    Recognizer, Recorder, analyse, keyTerms, saveAttempt, attempts, clearAttempts };
})();

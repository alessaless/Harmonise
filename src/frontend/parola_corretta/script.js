"use strict";

if (window.__ORTOGRAFIA3_BOOTSTRAPPED__) {
    console.warn("[ortografia3] Script già inizializzato: ignoro secondo avvio.");
} else {
    window.__ORTOGRAFIA3_BOOTSTRAPPED__ = true;

    const ID_ESERCIZIO = 3;
    const __BASE__ = new URL('.', (document.currentScript && document.currentScript.src) || window.location.href);
    const DATA_URL = new URL('esercizio3_ortografia.json', __BASE__).toString();
    const LEVELS = ["facile","medio","difficile"];
    const ROUNDS_PER_LEVEL = 5;
    const QT = window.QT || { say: async () => {} };

    let dataset=null, currentLevel=0, roundInLevel=0, currentItem=null;
    let seenKey="", seen=new Set();

    const $ = (id)=>document.getElementById(id);
    const setMessage=(t,type)=>{ const el=$("message"); if(!el) return; el.textContent=t||""; el.className=""; el.id="message"; if(type) el.classList.add(type==="success"?"message-success":"message-warning"); };
    const updateLevelBadge=()=>{ const el=$("level-info"); if(el) el.textContent=`Livello ${currentLevel+1} — ${LEVELS[currentLevel]}`; };
    const showVictory=()=>{ const m=$("victory-modal"); if(m) m.style.display="flex"; };
    const hideVictory=()=>{ const m=$("victory-modal"); if(m) m.style.display="none"; };
    const showQuit=()=>{ const m=$("quit-modal"); if(m) m.style.display="flex"; };
    const hideQuit=()=>{ const m=$("quit-modal"); if(m) m.style.display="none"; };
    const normalize=(s)=>String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim();
    const pad = (n)=>String(n).padStart(2,"0");
    // solo data (YYYY-MM-DD)
    const formatDateSQL = (d)=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

    const metrics = {
        sessionStart:null, itemStart:null,
        total:0, correct:0, errors:0, durations:[], topics:new Set(), complexities:[], maxLevelReached:0,
        startSession(){ this.sessionStart=Date.now(); },
        startItem(){ this.itemStart=Date.now(); },
        endItem({correct, topic, complexity}){
            this.total++; if(correct) this.correct++; else this.errors++;
            if (this.itemStart) this.durations.push(Date.now()-this.itemStart);
            if (topic) this.topics.add(topic);
            if (complexity) this.complexities.push(complexity);
        },
        buildAdvancedPayload(terminated){
            const avgSec = this.durations.length ? Math.round(this.durations.reduce((a,b)=>a+b,0)/this.durations.length/1000) : 0;
            const numTopics = this.topics.size;
            let maxC=1, minC=1, avgC=1;
            if (this.complexities.length){
                maxC = Math.max(...this.complexities);
                minC = Math.min(...this.complexities);
                avgC = Math.round(this.complexities.reduce((a,b)=>a+b,0)/this.complexities.length);
            }
            const punti = Math.min(30, Math.max(0, this.correct)); // 1 punto per corretto, cap 30
            return {
                bambino: getBambinoId(),
                idEsercizio: ID_ESERCIZIO,
                numeroErrori: this.errors,
                terminato: terminated ? "Y" : "N",
                dataEsecuzione: formatDateSQL(new Date()),
                livelliCompletati: Math.min(LEVELS.length, this.maxLevelReached + 1),
                averagedTimespent: avgSec,
                totalNumProblems: this.total,
                numTopics,
                averagedComplexity: avgC,
                maxComplexity: maxC,
                minComplexity: minC,
                averagedPointsEarnedSession: punti
            };
        }
    };

    async function loadData(){
        try{
            const res = await fetch(DATA_URL, { cache:"no-store" });
            if(!res.ok) throw new Error(`Impossibile caricare ${DATA_URL} (HTTP ${res.status})`);
            dataset = await res.json();
            for (const k of LEVELS) if (!Array.isArray(dataset[k])) dataset[k]=[];
        }catch(e){
            console.error("Caricamento dataset fallito:", e);
            setMessage("Non riesco a caricare il dataset. Uso un esempio.","warning");
            dataset = { facile:[{parola_errata:"pallla", parola_corretta:"palla", topic:"oggetto"}], medio:[], difficile:[] };
        }
    }

    function pickItem(){
        const key = LEVELS[currentLevel];
        const bag = dataset[key] || [];
        const available = bag.map((_,i)=>i).filter(i=>!seen.has(`${currentLevel}:${i}`));
        if (!available.length){
            if (currentLevel < LEVELS.length-1){
                currentLevel++;
                roundInLevel=0; updateLevelBadge(); return pickItem();
            } else { showVictory(); return null; }
        }
        const i = available[Math.floor(Math.random()*available.length)];
        currentItem = bag[i];
        seen.add(`${currentLevel}:${i}`);
        localStorage.setItem(seenKey, JSON.stringify(Array.from(seen)));
        updateLevelBadge();
        return currentItem;
    }

    function renderItem(){
        const promptEl = $("prompt"); if(!promptEl || !currentItem) return;
        promptEl.textContent = currentItem.parola_errata;
        promptEl.style.visibility="visible"; promptEl.style.color="#111";
        const inp = $("answer"); if (inp){ inp.value=""; inp.focus(); }
        try{ QT.say(`Correggi la parola: ${currentItem.parola_errata}`); }catch{}
    }

    function submit(){
        if (!currentItem) return;
        const inp = $("answer");
        const userAns = normalize(inp ? inp.value : "");
        const ok = userAns === normalize(currentItem.parola_corretta);
        metrics.endItem({ correct: ok, topic: currentItem.topic || null, complexity: currentLevel+1 });

        if (ok){
            setMessage("Perfetto! ✅", "success");
            try{ QT.say("Grande! Ottimo lavoro!"); }catch{}
        } else {
            setMessage(`Risposta corretta: ${currentItem.parola_corretta}`, "warning");
            try{ QT.say("Tranquilla, va benissimo! Ora lo sai. Avanti così!"); }catch{}
        }
        setTimeout(startRound, 700);
    }

    function nextRound(){
        roundInLevel++;
        if (roundInLevel >= ROUNDS_PER_LEVEL){
            roundInLevel = 0;
            if (currentLevel < LEVELS.length-1){
                currentLevel++; metrics.maxLevelReached=Math.max(metrics.maxLevelReached,currentLevel);
            } else { showVictory(); return; }
        }
        setTimeout(startRound, 600);
    }

    function startRound(){
        setMessage("");
        metrics.startItem();
        if (!pickItem()) return;
        renderItem();
    }

    /* ===== API ===== */
    function getToken(){ for(const k of ["token","access_token","jwt","bearer","authToken"]){ const v=localStorage.getItem(k); if(v) return v; } return null; }
    function getUserCtx(){ try{ const raw=localStorage.getItem("user"); return raw?JSON.parse(raw):null; }catch{ return null; } }
    function getBambinoId(){
        const u = getUserCtx(); if(!u) return 0;
        const cand = u.id ?? u.userId ?? u.bambinoId ?? (u.bambino && u.bambino.id) ?? (u.profile && u.profile.id);
        const p = parseInt(cand,10); return Number.isFinite(p)?p:0;
    }
    async function salvaEsecuzioneAvanzata(body){
        const token=getToken(); const bambino=getBambinoId();
        if(!bambino) throw new Error("Bambino non determinato"); if(!token) throw new Error("Token mancante");
        body.bambino=bambino;
        const res = await fetch("http://localhost:8080/execution/advanced",{
            method:"POST", headers:{ "Content-Type":"application/json", "Authorization":`Bearer ${token}` },
            body: JSON.stringify(body)
        });
        if(!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    }

    let isFinishing=false;
    async function finish(terminated){
        if (isFinishing) return; isFinishing=true;
        ["quit-yes-btn","play-again-btn"].forEach(id=>{ const b=$(id); if(b) b.disabled=true; });
        try{
            const payload = metrics.buildAdvancedPayload(terminated);
            await salvaEsecuzioneAvanzata(payload);
        }catch(e){
            console.warn("Salvataggio esecuzione fallito:", e);
        }finally{
            try{
                var marker="/src/frontend/";
                var origin=window.location.origin;
                var pathname=window.location.pathname;
                var idx=pathname.indexOf(marker);
                var DEST_URL=(idx!==-1)
                    ? origin + pathname.slice(0, idx + marker.length) + "elenco_esercizi.html"
                    : new URL("../elenco_esercizi.html", window.location.href).href;
                window.location.replace(DEST_URL);
            }catch{}
        }
    }

    function wireUI(){
        const s=$("submit"); if(s) s.addEventListener("click", e=>{ e.preventDefault(); submit(); });
        const inp=$("answer"); if(inp) inp.addEventListener("keydown", e=>{ if(e.key==="Enter"){ e.preventDefault(); submit(); }});
        const qb=$("quit-btn"); if(qb) qb.addEventListener("click", e=>{ e.preventDefault(); showQuit(); });
        const qy=$("quit-yes-btn"); if(qy) qy.addEventListener("click", e=>{ e.preventDefault(); hideQuit(); finish(false); });
        const qn=$("quit-no-btn"); if(qn) qn.addEventListener("click", e=>{ e.preventDefault(); hideQuit(); });
        const pa=$("play-again-btn"); if(pa) pa.addEventListener("click", e=>{ e.preventDefault(); hideVictory(); finish(true); });
    }

    /* ===== Livello iniziale via ML ===== */
    async function fetchHistoryForBambino(){
        const bambino = getBambinoId();
        const token = getToken();
        if (!bambino) throw new Error("Bambino non determinato");
        if (!token) throw new Error("Token mancante in localStorage");
        const url = `http://localhost:8080/execution/advanced/byBambino/${bambino}`;
        const res = await fetch(url, { headers: { "Authorization": `Bearer ${token}` }});
        if (!res.ok) throw new Error(`GET history HTTP ${res.status}`);
        return res.json();
    }
    async function decideStartingLevel(ID_ESERCIZIO){
        try{
            const history = await fetchHistoryForBambino();
            if (!Array.isArray(history) || history.length === 0){
                return 0; // nessuna esecuzione -> facile
            }
            const resp = await fetch("http://127.0.0.1:8000/predict-level-from-history",{
                method:"POST",
                headers:{ "Content-Type":"application/json" },
                body: JSON.stringify({ idEsercizio: ID_ESERCIZIO, history })
            });
            if(!resp.ok) throw new Error(`predict HTTP ${resp.status}`);
            const out = await resp.json();
            const suggested = parseInt(out.level, 10); // 1..3
            if (Number.isFinite(suggested)){
                return Math.max(0, Math.min(2, suggested - 1)); // 0..2
            }
            return 0;
        }catch(e){
            console.warn("[level-picker] fallback a livello facile:", e);
            return 0;
        }
    }

    (async function main(){
        try{
            metrics.startSession(); updateLevelBadge(); wireUI();
            await loadData();
            currentLevel = await decideStartingLevel(ID_ESERCIZIO);
            updateLevelBadge();
            const bid=getBambinoId(); seenKey=`ortografia3_seen_${bid || "anon"}`; seen=new Set(JSON.parse(localStorage.getItem(seenKey)||"[]"));
            await startRound();
        }catch(e){
            console.error(e); setMessage("Errore di inizializzazione. Controlla la console.","warning");
        }
    })();
}

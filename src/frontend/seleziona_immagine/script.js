"use strict";

/* =========================
   Comprensione del testo — ID esercizio 1
   ========================= */
if (window.__COMPRENSIONE1_BOOTSTRAPPED__) {
    console.warn("[comprensione1] Script già inizializzato: ignoro secondo avvio.");
} else {
    window.__COMPRENSIONE1_BOOTSTRAPPED__ = true;

    const ID_ESERCIZIO = 1;
    const __BASE__ = new URL(".", (document.currentScript && document.currentScript.src) || window.location.href);
    const DATA_URL = new URL("esercizio1_comprensione.json", __BASE__).toString();
    const LEVELS = ["facile", "medio", "difficile"];
    const ROUNDS_PER_LEVEL = 5;

    const QT = window.QT || { say: async () => {} };

    /* ===== Stato ===== */
    let dataset = null;
    let currentLevel = 0;
    let roundInLevel = 0;
    let currentItem = null;

    let seenKey = "";
    let seen = new Set();

    /* ===== Helpers UI ===== */
    const $ = (id) => document.getElementById(id);
    const setMessage = (t, type) => {
        const el = $("message"); if (!el) return;
        el.textContent = t || "";
        el.className = ""; el.id = "message";
        if (type) el.classList.add(type === "success" ? "message-success" : "message-warning");
    };
    const updateLevelBadge = () => {
        const el = $("level-info"); if (el) el.textContent = `Livello ${currentLevel + 1} — ${LEVELS[currentLevel]}`;
    };
    const showVictory = () => { const m = $("victory-modal"); if (m) m.style.display = "flex"; };
    const hideVictory = () => { const m = $("victory-modal"); if (m) m.style.display = "none"; };
    const showQuit    = () => { const m = $("quit-modal");    if (m) m.style.display = "flex"; };
    const hideQuit    = () => { const m = $("quit-modal");    if (m) m.style.display = "none"; };

    /* ===== Utils ===== */
    const shuffle = (a) => a.slice().sort(() => Math.random() - 0.5);
    const normalize = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const pad = (n) => String(n).padStart(2, "0");
    // solo data (YYYY-MM-DD)
    const formatDateSQL = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

    // ➜ Risolutore per redirect alla root /src/frontend/
    function resolveFrontendURL(filename){
        const marker = "/src/frontend/";
        const { origin, pathname } = window.location;
        const idx = pathname.indexOf(marker);
        if (idx !== -1) {
            const base = origin + pathname.slice(0, idx + marker.length); // include trailing slash
            return new URL(filename, base).href;
        }
        // Fallback: un livello sopra
        return new URL(`../${filename}`, window.location.href).href;
    }

    /* ===== Metrics ===== */
    const metrics = {
        sessionStart: null,
        itemStart: null,
        total: 0,
        correct: 0,
        errors: 0,
        durations: [],         // ms per item
        topics: new Set(),     // topic dal JSON
        complexities: [],      // 1..3 (livello corrente)
        maxLevelReached: 0,

        startSession(){ this.sessionStart = Date.now(); },
        startItem(){ this.itemStart = Date.now(); },
        endItem({correct, topic, complexity}){
            this.total++;
            if (correct) this.correct++; else this.errors++;
            if (this.itemStart) this.durations.push(Date.now() - this.itemStart);
            if (topic) this.topics.add(topic);
            if (complexity) this.complexities.push(complexity);
        },
        buildAdvancedPayload(terminated){
            const avgSec = this.durations.length
                ? Math.round(this.durations.reduce((a,b)=>a+b,0)/this.durations.length/1000)
                : 0;

            const numTopics = this.topics.size;

            let maxC=1, minC=1, avgC=1;
            if (this.complexities.length){
                maxC = Math.max(...this.complexities);
                minC = Math.min(...this.complexities);
                avgC = Math.round(this.complexities.reduce((a,b)=>a+b,0)/this.complexities.length);
            }

            const punti = Math.min(30, Math.max(0, this.correct)); // 1 punto per corretto, max 30

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

    /* ===== Data ===== */
    async function loadData(){
        const res = await fetch(DATA_URL, { cache: "no-store" });
        if (!res.ok) throw new Error(`Impossibile caricare ${DATA_URL} (HTTP ${res.status})`);
        dataset = await res.json();
        for (const k of LEVELS) if (!Array.isArray(dataset[k])) dataset[k] = [];
    }

    function pickItem(){
        const key = LEVELS[currentLevel];
        const bag = dataset[key] || [];
        const available = bag.map((_,i)=>i).filter(i => !seen.has(`${currentLevel}:${i}`)); // (fix: rimosso typo)

        if (!available.length){
            if (currentLevel < LEVELS.length-1){
                currentLevel++;
                metrics.maxLevelReached = Math.max(metrics.maxLevelReached, currentLevel);
                roundInLevel = 0;
                updateLevelBadge();
                return pickItem();
            } else {
                showVictory();
                return null;
            }
        }
        const i = available[Math.floor(Math.random()*available.length)];
        currentItem = bag[i];
        seen.add(`${currentLevel}:${i}`);
        localStorage.setItem(seenKey, JSON.stringify(Array.from(seen)));
        updateLevelBadge();
        return currentItem;
    }

    /* ===== Round ===== */
    function render(){
        const prompt = $("prompt");
        const choices = $("choices");
        if (!prompt || !choices || !currentItem) return;

        prompt.innerHTML = `<strong>Descrizione:</strong> ${currentItem.testo}`;
        const opts = shuffle([currentItem.risposta, ...(currentItem.distrattori || [])]).slice(0,4);

        choices.innerHTML = "";
        opts.forEach((opt)=>{
            const b = document.createElement("button");
            b.type = "button";
            b.className = "option";
            b.textContent = String(opt).toUpperCase();
            b.addEventListener("click", ()=> submit(opt));
            choices.appendChild(b);
        });

        try{ QT.say(String(currentItem.testo)); }catch{}
    }

    function submit(sel){
        const ok = normalize(sel) === normalize(currentItem.risposta);
        const topic = currentItem.topic || null;
        const complexity = currentLevel + 1;
        metrics.endItem({ correct: ok, topic, complexity });
        setMessage(ok ? "Corretto! 🎉" : "Ops, riproviamo. ❌", ok ? "success" : "warning");
        if (ok) nextRound();
    }

    function nextRound(){
        roundInLevel++;
        if (roundInLevel >= ROUNDS_PER_LEVEL){
            roundInLevel = 0;
            if (currentLevel < LEVELS.length-1){
                currentLevel++;
                metrics.maxLevelReached = Math.max(metrics.maxLevelReached, currentLevel);
            } else {
                showVictory();
                return;
            }
        }
        setTimeout(startRound, 600);
    }

    function startRound(){
        setMessage("");
        metrics.startItem();
        if (!pickItem()) return;
        render();
    }

    /* ===== API client ===== */
    function getToken(){
        for (const k of ["token","access_token","jwt","bearer","authToken"]){
            const v = localStorage.getItem(k); if (v) return v;
        } return null;
    }
    function getUserCtx(){
        try{ const raw = localStorage.getItem("user"); return raw ? JSON.parse(raw) : null; }catch{ return null; }
    }
    function getBambinoId(){
        const u = getUserCtx();
        if (!u) return 0;
        const cand = u.id ?? u.userId ?? u.bambinoId ?? (u.bambino && u.bambino.id) ?? (u.profile && u.profile.id);
        const p = parseInt(cand,10);
        return Number.isFinite(p) ? p : 0;
    }
    async function salvaEsecuzioneAvanzata(body){
        const token = getToken();
        const bambino = getBambinoId();
        if (!bambino) throw new Error("Bambino non determinato");
        if (!token)   throw new Error("Token mancante");
        body.bambino = bambino;
        const res = await fetch("http://localhost:8080/execution/advanced", {
            method:"POST",
            headers:{ "Content-Type":"application/json", "Authorization":`Bearer ${token}` },
            body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    }

    /* ===== Fine attività ===== */
    let isFinishing = false;
    async function finish(terminated){
        if (isFinishing) return;
        isFinishing = true;

        ["quit-yes-btn","play-again-btn"].forEach(id => { const b=$(id); if(b) b.disabled = true; });

        try{
            const payload = metrics.buildAdvancedPayload(terminated);
            await salvaEsecuzioneAvanzata(payload);
        }catch(e){
            console.warn("Salvataggio esecuzione fallito:", e);
        }finally{
            try{
                const DEST_URL = resolveFrontendURL("elenco_esercizi.html");
                window.location.replace(DEST_URL);
            }catch{}
        }
    }

    /* ===== Wiring & start ===== */
    function wireUI(){
        const qb = $("quit-btn"); if (qb) qb.addEventListener("click", e=>{ e.preventDefault(); showQuit(); });
        const qy = $("quit-yes-btn"); if (qy) qy.addEventListener("click", e=>{ e.preventDefault(); hideQuit(); finish(false); });
        const qn = $("quit-no-btn"); if (qn) qn.addEventListener("click", e=>{ e.preventDefault(); hideQuit(); });
        const pa = $("play-again-btn"); if (pa) pa.addEventListener("click", e=>{ e.preventDefault(); hideVictory(); finish(true); });
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
            metrics.startSession();
            wireUI();
            updateLevelBadge();
            await loadData();
            currentLevel = await decideStartingLevel(ID_ESERCIZIO);
            updateLevelBadge();

            const bid = getBambinoId();
            seenKey = `comprensione1_seen_${bid || "anon"}`;
            seen = new Set(JSON.parse(localStorage.getItem(seenKey) || "[]"));

            startRound();
        }catch(e){
            console.error(e);
            setMessage("Errore di inizializzazione. Controlla la console.", "warning");
        }
    })();
}

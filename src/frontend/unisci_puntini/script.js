const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const game = document.getElementById("game");
const message = document.getElementById("message");
const levelInfo = document.getElementById("level-info");

let current = 1;
let startX = null;
let startY = null;
let isDrawing = false;
let level = 0;
let dots = [];

let idEsercizio = 8;

function getIdEsercizio() {
    return idEsercizio;
}

// Definizione livelli: array di array con posizioni puntini
const levels = [
    // Livello 1 - Triangolo
    [
        {x: 200, y: 50},
        {x: 50, y: 300},
        {x: 350, y: 300}
    ],
    // Livello 2 - Quadrato
    [
        {x: 50, y: 50},
        {x: 350, y: 50},
        {x: 350, y: 350},
        {x: 50, y: 350}
    ],
    // Livello 3 - Pentagono
    [
        {x: 200, y: 50},
        {x: 350, y: 150},
        {x: 300, y: 330},
        {x: 100, y: 330},
        {x: 50,  y: 150}
    ],
    // Livello 4 - Stella semplice
    [
        {x: 200, y: 50},
        {x: 240, y: 180},
        {x: 350, y: 180},
        {x: 260, y: 250},
        {x: 300, y: 370},
        {x: 200, y: 300},
        {x: 100, y: 370},
        {x: 140, y: 250},
        {x: 50, y: 180},
        {x: 160, y: 180}
    ]
];

// crea puntini per il livello corrente
function loadLevel(lvl) {
    document.body.classList.remove("completed"); // sfondo verde finale
    document.body.classList.remove("error"); // sfondo verde finale
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.querySelectorAll(".dot").forEach(d => d.remove());
    current = 1;
    isDrawing = false;

    const points = levels[lvl];
    points.forEach((p, i) => {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        dot.dataset.id = i+1;
        dot.style.left = (p.x - 15) + "px";
        dot.style.top = (p.y - 15) + "px";
        dot.innerText = i+1;
        game.appendChild(dot);
    });

    dots = document.querySelectorAll(".dot");
    levelInfo.textContent = `Livello ${lvl+1}`;

    // nascondi messaggio
    message.textContent = "";
    message.classList.remove("message-warning", "message-success");

    setupClicks();
}

// calcola il centro di un puntino in coordinate canvas
function getDotCenter(dot) {
    const rect = dot.getBoundingClientRect();
    const gameRect = game.getBoundingClientRect();
    return {
        x: rect.left - gameRect.left + rect.width/2,
        y: rect.top - gameRect.top + rect.height/2
    };
}

// ridisegna le linee già completate
function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(231,76,60,0.7)";

    for (let i = 1; i < current; i++) {
        const startDot = document.querySelector(`.dot[data-id="${i}"]`);
        const endDot = document.querySelector(`.dot[data-id="${i+1}"]`);
        if (startDot && endDot) {
            const s = getDotCenter(startDot);
            const e = getDotCenter(endDot);
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(e.x, e.y);
            ctx.stroke();
        }
    }
}

// abilita click sul puntino corretto
function setupClicks() {
    dots.forEach(dot => {
        dot.addEventListener("mousedown", () => {
            const id = parseInt(dot.dataset.id);
            if (id === current) {
                const center = getDotCenter(dot);
                startX = center.x;
                startY = center.y;
                isDrawing = true;
            }
        });
    });
}

// linea dinamica
canvas.addEventListener("mousemove", e => {
    if (isDrawing) {
        redraw();
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.strokeStyle = "rgba(231,76,60,0.7)";
        ctx.lineWidth = 4;
        ctx.stroke();
    }
});

// rilascio mouse → verifica collegamento
document.addEventListener("mouseup", e => {
    if (isDrawing) {
        const gameRect = game.getBoundingClientRect();
        const mouseX = e.clientX - gameRect.left;
        const mouseY = e.clientY - gameRect.top;

        let targetId;
        if (current < dots.length) {
            targetId = current + 1;
        } else if (current === dots.length) {
            targetId = 1; // chiusura figura
        }

        const targetDot = document.querySelector(`.dot[data-id="${targetId}"]`);

        if (targetDot) {
            const targetCenter = getDotCenter(targetDot);
            const dx = mouseX - targetCenter.x;
            const dy = mouseY - targetCenter.y;
            const distance = Math.sqrt(dx*dx + dy*dy);

            if (distance < 20) {
                if (current < dots.length) {
                    // qua mettere una frase random ogni due puntini tra un set di frasi
                    current++;
                    message.classList.remove("message-warning");
                    document.body.classList.remove("completed"); // sfondo verde finale
                    document.body.classList.remove("error"); // sfondo verde finale
                    redraw();
                } else {
                    // chiusura figura
                    const lastDot = document.querySelector(`.dot[data-id="${dots.length}"]`);
                    const lastCenter = getDotCenter(lastDot);

                    redraw();
                    ctx.beginPath();
                    ctx.moveTo(lastCenter.x, lastCenter.y);
                    ctx.lineTo(targetCenter.x, targetCenter.y);
                    ctx.strokeStyle = "rgba(231,76,60,0.7)";
                    ctx.lineWidth = 4;
                    ctx.stroke();
                    message.textContent = `Figura completata 🎉 `;
                    message.classList.remove("message-warning");
                    message.classList.add("message-success");
                    document.body.classList.add("completed"); // sfondo verde finale

                    level++;
                    if(level < levels.length){
                        QT.say("Bravo, hai completato la figura. Adesso Passiamo al prossimo livello!")
                    } else {
                        QT.say("Bravissimo! Hai terminato tutti i livelli!")
                    }



                    setTimeout(() => {
                        if (level < levels.length) {
                            incrementaLivelliCompletati();
                            loadLevel(level);
                        } else {
                            incrementaLivelliCompletati();
                            terminaEsercuzioneEsercizio(idEsercizio, "Y", false)
                            message.textContent = "Hai completato tutti i livelli 🎊";
                            message.classList.remove("message-warning");
                            message.classList.add("message-success");
                            document.body.classList.add("completed");
                            setTimeout(() => {
                                showVictoryModal();
                            }, 200);
                        }
                    }, 3000);
                }
            } else {
                QT.say("Attento! Non hai collegato il puntino giusto! ")
                incrementaNumeroErrori();
                message.textContent = "Attenzione, riprova!";
                message.classList.remove("message-success");
                message.classList.add("message-warning");
                document.body.classList.remove("completed"); // sfondo verde finale
                document.body.classList.add("error"); // sfondo verde finale
                redraw();
            }
        }
        isDrawing = false;
    }
});

loadLevel(level);
